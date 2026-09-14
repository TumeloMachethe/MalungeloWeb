MALUNGELO PROPERTIES — MULTI-RESIDENCE APPLICATION UPDATE

What changed
------------
Students can now apply for more than one residence in a single application.

The form now has:
1. First Choice Accommodation (required)
2. Other Residences You Would Accept (optional, multiple selections)

Data sent
---------
The existing field remains unchanged:
Accommodation = the student's first choice

A new field is sent as well:
Additional Accommodation Choices = any other selected residences, or None

This means the current Make.com / Excel mapping for Accommodation can keep working
for the student's first choice. To store the alternatives in Excel too, add an
"Additional Accommodation Choices" column and map the new webhook field to it.

Files changed
-------------
apply.html
style.css

script.js is unchanged from the mobile update.

Property Apply buttons still work. If a student taps "Apply for Park Place",
Park Place is automatically set as their first choice, and they can then add
Western House and/or Westbourne House as alternatives.
