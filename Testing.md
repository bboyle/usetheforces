# Introduction #

Testing is an important part of quality assurance. Automated testing is useful to avoid regressions and spot bugs that might be difficult to uncover through manual testing.

## Challenges ##
  * emulating keyboard access (e.g. testing ARIA behaviours)
  * testing in screen readers
  * testing visual design


# References and potential tools #
  * [frontend-test-suite](https://github.com/NeilCrosby/frontend-test-suite/blob/master/README.markdown)
  * [Reducing step explosion by decoupling Cucumber steps from your GUI](http://watirmelon.com/2011/01/23/reducing-step-explosion-by-decoupling-cucumber-steps-from-your-gui/)
  * [Behaviour driven development with Cucumber](http://cukes.info/)
  * QUnit—jquery test framework (requires javascript), great for bundling into Chrome extensions
  * YUI Test—tests written in javascript, bundled into self-contained HTML pages
  * YETI—runs YUI tests in multiple browsers/platforms simultaneously
  * Selenium—drives a browser (requires javascript)
  * Watir—drives a browser