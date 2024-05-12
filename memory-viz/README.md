# MemoryViz: Creating memory model diagrams

This package generates memory model diagrams for Python code in the style of CSC110/111/148 at the University of Toronto.
This uses the [Rough.js](https://roughjs.com/) Javascript library to emulate the look of hand-drawn diagrams.

**Note**: this project is currently experimental, and may undergo significant changes before stabilizing.

## Installation (users)

1. Install [Node.js](https://nodejs.org/en/).
2. Install the `memory-viz` package:

    ```console
    $ npm install memory-viz
    ```

## Installation (developers)

1. First, clone this repository.
2. Install [Node.js](https://nodejs.org/en/).
3. Open a terminal in your local code of the repository, and then run:

    ```console
    $ npm install
    ```

4. Compile the Javascript assets using [webpack](https://webpack.js.org/guides/getting-started/):

    ```console
    $ npm run build-dev --workspace=memory-viz
    ```

5. Install the pre-commit hooks to automatically format your code when you make commits:

    ```console
    $ npx husky install
    $ npm pkg set scripts.prepare="husky install"
    $ npx husky add .husky/pre-commit "npx lint-staged"
    ```

### Automatic Javascript compilation

Rather than running `npm run build-dev` to recompile your Javascript bundle every time you make a change, you can instead run the following command:

```console
$ npm run watch --workspace=memory-viz
```

This will use `webpack` to watch for changes to the Javascript source files and recompile them automatically.

_Note_: this command will keep running until you manually terminate it (Ctrl + C), and so you'll need to open a new terminal window to enter new terminal commands like running the demo below.

### Running tests

To run the test suite, execute the following command:

```console
$ npm run test --workspace=memory-viz
```

## Usage

The only function that a user will ever have to call is `user_functions.draw`.

This function has three parameters:

1. `objs`: The array of objects (including stack-frames) to be drawn. Each object must follow
   a strict structure which is thoroughly outlined in the `object_structure.md` file.
2. `automation`: A boolean, indicating whether the location of the memory-model boxes should
   be automatically generated. If this is false, the user must x and y attributes for each object
   (representing the object's coordinates).
3. `configuration`: A JS object representing configuration such as the user-specified width.
   Defining a `width` property is mandatory if `automation` is `true`.

(**Note**: If the array of objects to be drawn is stored in a JSON file, the user can simply choose to pass the path to
that JSON as the first parameter to `draw`. The implementation automatically handles the case that `typeof objs === "string"`.
)
