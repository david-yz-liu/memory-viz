# Memory model diagrams

This package generates memory model diagrams for Python code in the style of CSC110/111/148 at the University of Toronto.
This uses the [Rough.js](https://roughjs.com/) Javascript library to emulate the look of hand-drawn diagrams.

**Note**: this project is currently experimental, and may undergo significant changes before stabilizing.

## Installation (users)

1. Install [Node.js](https://nodejs.org/en/).
2. Install the `memory-models-rough` package from GitHub (it is currently not on npm):

    ```console
    $ npm install git+https://github.com/david-yz-liu/memory-models-rough.git -g
    ```

    _Note_: omit the `-g` flag if you want to install the package into just the current working directory.

## Installation (developers)

1. First, clone this repository.
2. Install [Node.js](https://nodejs.org/en/).
3. Open a terminal in your local code of the repository, and then run:

    ```console
    $ npm install
    ```

4. Compile the Javascript assets using [webpack](https://webpack.js.org/guides/getting-started/):

    ```console
    $ npm run build
    ```

That's it!
You should then be able to try out the demo in the [Example usage](#example-usage) section below.

### Automatic Javascript compilation

Rather than running `npm run build` to recompile your Javascript bundle every time you make a change, you can instead run the following command:

```console
$ npm run watch
```

This will use `webpack` to watch for changes to the Javascript source files and recompile them automatically.

*Note*: this command will keep running until you manually terminate it (Ctrl + C), and so you'll need to open a new terminal window to enter new terminal commands like running the demo below.



2. style
   3. config
   4. blank-spaces
   4. presets 


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


### Automation
One of the main capabilities offered is the automatic generation of coordinates for objects
passed by the user.



##### Automation Example



### Style Features for Drawing
 
The package allows user to define their own configuration for the style of the drawings. To achieve this, we utilize 
rough package (see the documentation of rough package) and SVG (see the documentation of SVG for details). Rough package
is used for style configurations related to boxes (that are drawn) and SVG is mainly related to texts. Therefore, the user
needs to follow the guidelines (documentation) of the aforementioned packages **and** the instructions in the `style.md` file
on how to pass these *style* arguments. We strongly recommend the user to consult the `style.md` file. 

Also, we provide pre-sets that users can utilize. Hence, user can pass these presets (following
the instructions in the `style.md` file)

Our default style is as follows:

![Diagram generated for showing our default style](docs/images/demo.svg)

On the other hand, users can gene

