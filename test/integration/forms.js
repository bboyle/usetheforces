//create the test suite
var TS_formsIntegration = new YAHOO.tool.TestSuite("forces.forms integration test suite"); 


var Assert = YAHOO.util.Assert;


// required fields unit tests
var TC_formEventIntegration = new YAHOO.tool.TestCase({

	name: "Form events integration tests",

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
	},

	tearDown: function () {
		$('#form').remove();
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_relevantEventsFireCorrectly: function () {
<<<<<<< .mine
		$(document).bind('-tf-relevant', function(evt, target) {
			target.before('<span class="relevant">RELEVANT</span>');
=======
		$(document).bind($.forces.EVENT_RELEVANT, function(evt, target) {
			target.before('<span class="relevant">RELEVANT</span>');
>>>>>>> .r93
		});
<<<<<<< .mine
		$(document).bind('-tf-irrelevant', function(evt, target) {
			target.before('<span class="relevant">IRRELEVANT</span>');
=======
		$(document).bind($.forces.EVENT_IRRELEVANT, function(evt, target) {
			target.before('<span class="relevant">IRRELEVANT</span>');
>>>>>>> .r93
		});

		Assert.areSame(0, $('#input01').prev('.relevant').length);
		Assert.areSame(0, $('#input01').forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event fired when relevance did not change');
		Assert.areSame(1, $('#input01').forces_attr('relevant', false).forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event not detected');
		Assert.areSame('RELEVANT', $('#input01').prev('.relevant').text());

		Assert.areSame(0, $('#input02').prev('.relevant').length);
		Assert.areSame(1, $('#input02').forces_attr('relevant', false).prev('.relevant').length);
		Assert.areSame('IRRELEVANT', $('#input02').prev('.relevant').text());
	},
	

	test_requiredEventsFireCorrectly: function () {
<<<<<<< .mine
		$(document).bind('-tf-required', function(evt, target) {
			target.before('<span class="required">REQUIRED</span>');
=======
		$(document).bind($.forces.EVENT_REQUIRED, function(evt, target) {
			target.before('<span class="required">REQUIRED</span>');
>>>>>>> .r93
		});
<<<<<<< .mine
		$(document).bind('-tf-optional', function(evt, target) {
			target.before('<span class="required">OPTIONAL</span>');
=======
		$(document).bind($.forces.EVENT_OPTIONAL, function(evt, target) {
			target.before('<span class="required">OPTIONAL</span>');
>>>>>>> .r93
		});

		Assert.areSame(0, $('#input01').prev('.required').length);
		Assert.areSame(1, $('#input01').forces_attr('required', true).prev('.required').length);
		Assert.areSame('REQUIRED', $('#input01').prev('.required').text());

		Assert.areSame(0, $('#input02').prev('.required').length);
		Assert.areSame(0, $('#input02').forces_attr('required', false).prev('.required').length, 'OPTIONAL event fired when required state did not change');
		Assert.areSame(1, $('#input02').forces_attr('required', true).forces_attr('required', false).prev('.required').length);
		Assert.areSame('OPTIONAL', $('#input02').prev('.required').text());
	}
});


//add test cases
TS_formsIntegration.add(TC_formEventIntegration);

//add the test suite
YAHOO.tool.TestRunner.add(TS_formsIntegration);
