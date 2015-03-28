# Introduction #

The guts of any form are the questions and answers. The user gives the answers. The form has to provide the questions and answering controls/widgets (text boxes and drop down lists, radio buttons and all that). You might also call these "fields" or "prompt response pairs". And you might pad this out with hints, help text, sample data, validation messages, error recovery suggestions, and more. Throw all this in a pot and what is it called?

Here at usetheforces we're gonna choose a term from XForms and go with:
_[form controls](http://www.w3.org/TR/xforms/#controls)_.

## Why XForms? ##
HTML doesn't go deep enough. We will establish a mapping between the semantics of XForms and the markup of HTML.

There are good terms in a number of publications on form design, however these aren't as readily accessible online. We'd prefer to reference something open and available to all.

XForms has a rich semantic model for form controls. It functions well as a superset, and we hope it proves to be a solid foundation.


# What is a form control? #

A form control encapsulates a single piece of data capture. If you think of your form as asking one question at a time of the user, and one answer at a time being provided, that single question/answer is what we intend to markup as a control.

If this were XForms, the control has a type based around the semantics of the data capture. There is a close mapping between data capture semantics and the types of UI widgets you would typically use. This "control type" element then contains all the other important bits: the question text (content) itself, additional help, any constraints or calculations, etc. For example, if the question was "what is your password?" you'd choose "secret" as the element with the best semantics.

```
<secret>
  <label>What is your password?</label>
</secret>
```

Note that in XForms, there is no need to specify a UI widget (an "input" element in HTML), as XForms is independent of any presentation concerns.

## How could we map this to HTML? ##
```
<li class="xf-secret">
  <label for="password">What is your password?</label>
  <input type="password" id="password" ... />
</li>
```

We needed to introduce a wrapper element, and give it a class to represent the semantics we want it to have. Using the 'xf-' prefix to indicate this term comes from XForms.

We chose "li" because — like [Aaron Gustafson - Learning to love forms](http://www.webdirections.org/resources/aaron-gustafson/) — we believe (part of) a form is a list of questions. But you can substitute a "div" or other element if you prefer.

The label is still there, and now we have to specify the widget also (HTML embraces presentational semantics after all, the structural ones if not the styling). Because of this, we've had to link the label and widget together with @for and @id attributes. After all, HTML (and all the user-agents that consume HTML) know nothing about our "xf-secret" class and what it means. And accessibility is important.

We could leave it there, but we know it's not enough. Maybe this password is being created by a user signing up for a new account, and you want to show them a hint about passwords.

```
<secret>
  <label>New password:</label>
  <hint>6–14 characters, a mix of letters, numbers and symbols works best!</hint>
</secret>
```

Where do we put that hint in the HTML?
It will only be accessible if it is in the label, so that is where we'll put it.

```
<li class="xf-secret">
  <label for="password">
    <span class="xf-label">New password:</span>
    <small class="xf-hint">6–14 characters, a mix of letters, numbers and symbols works best!</small>
  </label>
  <input type="password" id="password" ... />
</li>
```

Key things to note here.

In XForms, the _form control_ contains all the information about the form. The only way to accessibly do this within HTML is by placing this information within the HTML label tag. HTML also requires us to specify the widget, so we place that after the label, and then wrap the label and widget with another tag, giving it a classname based on the XForms element name.

_Couldn't we just put the widget inside the label too? Would we still need the li element?(Hey, even if we could, we will go absolutely bonkers trying to tame this when we need to use legend instead of label. Read on!)_


# Radio buttons and checkboxes #
The markup for these are managed differently in HTML. Although radio buttons and checkboxes represent one answer to a question, in HTML they are made up of many individual widgets and labels. We need a way of grouping that into a _form control_ and HTML has provided clear guidance on the best (accessible) way to do this: fieldsets and legends.

We've found radio buttons are like "select1" controls in XForms, and checkboxes match up with "select" controls. Both of these controls have "choices", a list of "items" that the user selects from. Put all this together and we have:

```
<select1>
  <label>Flavor</label>
  <item>
    <label>Vanilla</label>
    <value>v</value>
  </item>
  <item>
    <label>Strawberry</label>
    <value>s</value>
  </item>
  <item>
    <label>Chocolate</label>
    <value>c</value>
  </item>
</select1>
```

becomes

```
<li class="xf-select1">
  <fieldset>
    <legend>
      <span class="xf-label">Flavor</span>
    </legend>
    <ul class="xf-choices">
      <li><label for="flavor-v"><input type="radio" id="flavor-v" name="flavor" value="v" />Vanilla</label></li>
      <li><label for="flavor-s"><input type="radio" id="flavor-s" name="flavor" value="s" />Strawberry</label></li>
      <li><label for="flavor-c"><input type="radio" id="flavor-c" name="flavor" value="c" />Chocolate</label></li>
    </ul>
  </fieldset>
</li>
```