---
title: Inputs to the draw function
---

# Structure of `objects` argument in `draw` function

Arguably the most significant parameter the user has to specify for the `draw` function is `objects`, representing
the array of objects to be drawn.

To be successfully rendered, the array must contain objects that strictly follow a specific structure. Every object
must contain the following attributes:

-   `type` - `string`: Specifies whether a class, stack frame, or object is being drawn. To draw a class, input `.class` and to draw a stack frame, input `.frame`. If an object is being drawn, input the type of the object.
-   `name` - `string`: The name of the class or stack frame to be drawn. Note that this attribute is only
    applicable if the object's type is `.class` or `.frame`. Otherwise, this attribute can be excluded from the input.
-   If the user wants to hardcode the coordinates (implying the `automation` parameter of `draw` is false), each object
    must include `x` and `y` attributes (for x-y coordinates).
-   `id` - `string`|`number`: Denotes the id value of this object. If we are to draw a stack frame, then this MUST be `null`.
-   `value` - `*`: Denotes the value of the object. This could be anything, from an empty string to a JS object,
    which would be passed for the purpose of drawing a user-defined class object, a
    stack frame, or a dictionary.
    **Note that in such cases where we want to draw a 'container'
    object (an object that contains other objects), we pass a _JS object_ where the keys are the
    attributes/variables and the values are the id's of the corresponding objects (not the
    objects themselves)**.
-   `show_indexes` - `boolean`: This is applicable only when drawing tuples or lists (when drawSequence
    method will be used). It denotes whether the memory box of the underlying
    sequence will include indices (for sequences) or not. This
    has a default value of `false`, and it should be manually set to `true`
    only if the object corresponds to a sequence (list or
    tuple).
-   `style` - `object` | `array`: A JS object or array specifying the "style" of the object. See `style.md` for information
    on the required structure (also see `presets.md` for the full capabilities).

### Examples

```javascript
{
    "type": ".frame",
    "name": "__main__",
    "id": null,
    "value": {"lst1": 82, "lst2": 84, "p": 99, "d": 10, "t": 11}
}

{
    "type": ".frame",
    "name": "func",
    "id": null,
    "value": {"age": 12, "name": 17}
}

{"type": ".blank-frame", "width": 100, "height": 200}

{"type": "list", "id": 82, "value": [19, 43, 28, 49]}

{"type": "list", "id": 84, "value": [32, 10, 90, 57], "show_indexes": true}

{"type": "int", "id": 19, "value": 1969}

{"type": "bool", "id": 32, "value": true}

{"type": ".blank", "width": 200, "height": 100}

{"type": "str", "id": 43, "value": "David is cool"}

{"type": "tuple", "id": 11, "value": [82, 76]}

{"type": "set", "id": 90, "value": [36, 49, 64]}

{"type": "dict", "id": 10, "value": {"x": 81, "y": 100, "z": 121}}

{"type": "None", "id": 13, "value": "None",
    "style": {
      "text_value" : {"font-style": "italic"},
      "box_id": {"fill": "red", "fillStyle": "dots"},
      "box_type": {"fill": "red", "fillStyle": "solid"},
      "box_container": {"fill":"black", "fillStyle": "solid"}}
}
```
