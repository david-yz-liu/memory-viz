---
title: MemoryViz CLI
---

# MemoryViz CLI

Run MemoryViz straight from your terminal!

The MemoryViz CLI takes in MemoryViz-compatible JSON and returns an SVG of the memory model.

## Usage

To use the MemoryViz CLI, run:

```console
$ npx memory-viz <path-to-file>
```

where `<path-to-file>` is the path to a file containing MemoryViz-compatible JSON. If a file path is not provided, the CLI will take input from standard input.

By default, the SVG is saved in the current working directory. See the "Options" section below for more output options.

NOTE: If you choose not to provide a file path and are typing JSON directly into the terminal, you need to signal the end of your input.

-   **macOS, Linux:** `Ctrl + D`
-   **Windows:** `Enter` followed by either
    -   `Ctrl + D`, or
    -   `Ctrl + Z` and then `Enter`

## Options

Below are optional arguments used to specify the way in which the SVG is outputed and generated.

### `--output=<path>`

Saves SVG in the specified folder.

### `--stdout`

Prints SVG to standard output.

NOTE: If the CLI is taking input from standard input, either `--stdout` or `--output` must be specified.

### `--width`

Specifies the width of the generated SVG.

### `--height`

Specifies the height of the generated SVG.

### `--roughjs_config<arg>`

Specifies the style of the generated SVG. Please refer to the [Rough.js documentation](https://github.com/rough-stuff/rough/wiki#options) for available options.

The argument is a comma-separated list of key-value pairs in the form `<key1=value1,key2=value2,...>`.

## Examples

File path input and default output.

```console
$ npx memory-viz <path-to-file>
```

Standard input, standard output, with a width of 200.

```console
$ npx memory-viz --stdout --width=200
```

File path input, output path, and solid red fill.

```console
$ npx memory-viz <path-to-file> --output=<path> --roughjs-config fill=red,fillStyle=solid
```
