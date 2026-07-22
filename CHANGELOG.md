# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### 🚨 Breaking changes

### ✨ Enhancements

### 🐛 Bug fixes

### 📚 Documentation and demo website changes

- Removed line wrap and added a horizontal scrollbar for overflowing text to `MemoryModelsTextInput`
- Added resizable panels to the demo website using the new `react-resizable-panels` dependency

### 🔧 Internal changes

- Added `data-memory-viz-object-id` as a data attribute to each object's `<g>` tag and refactored `memory_model.ts` to remove the use of `idToObjectMap` attribute, replacing it with with separate Javascript code within the interactivity logic that dynamically builds the object ID map

## [0.10.0] - 2026-07-15

### 🚨 Breaking changes

- Removed the unused `automation` parameter from the draw function and all its usages

### ✨ Enhancements

- Scoped CSS styles to the `memory-viz-diagram` class applied to the `<svg>` element, so styles do not leak onto surrounding page content when a diagram is embedded in a host page

### 🐛 Bug fixes

- Updated `dict` key positioning so each label is centered in its box
- Resolved the error when generating very wide objects, setting the canvas width to a computed required width when width not explicitly set
- Fixed the broken hover interactivity feature

### 📚 Documentation and demo website changes

- Updated demo website to combine error messages into one banner located under the user input box
- Removed "Draw Diagram" button from demo website and added automatic memory model rendering
- Updated `memory-viz/docs/docs/03-automation_algorithms.md` to reflect current algorithm used by Memory Viz
- For sample inputs in the demo website, removed the automatic layout example and modified the manual layout example to use the same objects as the simple example
- Replaced canvas rendering with live SVG in the demo website's `SvgDisplay.tsx`, adding box highlighting when the user hovers over object IDs

## [0.9.1] - 2026-06-11

### ✨ Enhancements

- Updated and established a new standard for immutable objects where `x`, `y`, `width`, and `height` to refer to the outermost rectangle
- Updated `ClassDrawnEntitySchema` to allow value to be either a dictionary or a string, enabling `.class` objects to display a string representation instead of attribute rows

### 🐛 Bug fixes

- Removed unwanted right padding in `draw()` with primitive objects

### 📚 Documentation and demo website changes

- Added `memory-viz` workspace dev dependency to `package.json`

### 🔧 Internal changes

- Updated CI config to use Ubuntu v24.04, `pnpm/action-setup@v6`, and pass `--no-git-checks` to `pnpm publish`
- Removed old access token from the GitHub Action for package publishing
- Added `generate-svgs-plugin` to run old `generate-svgs` script functionality when the documentation site starts, and deleted script. Also removed all svg files and added them to `.gitignore`
- Added `memory-viz` workspace dependency to repository root

## [0.9.0] - 2026-05-23

### ✨ Enhancements

- Added the built in immutable Python types (complex, bytes, range) to the memory-viz immutable types
- Added documentation and tests for the pre-existingly supported immutable Python type `datetime.date`
- Added the built in immutable Python type `frozenset` to the memory-viz immutable, and sequence types
- Refactored `drawSequence` to use literal types to verify the `type` argument type validation
- Added id validation for 'draw' input to print a warning when duplicate ids or unresolved id references are detected
- Added `<title>` and `<desc>` attributes to describe the root `<svg>` element and each `DrawnEntity` within generated SVG diagrams, and added `role="graphics-object"` attribute to `<g>` tags
- Added category descriptions to `<text>` elements using `aria-describedby` and added `aria-hidden="true"` attribute to decorative text in memory model diagrams
- Changed the order in which `DrawnEntity` components are drawn to improve screen reader navigation
- Grouped stack frames and objects into separate `<g>` tags with a `<title>` description for each group

### 🐛 Bug fixes

- Added trailing zeroes to values for objects of type `float`
- Changed labels for `<text>` elements in stack frames from "attribute name" and "attribute value" to "parameter name" and "parameter value"
- Removed unwanted padding in `draw()` when memory model is generated without any stack frames
- Fixed stack frames to all share a uniform width equal to the maximum computed/specified width among all frames

### 📚 Documentation and demo website changes

- Updated the `LightbulbIcon` in the `MemoryModelsMenu` so that it no longer rotates on click
- Switched demo website from default `i18next` instance to a separate instance
- Added the MemoryViz logo as a favicon to the documentation and demo webpages
- Replaced the Docusaurus logo with the MemoryViz logo in the header of the docs website
- Removed unneeded `id: null` for `.frame` objects in demo JSON inputs
- Added `lang` attribute to root `<html>` element of demo website
- Changed demo website subheading component to `<h2>` to ensure all heading elements are in sequentially decreasing order
- Added `tabindex` to `MenuItem` and converted `Menu` to `Popover` in `MemoryModelsMenu` to ensure all interactive elements in the demo website are keyboard focusable
- Updated the `MemoryModelSample` to not reset the draw theme after each render and set the default theme of renders to match the website's theme
- Changed demo website to only `useAutomation` and removed the checkbox to toggle that render setting to remove non-`useAutomation` MemoryModels from being drawn twice on top of one another
- Replaced `required` column with `default` on 'Entity Specification' page and updated documentation to reflect new DrawnEntitySchema
- Updated the SvgDisplay to re-render whenever the configuration data is changed
- Changed demo website sample inputs to ensure no warnings are emitted
- Added an example of multiple stack frames to the documentation website

### 🔧 Internal changes

- Added `cross-env` dev dependency to enable setting environment variables in npm `"scripts"` commands on Windows
- Resolved warnings and errors that printed to terminal when test suites were ran
- Wrapped rect and text elements for each `DrawnEntity` into parent `<g>` tag before appending to root `<svg>` element
- Fix diagram width tests to correctly test for small input widths
- Parameterized snapshot tests for the 'draw' function
- Switched from default `i18next` instance to a separate instance
- Prevented coveralls.io failure from triggering CI failure
- Updated `.gitignore` to ignore vscode config files
- Refactored `DrawnEntitySchema` to use discriminated union of schemas for each type, throwing error for invalid fields
- Wrapped each `<text>` element under the `<g>` tag that draws its border
- Corrected prop type annotation and the isDarkMode default value in `demo/src/SvgDisplay.tsx` to eliminate related Typescript Errors
- Removed use of `& { value?: any }` intersection type for `DrawnEntity`
- Allow arbitrary inputs to `draw()` by moving `DrawnEntitySchema.safeParse()` validation from `drawAll()` to `draw()`
- Add default values for `id`, `value`, `show_indexes`, `name`, and blank objects' `width`/`height` fields in `DrawnEntitySchema`
- Renamed `object` to `entity` in `MemoryModel` methods, where an entity can either be a stack frame or an object
- Modified demo JSON example to resolve all warnings in the examples directory. Also updated the demo.json code snippet in README.md for consistency.
- Switched to `pnpm` for project build management
- Changed `generate-svgs` to import the default `memory-viz` export to align with the package's ESM export shape
- Changed `draw.spec` test to remove floating point errors

## [0.8.0] - 2025-12-04

### ✨ Enhancements

- Added light/dark theme toggle button to demo website
- Added "Theme" rendering option, allowing users to change the theme of output
- Updated the default canvas bottom padding from 100 to 25
- Added styling for compound objects (lists, tuples, sets, and dictionaries)
- Extended dict `value` to accept a list of two-element lists, where each inner list is in the form `[key id, value id]`
- Added internationalization (i18n) support for translations across demo, webstepper, and CLI.

### 🐛 Bug fixes

- Resolved CSS font-size keyword handling in text length calculations
- Updated the Style data type definition to allow for bare strings, along with error handling for invalid Style attribute strings.
- Updated `cliConfig` in webpack configuration to make CLI run correctly after being bundled

### 📚 Documentation and demo website changes

- Updated the demo website to use `ThemedImages` for all image examples, supporting dark mode.
- Rewrote the `Style API` page of documentation to include JSON inputs and SVG outputs
- Updated the demo website main container height to full height of viewport
- Enabled demo website's checkmark in input text box to dynamically match light/dark theme

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
- Converted the entire monorepo from CommonJS to native ESM, including package/module configuration, TypeScript and Webpack builds, experimental Jest ESM setup, and full migration of all imports, mocks, and tests.
- Split output files to have CJS and ESM versions for Node and the browser

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
