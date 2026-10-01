<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# @gulpjs/to-absolute-glob

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Make a glob pattern absolute, ensuring that negative globs and patterns with trailing slashes are correctly handled.

## Usage

```js
var toAbsoluteGlob = require('@gulpjs/to-absolute-glob');

// All these assume your cwd is `/dev/foo/`

toAbsoluteGlob('a/*.js') === '/dev/foo/a/*.js';

// Makes a path absolute
toAbsoluteGlob('a') === '/dev/foo/a';

// Retains trailing slashes
toAbsoluteGlob('a/*/') === '/dev/foo/a/*/';

// Makes a negative glob absolute
toAbsoluteGlob('!a/*.js') === '!/dev/foo/a/*.js';

// Accepts a cwd
toAbsoluteGlob('a/*.js', { cwd: 'foo' }) === '/dev/foo/foo/a/*.js';

// Accepts a root path
toAbsoluteGlob('/a/*.js', { root: 'baz' }) === '/dev/foo/baz/a/*.js';
```

## API

### `toAbsoluteGlob(glob, [options])`

Takes a `glob` string and an optional `options` object and produces an absolute glob. If the glob is relative, the `root` or `cwd` option (or `process.cwd()` if neither specified) will be used as the base of the glob.

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/@gulpjs/to-absolute-glob.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@gulpjs/to-absolute-glob
[npm-image]: https://img.shields.io/npm/v/@gulpjs/to-absolute-glob.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/to-absolute-glob/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/to-absolute-glob/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/to-absolute-glob
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/to-absolute-glob/main.svg?style=flat-square
<!-- prettier-ignore-end -->
