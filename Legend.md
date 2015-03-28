# Introduction #

Tips and tricks for using HTML's `legend` element.


# Styling #

## Reset styles ##
  * Remove margins/padding
  * Allow text wrapping
  * Reset text colour (older versions of IE use blue for legend text)

```
fieldset {
	border: none;
}
legend {
	margin: 0;
	padding: 0;
	white-space: normal;
	width: 100%;
	color: inherit;
	*color: #000;
	*margin-left: -7px;
	*margin-right: -7px;
}
legend > span {
	display: block;
}
legend span {
	*display: block;
	*float: left;
}
legend span span {
	*display: inline;
	*float: none;
}
```

## Styling legends as headings ##
When using fieldsets to represent sections of a form, the `legend` takes on the role of a heading. Styling it `bold` is straightforward. Using backgrounds or borders can be tricky, particularly in gecko browsers where the legend will not stretch to utilise the available width (no matter what you do).

### Using a line under the heading ###
Usually `border-bottom` would suffice, however gecko will appear to cut the border short. Assuming the element after the legend is a block element, you can use this css:
```
legend + * {
  border-top: 1px solid #000;
}
```
This applies a `border-top` to siblings of `legend` elements, which works in gecko and all browsers supporting CSS2 selectors.

IE6 does not support the sibling selector '`+`', so the above rule is ignored. However, IE6 can apply a `border-bottom` on `legend` just fine.

```
legend {
  _border-bottom: 1px solid #000;
}
```

Yep, it means specifying the border twice. But it works.