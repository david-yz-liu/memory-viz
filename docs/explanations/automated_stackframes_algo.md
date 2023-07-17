### Documentation for `drawAutomatedStackFrames`


This is the documentation for the `drawAutomatedStackFrames`, which
outlines the main idea behind the algorithm which automatically aligns
the stack frames on the canvas.

Given a list of objects in the format described in `MemoryModel.drawAll`,
but without `x` and `y` coordinates as properties (as the point of
`drawAutomatedStackFrames` is to assign coordinates to each object):

1. First we make sure that no configuration options (padding etc.)
   remain undefined. To achieve this, we loop through the configurations
   attributes and check whether they have already been defined by the user. If not,
   we pass in the default configuration settings.
2. Then, we initialize the accumulators which helps us to track minimum required canvas height,
   required width for drawing all stack frames and a collection of stack frames that will be drawn.
3. Afterward, we iterate through the given stack-frames objects. Inside the loop,
   we first acquire the width and the height of the object. If the box is "BLANK", we obtain the height and width
   by accessing the attributes of the object. If not, we obtain the dimensions by using the `getSize` function. Refer
   to the function for details.
4. Moreover, we update the width accumulator, if the box width is greater than the size stored in the accumulator
5. After that, we add the `x` and `y` attributes to the stack frames object (if it's not a BLANK box), and add the object
   the collection accumulator.
6. At the end, we update the min required height by adding the height of the box to the accumulator and return
   the object. After the loop, we update the accumulator in accordance with the `configuration.padding`.
7. At the end, we return a JS object that has the following format `{StackFrames: ..., requiredHeight: ..., requiredWidth: ...}`



So, in summary, we equip the objects with their hypothetical
dimensions, we sort them by height, and equip
them with actual coordinates (of the top-left corner),
dynamically moving to a new row and continuing if necessary.

As a result, the caller of the function (may that be an actual user
or another function) has a list of objects equipped with coordinates,
and can use `drawAll` (assuming the existence of a MemoryModel object)
to actually draw them.
