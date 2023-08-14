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

## Example usage

```javascript
// In demo.js
const { MemoryModel } = require("memory-models-rough")

const m = new MemoryModel({ width: 1300, height: 1100 })

m.drawClass(10, 10, "emphasize", null, { lst: 4 }, true)
m.drawClass(10, 160, "__main__", null, { sentence: 2, hi: null }, true)
m.drawObject(510, 10, "list", 2, [10, 11, 12], true)
m.drawObject(770, 10, "list", 3, [10, 11, 12], false)
m.drawObject(510, 200, "str", 10, "winter")
m.drawObject(760, 200, "int", 11, 999)
m.drawObject(1010, 200, "bool", 12, true)
m.drawObject(510, 400, "set", 4, [10, 11, 12, 23, 24])
m.drawObject(510, 600, "dict", 100, { 2: 3, 10: 20, hi: "bye" })

m.drawClass(
    800,
    600,
    "HockeyTeam",
    26,
    { name: 21, games_played: 5, wins: 11 },
    false
)

m.save("demo.svg")
```

(**Note**: If the array of objects to be drawn is stored in a JSON file, the user can simply choose to pass the path to
that JSON as the first parameter to `draw`. The implementation automatically handles the case that `typeof objs === "string"`.
)

Running `node demo.js` creates a file `demo.svg` that contains the following image:

![Diagram generated for demo.js file.](docs/images/demo.svg)


### Automation Example

```javascript
// In automation_demo.js
const { draw } = require("user_functions");

const objs = [
   {"isClass": true, "name": "__main__", "id": null, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true},
   {"isClass": true, "name": "func", "id": null, "value": {"age": 12, "name": 17}, "stack_frame": true},
   {"isClass": false, "name": "list", "id": 82, "value": [19, 43, 28, 49]},
   {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
   {"isClass": false, "name": "int", "id": 19, "value": 1969},
   {"isClass": false, "name": "bool", "id": 32, "value": true},
   {"isClass": false, "name": "str", "id": 43, "value": "David is cool"},
   {"isClass": false, "name": "tuple", "id": 11, "value": [82, 76]},
   {"isClass": false, "name": "set", "id": 90, "value": [36, 49, 64]},
   {"isClass": false, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}},
   {"isClass": false, "name": "None", "id": 13, "value": "None"}
]

const configuration = {width: 1300, padding: 30, top_margin: 30, bottom_margin: 40, left_margin: 20, right_margin:30};

// const some_stack_frame = {"isClass": true, "name": "__main__", "id": 
// null, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}, "stack_frame": true}
//
// const another_stack_frame = {"name": "BLANK", "width": 100, "height": 200, "stack_frame" : true}
//
// const some_list = {"isClass": false, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true}
//
// const some_int = {"isClass": false, "name": "int", "id": 19, "value": 1969}
//
// const some_bool = {"isClass": false, "name": "bool", "id": 32, "value": true}
//
// const some_string = {"isClass": false, "name": "str", "id": 43, "value": "David is cool"}
//
// const some_dict = {"isClass": false, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}}
//
// const none = {"isClass": false, "name": "None", "id": 13, "value": "None"}
// 
// const objs = [some_stack_frame, another_stack_frame, some_list, some_int, some_bool, some_string, some_dict,
// some_dict, none];


const m = draw(objs, true, configuration)


m.save("~/Desktop/demo.svg")
```

Running node `automation_demo.js` creates a file `automation_demo.svg` that contains the following image:

![Diagram generated for automation_demo.js file.](docs/images/automation_demo.svg)




### Manual Coordinates Example

Despite the automation capabilities, the user may still wish to hardcode the coordinates of the memory boxes.
To do this, they must set the `automation` parameter of the `draw` function to false (signifying that no automation
should take place), and supply `x` and `y` coordinates for *every* object in the passed array (there is no notion of
"partial" automation).

Note that in the case of manual coordinates, the `configuration` parameter can provide no additional functionality,
and an empty object (`{}`) will suffice.

```javascript
// In automation_demo.js
const { draw } = require("user_functions");

const objs = [
   {"isClass": true, "x": 25, "y":200, "name": "__main__", "id": 82, "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10,
         "t": 11}, "stack_frame": true},
   {"isClass": true, "x": 350, "y":10, "name": "Person", "id": 99, "value": {"age": 12, "name": 17}, "stack_frame": false},
   {"isClass": false, "x": 350, "y": 350, "name": "list", "id": 82, "value": [19, 43, 28, 49]},
   {"isClass": false, "x": 350, "y": 600, "name": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true},
   {"isClass": false, "x": 750, "y": 10, "name": "int", "id": 19, "value": 1969},
   {"isClass": false, "x": 750, "y": 250, "name": "bool", "id": 32, "value": true},
   {"isClass": false, "x": 750, "y": 500, "name": "str", "id": 43, "value": "David is cool"},
   {"isClass": false, "x": 1050, "y": 40, "name": "tuple", "id": 11, "value": [82, 76]},
   {"isClass": false, "x": 1050, "y": 260, "name": "set", "id": 90, "value": [36, 49, 64]},
   {"isClass": false, "x": 1050, "y": 500, "name": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}},
   {"isClass": false, "x": 750, "y": 750, "name": "None", "id": 13, "value": "None"}
]

const configuration = {};

const m = draw(objs, false, configuration)


m.save("~/Desktop/manual_demo.svg")
```

Running node `manual_demo.js` creates a file `manual_demo.svg` that contains the following image:

![Diagram generated for automation_demo.js file.](docs/images/manual_demo.svg)





