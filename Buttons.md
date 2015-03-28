# Introduction #

Simple UI for buttons.


# Details #

  * Put actions (buttons and links) in a list, at the very end of the form
  * If the action leads to the next step in a process, label it 'Continue' (on the very last form, call it what it does)
  * Place 'Cancel' on the far right—link (rather than button) recommended
  * Be specific about what happens when the button is pressed—the is a relationship between the button label, the title of the form, and what the user expects to happen
  * Avoid computer/web jargon like 'Submit'—try 'Submit feedback' or 'Send feedback' if there isn't anything more specific
  * Make the **primary action** bold, and first in the list
    * It should be the first `input[type=submit]` in the form, so that it is activated if the user presses 'Enter' in any input field to submit the form—if you need other buttons earlier in the form, use `button[type=button]`
  * Put generous space between buttons

## Styling ##

Default browser styling should be quite nice in most situations. A bit of padding, bold on the primary action, and inheriting the font will do wonders.

For more visual style, changing backgrounds or borders will reset other styles and might result in the buttons looking (and feeling) worse. Best to use a background image with sprites. Be sure to includes states for hover (highlight) and click (pressed), as well as different colours for primary and secondary actions. Background scaling (with font size) may be important, however is a small issue with most browsers supporting zoom (rather than just increasing font size).

Study the default button design. Note that there are often numerous borders (or border like aspects) at play: a groove around the button that appears to carve it out of the page, a highlight on the top corners edges and slight shadow on bottom corners, and a gradient giving the button a raised appearance. A simple block with a bevel (with or without rounded corners) does not give the appearance of standard buttons. Likewise, a 'button' that does not visually react to hover/focus and click states does not work. Get the affordances and your buttons will sing.

## References ##
  * [HTML5 Accessibility Chops: Just use a (native HTML) button](http://www.paciellogroup.com/blog/2011/04/html5-accessibility-chops-just-use-a-button/)
  * [Primary & Secondary Actions in Web Forms](http://www.lukew.com/resources/articles/PSactions.asp)
  * [Custom Buttons 3.0 (demo)](http://stopdesign.com/eg/buttons/3.0/code.html)
  * [Simply Buttons v2](http://www.p51labs.com/simply-buttons-v2/)
  * [Rediscovering the Button Element](http://particletree.com/features/rediscovering-the-button-element/)
  * [How to make sexy buttons with CSS](http://www.oscaralexander.com/tutorials/how-to-make-sexy-buttons-with-css.html)
  * [Labelling buttons](http://www.quora.com/Why-should-your-form-buttons-not-use-Submit-for-their-text)
  * [Call to Action Buttons Best Practices Guide](http://uxmovement.com/buttons/call-to-action-buttons-best-practices-guide)
  * [How You Should Align Your Form Buttons](http://uxmovement.com/forms/how-you-should-align-your-form-buttons)