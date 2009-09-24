//create the test suite
var TS_formsUI = new YAHOO.tool.TestSuite("forces.forms.ui unit test suite"); 


var Assert = YAHOO.util.Assert;


// form controls unit tests
var TC_formControls = new YAHOO.tool.TestCase({

	name: "Form controls unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		$(
			'<form id="form" action="#form"><ol class="ftw-questions">' +
				'<li class="xf-input" id="input01-container"><label for="input01" id="label-input"><span class="xf-label">Input</span></label>' +
				'<input type="text" name="input01" id="input01" /></li>' +
				'<li class="xf-select" id="select-container"><fieldset><legend id="legend-select"><span><span class="xf-label">Select</span></legend>' +
				'<ul class="xf-choices">' +
				'<li><input type="checkbox" name="select" id="selectA" value="A" /><label for="selectA">A</label></li>' +
				'<li><input type="checkbox" name="select" id="selectB" value="B" /><label for="selectB">B</label></li>' +
				'<li><input type="checkbox" name="select" id="selectC" value="C" /><label for="selectC">C</label></li>' +
				'</ul></li>' +
				'<li class="xf-group" id="group"><fieldset>' +
				'<legend><span><span class="xf-label">Name</span></span></legend>' +
				'<ol class="ftw-questions">' +
				'<li class="xf-select"><label for="name-title"><span class="xf-label">Title</span></label>' +
				'<select id="name-title"><option value=""></option><option>Mr</option><option>Mrs</option></select></li>' +
				'<li class="xf-input"><label for="name-given"><span class="xf-label">Given name(s)</span></label>' +
				'<input type="text" id="name-given" size="20" /></li>' +
				'<li class="xf-input"><label for="name-family"><span class="xf-label">Family name</span></label>' +
				'<input type="text" id="name-family" size="20" /></li>' +
				'</ol>' +
				'</fieldset>' +
				'</li>' +
			'</ol></form>'
		).appendTo('body');
	},

	tearDown: function () {
		$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_canFindControlForInput: function () {
		Assert.areSame(document.getElementById('input01-container'), $('#input01').forces_control().get(0));
	},
	test_canFindLabelForInput: function () {
		Assert.areSame("Input", $('#input01').forces_label().text());
	},
	test_canFindRequiredMarkerForInput: function () {
		$('#input01').forces_attr('required', true);
		Assert.areSame(1, $('#label-input').find('.xf-required').length);
		Assert.areSame("Input*", $('#label-input').text());
	},
	test_canFindControlForSelect: function () {
		Assert.areSame(document.getElementById('select-container'), $('#selectA').forces_control().get(0));
		Assert.areSame(document.getElementById('select-container'), $('#selectB').forces_control().get(0));
		Assert.areSame(document.getElementById('select-container'), $('#selectC').forces_control().get(0));
	},
	test_canFindLabelForSelect: function () {
		Assert.areSame("Select", $('#selectB').forces_label().text());
	},
	test_canFindGroupControl: function () {
		Assert.areSame(false, $('#name-given').is(':-xf-group'));
		Assert.areSame(1, $('#name-given').parents(':-xf-group').length);
		Assert.areSame(document.getElementById('group'), $('#name-given').forces_group().get(0));
	},
	test_canFindGroupLabel: function () {
		Assert.areSame("Given name(s)", $('#name-given').forces_label().text());
		Assert.areSame("Name", $('#name-given').forces_group().forces_label().text());
	}
});





//add test cases
TS_formsUI.add(TC_formControls);

//add the test suite
YAHOO.tool.TestRunner.add(TS_formsUI);
