//create the test suite
var TS_forms = new YAHOO.tool.TestSuite("forces.forms test suite"); 


var Assert = YAHOO.util.Assert;


// required fields unit tests
var TC_formsRequired = new YAHOO.tool.TestCase({

	name: "Required fields unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		$(
			'<form id="form" action="#form"><ol>' +
				'<li><input type="text" name="input01" id="input01" /></li>' +
				'<li><input type="text" name="input02" id="input02" /></li>' +
				'<li class="required"><input type="text" name="input03" id="input03" /></li>' +
				'<li class="required"><input type="text" name="input04" id="input04" /></li>' +
			'</ol></form>'
		).appendTo('body');
		$('#input02').forces_attr('required', true);
		$('.required input').forces_attr('required', true);
	},

	tearDown: function () {
		//$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_selector_tf_required: function () {
		Assert.areSame(true, $('#input02').is(':-tf-REQUIRED'));
		Assert.areSame(false, $('#input01').is(':-tf-REQUIRED'));
	},
	
	test_forces_attr_required: function () {
		Assert.areSame(true, $('#input01').forces_attr('required', true).is(':-tf-REQUIRED'));
		Assert.areSame(false, $('#input01').forces_attr('required', false).is(':-tf-REQUIRED'));
		Assert.areSame(false, $('#input01').forces_removeAttr('required').is(':-tf-REQUIRED'));
	},

	test_setRequiredFromAncestorClass: function () {
		Assert.areSame(true, $('#input03').is(':-tf-REQUIRED'));
		Assert.areSame(true, $('#input04').is(':-tf-REQUIRED'));
	}
});



//add test cases
TS_forms.add(TC_formsRequired);

//add the test suite
YAHOO.tool.TestRunner.add(TS_forms);
