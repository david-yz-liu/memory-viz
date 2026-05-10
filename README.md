# MemoryViz

Welcome to the repository for the MemoryViz project!
MemoryViz is a visualization tool that generates memory model diagrams for Python code, aimed at students and educators.
MemoryViz is written in Javascript and is built on top of the [Rough.js](https://roughjs.com/) library.

For more information, check out our [demo](https://www.cs.toronto.edu/~david/memory-viz/demo/) and [project documentation](https://www.cs.toronto.edu/~david/memory-viz/).

## Installation

Install MemoryViz using `npm` (requires [Node.js](https://nodejs.org/en) to be installed):

```bash
$ npm install memory-viz
```

## Example

Given a JSON file [`demo.json`](examples/memory-viz-cli/demo.json) that encodes a state of Python memory and some styling options:

```json
[
    {
        "type": ".frame",
        "name": "__main__",
        "value": { "s": 19, "x": 13 }
    },
    {
        "type": "str",
        "id": 19,
        "value": "David is cool!",
        "style": ["highlight"]
    },
    {
        "type": "int",
        "id": 13,
        "value": 7
    }
]
```

you can run the following command in the terminal:

```console
$ npx memory-viz --output demo_output.svg demo.json
```

This producs an SVG file, `demo_output.svg`, that visualizes the state of memory:

![Sample usage svg output](examples/memory-viz-cli/demo_output.svg)

## About this repository

This repository contains multiple [pnpm workspaces](https://pnpm.io/workspaces) that contains the MemoryViz-related projects.

- [memory-viz/](memory-viz/) is the source code for the main `memory-viz` Javascript package
- [demo/](demo/) contains the source code for the [demo website](https://www.cs.toronto.edu/~david/memory-viz/demo/)
- [docs/](docs/) contains the source code for the [project documentation website](https://www.cs.toronto.edu/~david/memory-viz/)
- [webstepper/](webstepper/) contains the source code for the Webstepper project, which integrates MemoryViz and [PythonTA](https://www.cs.toronto.edu/~david/pyta/)

## Developers

### Installation

1. Install [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/installation).
2. Clone the MemoryViz repository and `cd` into it:

    ```bash
    $ git clone https://github.com/david-yz-liu/memory-viz.git
    $ cd memory-viz
    ```

3. Install the dependencies:

    ```bash
    $ pnpm install
    ```

4. Compile the MemoryViz library:

    ```bash
    $ pnpm --filter memory-viz run build-dev
    ```

5. Run the test suite to check that all tests pass:

    ```bash
    $ pnpm test
    ```

### Developer tips

**Automatic Javascript compilation**. Rather than running `pnpm --filter memory-viz run build-dev` to recompile your Javascript bundle every time you make a change, you can instead run the following command:

```bash
$ pnpm --filter memory-viz run watch
```

This will use `webpack` to watch for changes to the Javascript source files and recompile them automatically.

_Note_: this command will keep running until you manually terminate it (Ctrl + C), and so you'll need to open a new terminal window to enter new terminal commands like running the demo below.

**Viewing Jest SVG snapshots.** To easily view the Jest SVG snapshots, open the file `memory-viz/src/tests/__snapshots__/snapshot.html` and select the snapshot outputs with the `*.snap` extension.

### Building and running the documentation website

See [`docs/README.md`](docs/README.md).

### Building and running the demo website

See [`demo/README.md`](demo/README.md).

### Building and running the webstepper website

See [`webstepper/README.md`](webstepper/README.md).
