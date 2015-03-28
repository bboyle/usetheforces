# IMPORTANT NOTICE #
These ideas have been superseded in the implementation of [forces\_attr](forces_attr.md)

# Introduction #

_Progressive disclosure_ is the display (disclosure) of sections of a form as they become (progressively) _relevant_. For example, answering a question "yes" or "no" might cause different follow questions to be asked. Progressive disclosure is the practice of showing this sections dynamically, with javascript.


# Usage #

## Forces jQuery ##
_Disclose the "discount" field when "amount" is greater than 1000_
```
$('#my-discount').relevant(function() {
  return $('#my-amount').val() > 1000;
});
```

## Forces XHTML ##
```
  <li class="xf-input">
    <label for="my-amount">
      <span class="xf-label">Amount</span>
    </label>
    <input type="text" id="my-amount" name="myAmount" value="999" />
  </li>
  <li class="xf-input">
    <label for="my-discount">
      <span class="xf-label">Discount</span>
    </label>
    <input type="text" id="my-discount" name="myDiscount" />
  </li>
```

# References #
  * http://www.w3.org/TR/xforms/#model-prop-relevant


---


# Alternative implementation #

Toggle relevance with true/false values, like so:
```
  $("#my-discount").forces_attr('relevant', true);
```

Specify function using the following pattern:
```
  var myAmount = $('#my-amount');
  var myDiscount = $('#my-discount');
  myAmount.change(function() {
    myDiscount.forces_attr('relevant', myAmount.val() > 1000);
    return arguments.callee;
  }());
```

This runs the function whenever the value of "my amount" changes, recalculating the relevance of "my discount". This use of `return arguments.callee` and `function() { ... }()` ensures the calculation is run once after definition, to ensure an accurate initial state.