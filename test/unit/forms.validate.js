Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormValidateUnitSuite = new Y.Test.Suite("forces.forms.validate unit test suite"); 

	// luhn check tests
	Y.forces.test.FormValidateUnitSuite.add(new Y.Test.Case({
		name: "validation algorithm unit tests",

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_luhn: function() {
			var numbers = [
				'4111 1111 1111 1111',
				'4000 1000 2000 3000',
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
		}

	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormValidateUnitSuite);

});