---
title: MemoryViz CLI
---

# MemoryViz CLI

You can run MemoryViz straight from your terminal!

## Input

To run the MemoryViz CLI, run:

```console
$ npx memory-viz <path-to-file>
```

replacing `<path-to-file>` with the path to a file containing MemoryViz-compatible JSON. If the file content is not compatible with MemoryViz, an error will be thrown.

## Output

The output is an SVG image generated by MemoryViz and the image is saved in the current working directory. The name of the SVG will be the same as that of the inputted file (i.e., if the inputted file is `david-is-cool.json`, the output will be `david-is-cool.svg`).

## Options

Below are optional arguments used to specify the way in which the SVG image is generated.

### `--width`

Specifies the width of the generated SVG.

```console
$ npx memory-viz <path-to-file> --width=700
```

### `--height`

Specifies the height of the generated SVG.

```console
$ npx memory-viz <path-to-file> --height=700
```

### `--roughjs_config`

Specifies the style of the generated SVG. Please refer to the [Rough.js documentation](https://github.com/rough-stuff/rough/wiki#options) for available options.

The argument is a comma-separated list of key-value pairs in the form `<key1=value1,key2=value2,...>`.

```console
$ npx memory-viz <path-to-file> --roughjs-config fill=red,fillStyle=solid
```
