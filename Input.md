# Introduction #

Simple text input.


# Details #

## XForms ##
```
<input ref="order/shipTo/street" class="streetAddress">
  <label>Street</label>
  <hint>Please enter the number and street name</hint>
</input>
```

## Forces XHTML ##
```
<li class="xf-input streetAddress">
  <label for="order-shipTo-street">
    <span class="xf-label">Street</span>
    <small class="xf-hint">Please enter the number and street name</small>
  </label>
  <input type="input" id="order-shipTo-street" … />
</li>
```

## Forces jQuery selectors ##
_These examples have been written to illustrate the code above_
| `:-xf-input` | matches all input elements (the `li` wrapper |
|:-------------|:---------------------------------------------|
| `:-xf-label` | matches the `span class="xf-label"` element |
| `:-xf-hint` | matches all `small` element |
| `:-xf-input input` | accesses the control widget (`input` element) |

# References #
  * [the input element (XForms)](http://www.w3.org/TR/xforms/#ui-input)