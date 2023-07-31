/**
 * Makes the memory model more visually appealing by a "vertical centering" of the objects' boxes.
 *
 * The idea is that the first object in a row (the "rowBreaker") could be much taller than the remaining ones in that
 * row, so instead of putting all y-coordinates of the top-left corner to be the same across all these objects,
 * the non-rowBreaker boxes are brought down a bit so that they look vertically centered. Specifically, they are
 * brought down until the margin from the top of the rowBreaker and the margin from the bottom of the rowBreaker
 * are equal.
 *
 * NOTE: Once again, there is no canvas here or actual visual displacements, but merely mutation of the passed list
 * of objects, changing the "y" property of some objects. Of course, this does translate to visual changes once
 * you put this list of objects on canvas (e.g. using the 'MemoryModel.drawAll' method).
 *
 * @param {[object]} objs the list of objects which we want to vertically beautify
 * @returns {[object]} a mutates list of objects, with altered y-coordinates for the objects.
 */
function vert_beautify(objs) {
    // Initially, the height against which we compare is the height of the first object, the tallest of all.
    let height = objs[0].height

    for (const obj of objs) {
        // Ensuring every object has the 'rowBreaker' property. All "first" objects in row have them from the
        // 'drawAutomatedOtherItems' functions, but the rest do not.
        obj.rowBreaker = obj.rowBreaker|false;

        // we are changing row, so we now need to compare against the first object of that row.
        // All displacement happen relative to the "rowBreaker" object, so this object does not move at all.
        if (obj.rowBreaker) {
            height = obj.height;

        } else {
            // Calculations (to make margins from the top and the bottom of the "rowBreaker" box equal)
            const diff = height - obj.height;
            const displacement = diff/2;
            obj.y = obj.y + displacement
        }
    }

    return objs;
}


/**
 *
 * @param {Array} objects
 */
function warnForBlankSpaces(objects) {
    for (let i=0; i < objects.length; i++) {
        const obj = objects[i];

        if ((obj.name === "BLANK") && (!obj.hasOwnProperty("height") || !obj.hasOwnProperty("width"))) {
            objects.splice(i);
            console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
        }
    }
}