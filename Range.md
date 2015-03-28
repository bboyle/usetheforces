# Introduction #

Input type range is specified in HTML5.


# Details #


# Story RANGE-001 #

As a web developer I want to use range where available and a select list elsewhere so that I can deliver the best customer experience.
http://stackoverflow.com/questions/2246136/how-do-i-build-a-gracefully-degrading-html5-range

## Acceptance criteria ##
_Completed 12 March 2010_
  1. use progressive enhancement (select list by default, replaced by range when supported) [r229](http://code.google.com/p/usetheforces/source/detail?r=229)
  1. do nothing if any option contains non-numeric values: floating point and negatives allowed; ignore null values [r225](http://code.google.com/p/usetheforces/source/detail?r=225)
  1. specify min attribute based on the lowest option value [r226](http://code.google.com/p/usetheforces/source/detail?r=226)
  1. specify max attribute based on the highest option value [r227](http://code.google.com/p/usetheforces/source/detail?r=227)
  1. specify step attribute based on difference between two lowest values [r229](http://code.google.com/p/usetheforces/source/detail?r=229)
  1. specify (default) value attribute based on selected option value ~~or the empty string~~ [r233](http://code.google.com/p/usetheforces/source/detail?r=233)
  1. preserve attributes: id, class, name, title [r235](http://code.google.com/p/usetheforces/source/detail?r=235)

### Questions ###
  * What if there is only 1 value in the list? This gets converted to a range control with min and max the same, and a step of zero. This is expected behaviour, not a bug.