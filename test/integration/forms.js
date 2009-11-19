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

		setUp: function() {
			$(
				'<form id="form" action="javascript:"><ol>' +
					'<li><input type="text" name="input1" id="input1" /></li>' +
					'<li><input type="text" name="input2" id="input2" /></li>' +
				'</ol></form>'
			).appendTo('body').forces_enable();
		},

		tearDown: function() {
			$('#form').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_relevantEventsFireCorrectly: function() {
			$(document).bind($.forces.EVENT_XF_ENABLED, function(evt) {
				$(evt.target).before('<span class="relevant">ENABLED</span>');
			});
			$(document).bind($.forces.EVENT_XF_DISABLED, function(evt) {
				$(evt.target).before('<span class="relevant">DISABLED</span>');
			});

			Assert.areSame(0, $('#input1').prev('.relevant').length);
			Assert.areSame(0, $('#input1').forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event fired when relevance did not change');
			Assert.areSame(1, $('#input1').forces_attr('relevant', false).forces_attr('relevant', true).prev('.relevant').length, 'RELEVANT event not detected');
			Assert.areSame('ENABLED', $('#input1').prev('.relevant').text());

			Assert.areSame(0, $('#input2').prev('.relevant').length);
			Assert.areSame(1, $('#input2').forces_attr('relevant', false).prev('.relevant').length);
			Assert.areSame('DISABLED', $('#input2').prev('.relevant').text());
		},


		test_requiredEventsFireCorrectly: function() {
			$(document).bind($.forces.EVENT_XF_REQUIRED, function(evt) {
				$(evt.target).before('<span class="required">REQUIRED</span>');
			});
			$(document).bind($.forces.EVENT_XF_OPTIONAL, function(evt) {
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


		test_submitEventsFireCorrectly: function() {
			var done = 0;
			$(document).bind($.forces.EVENT_XF_SUBMIT_DONE, function() { ++done; });
			var error = 0;
			$(document).bind($.forces.EVENT_XF_SUBMIT_ERROR, function() { ++error; });

			Assert.areSame(0, done, '"DONE" should not fire before submission occurs');
			Assert.areSame(0, error, '"ERROR" should not fire before submission occurs');
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			Assert.areSame(0, done, '"DONE" should not fire on submit failure');
			Assert.areSame(1, error, '"ERROR" should fire on submit failure');
			$('#input1').forces_attr('required', false);
			$('#form').submit();
			Assert.areSame(1, done, '"DONE" should fire on submit success');
			Assert.areSame(1, error, '"ERROR" should not fire on submit failure');
		},


		test_submitEventsCanBeDisabled: function() {
			var done = 0;
			$(document).bind($.forces.EVENT_XF_SUBMIT_DONE, function() { ++done; });
			var error = 0;
			$(document).bind($.forces.EVENT_XF_SUBMIT_ERROR, function() { ++error; });
			
			$('#form').forces_enable(false);

			Assert.areSame(0, done, 'disabled: "DONE" should not fire before submission occurs');
			Assert.areSame(0, error, 'disabled: "ERROR" should not fire before submission occurs');

			$('#input1').forces_attr('required', true);
			$('#form').submit();
			Assert.areSame(0, done, 'disabled: "DONE" should not fire on submit failure');
			Assert.areSame(0, error, 'disabled: "ERROR" should fire on submit failure');

			$('#input1').forces_attr('required', false);
			$('#form').submit();
			Assert.areSame(0, done, 'disabled: "DONE" should fire on submit success');
			Assert.areSame(0, error, 'disabled: "ERROR" should not fire on submit failure');
		},


		test_submitEventSuppression: function() {
			var submitted = 0;
			var suppressed = 0;
			$(document).submit(function() { ++submitted; });
			$('#form').bind($.forces.EVENT_TF_SUBMIT_SUPPRESSED, function() { ++suppressed; });
			
			function wasSubmitted(wasSubmitted) {
				$('#form').submit();
				return submitted > wasSubmitted;
			}
			
			Assert.areSame(0, suppressed);

			Assert.areSame(true, wasSubmitted(submitted));
			Assert.areSame(0, suppressed);

			Assert.areSame(false, wasSubmitted(submitted), 'repeated submit not suppressed');
			Assert.areSame(1, suppressed, 'suppressed event not observed');

			Y.log('test_submitEventSuppression called timeout ' + $.forces.SUBMIT_TOLERANCE + 'ms, please wait ...', 'wait', 'TestRunner');
			this.wait(function() {
				Assert.areSame(true, wasSubmitted(submitted), 'submit after tolerance should proceed');
				Assert.areSame(1, suppressed, 'extra suppressed event counted');
			}, $.forces.SUBMIT_TOLERANCE + 100);
		},

		
		test_submitErrorsDoNotSuppressSubmit: function() {
			var submitted = 0;
			$('#form').submit(function() { ++submitted; });
			$('#form').bind($.forces.EVENT_XF_SUBMIT_ERROR, function() { --submitted; });
			
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