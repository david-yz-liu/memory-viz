# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### 🚨 Breaking changes

-   Changed the `name` attribute to `type` when drawing objects.
-   Removed the `isClass` and `stack_frame` attributes and embedded them as the types `.class` and `.frame`.
-   Renamed the input for blank objects from `BLANK` to `.blank`.
-   Created new type `.blank-frame` to denote blank stack frames.

### ✨ Enhancements

### 🐛 Bug fixes

-   Fixed a bug where box fill colours would cover box text, and changed the implementation of `hide` style option.
-   Removed double quotes when rendering objects of type `None`.

### 📚 Documentation and demo website changes

### 🔧 Internal changes

-   Added a changelog and pull request template.
-   Modified `roughjs` import to be compatible with Jest's `moduleNameMapper` config option.
-   Added instructions on the `memory-viz/README.md` for running the test suite.
-   Fix CI build action for demo website.
-   Added data type and manual layout tests for the `draw` function.
-   Updated file paths for example files under docs to import the correct file.
-   Added style and automatic layout tests for the `draw` function.
-   Updated documentation, tests, and examples to reflect the `isClass` attribute being optional and set to `false` by default.
-   Removed unused imports in `demo_C.js`.
-   Added type interfaces and type annotations to `style.ts`.
-   Added `DrawnEntity` type annotations to source code files.
-   Replaced `seed` configuration option with general configuration option `roughjs_config`.

## [0.1.0] - 2024-04-16

Initial release to [NPM](https://www.npmjs.com/package/memory-viz).
For changes up to this release, see the [commit history](https://github.com/david-yz-liu/memory-viz/commits/master/).
