# Function: draw()

> **draw**(`objects`, `automation`, `configuration`): `MemoryModel`

Draw the given objects on the canvas.

The format of the array of objects must adhere to the description provided in MemoryModel.drawAll.

## Parameters

• **objects**: `string` \| [`DrawnEntity`](../interfaces/DrawnEntity.md)[]

The array of objects to be drawn: this could be passed as an actual JavaScript
array of objects, or as a JSON file containing the object array. This array of objects may also include the
user-defined style configuration. See the demo files and style.md file for details.

• **automation**: `boolean`

Whether the coordinates (of the objects on the canvas) should be automatically
generated or manually inputted.

• **configuration**: `Partial`\<[`DisplaySettings`](../interfaces/DisplaySettings.md)\>

The configuration (display settings) defined by the user.
This is also the place to define `sort_by` ("height" or "id") for the object space.
NOTE: In the case that automation == true, then the user must define configuration.width,
as this will be used as the "max canvas width" for the automation process.
If automation == false, then all configuration properties are optional, and the function
will still operate even without defining them.

## Returns

`MemoryModel`

the produced canvas

## Defined in

[user_functions.ts:32](https://github.com/leowrites/memory-viz/blob/8cda88515e50b41d2533b761233a7a153c7b994c/memory-viz/src/user_functions.ts#L32)
