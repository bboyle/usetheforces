copy /b license.js + jquery.forces.date.js + jquery.forces.xpath.js + jquery.forces.dom.js + jquery.forces.fx.js + jquery.forces.forms.core.js + jquery.forces.forms.ui.js jquery.forces.forms.combined.js
java -jar ..\yuicompressor-2.4.2.jar jquery.forces.forms.combined.js -o jquery.forces.forms.min.js
java -jar ..\yuicompressor-2.4.2.jar forces.forms.css -o forces.forms.min.css
