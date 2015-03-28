# Introduction #

CSS id and class identifiers used by forces.


# Details #

| identifier | description | application |
|:-----------|:------------|:------------|
| .ftw-questions | list of questions | OL, UL |
| .ftw-preamble | introductory instructions | DIV |
| .section | sectioning element | DIV |
| .tf-footer |
| .tf-form | sectioning element (form) | DIV |
| .tf-submit |
| .tt-citizen | citizen interaction | FORM |
| .wfd-action-primary | primary action | BUTTON, INPUT (type submit) |
| .xf-required | required marker | ABBR |
| .xf-input |
| .xf-secret |
| .xf-select1 |
| .xf-select |
| .xf-textarea |
| .xf-choices |
| .xf-appearance-compact |

## Prefixes ##

Class names have been chosen to reduce the likelihood of conflicts — e.g. there's every chance "alert" may already be used on a website, but "xf-alert" is less likely. These prefixes have been chosen to reflect the source, or inspiration, of the semantics behind the class name.

| prefix | source | description |
|:-------|:-------|:------------|
| ftw | Forms That Work: Designing Web Forms for Usability | Caroline Jarret and Gerry Gaffney's book |
| tf | (use) the forces | some ideas originate in this project |
| tt | Tim Turner | Tim Turner 's research on Market Segmentation for eGovernment |
| wfd | Web Form Design: Filling in the Blanks | Luke Wroblewski's book |
| xf | XForms | W3C's spec on forms |

Sometimes we name classes after elements from HTML5 (e.g. section). In this instances, we do not use a prefix.