This functionality is borrowed from HTML5 [setCustomValidity()](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-setcustomvalidity)

# .forces\_setCustomValidity() #

  * removes invalid constraint
  * removes any set alert message (validation warning)

# .forces\_setCustomValidity(message) #

  * flags a control as invalid
  * sets the alert message (validation warning) to be displayed


# Examples #

see the HTML5 example. Replace _setCustomValidity()_ with _forces\_setCustomValidity()_

# Notes #

Setting custom validity does not necessarily trigger the display of alerts to the user; it will flag a control as invalid and fire the invalid event, but UI updates may be delayed until triggered by a user interaction — e.g. focus, blur, change or submit event.