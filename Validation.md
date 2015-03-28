# Introduction #

Form must be validated onsubmit.
Validation messages should be:
  * presented at the top of the form and receive focus.
  * be titled "Unable to _perform action_" where _perform action_ is the action specified by the user (for example: the button the user pressed).
  * presented in an ordered list, no more than one message per field.
  * use the format "label: message"
  * link to the relevant field @id using a standard link (not a label)
  * be repeated next to the field

Issue: in a stacked layout, this link may jump to the field and the label (above the field) may not be visible onscreen. It may be preferable to link to the label, but this requires all labels to be given an @id. Also applicable for linking to fieldset/legend.

Most fields will benefit from inline validation.
Inline validation should:
  * be shown immediately right of the field
  * be updated onblur, except in special cases where immediate (oninput) feedback is beneficial
  * display 'valid' or 'invalid' state
  * display a message advising how to correct the error for 'invalid' state
  * use consistent terminology (the same message as onsubmit errors)

Issue: "oninput" should not be triggered too often. Wait for a pause in input (typing) before acting. Consider: onkeyup starts a timer which will fire an oninput event. An onkeydown event cancels this timer. An onblur event cancels the timer _and_ fires the oninput event. Additionally, validation may be suppressed until sufficient input is entered. For example, there might be a 3 character minimum before a message is displayed. Validation messages should avoid frustrating users, validating before they have finished/paused in their input is too heavy handed.

Special cases where oninput feedback is beneficial are for answers that are 'created' and the user cannot know in advance if the value is valid. Examples: checking if a new username is already reserved, testing if a new password meets security requirements.
Oninput validation must not be used for 'slot-in' answers. Checking for typos (e.g. credit card numbers) should not occur until onblur.

# References #
  1. http://formulate.com.au/articles/well-designed-error-messages/
  1. http://simplyaccessible.com/article/form-error-messages/
  1. http://webaim.org/techniques/formvalidation/#form
  1. http://www.standards-schmandards.com/2005/accessible-errors/