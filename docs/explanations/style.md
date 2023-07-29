## API

A user is able to add custom styling to an object 
(of the list of objects to be drawn on canvas) by
adding an attribute named `style` which maps to an object of the 
following format:
`
style : {
text_id : {...},
text_type : {...},
text_value : {...},
box_id : {...},
box_type : {...},
box_container : {...},
}
`.

The object has up to six attributes (the ones observed above), each 
corresponding to a particular component of an object with the potential
to be styled.

Crucially, each of the attributes in the `style` object refer themselves
to another object:
- Text-related attributes can contain any attribute specified in the
documentation of the text element for svg graphics, found on 
https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text.
- Box-related attributes can contain any styling attributes specified in the
  documentation of the the rough library, found on https://roughjs.com/ and
  https://github.com/rough-stuff/rough/wiki.


## Insights for the Implementation
The user specifies a desired style for each of the objects in the list.

### Merging
First, there is a default object that containes all key-value pairs of style attributes
that (be default) are common across objects of all types. This object is called `common_style`.

Then we use a list objects to represent some styling properties specific to certain type categories
(for instance, `text_value` for collections need to have the id color by default, which
is not true for primitive types). The `deepmerge` library is used to merge the common styles
mentined above with these category-specific styles.

Finally, any user-supplied styling attributes are merged to the current style object.
This is the second and final merge.

### Cascade
The above "merging" procedure takes place inside the `drawAll` method (using the 
`populateDefaultStyle` helper function).

Then, inside the `drawClass` and `drawObject` methods (which are called from within
`drawALl`), for every invocation of `drawText` and `drawRect` (responsible for drawing
text and boxes, respectively), the corresponding attribute of the object's style 
object is passed (for instance, in the case where `drawText` is called to draw the id value
inside the id box, `style.text_id` is passed as an argument to `drawText`).

Finally, inside of drawText and drawRect, we loop through all the attributes of the
passed style object, and apply each of those in the appropriate manner (
for drawRect, you simply pass the style when initializing a recktangle by doing
`this.rough_svg.rectangle(x, y, width, height, style)`, and with the text element you
use the DOM method `setAttribute` by doing `newElement.setAttribute(style_attribute, style[style_attribute])`
).

Thus the style is cascaded down from user to drawText/drawRect as follows:

user-defined style --> drawAll --> drawClass/drawObject --> drawText/drawRect


## Examples
....................

....................

....................
