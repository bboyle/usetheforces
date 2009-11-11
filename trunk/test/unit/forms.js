Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormUnitSuite = new Y.Test.Suite("forces.forms unit test suite"); 

	// required fields unit tests
	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Required fields unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
					'<li class="required"><input type="text" name="input3" id="input3" /></li>' +
					'<li class="required"><input type="text" name="input4" id="input4" /></li>' +
					'<li><input type="text" name="input5" id="input5" /></li>' +
				'</ol></form>'
			).appendTo('body');
			$('#input2').forces_attr('required', true);
			$('.required input', '#form').forces_attr('required', true);
			$('#input5').forces_attr('required', 'input1 = "5 is required"');
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_readRequiredAttribute: function () {
			Assert.areSame('required', $('#input2').forces_attr('required'));
			Assert.areSame(null, $('#input1').forces_attr('required'));
		},

		test_canSetRequiredUsingForcesAttr: function () {
			Assert.areSame(true, $('#input1').forces_attr('required', true).is(':-xf-required'));
			Assert.areSame(false, $('#input1').forces_attr('required', false).is(':-xf-required'));
			Assert.areSame(false, $('#input1').forces_removeAttr('required').is(':-xf-required'));
			Assert.areSame(null, $('#input1').forces_attr('required'));
		},

		test_setRequiredFromAncestorClass: function () {
			Assert.areSame(true, $('#input3').is(':-xf-required'));
			Assert.areSame(true, $('#input4').is(':-xf-required'));
		},

		test_readCalculationFromRequiredAttribute: function () {
			Assert.areSame('input1 = "5 is required"', $('#input5').forces_attr('required'));
		}
	}));


	// relevant fields unit tests
	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Relevant fields unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
				'</ol></form>'
			).appendTo('body');
			$('#input2', '#form').forces_attr('relevant', false);
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_fieldsAreRelevantByDefault: function () {
			Assert.areSame(true, $('#input1').is(':-xf-relevant'));
			Assert.areSame(false, $('#input1').is(':-xf-irrelevant'));
		},

		test_readRelevantAttribute: function () {
			Assert.areSame('relevant', $('#input1').forces_attr('relevant'));
			Assert.isNull($('#input2').forces_attr('required'));
		},

		test_canSetRelevantUsingForcesAttr: function () {
			Assert.areSame(true, $('#input1').forces_attr('relevant', true).is(':-xf-relevant'));
			Assert.areSame(false, $('#input1').forces_attr('relevant', false).is(':-xf-relevant'));
			Assert.areSame(true, $('#input1').forces_removeAttr('relevant').is(':-xf-relevant'));
			Assert.areSame('relevant', $('#input1').forces_attr('relevant'));
		}
	}));


	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Selectors unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" value="foo" /></li>' +
					'<li><input type="text" name="input3" id="input3" value="foo" /></li>' +
					'<li><fieldset id="radio1">' +
						'<input type="radio" name="radio1" id="radio1-A" value="A"/>' +
						'<input type="radio" name="radio1" id="radio1-B" value="B"/>' +
						'<input type="radio" name="radio1" id="radio1-C" value="C"/>' +
					'</fieldset></li>' +
					'<li><fieldset id="radio2">' +
						'<input type="radio" name="radio2" id="radio2-A" value="A"/>' +
						'<input type="radio" name="radio2" id="radio2-B" value="B" checked="checked" />' +
						'<input type="radio" name="radio2" id="radio2-C" value="C"/>' +
					'</fieldset></li>' +
				'</ol></form>'
			).appendTo('body');
			$('#input1,#radio1').forces_attr('required', true);
			$('#input3').forces_attr('relevant', false);
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_emptySelectorWithInput: function () {
			Assert.areSame(true, $('#input1').is(':-xf-empty'));
			Assert.areSame(false, $('#input2').is(':-xf-empty'));
			Assert.areSame(true, $('#input2').val(' ').is(':-xf-empty'));
			Assert.areSame(false, $('#input2').val('foo').is(':-xf-empty'));
		},

		test_emptySelectorWithRadio: function () {
			Assert.areSame(true, $('#radio1').is(':-xf-empty'), 'radio1 reported as not empty');
			Assert.areSame(false, $('#radio2').is(':-xf-empty'), 'radio2 reported as empty');
			$('#radio2-B').get(0).removeAttribute('checked');
			Assert.areSame(0, $('#radio2 :checked').length, 'radio2 should not have :checked elements');
			Assert.areSame(true, $('#radio2').is(':-xf-empty'), 'radio2 should now be empty');
			$('#radio2-C').click();
			Assert.areSame(false, $('#radio2').is(':-xf-empty'), 'radio2 should not be empty');
		},

		test_relevantSelectorReturnsCorrectBoolean: function () {
			Assert.areSame(true, $('#input1').is(':-xf-relevant'));
			Assert.areSame(true, $('#input3').is(':-xf-irrelevant'));
			Assert.areSame(false, $('#input3').is(':-xf-relevant'));
			Assert.areSame(true, $('#input3').forces_attr('relevant', true).is(':-xf-relevant'));
		},

		test_requiredSelectorReturnsCorrectBoolean: function () {
			Assert.areSame(true, $('#input1').is(':-xf-required'));
			Assert.areSame(false, $('#input1').is(':-xf-optional'));
			Assert.areSame(true, $('#input1').forces_attr('required', false).is(':-xf-optional'));
			Assert.areSame(false, $('#input2').is(':-xf-required'));
			Assert.areSame(true, $('#input2').is(':-xf-optional'));
		},

		test_validitySelectorsReturnCorrectBoolean: function () {
			Assert.areSame(false, $('#input1').is(':-xf-valid'), 'input matched valid');
			Assert.areSame(false, $('#input1').is(':-xf-invalid'), 'input matched invalid');
			Assert.areSame(true, $('#input1').is(':-tf-not-validated'), 'input matched \'not validated\'');
		}
	}));


	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Data type fields unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
				'</ol></form>'
			).appendTo('body');
			$('#input2').forces_attr('type', 'email');
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_readTypeAttribute: function () {
			Assert.areSame('email', $('#input2').forces_attr('type'));
			Assert.areSame('email', $('#input1').forces_attr('type', 'email').forces_attr('type'));
			Assert.areNotSame('email', $('#input1').forces_removeAttr('type').forces_attr('type'));
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUnitSuite);

});