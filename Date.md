# Introduction #

Dates are coming. XForms can leverage the date datatype from XML schema and HTML5 has defined "date" as a new @type value for input (already supported in Opera). The future looks good. For the present …

# Date format #
`$.forces_date_format(date, format)`
Supported formats:
| `YYYY`, `%Y` | 4 digit year |
|:-------------|:-------------|
| `MM`, `%m` | 2 digit month |
| `DD`, `%d` | 2 digit day of month |
| `%A` | Full weekday (English) |
| `%B` | Full month name (English) |

# References #

## Date formatting ##
  * http://java.sun.com/j2se/1.4.2/docs/api/java/text/SimpleDateFormat.html
  * http://www.w3.org/TR/xslt20/#date-picture-string
  * http://www.opengroup.org/onlinepubs/009695399/functions/strftime.html