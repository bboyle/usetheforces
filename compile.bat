copy /b license.js + jquery.forces.date.js + jquery.forces.xpath.js + jquery.forces.dom.js + jquery.forces.fx.js + jquery.forces.forms.core.js + jquery.forces.forms.ui.js jquery.forces.forms.combined.js

java -jar lib\compiler.jar -js jquery.forces.forms.combined.js -js_output_file jquery.forces.forms.min-google.js
java -jar lib\yuicompressor-2.4.2.jar jquery.forces.forms.combined.js -o jquery.forces.forms.min-yui.js
copy jquery.forces.forms.min-yui.js jquery.forces.forms.min.js

java -jar lib\yuicompressor-2.4.2.jar jquery.forces.lib.validate.js -o jquery.forces.lib.validate.min.js
java -jar lib\yuicompressor-2.4.2.jar forces.forms.css -o forces.forms.min.css
