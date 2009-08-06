//create the test suite
var TS_forms = new YAHOO.tool.TestSuite("forces.forms unit test suite"); 


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
				'<li><input type="text" name="input05" id="input05" /></li>' +
			'</ol></form>'
		).appendTo('body');
		$('#input02', '#form').forces_attr('required', true);
		$('.required input', '#form').forces_attr('required', true);
		$('#input05', '#form').forces_attr('required', 'input01 = "5 is required"');
	},

	tearDown: function () {
		$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_requiredSelectorReturnsCorrectBoolean: function () {
		Assert.areSame(true, $('#input02').is(':-tf-required'));
		Assert.areSame(false, $('#input01').is(':-tf-required'));
	},

	test_readRequiredAttribute: function () {
		Assert.areSame('required', $('#input02').forces_attr('required'));
		Assert.areSame(null, $('#input01').forces_attr('required'));
	},

	test_canSetRequiredUsingForcesAttr: function () {
		Assert.areSame(true, $('#input01').forces_attr('required', true).is(':-tf-required'));
		Assert.areSame(false, $('#input01').forces_attr('required', false).is(':-tf-required'));
		Assert.areSame(false, $('#input01').forces_removeAttr('required').is(':-tf-required'));
		Assert.areSame(null, $('#input01').forces_attr('required'));
	},

	test_setRequiredFromAncestorClass: function () {
		Assert.areSame(true, $('#input03').is(':-tf-required'));
		Assert.areSame(true, $('#input04').is(':-tf-required'));
	},

	test_readCalculationFromRequiredAttribute: function () {
		Assert.areSame('input01 = "5 is required"', $('#input05').forces_attr('required'));
	}
});


// relevant fields unit tests
var TC_formsRelevant = new YAHOO.tool.TestCase({

	name: "Relevant fields unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		$(
			'<form id="form" action="#form"><ol>' +
				'<li><input type="text" name="input01" id="input01" /></li>' +
				'<li><input type="text" name="input02" id="input02" /></li>' +
			'</ol></form>'
		).appendTo('body');
		$('#input02', '#form').forces_attr('relevant', false);
	},

	tearDown: function () {
		$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_fieldsAreRelevantByDefault: function () {
		Assert.areSame(true, $('#input01').is(':-tf-relevant'));
		Assert.areSame(false, $('#input01').is(':-tf-irrelevant'));
	},

	test_relevantSelectorReturnsCorrectBoolean: function () {
		Assert.areSame(true, $('#input01').is(':-tf-relevant'));
		Assert.areSame(true, $('#input02').is(':-tf-irrelevant'));
		Assert.areSame(false, $('#input02').is(':-tf-relevant'));
	},

	test_readRelevantAttribute: function () {
		Assert.areSame('relevant', $('#input01').forces_attr('relevant'));
		Assert.areSame(null, $('#input02').forces_attr('required'));
	},

	test_canSetRelevantUsingForcesAttr: function () {
		Assert.areSame(true, $('#input01').forces_attr('relevant', true).is(':-tf-relevant'));
		Assert.areSame(false, $('#input01').forces_attr('relevant', false).is(':-tf-relevant'));
		Assert.areSame(true, $('#input01').forces_removeAttr('relevant').is(':-tf-relevant'));
		Assert.areSame('relevant', $('#input01').forces_attr('relevant'));
	}
});


//add test cases
TS_forms.add(TC_formsRequired);
TS_forms.add(TC_formsRelevant);

//add the test suite
YAHOO.tool.TestRunner.add(TS_forms);
