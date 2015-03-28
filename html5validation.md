# Introduction #

HTML5 specifies a validation framework for web forms.
This integrates forces with those attributes and events in order to:
  * ease migration to html5
  * implement a richer UI in browsers implementing html5 validation


# Details #


# Story HTML5-001 #

As a forces developer I want "invalid" states to be consistently handled whether they were detected and escalated by html5 validation or forces validation.

## Acceptance criteria ##
  1. `:-xf-invalid` should match elements that are "invalid" by html5 definition
  1. ~~`:-xf-required` should match elements with `@required`~~

# References #
  * [Detecting HTML5 Features, Dive Into HTML 5](http://diveintohtml5.org/detect.html)