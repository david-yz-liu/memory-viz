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

You may also specify an output path using the `--output` option (see below). If no output path is provided, the CLI will print to standard output.

_Note_: The CLI currently does not support typing input directly into the terminal. Instead, use piping or other strategies to pass data into standard input.

## Options

Below are optional arguments used to specify the way in which the SVG is outputed and generated.

### `--output=<path>`

Writes generated SVG to the specified file path. The directories in the path must exist. If the file already exists, it will be overwritten.

For example, `./<filename>`, `<filename>`, `./<dir>/<filename>`, `<dir>/<filename>` are accepted.

### `--width`

Specifies the width of the generated SVG.

### `--height`

Specifies the height of the generated SVG.

### `--roughjs_config<arg>`

Specifies the style of the generated SVG. Please refer to the [Rough.js documentation](https://github.com/rough-stuff/rough/wiki#options) for available options.

The argument is a comma-separated list of key-value pairs in the form `<key1=value1,key2=value2,...>`.

### `--global-style=<path>` (`-s <path>`)

Specifies a path to a CSS file that contains global styles for the SVG. The SVG source code contains various CSS selectors within the `<style>` tag, which can be used to style the SVG elements.

### `--theme=<name>` (`-t <name>`)

Applies a theme to the SVG. Included themes are `dark` and `high-contrast`. If no theme is specified, the default light theme is used. Custom themes can be defined using a `[data-theme]` attribute selector in the CSS file specified by the `--global-style` option.

## Examples

This takes input from a file and prints to `stdout`.

```console
$ npx memory-viz <path-to-file>
```

This takes input from `stdin`, generates the SVG with a width of 200, and prints to `stdout`.

```console
$ npx memory-viz --width=200
```

This takes input from a file, generates the SVG with a solid red fill, and writes the SVG to the specified path.

```console
$ npx memory-viz <path-to-file> --output=<path> --roughjs-config fill=red,fillStyle=solid
```

This takes an input from a file, generates the SVG with custom styles from a CSS file, and writes the SVG to the specified path.

```console
$ npx memory-viz <path-to-file> --output=<path> --global-style=<path-to-css>
```

This takes an input from a file, generates the SVG with a dark theme, and writes the SVG to the specified path.

```console
$ npx memory-viz <path-to-file> --output=<path> --theme=dark
```

This takes an input from a file, generates the SVG with a custom theme defined in a CSS file, and writes the SVG to the specified path.

```console
$ npx memory-viz <path-to-file> --output=<path> --global-style=<path-to-css> --theme=<custom-name>
```

Here is an example of a CSS file that defines a custom theme, and its usage:

```css
[data-theme="oceanic-light"] {
    --highlight-value-text-color: #014f86;
    --highlight-id-text-color: #008c9e; /* vibrant teal */

    --fade-text-color: #5c7382; /* muted sea gray-blue */
    --hide-text-color: #ffffff; /* white */

    --highlight-box-fill: #caf0f8; /* pale aqua */
    --highlight-box-line-color: #0077b6; /* strong ocean blue */

    --fade-box-fill: #dbeeff; /* soft light blue */
    --fade-box-line-color: #90e0ef; /* pastel aqua */

    --hide-box-fill: #ffffff; /* white */
}
```

```console
$ npx memory-viz <path-to-file> --output=<path> --global-style=<path-to-css> --theme=oceanic-light
```
