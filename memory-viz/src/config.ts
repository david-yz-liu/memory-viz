export const config = {
    rect_style: { stroke: "rgb(0, 0, 0)" },
    text_color: "rgb(0, 0, 0)", // Default text color
    value_color: "rgb(27, 14, 139)", // Text color for primitive values
    id_color: "rgb(150, 100, 28)", // Text color for object ids
    item_min_width: 50, // Minimum width of an item box in a collection
    item_min_height: 50, // Minimum height of an item box in a collection
    obj_min_width: 200, // Minimum width of object rectangle
    obj_min_height: 130, // Minimum height of object rectangle
    prop_min_width: 60, // Minimum width of type and id boxes
    prop_min_height: 50, // Minimum height of type and id boxes
    obj_x_padding: 25, // Minimum horizontal padding of object rectangle
    double_rect_sep: 6, // Separation between double boxes around immutable objects
    list_index_sep: 20, // Vertical offset for list index labels
    font_size: 20, // Font size, in px
    browser: false, // Whether this library is being used in a browser context
};
