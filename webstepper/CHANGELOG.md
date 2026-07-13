# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### 🚨 Breaking changes

### ✨ Enhancements

- Added optional `startLineNumber` variable for custom line numbers, defaulting to first element of `memoryVizData` if not set
- Removed line wrap and added a horizontal scrollbar for overflowing text to `CodeDisplay`
- Replaced canvas rendering with live SVG in `SvgDisplay.tsx`, adding box highlighting when the user hovers over object IDs

### 🐛 Bug fixes

### 📚 Documentation changes

### 🔧 Internal changes

- Removed the unused `automation` parameter when calling the draw function

## [0.9.1] - 2026-06-11

### ✨ Enhancements

- Modified the MemoryViz images to match the current theme (light or dark) of the webstepper website

## [0.9.0] - 2026-05-23

### ✨ Enhancements

- Added the MemoryViz logo as a favicon
- Added dark mode syntax highlighting for the code display
- Added `lang` attribute to root `<html>` element of webstepper website
- Changed webstepper website subheading component to `<h2>` to ensure all heading elements are in sequentially decreasing order

### 🚨 Breaking changes

- The webstepper now requires a list of JSONS containing line numbers, a MemoryViz input and (optionally) a configuration to be provided by a global variable. MemoryViz is then invoked directly to render these MemoryViz inputs into SVGs for display.

### 🔧 Internal changes

- Switched webstepper website from default `i18next` instance to a separate instance

## [0.8.0] - 2025-12-04

### ✨ Enhancements

- Added light/dark theme toggle button to webstepper website

### 🔧 Internal changes

- Fixed bug where there are console.error outputs when running tests even though tests pass

## [0.7.0] - 2025-08-11

### ✨ Enhancements

- Launchd an initial prototype!
- Improved UI to indicate when the end of the program is reached.
- Expanded code and svg displays in UI.
- Added the ability to step back and forth using the arrow keys.
- Added arrow key icons

### 📚 Documentation changes

- Added a README.

### 🔧 Internal changes

- Added a script for installing the Webstepper build to a specified path.
- Updated to use the window object to serve app data.
- Enabled SCSS support.
