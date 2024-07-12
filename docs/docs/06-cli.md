---
title: MemoryViz CLI
---

# MemoryViz CLI

Run MemoryViz straight from your terminal!

The MemoryViz CLI takes in MemoryViz-compatible JSON and returns an SVG of the memory model.

## Usage

The CLI is called with `npx memory-viz` followed by optional arguments.

```console
$ npx memory-viz --option1 --option2=<val> ...
```

There are two ways to provide JSON input and three options for how the SVG is outputted.

## Input

### `--filepath=<path>`

Takes in JSON input from a file.

### `--stdin`

Takes in JSON input through standard input.

If you are typing JSON directly into the terminal, you need to signal the end of your input.

-   **macOS, Linux:** `Ctrl + D`
-   **Windows:** `Enter` followed by either
    -   `Ctrl + D`, or
    -   `Ctrl + Z` and then `Enter`

## Output

### Default

Saves SVG in the current working directory. Does not require additional input.

### `--output=<path>`

Saves SVG in the specified folder.

### `--stdout`

Prints SVG to standard output.

**NOTE:** While the `--filepath` input option may be combined with any of the three output options, `--stdin` must be used with either `--stdout` or `--output`.

## Options

Below are optional arguments used to specify the way in which the SVG is generated.

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
$ npx memory-viz --filepath=<path>
```

Standard input, standard output, with a width of 200.

```console
$ npx memory-viz --stdin --stdout --width=200
```

Standard input, output path, and solid red fill.

```console
$ npx memory-viz --stdin --output=<path> --roughjs-config fill=red,fillStyle=solid
```
