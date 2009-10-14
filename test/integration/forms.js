Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormIntegrationSuite = new Y.Test.Suite("forces.forms integration test suite"); 

	// form events integration tests
	Y.forces.test.FormIntegrationSuite.add(new Y.Test.Case({
		name: "Form events integration tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			$(
				'<form id="form" action="javascript:"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
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
			$(document).bind($.forces.EVENT_RELEVANT, function(evt) {
				$(evt.target).before('<span class="relevant">RELEVANT</span>');
			});
			$(document).bind($.forces.EVENT_IRRELEVANT, function(evt) {
				$(evt.target).before('<span class="relevant">IRRELEVANT</span>');
			});

			Assert.areSame(0, $('#input1').prev('.relevant').length);
			Assert.areSame(0, $('#input1').forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event fired when relevance did not change');
			Assert.areSame(1, $('#input1').forces_attr('relevant', false).forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event not detected');
			Assert.areSame('RELEVANT', $('#input1').prev('.relevant').text());

			Assert.areSame(0, $('#input2').prev('.relevant').length);
			Assert.areSame(1, $('#input2').forces_attr('relevant', false).prev('.relevant').length);
			Assert.areSame('IRRELEVANT', $('#input2').prev('.relevant').text());
		},


		test_requiredEventsFireCorrectly: function () {
			$(document).bind($.forces.EVENT_REQUIRED, function(evt) {
				$(evt.target).before('<span class="required">REQUIRED</span>');
			});
			$(document).bind($.forces.EVENT_OPTIONAL, function(evt) {
				$(evt.target).before('<span class="required">OPTIONAL</span>');
			});

			Assert.areSame(0, $('#input1').prev('.required').length);
			Assert.areSame(1, $('#input1').forces_attr('required', true).prev('.required').length);
			Assert.areSame('REQUIRED', $('#input1').prev('.required').text());

			Assert.areSame(0, $('#input2').prev('.required').length);
			Assert.areSame(0, $('#input2').forces_attr('required', false).prev('.required').length, 'OPTIONAL event fired when required state did not change');
			Assert.areSame(1, $('#input2').forces_attr('required', true).forces_attr('required', false).prev('.required').length);
			Assert.areSame('OPTIONAL', $('#input2').prev('.required').text());
		},


		test_submitErrorEventFiresCorrectly: function () {
			$(document).bind($.forces.EVENT_SUBMIT_ERROR, function(evt) {
				$(evt.target).prepend('<span class="submit-error">SUBMIT ERROR</span>');
			});
			
			Assert.areSame(0, $('.submit-error').length, 'SUBMIT ERROR should not be present before submit event');
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			Assert.areSame('SUBMIT ERROR', $('#form').find('.submit-error').text(), 'SUBMIT ERROR should occur on submit with invalid control');
		},


		test_submitEventSuppression: function () {
			var submitted = 0;
			$(document).submit(function() { ++submitted; });
			
			function wasSubmitted(wasSubmitted) {
				$('#form').submit();
				return submitted > wasSubmitted;
			}
			
			Assert.areSame(true, wasSubmitted(submitted));
			Assert.areSame(false, wasSubmitted(submitted), 'repeated submit not suppressed');
			Y.log('test_submitEventSuppression called timeout ' + $.forces.SUBMIT_TOLERANCE + 'ms, please wait ...', 'wait', 'TestRunner');
			this.wait(function() {
				Assert.areSame(true, wasSubmitted(submitted), 'submit after tolerance should proceed');
			}, $.forces.SUBMIT_TOLERANCE + 100);
		},

		
		test_submitErrorsDoNotSuppressSubmit: function () {
			var submitted = 0;
			$('#form').submit(function() { ++submitted; });
			$('#form').bind($.forces.EVENT_SUBMIT_ERROR, function() { --submitted; });
			
			function wasSubmitted(wasSubmitted) {
				$('#form').submit();
				return submitted > wasSubmitted;
			}
			
			$('#input1').forces_attr('required', true);
			Assert.areSame(false, wasSubmitted(submitted), 'submitted blank (required) field');
			$('#input1').val('foo');
			Assert.areSame(true, wasSubmitted(submitted), 'unable to submit (suppressed) after correcting invalid field');
		}
		
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormIntegrationSuite);

});