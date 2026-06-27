---
title: Automatic Layout
---

# Automatic Layout

## Discussion

When an entity does not have x or y coordinates provided, an algorithm is used to
automatically compute coordinates instead. The algorithm is outlined below.

Users may specify the desired width of the canvas. If no width is provided, a width will
be computed based on width of the widest object and the widest stack frame.

Given a list of objects in the format described in `MemoryModel.drawAll`, we separate
these given objects into to collections as _stack frames_ and _other items_ by using the
`setDimensionsAll` function.

We equip the objects with their hypothetical dimensions and then optionally sort them before
laying them out. By default no sorting is applied; to enable sorting set `sort_by` to
`SortOptions.Height` or to `SortOptions.Id`. If `sort_by` is unset, the original input order
is preserved. After sorting (or leaving the input order intact), we begin equipping objects
with actual coordinates (the top-left corner), dynamically moving to a new row and continuing if necessary.

In particular, within the `setDimensionsAll` function, all stackframe objects are passed to
`setStackFrameCoordinates`, which not only equips the objects with the coordinates, but importantly
also returns the total width of the stack-frame "section" in the canvas, which is then passed
to `setOtherItemsCoordinates` as a way to tell it where the vertical division between the two
sections takes place (in this way, the divider between the stack-frame section and the objects section
is determined dynamically).

Below we thoroughly describe the steps for each of the two functions:
`setStackFrameCoordinates` and `setOtherItemsCoordinates`.

## `setStackFrameCoordinates`

1. First, we initialize the accumulators which helps us to track minimum required canvas height,
   required width for drawing all stack frames, and a collection of stack frames that will be drawn.

2. Afterward, we iterate through the given stack-frames objects. Inside the loop,
   we first acquire the width and the height of the object.

3. Then, we update the width accumulator (`stack_endpoint`) if the box width is greater than the size
   stored in the accumulator.

4. After that, we add the `x` and `y` attributes to the stack frames object (if it's not of type
   ".blank-frame"), and add the object to the collection accumulator. We obtain the x and y coordinates
   by setting x to the left margin and y to the current value of the minimum height accumulator.

5. At the end of the loop, we update the min required height by adding the height of the box to
   the accumulator. Then, we repeat for any remaining given stack-frame objects.

6. Outside the loop, if the given list of stack frames is not empty, add the left margin to the
   width accumulator. If the height of the canvas is undefined or less than the min required height
   plus padding, set the height of the canvas to the min required height plus padding.

7. At the end, we return a JS object that has the following format
   `{StackFrames: ..., stackEndpoint: ...}`

## `setOtherItemsCoordinates`

1. First, we determine the width of the canvas by computing a width based on the widest object and
   endpoint of the stack frames.
   If the user provided a width, we use the configured width unless it is smaller than the computed width.
   If no width is provided, use the computed canvas width.

2. Then, given a list of objects with width and height already assigned\*, optionally sort the objects.
   By default no sorting is applied; set `sort_by` to `SortOptions.Height` to sort by descending height,
   or to `SortOptions.Id` to sort by ascending id.

3. Loop through the passed list of objects, and let the
   current object be denoted as `item`:

- If `item` fits horizontally (which is determined by checking
  if the top-right coordinate of the last iteration's object,
  plus some padding, plus the width of `item` is less than the
  width of the entire canvas), **equip `item` with the (top-left)
  coordinates** it would take if it were drawn.
- If `item` does NOT fit horizontally, we move to a new row.
  Again, **equip `item` with the (top-left) coordinates** it
  would take if it were drawn (in this case, the x-coordinate
  would go back to the initial state since we moved to a new row,
  and the y-coordinate would increase by the height of the
  _previous_ row, which is determined from the height of the tallest object in that row).

4. Return the mutated list of objects.

\*In case the object has `type=".blank"`, it is assumed that the user has
also provided a width and a height attribute corresponding to the desired
width and height of the blank space. If such dimensions have not been provided,
a related warning is printed and the object is skipped (no blank space is
recorded). Note that if a blank stack frame is being drawn, the input should
have `type=".blank-frame"` and the `name` attribute should be excluded from the input.

## Summary

As a result, the caller of the `setDimensionsAll` function has a list of objects equipped with
coordinates, and `drawAll` proceeds to actually draw them.

Thus, **the process of determining coordinates is now fully automated**.
