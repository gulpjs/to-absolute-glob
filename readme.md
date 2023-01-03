# to-absolute-glob [![NPM version](https://img.shields.io/npm/v/to-absolute-glob.svg?style=flat)](https://www.npmjs.com/package/to-absolute-glob) [![NPM downloads](https://img.shields.io/npm/dm/to-absolute-glob.svg?style=flat)](https://npmjs.org/package/to-absolute-glob) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/to-absolute-glob.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/to-absolute-glob) [![Windows Build Status](https://img.shields.io/appveyor/ci/jonschlinkert/to-absolute-glob.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/jonschlinkert/to-absolute-glob)

> Make a glob pattern absolute, ensuring that negative globs and patterns with trailing slashes are correctly handled.

## Usage

```js
const toAbsGlob = require("to-absolute-glob");
toAbsGlob("a/*.js");
//=> '/dev/foo/a/*.js'
```

## Examples

Given the current project folder (cwd) is `/dev/foo/`:

**makes a path absolute**

```js
toAbsGlob("a");
//=> '/dev/foo/a'
```

**makes a glob absolute**

```js
toAbsGlob("a/*.js");
//=> '/dev/foo/a/*.js'
```

**retains trailing slashes**

```js
toAbsGlob("a/*/");
//=> '/dev/foo/a/*/'
```

**retains trailing slashes with cwd**

```js
toAbsGlob("./fixtures/whatsgoingon/*/", { cwd: __dirname });
//=> '/dev/foo/fixtures/whatsgoingon/*/'
```

**makes a negative glob absolute**

```js
toAbsGlob("!a/*.js");
//=> '!/dev/foo/a/*.js'
```

**from a cwd**

```js
toAbsGlob("a/*.js", { cwd: "foo" });
//=> '/dev/foo/foo/a/*.js'
```

**makes a negative glob absolute from a cwd**

```js
toAbsGlob("!a/*.js", { cwd: "foo" });
//=> '!/dev/foo/foo/a/*.js'
```

**from a root path**

```js
toAbsGlob("/a/*.js", { root: "baz" });
//=> '/dev/foo/baz/a/*.js'
```

**from a root slash**

```js
toAbsGlob("/a/*.js", { root: "/" });
//=> '/dev/foo/a/*.js'
```

**from a negative root path**

```js
toAbsGlob("!/a/*.js", { root: "baz" });
//=> '!/dev/foo/baz/a/*.js'
```

**from a negative root slash**

```js
toAbsGlob("!/a/*.js", { root: "/" });
//=> '!/dev/foo/a/*.js'
```

### License

MIT
