## About
In case the user does not want to get their hands dirty with specific DOM (and RoughJS) attributes
for configuring the style of an object, they have the option specify a present, which represents
an umbrella of different styling attributes that are combined to produce a particular effect, such
as "highling" an object, or "hiding" a particular component of it.

To declare the desired preset, the user must assign it to the `style` attribute 
(e.g. `style: "highlight"`).

## Specs

### `highlight`
![Screenshot 2023-07-31 at 11.31.03 AM.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Ff6%2Fx6rhw35x1svfhxbxw4g0lrl00000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_7NulwZ%2FScreenshot%202023-07-31%20at%2011.31.03%20AM.png)

When the keyword `highlight` is provided as the value for the `style` attribute, there will be significant
changes on the appearance of the contanier. In terms of the boxes (the container representing the data, the id box
if applicable and the type box), the lines will be bolder, and there will be less roughness (lines would be more still
than usual). In terms of the texts (the text representing the id, type and the value), the font size will be bigger,
and they will appear bolder than default.


### `highlight_id`

When the keyword `highlight_id` is provided as the value for the `style` attribute, there will be significant
changes on the appearance of the contanier. In terms of the id box the lines will be bolder, and there will be
less roughness (lines would be more still than usual). In terms of the id text, the font size will be bigger, and it
will appear bolder than default.

### `highlight_type`

When the keyword `highlight_type` is provided as the value for the `style` attribute, there will be significant
changes on the appearance of the contanier. In terms of the type box the lines will be bolder, and there will be
less roughness (lines would be more still than usual). In terms of the type text, the font size will be bigger, and it
will appear bolder than default.

### hide
![Screenshot 2023-07-31 at 11.34.26 AM.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Ff6%2Fx6rhw35x1svfhxbxw4g0lrl00000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_TwIYSZ%2FScreenshot%202023-07-31%20at%2011.34.26%20AM.png)
It make all three major boxes (type box, id box, and the surrounding container box) all blank (white).

### hide_id
![Screenshot 2023-07-31 at 11.35.35 AM.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Ff6%2Fx6rhw35x1svfhxbxw4g0lrl00000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_By2xZl%2FScreenshot%202023-07-31%20at%2011.35.35%20AM.png)
It will make the id box blank (white).

### hide_type
![Screenshot 2023-07-31 at 11.38.18 AM.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Ff6%2Fx6rhw35x1svfhxbxw4g0lrl00000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_detKZo%2FScreenshot%202023-07-31%20at%2011.38.18%20AM.png)
It will make the type box blank (white).

### hide_container
![Screenshot 2023-07-31 at 11.48.13 AM.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Ff6%2Fx6rhw35x1svfhxbxw4g0lrl00000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_1vSXMT%2FScreenshot%202023-07-31%20at%2011.48.13%20AM.png)
It will make the container box blank (white).
(NOTE: this is not currently supported for sequences due to initial implementation constraints).

## Implementation Note
With regards to implementation, ...
Once the style attribute has been assigned to the appropriate object, we call 
the `populateDefaultStyle` function, simply to comlement with any default attributes
that are not there.