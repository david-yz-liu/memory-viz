# MemoryViz CLI example

`demo.json` contains a sample memory model. Running the CLI on it produces an SVG file equivalent to `demo_output.svg`.

## Running

From the **repo root**, first build the library, then invoke the CLI:

```bash
$ pnpm --filter memory-viz run build-dev
$ pnpm exec memory-viz --output examples/memory-viz-cli/my_output.svg examples/memory-viz-cli/demo.json
```

This writes `my_output.svg` into this directory.
