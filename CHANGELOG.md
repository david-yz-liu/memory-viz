# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### 🚨 Breaking changes

### ✨ Enhancements

- Added light/dark theme toggle button to demo website
- Added "Theme" rendering option, allowing users to change the theme of output
- Updated the default canvas bottom padding from 100 to 25
- Extended dict `value` to accept a list of two-element lists, where each inner list is in the form `[key id, value id]`
- Added styling for compound objects (lists, tuples, sets, and dictionaries)

### 🐛 Bug fixes

- Resolved CSS font-size keyword handling in text length calculations
- Updated the Style data type definition to allow for bare strings, along with error handling for invalid Style attribute strings.

### 📚 Documentation and demo website changes

- Updated the demo website to use `ThemedImages` for all image examples, supporting dark mode.
- Rewrote the `Style API` page of documentation to include JSON inputs and SVG outputs
- Updated the demo website main container height to full height of viewport

### 🔧 Internal changes

- Disabled `no-empty-keys` rule in ESLint config.
- Enabled Typescript `strict` option and fixed compilation errors
- Fixed bug where there are console.error outputs when running tests for the webstepper and demo sites even though tests pass
- Updated `autofix.ci` to v1
- Converted CLI from JavaScript to TypeScript and added dedicated webpack configuration for bundling it during builds.
- Migrated CLI tests from `child_process` to `execa`, converting all tests to async/await pattern
- Updated GitHub Actions workflows to `setup-node@v5` and Node.js v24
- Enabled Dependabot updates for GitHub Actions
- Introduced `DrawnEntityStrict` type and refactored `drawAll` to obtain an array of strict objects before drawing each object
- Moved logic for setting `x` and `y` coordinates from `automate.ts` to the `MemoryModel` class, deleted `automate.ts`

## [0.7.0] - 2025-08-11

### ✨ Enhancements

- Added unique object ids for SVG output object tags `<g>`
- Added support for global CSS styling using the `--global-style` option in the CLI
- Added optional attributes width and height for each drawn object
- Added `--theme` option to the CLI to apply stylized themes
- Added configurable hover interactivity feature to object ids, updated documentation

### 🐛 Bug fixes

- Fixed bug where the box wouldn't render properly when value is null for primitive types

### 📚 Documentation and demo website changes

- Rewrote 02-object_structure.md documentation page and renamed as 02-entity_specification.md

### 🔧 Internal changes

- Added Typescript support for "strictNullChecks" and refactored code accordingly
- Added dependabot groups for react and babel
- Removed getCanvasDimensions method and refactored logic into each `draw*` method
- Refactored type definitions for `DrawnEntity` and `Styles` to use zod
- Added eslint and ran it on all files

## [0.6.0] - 2025-05-24

### ✨ Enhancements

- If attribute name is the empty string or a string with only whitespaces, draw nothing
- Blank boxes can be created with null values for sets and lists
- Blank boxes can be created with blank empty strings or blank whitespace string values for dictionary keys
- Added type annotations in published package output
- Increased timeout for CLI tests from 2 seconds to 30 seconds
- Added appropriate icons to the buttons on the demo and webstepper pages
- Updated demo page tests in accordance with this change
- Added validation for user input in `drawAll` using zod, demo website now displays error for invalid inputs

### 🐛 Bug fixes

- Fixed bug where the keys of dictionaries disappear if box_container style sets a custom background colour
- Fixed bug where demo site would freeze upon the user inputting any valid JSON but not valid Memory Models JSON, added a test case

### 📚 Documentation and demo website changes

- Ensure GitHub Action deploys documentation to correct location
- Fixed links and syntax highlighting in READMEs

### 🔧 Internal changes

- Added Typescript declaration maps
- Added TypeScript support for the "NoImplicitAny" rule across project, fixing type issues raised across project.

## [0.5.0] - 2024-12-06

### ✨ Enhancements

- Added a batch mode to allow multiple snapshots as inputs to `draw` function

### 📚 Documentation and demo website changes

- Updated project READMEs.

### 🔧 Internal changes

- Added a GitHub workflow for automatically publishing memory-viz to npm.
- Added `prepare` script to `memory-viz/package.json`.
- Added environment to GitHub Actions configuration for publishing releases
- Updated `express` dependency to v4.21.2

## [0.4.0] - 2024-11-19

### ✨ Enhancements

- Added transparent and dark mode versions of the logos!
- Added functionality to set a default width for automatic-layout diagrams if not specified,
  and to crop unused space if necessary.

### 🐛 Bug fixes

- Fixed a bug where the `Download JSON` button would not download the JSON currently inside the input box.
- Made sure file input would reset when file input dialog was closed.
- Fixed a bug where the styles in `DisplaySettings.roughjs_config` were not applied.
- Fixed a bug where passing an empty array as objects will crash the program.
- Fixed a bug where the text may go outside of the box when it has a text font set

### 📚 Documentation and demo website changes

- Made text input box use a monospace font
- Disabled download buttons when there is no input/output.
- Added a dialog to the file input section.
- Made improvements to the dark mode version of the website.

### 🔧 Internal changes

- Added better typing.
- Added a page for viewing Jest SVG snapshots.
- Added a plugin for prettifying Jest SVG outputs.

## [0.3.2] - 2024-09-14

### ✨ Enhancements

- Added MemoryViz logo images!

### 🐛 Bug fixes

- Fixed an an issue with the `--output` flag not outputting results in the correct location.

### 📚 Documentation and demo website changes

- Reformatted demo website to horizontal layout.
- Added more documentation for the `--output` flag.
- Added zoom functionality to output canvas.

### 🔧 Internal changes

- Update GitHub Actions workflow to execute build on every pull request (and deployment only on changes to `master`)
- Create dependabot group for `@docusaurus` dependencies
- Create dependabot group for `@mui` dependencies

## [0.3.1] - 2024-08-02

### 🐛 Bug fixes

- Ensured built package files under `dist/` were correctly updated

### 🔧 Internal changes

- Updated most package dependencies

## [0.3.0] - 2024-08-02

### ✨ Enhancements

- Changed the `filePath` argument in the MemoryViz CLI to be optional and added `--output` option.

### 🐛 Bug fixes

- Fixed issue where object boxes would be drawn on top of stack frames in diagrams with large left margins.

### 🔧 Internal changes

- Moved global style attributes to CSS embedded in generated SVGs.

## [0.2.0] - 2024-06-28

### 🚨 Breaking changes

- Changed the `name` attribute to `type` when drawing objects.
- Removed the `isClass` and `stack_frame` attributes and embedded them as the types `.class` and `.frame`.
- Renamed the input for blank objects from `BLANK` to `.blank`.
- Created new type `.blank-frame` to denote blank stack frames.
- Replaced `seed` configuration option with general configuration option `roughjs_config`.

### ✨ Enhancements

- Created a CLI for MemoryViz.
- Added `--height` and `--width` options to MemoryViz CLI.
- Added `--roughjs_config` option to MemoryViz CLI.

### 🐛 Bug fixes

- Fixed a bug where box fill colours would cover box text, and changed the implementation of `hide` style option.
- Removed double quotes when rendering objects of type `None`.
- Removed double quotes when rendering objects that are not of type `str`.
- Fixed issue where diagrams would not render when width inputs to `draw()` were too small.

### 📚 Documentation and demo website changes

- Added documentation page for the MemoryViz CLI.

### 🔧 Internal changes

- Added a changelog and pull request template.
- Modified `roughjs` import to be compatible with Jest's `moduleNameMapper` config option.
- Added instructions on the `memory-viz/README.md` for running the test suite.
- Fix CI build action for demo website.
- Added data type and manual layout tests for the `draw` function.
- Updated file paths for example files under docs to import the correct file.
- Added style and automatic layout tests for the `draw` function.
- Updated documentation, tests, and examples to reflect the `isClass` attribute being optional and set to `false` by default.
- Removed unused imports in `demo_C.js`.
- Added type interfaces and type annotations to `style.ts`.
- Added `DrawnEntity` type annotations to source code files.
- Adopted Commander.js library for the MemoryViz CLI.
- Added `autofix.ci` to the CI workflow.
- Added correct link to file on GitHub for the "list of contributors" text in the pull request template markdown file.

## [0.1.0] - 2024-04-16

Initial release to [NPM](https://www.npmjs.com/package/memory-viz).
For changes up to this release, see the [commit history](https://github.com/david-yz-liu/memory-viz/commits/master/).
