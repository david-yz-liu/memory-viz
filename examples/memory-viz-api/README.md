# memory-viz API example

`demo.js` shows basic usage of the `memory-viz` JavaScript API: constructing a memory model and saving it as an SVG file.

## Running

First build the library, then run the script with Node:

```bash
$ pnpm --filter memory-viz run build-dev
$ node examples/memory-viz-api/demo.js
```

This writes `demo_output.svg` to the current directory.
