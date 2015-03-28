# Introduction #

A single select control.
Multiple options are provided, only one may be selected.


# Details #

Typically implemented as a _select list_ or _radio buttons_.
Use _checkboxes_ or _multiple select lists_ when more than one choice may be selected.

## XForms ##
```
<select1 ref="my:flavor">
  <label>Flavor</label>
  <item>
    <label>Vanilla</label>
    <value>v</value>
  </item>
  <item>
    <label>Strawberry</label>
    <value>s</value>
  </item>
  <item>
    <label>Chocolate</label>
    <value>c</value>
  </item>
</select1>
```

## Forces XHTML ##
### Select drop down list ###
```
<li class="xf-select1">
  <label for="my-flavor">
    <span class="xf-label">Flavor</span>
  </label>
  <select id="my-flavor" …>
    <option value="v">Vanilla</option>
    <option value="s">Strawberry</option>
    <option value="c">Chocolate</option>
  </select>
</li>
```
### Radio buttons ###
```
<li class="xf-select1">
  <fieldset id="my-flavor">
    <legend>
      <span class="xf-label">Flavor</span>
    </legend>
    <ul class="choices">
      <li><label for="my-flavor-v"><input type="radio" … id="my-flavor-v" value="v" />Vanilla</label></li>
      <li><label for="my-flavor-s"><input type="radio" … id="my-flavor-s" value="s" />Strawberry</label></li>
      <li><label for="my-flavor-c"><input type="radio" … id="my-flavor-c" value="c" />Chocolate</label></li>
    </ul>
  </fieldset>
</li>
```

## Forces jQuery selectors ##
_These examples have been written to illustrate the code above_
| `:-xf-select1` | matches all input elements (the `li` wrapper |
|:---------------|:---------------------------------------------|
| `:-xf-label` | matches the `span class="xf-label"` element |
| `:-xf-select1 select` | accesses the control widget (`select` element) |
| `:-xf-select1 :radio` | accesses the control widget (`input` elements) |
| `:-xf-select1 :radio:checked` | accesses the checked control widget (`input` elements) |

## CSS for 'choices' ##
```
/* choices */
ul.choices {
	display: block;
	list-style: none;
	margin: 0;
	padding: 0;
}
ul.choices li {
	display: block;
	list-style: none;
	margin: .3em 0;
	padding: 0 0 0 20px;
	position: relative;
}
ul.choices input {
	position: absolute;
	left: 0;
	_left: -20px;
}
```

# References #
  * [the select1 element (XForms)](http://www.w3.org/TR/xforms/#ui-selectOne)