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
			$(document).bind($.forces.EVENT_RELEVANT, function(evt) {
				$(evt.target).before('<span class="relevant">RELEVANT</span>');
			});
			$(document).bind($.forces.EVENT_IRRELEVANT, function(evt) {
				$(evt.target).before('<span class="relevant">IRRELEVANT</span>');
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
			$(document).bind($.forces.EVENT_REQUIRED, function(evt) {
				$(evt.target).before('<span class="required">REQUIRED</span>');
			});
			$(document).bind($.forces.EVENT_OPTIONAL, function(evt) {
				$(evt.target).before('<span class="required">OPTIONAL</span>');
			});

			Assert.areSame(0, $('#input01').prev('.required').length);
			Assert.areSame(1, $('#input01').forces_attr('required', true).prev('.required').length);
			Assert.areSame('REQUIRED', $('#input01').prev('.required').text());

			Assert.areSame(0, $('#input02').prev('.required').length);
			Assert.areSame(0, $('#input02').forces_attr('required', false).prev('.required').length, 'OPTIONAL event fired when required state did not change');
			Assert.areSame(1, $('#input02').forces_attr('required', true).forces_attr('required', false).prev('.required').length);
			Assert.areSame('OPTIONAL', $('#input02').prev('.required').text());
		},


		test_submitErrorEventFiresCorrectly: function () {
			$(document).bind($.forces.EVENT_SUBMIT_ERROR, function(evt) {
				$(evt.target).prepend('<span class="submit-error">SUBMIT ERROR</span>');
			});
			
			Assert.areSame(0, $('.submit-error').length, 'SUBMIT ERROR should not be present before submit event');
			$('#input01').forces_attr('required', true);
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
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormIntegrationSuite);

});