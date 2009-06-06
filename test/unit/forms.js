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
			'<form id="form" action="#form">' +
				'<input type="text" name="input01" id="input01" />' +
				'<input type="text" name="input02" id="input02" />' +
			'</form>'
		).appendTo('body');
		$('#input02').forces_attr('required', true);
	},

	tearDown: function () {
		$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_selector_tf_required: function () {
		Assert.areSame(true, $('#input02').is(':-tf-required'));
		Assert.areSame(false, $('#input01').is(':-tf-required'));
	},
	
	test_forces_attr_required: function () {
		Assert.areSame(true, $('#input01').forces_attr('required', true).is(':-tf-required'));
		Assert.areSame(false, $('#input01').forces_attr('required', false).is(':-tf-required'));
		Assert.areSame(false, $('#input01').forces_removeAttr('required').is(':-tf-required'));
	}
});



//add test cases
TS_forms.add(TC_formsRequired);

//add the test suite
YAHOO.tool.TestRunner.add(TS_forms);
