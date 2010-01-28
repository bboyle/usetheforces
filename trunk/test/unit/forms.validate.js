Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormValidateUnitSuite = new Y.Test.Suite("forces.forms.validate unit test suite"); 

	// luhn check tests
	Y.forces.test.FormValidateUnitSuite.add(new Y.Test.Case({
		name: "validation algorithm unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<form id="form" action="#form"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
				'</ol></form>'
			).appendTo('body');
		},

		tearDown: function() {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_luhn: function() {
			var numbers = [
				'4111 1111 1111 1111',
				'4000 1000 2000 3000',
				'4000 1000 2000 3',
				'0000 0000 0000 0000'
			];
			for (var i = 0; i < numbers.length; i++) {
				Assert.areSame(true, $.forces.isValidLuhn(numbers[i].replace(/[^0-9]+/g, '')), numbers[i] + ' failed luhn check');
			}

			numbers = [
				'0000 0000 0000 0001',
				'53 004 085 616',
				'4875697858795787',
				'1234567890'
			];
			for (var i = 0; i < numbers.length; i++) {
				Assert.areSame(false, $.forces.isValidLuhn(numbers[i].replace(/[^0-9]+/g, '')), numbers[i] + ' passed luhn check');
			}
		},


		test_confirmation: function() {
			$('#input2').forces_isConfirmationFor('#input1');

			$('#input2').forces_validate();
			Assert.areSame(true, $('#input2').is(':-xf-valid'), 'empty fields should match');

			$('#input1').focus().val('foo').change().blur();
			Assert.areSame(false, $('#input2').is(':-xf-valid'), 'foo should not match empty');

			$('#input2').focus().val('foo').change().blur();
			Assert.areSame(true, $('#input2').is(':-xf-valid'), 'foo should be confirmed');

			$('#input2').focus().val('bar').change().blur();
			Assert.areSame(false, $('#input2').is(':-xf-valid'), 'bar should not match foo');

			$('#input1').focus().val('bar').change().blur();
			Assert.areSame(true, $('#input2').is(':-xf-valid'), 'bar should be confirmed');
		}

	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormValidateUnitSuite);

});