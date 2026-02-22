# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### ✨ Enhancements

### 🐛 Bug fixes

### 🚨 Breaking changes

- The webstepper now requires a list of JSONS containing line numbers, a MemoryViz input and (optionally) a configuration to be provided by a global variable. MemoryViz is then invoked directly to render these MemoryViz inputs into SVGs for display.

### 📚 Documentation changes

### 🔧 Internal changes

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
