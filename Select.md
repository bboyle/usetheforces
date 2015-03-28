# Introduction #

A multiple select control. Multiple items may be selected from the group.


# Details #

Typically implemented as _checkboxes_ although can be done as a _multiple select_ control (typically multiple select controls are less familiar and more difficult for users).

### XForms ###
```
<select ref="my:flavors">
  <label>Flavors</label>
  <choices>
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
  </choices>
</select>
```

### Forces XHTML ###
```
<li class="xf-select">
  <fieldset id="my-flavor">
    <legend>
      <span class="xf-label">Flavor</span>
    </legend>
    <ul>
      <li><label for="my-flavor-v"><input type="checkbox" … id="my-flavor-v" value="v" />Vanilla</label></li>
      <li><label for="my-flavor-s"><input type="checkbox" … id="my-flavor-s" value="s" />Strawberry</label></li>
      <li><label for="my-flavor-c"><input type="checkbox" … id="my-flavor-c" value="c" />Chocolate</label></li>
    </ul>
  </fieldset>
</li>
```

### Forces jQuery selectors ###
_These examples have been written to illustrate the code above_
| `:-xf-select` | matches all "select" elements (the `li` wrapper |
|:--------------|:------------------------------------------------|
| `:-xf-label` | matches the `span class="xf-label"` element |
| `:-xf-select :checkbox` | accesses the control widget (`input` elements) |
| `:-xf-select :checkbox:checked` | accesses the checked control widgets (`input` elements) |


## References ##
  * [the select element (XForms)](http://www.w3.org/TR/xforms/#ui-selectMany)