"use strict";

var path = require("node:path");
var assert = require("node:assert");
var { describe, it } = require("node:test");

var resolve = require("../");
var fixture;
var actual;

function unixify(filepath) {
  return filepath.replace(/\\/g, "/");
}

describe("toAbsoluteGlob", function () {
  describe.skip("examples", function () {
    console.log(resolve("a"));
    console.log(resolve("a/*.js"));
    console.log(resolve("a/*/"));
    console.log(resolve("./fixtures/whatsgoingon/*/", { cwd: __dirname }));
    console.log(resolve("!a/*.js"));
    console.log(resolve("a/*.js", { cwd: "foo" }));
    console.log(resolve("!a/*.js", { cwd: "foo" }));
    console.log(resolve("/a/*.js", { root: "baz" }));
    console.log(resolve("/a/*.js", { root: "/" }));
    console.log(resolve("!/a/*.js", { root: "baz" }));
    console.log(resolve("!/a/*.js", { root: "/" }));
    console.log(resolve("/\\!/a/*.js", { root: "/" }));
    console.log(resolve("/\\!\\a/*.js", { root: "/" }));
  });

  describe("posix", function () {
    it("should make a path absolute", function () {
      assert.deepStrictEqual(resolve("a"), unixify(path.resolve("a")));
    });

    it("should make a glob absolute", function () {
      assert.deepStrictEqual(
        resolve("a/*.js"),
        unixify(path.resolve("a/*.js")),
      );
    });

    it("should retain trailing slashes", function () {
      actual = resolve("a/*/");
      assert.deepStrictEqual(actual, unixify(path.resolve("a/*")) + "/");
      assert.deepStrictEqual(actual.slice(-1), "/");
    });

    it("should retain trailing slashes with cwd", function () {
      fixture = "fixtures/whatsgoingon/*/";
      actual = resolve(fixture, { cwd: __dirname });
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve(__dirname, fixture)) + "/",
      );
      assert.deepStrictEqual(actual.slice(-1), "/");
    });

    it("should handle ./ at the beginnnig of a glob", function () {
      fixture = "./fixtures/whatsgoingon/*/";
      actual = resolve(fixture, { cwd: __dirname });
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve(__dirname, fixture)) + "/",
      );
    });

    it("should handle ../ at the beginnnig of a glob", function () {
      fixture = "../fixtures/whatsgoingon/*/";
      actual = resolve(fixture, { cwd: __dirname });
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve(__dirname, fixture)) + "/",
      );
    });

    it("should handle multiple ../ at the beginnnig of a glob", function () {
      fixture = "../../fixtures/whatsgoingon/*/";
      actual = resolve(fixture, { cwd: __dirname });
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve(__dirname, fixture)) + "/",
      );
    });

    it("should make a negative glob absolute", function () {
      actual = resolve("!a/*.js");
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve("a/*.js")));
    });

    it("should make a negative glob (starting with `./`) absolute", function () {
      actual = resolve("!./a/*.js");
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve("a/*.js")));
    });

    it("should make a negative glob (just `./`) absolute", function () {
      actual = resolve("!./");
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve(".")) + "/");
    });

    it("should make a negative glob (just `.`) absolute", function () {
      actual = resolve("!.");
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve(".")));
    });

    it("should make a negative glob (starting with ../) absolute", function () {
      actual = resolve("!../fixtures/whatsgoingon/*/");
      assert.deepStrictEqual(
        actual,
        "!" + unixify(path.resolve("../fixtures/whatsgoingon/*/")) + "/",
      );
    });

    it("should make a negative glob (starting with multiple ../) absolute", function () {
      actual = resolve("!../../fixtures/whatsgoingon/*/");
      assert.deepStrictEqual(
        actual,
        "!" + unixify(path.resolve("../../fixtures/whatsgoingon/*/")) + "/",
      );
    });

    it("should make a negative extglob absolute", function () {
      actual = resolve("!(foo)");
      assert.deepStrictEqual(actual, unixify(path.resolve("!(foo)")));
    });

    it("should make an escaped negative extglob absolute", function () {
      actual = resolve("\\!(foo)");
      assert.deepStrictEqual(actual, unixify(path.resolve(".")) + "/\\!(foo)");
    });

    it("should make a glob absolute from a cwd", function () {
      actual = resolve("a/*.js", { cwd: "foo" });
      assert.deepStrictEqual(actual, unixify(path.resolve("foo/a/*.js")));
    });

    it("should escape glob patterns in an absolute cwd", function () {
      actual = resolve("a/*.js", { cwd: "/(foo)/[bar]/{baz}/*/**/?/!" });
      var expected = unixify(
        path.resolve("/(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "/(foo)/[bar]/{baz}/*/**/?/!",
        "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("should escape glob patterns in a relative cwd", function () {
      actual = resolve("a/*.js", { cwd: "(foo)/[bar]/{baz}/*/**/?/!" });
      var expected = unixify(
        path.resolve("(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "(foo)/[bar]/{baz}/*/**/?/!",
        "\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("avoids double escaping in cwd", function () {
      actual = resolve("a/*.js", {
        cwd: "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      });
      var expected = unixify(
        path.resolve("/(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "/(foo)/[bar]/{baz}/*/**/?/!",
        "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("works with multiple characters in succession in cwd", function () {
      actual = resolve("a/*.js", { cwd: "/((foo))/[[bar]]/{{baz}}" });
      var expected = unixify(
        path.resolve("/((foo))/[[bar]]/{{baz}}/a/*.js"),
      ).replace(
        "/((foo))/[[bar]]/{{baz}}",
        "/\\(\\(foo\\)\\)/\\[\\[bar\\]\\]/\\{\\{baz\\}\\}",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("should make a negative glob absolute from a cwd", function () {
      actual = resolve("!a/*.js", { cwd: "foo" });
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve("foo/a/*.js")));
    });

    it("should make a glob absolute from a root path", function () {
      actual = resolve("/a/*.js", { root: "foo" });
      assert.deepStrictEqual(actual, unixify(path.resolve("foo/a/*.js")));
    });

    it("should make a glob absolute from a root slash", function () {
      actual = resolve("/a/*.js", { root: "/" });
      assert.deepStrictEqual(actual, unixify(path.resolve("/a/*.js")));
    });

    it("should escape glob patterns in an absolute root", function () {
      actual = resolve("/a/*.js", { root: "/(foo)/[bar]/{baz}/*/**/?/!" });
      var expected = unixify(
        path.resolve("/(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "/(foo)/[bar]/{baz}/*/**/?/!",
        "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("should escape glob patterns in a relative root", function () {
      actual = resolve("/a/*.js", { root: "(foo)/[bar]/{baz}/*/**/?/!" });
      var expected = unixify(
        path.resolve("(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "(foo)/[bar]/{baz}/*/**/?/!",
        "\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("avoids double escaping in root", function () {
      actual = resolve("/a/*.js", {
        root: "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      });
      var expected = unixify(
        path.resolve("/(foo)/[bar]/{baz}/*/**/?/!/a/*.js"),
      ).replace(
        "/(foo)/[bar]/{baz}/*/**/?/!",
        "/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("works with multiple characters in succession in root", function () {
      actual = resolve("/a/*.js", { root: "/((foo))/[[bar]]/{{baz}}" });
      var expected = unixify(
        path.resolve("/((foo))/[[bar]]/{{baz}}/a/*.js"),
      ).replace(
        "/((foo))/[[bar]]/{{baz}}",
        "/\\(\\(foo\\)\\)/\\[\\[bar\\]\\]/\\{\\{baz\\}\\}",
      );
      assert.deepStrictEqual(actual, expected);
    });

    it("should make a glob absolute from a negative root path", function () {
      actual = resolve("!/a/*.js", { root: "foo" });
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve("foo/a/*.js")));
    });

    it("should make a negative glob absolute from a negative root path", function () {
      actual = resolve("!/a/*.js", { root: "/" });
      assert.deepStrictEqual(actual, "!" + unixify(path.resolve("/a/*.js")));
    });
  });

  describe("windows", function () {
    it("should make an escaped negative extglob absolute", function () {
      actual = resolve("foo/bar\\!(baz)");
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve("foo/bar")) + "\\!(baz)",
      );
    });

    it("should make a glob absolute from a root path", function () {
      actual = resolve("/a/*.js", { root: "foo\\bar\\baz" });
      assert.deepStrictEqual(
        actual,
        unixify(path.resolve("foo/bar/baz/a/*.js")),
      );
    });

    it("should make a glob absolute from a root slash", function () {
      actual = resolve("/a/*.js", { root: "\\" });
      assert.deepStrictEqual(actual, unixify(path.resolve("/a/*.js")));
    });
  });
});
