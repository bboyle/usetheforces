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
					'<li><fieldset id="radio1">' +
						'<input type="radio" id="radio1a" name="radio1" value="a" />' +
						'<input type="radio" id="radio1b" name="radio1" value="b" />' +
						'<input type="radio" id="radio1c" name="radio1" value="c" />' +
					'</fieldset></li>' +
				'</ol></form>'
			).appendTo('body');
			$('#input2').forces_attr('required', true);
			$('.required input', '#form').forces_attr('required', true);
			$('#input5').forces_attr('required', 'input1 = "5 is required"');
			$('#radio1').forces_attr('required', true);
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
			Assert.areSame('required', $('#radio1').forces_attr('required'), 'radio1 should be required');
		},

		test_canSetRequiredUsingForcesAttr: function () {
			Assert.areSame(true, $('#input1').forces_attr('required', true).is(':-xf-required'));
			Assert.areSame(false, $('#input1').forces_attr('required', false).is(':-xf-required'));
			Assert.areSame(false, $('#input1').forces_removeAttr('required').is(':-xf-required'));
			Assert.areSame(null, $('#input1').forces_attr('required'));

			Assert.areSame(true, $('#radio1').forces_attr('required', true).is(':-xf-required'));
			Assert.areSame(false, $('#radio1').forces_attr('required', false).is(':-xf-required'));
			Assert.areSame(false, $('#radio1').forces_removeAttr('required').is(':-xf-required'));
			Assert.areSame(null, $('#radio1').forces_attr('required'));
		},

		test_setRequiredFromAncestorClass: function () {
			Assert.areSame(true, $('#input3').is(':-xf-required'));
			Assert.areSame(true, $('#input4').is(':-xf-required'));
		},

		test_readArbitraryValueFromRequiredAttribute: function () {
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
			$('#radio2-B').get(0).checked = false;
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


	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Validation system unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
					'<li><fieldset id="radio1">' +
						'<input type="radio" id="radio1a" name="radio1" value="a" />' +
						'<input type="radio" id="radio1b" name="radio1" value="b" />' +
						'<input type="radio" id="radio1c" name="radio1" value="c" />' +
					'</fieldset></li>' +
				'</ol></form>'
			).appendTo('body').forces_enable();
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_requiredTextFieldValidation: function() {
			$('#input1').forces_validate();
			Assert.areSame(true, $('#input1').is(':-xf-valid'), 'input1 should be valid by default');

			$('#input1').forces_attr('required', true).forces_validate();
			Assert.areSame(false, $('#input1').is(':-xf-valid'), 'required input1 should be invalid when empty');

			$('#input1').val('foo').forces_validate();
			Assert.areSame(true, $('#input1').is(':-xf-valid'), 'required input1 should be valid when "foo"');
		},

		test_requiredRadioButtonsValidation: function() {
			$('#radio1').forces_validate();
			Assert.areSame(true, $('#radio1').is(':-xf-valid'), 'radio1 should be valid by default');

			$('#radio1').forces_attr('required', true).forces_validate();
			Assert.areSame(false, $('#radio1').is(':-xf-valid'), 'required radio1 should be invalid when empty');

			$('#radio1a').click();
			$('#radio1').forces_validate();
			Assert.areSame(true, $('#radio1').is(':-xf-valid'), 'required radio1 should be valid when "a" checked');
		},
		
		test_shouldBeInvalidOnSetCustomValidityWithMessage: function() {
			Assert.areSame(false, $('#input1').is(':-xf-invalid'), 'input1 should not be invalid by default');

			$('#input1').forces_setCustomValidity('foo').forces_validate();
			Assert.areSame(true, $('#input1').is(':-xf-invalid'));

			$('#input1').forces_setCustomValidity('foo').forces_validate();
			Assert.areSame(true, $('#input1').is(':-xf-invalid'));
			Assert.areSame('foo', $('#input1').forces_validationMessage());

			$('#input1').forces_setCustomValidity('').forces_validate();
			Assert.areSame(false, $('#input1').is(':-xf-invalid'));
		}
	}));


	Y.forces.test.FormUnitSuite.add(new Y.Test.Case({
		name: "Confirmation fields unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
				'</ol></form>'
			).appendTo('body').forces_enable();
			$('#input2').forces_isConfirmationFor('#input1');
		},

		tearDown: function () {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_canFindConfirmationField: function() {
			Assert.areSame($('#input1').get(0), $('#input2').forces_isConfirmationFor().get(0), 'not found using ID');

			var input1 = $('#input1');
			$('#input2').forces_isConfirmationFor(input1);
			Assert.areSame(input1.get(0), $('#input2').forces_isConfirmationFor().get(0), 'not found using object');
		},

		test_canFindValidationDependency: function() {
			Assert.areSame($('#input2').get(0), $('#input1').data('-tf-VALIDATE').get(0), 'not found using ID');

			var input1 = $('#input1');
			$('#input2').forces_isConfirmationFor(input1);
			Assert.areSame($('#input2').get(0), $('#input1').data('-tf-VALIDATE').get(0), 'not found using object');
		},

		test_shouldBeValidWhenValuesMatch: function() {
			$('#input1').focus().val('foo').blur();
			$('#input2').focus().val('foo').blur();
			Assert.areSame(true, $('#input2').is(':-xf-valid'));
		},

		test_shouldBeInvalidWhenValuesDoNotMatch: function() {
			$('#input1').focus().val('foo').blur();
			$('#input2').focus().val('bar').blur();
			Assert.areSame(true, $('#input2').is(':-xf-invalid'));
		},

		test_shouldToggleValidationCorrectly: function() {
			$('#input1').focus().val('foo').blur();
			$('#input2').focus().val('bar').blur();
			Assert.areSame(true, $('#input2').is(':-xf-invalid'), 'invalid expected (foo != bar)');

			$('#input2').focus().val('foo').blur();
			Assert.areSame(true, $('#input2').is(':-xf-valid'), 'valid expected (foo = bar ~ foo)');

			$('#input1').focus().val('fo').blur();
			Assert.areSame(true, $('#input2').is(':-xf-invalid'), 'invalid expected (foo ~ fo != foo)');

			$('#input1').focus().val('foo').blur();
			Assert.areSame(true, $('#input2').is(':-xf-valid'), 'valid expected (fo ~ foo = foo)');
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUnitSuite);

});