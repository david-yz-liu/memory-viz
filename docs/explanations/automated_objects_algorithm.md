### Documentation For `drawAutomatedOtherItems`

How does the automation of `drawAutomatedOtherItems`, responsible
for drawing all non-stackframe objects actually work? The algorithms
is outlined below.

Given a list of objects in the format described in `MemoryModel.drawAll`,
but without `x` and `y` coordinates as properties (as the point of 
`drawAutomatedOtherItems` is to assign coordinates to each object):

1. Determine the size --width and height-- of the (outer) box of each object if it were to 
be drawn on canvas, and **equip the object with its calculated dimensions, by adding width and height properties**. This will tell us exactly how much space each
object will require in the canvas. For this purpose I created the `getSize` function
in the `automate.js` module, which accepts any object and returns the
size it would have on canvas.


2. Sort the list of objects by descending height of the objects 
(the height and weight properties were added to each object in 
STEP 1). The purpose of this step is to economize on the height
of the canvas; **all “tall” boxes ought to be together in the first 
(few) “rows” of the canvas, so not all “rows” need to have a 
large vertical value**. This sorting allows us to do this because
once you place an object in a new row, you know all remaining objects
will be shorter that this object.


3. Loop through the passed list of objects (which now is equipped
with dimensions, and is sorted by descending height), and let the
current object be denoted as `obj`:
- If `obj` fits horizontally (which is determined by checking
   if the top-right coordinate of the last iteration's object,
   plus some padding, plus the width of `obj` is less than the
   width of the entire canvas), **equip `obj` with the (top-left) 
   coordinates** it would take if it were drawn. 
- If `obj` does NOT fit horizontally, we move to a new row.
   The height of the new row will be the height of the current
   object that does not fit (plus some padding), `obj`, since (due to the sorting
   in step 2) `obj` is tallest amongst all remaining objects
      (so it just makes sense to the make this the height of
   the row itself). 
   Again, **equip `obj` with the the (top-left) coordinates** it 
   would take if it were drawn (in this case, the x-coordinate
   would go back to the initial state since we moved to a new row,
   and the y-coordinate would increase by the height of the 
   *previous* row).

4. Return the mutated list of objects.


So, in summary, we equip the objects with their hypothetical 
dimensions, we sort them by height, and the begin equipping
them with actual coordinates (of the top-left corner),
dynamically moving to a new row and continuing if necessary.

As a result, the caller of the function (may that be an actual user
or another function) has a list of objects equipped with coordinates,
and can use `drawAll` (assuming the existence of a MemoryModel object)
to actually draw them.

Thus, **the process of determining coordinates is now fully automated**. 
