# .forces\_attr(attributeName, value) #

## Supported attributes ##
| attributeName | values | description |
|:--------------|:-------|:------------|
| type | email | date | number | set data 'type' |
| relevant | true | false | is control "relevant" |
| required | true | false | is control "required" |


# Examples #

## type ##

```

$('#age').forces_attr('type', 'number');
$('#email-field-id').forces_attr('type', 'email');

```

## relevant ##

Using this HTML:
```

<fieldset id="flavour">
  <legend>Ice cream flavour</legend>
  <label><input type="radio" name="flavour" value="chocolate" /></label>
  <label><input type="radio" name="flavour" value="strawberry" /></label>
  <label><input type="radio" name="flavour" value="vanilla" /></label>
</fieldset>

<fieldset id="topping">
  <legend>Topping (vanilla ice cream only)</legend>
  <label><input type="radio" name="topping" value="caramel" /></label>
  <label><input type="radio" name="topping" value="chocolate" /></label>
</fieldset>


```

The "toppings" are only relevant with vanilla flavour.
```

function toppingRelevant() {
  $('#topping').forces_attr('relevant', $('#flavour input:checked').val() === 'vanilla');
}
// run when flavour changes to check relevance of topping
$('#flavour').change(toppingRelevant);
// run once on page load to set initial relevance
toppingRelevant();

```

The syntax can vary, so long as a boolean true/false value is set for the 'relevant' attribute. For example:
```
$('#topping').forces_attr('relevant', $('#flavour-vanilla').is(':checked'));
```
or
```
if ($('#flavour-vanilla').is(':checked')) {
  $('#topping').forces_attr('relevant', true);
} else {
  $('#topping').forces_attr('relevant', false);
}
```