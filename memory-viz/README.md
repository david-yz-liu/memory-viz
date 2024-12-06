# MemoryViz: Creating memory model diagrams

MemoryViz is a visualization tool that generates memory model diagrams for Python code, aimed at students and educators.
MemoryViz is written in Javascript and is built on top of the [Rough.js](https://roughjs.com/) library.

For more information, check out our [demo](https://www.cs.toronto.edu/~david/memory-viz/demo/) [project documentation](https://www.cs.toronto.edu/~david/memory-viz/).

## Installation

Install MemoryViz using `npm` (requires [Node.js](https://nodejs.org/en) to be installed):

```console
$ npm install memory-viz
```

## Usage

MemoryViz can be run from the command line or using its Javascript API.

### Command-line interface

Given a JSON file [`demo.json`](examples/demo.json) that encodes a state of Python memory and some styling options:

```json
[
    {
        "type": ".frame",
        "name": "__main__",
        "id": null,
        "value": { "lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11 }
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

![Sample usage svg output](examples/demo_output.svg)

## Javascript API (Node.js)

Call the `draw` function on an array that encodes a state of Python memory and some styling options.
Here's a complete example, which produces the same SVG output as above.

```js
const { draw } = require("memory-viz");

const objects = [
    {
        type: ".frame",
        name: "__main__",
        id: null,
        value: { lst1: 82, lst2: 84, p: 99, d: 10, t: 11 },
    },
    {
        type: "str",
        id: 19,
        value: "David is cool!",
        style: ["highlight"],
    },
    {
        type: "int",
        id: 13,
        value: 7,
    },
];

const model = draw(objects, true, { width: 1300 });

model.save("demo_output.svg");
```

### Javascript API (browser)

MemoryViz can also be run in the browser by loading the library from a CDN (e.g., [jsDelivr](https://cdn.jsdelivr.net/npm/memory-viz@latest/dist/memory-viz.bundle.js)) and accessing the global `memoryViz` object.
Here is a [standalone example](https://github.com/david-yz-liu/memory-viz/tree/master/examples/memory-viz-browser/index.html).

## Contributing

### Installation

1. Install [Node.js](https://nodejs.org/en/).
2. Clone the MemoryViz repository and `cd` into it:

    ```console
    $ git clone https://github.com/david-yz-liu/memory-viz.git
    $ cd memory-viz
    ```

3. Install the dependencies:

    ```console
    $ npm install
    ```

4. Install the pre-commit hooks to automatically format your code when you make commits:

    ```console
    $ npx husky init
    ```

5. Compile the MemoryViz library:

    ```console
    $ npm run build-dev --workspace=memory-viz
    ```

6. Run the test suite to check that all tests pass:

    ```console
    $ npm test
    ```

### Developer tips

**Automatic Javascript compilation**. Rather than running `npm run build-dev` to recompile your Javascript bundle every time you make a change, you can instead run the following command:

```console
$ npm run watch --workspace=memory-viz
```

This will use `webpack` to watch for changes to the Javascript source files and recompile them automatically.

_Note_: this command will keep running until you manually terminate it (Ctrl + C), and so you'll need to open a new terminal window to enter new terminal commands like running the demo below.

**Viewing Jest SVG snapshots.** To easily view the Jest SVG snapshots, open the file `memory-viz/src/tests/__snapshots__/snapshot.html` and select the snapshot outputs with the `*.snap` extension.
