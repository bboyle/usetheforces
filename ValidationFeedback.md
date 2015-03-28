# Introduction #

Catching errors quickly is important for recovery, but too much feedback can interrupt the customer's flow. How to balance these two?


# Details #

These are the key events:
  * oninput: as a question is being answered (e.g. while typing in a box)
  * onblur: when the customer leaves a question
  * onchange: when an answer is changed (including providing an answer where previously there was none)
  * onsubmit: when form submission begins (client side)
  * response: server side response to the form submission.

Required fields should only be validated for missing values on submit. Allow the customer to fill out the form at their own pace, and choosing their own sequence if desired. Prompt for any missing answers onsubmit. However, remove any alerts about missing values when a value is provided (onchange).

Radio buttons, checkboxes and select controls should only be validated for missing values, if required, onsubmit. No further validation should occur. By their very nature, they limit the customer to valid answers. Should some answers not be valid in some circumstances (e.g. dependent upon the value in another field), disable those answers (make them irrelevant).

Textareas may be validated oninput if a maxlength is exceeded (until @maxlength is supported on textarea elements). Allow the customer to type more (supports flexible editing), but display the alert and prevent form submission if necessary.

Inputs of known data types may be validated against the values required for those types. This validation should be onchange and onsubmit. Note that some situations do not trigger onchange (e.g. manipulating values through firebug or the DOM) therefore onsubmit is an important catch all.

Known data types for input:
  * email
  * date (including component dates, such as expiry month/year)
  * number (digits only)
  * luhn (check digit, e.g. credit card, abn)
  * numbers with spaces (e.g. credit card)

Where the UA supports validation (e.g. HTML5 support), this should be utilised.

| control | event | notes |
|:--------|:------|:------|
| input (email) | oninput | do nothing, allow the user to type the email address |
| input (email) | onchange | validate the email address |
| radio buttons | oninput | buttons are toggled within the field ... equivalent to onchange |
| radio buttons | onchange | do nothing |
| radio buttons | onsubmit | check if missing and required |