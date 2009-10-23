Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormUiUnitSuite = new Y.Test.Suite("forces.forms.ui unit test suite"); 

	// form objects unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form UI objects unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="#form" onsubmit="return false"><ol class="ftw-questions">' +
					'<li class="xf-input" id="input01-container"><label for="input01" id="label-input"><span class="xf-label">Input</span></label>' +
					'<input type="text" name="input01" id="input01" /></li>' +
					'<li class="xf-select" id="select-container"><fieldset><legend id="legend-select"><span><span class="xf-label">Select</span></legend>' +
					'<ul class="xf-choices">' +
					'<li><input type="checkbox" name="select" id="selectA" value="A" /><label for="selectA">A</label></li>' +
					'<li><input type="checkbox" name="select" id="selectB" value="B" /><label for="selectB">B</label></li>' +
					'<li><input type="checkbox" name="select" id="selectC" value="C" /><label for="selectC">C</label></li>' +
					'</ul></li>' +
					'<li class="xf-group" id="group"><fieldset>' +
					'<legend><span><span class="xf-label">Name</span></span></legend>' +
					'<ol class="ftw-questions">' +
					'<li class="xf-select"><label for="name-title"><span class="xf-label">Title</span></label>' +
					'<select id="name-title"><option value=""></option><option>Mr</option><option>Mrs</option></select></li>' +
					'<li class="xf-input"><label for="name-given"><span class="xf-label">Given name(s)</span></label>' +
					'<input type="text" id="name-given" size="20" /></li>' +
					'<li class="xf-input"><label for="name-family"><span class="xf-label">Family name</span></label>' +
					'<input type="text" id="name-family" size="20" /></li>' +
					'</ol>' +
					'</fieldset>' +
					'</li>' +
				'</ol></form>' +
				'</div>'
			).appendTo('body');
		},


		tearDown: function() {
			$('#form-container').remove();
		},


		//---------------------------------------------
		// Tests
		//---------------------------------------------


		test_canFindControlForInput: function() {
			Assert.areSame(document.getElementById('input01-container'), $('#input01').closest(':-xf-control').get(0));
		},


		test_canFindLabelForInput: function() {
			Assert.areSame("Input", $('#input01').closest(':-xf-control').find(':-xf-label').text());
		},


		test_canFindRequiredMarkerForInput: function() {
			$('#input01').forces_attr('required', true);
			Assert.areSame(1, $('#label-input').find('.xf-required').length);
			Assert.areSame("Input*", $('#label-input').text());
		},


		test_canFindControlForSelect: function() {
			Assert.areSame(document.getElementById('select-container'), $('#selectA').closest(':-xf-control').get(0));
			Assert.areSame(document.getElementById('select-container'), $('#selectB').closest(':-xf-control').get(0));
			Assert.areSame(document.getElementById('select-container'), $('#selectC').closest(':-xf-control').get(0));
		},


		test_canFindLabelForSelect: function() {
			Assert.areSame("Select", $('#selectB').closest(':-xf-control').find(':-xf-label').text());
		},


		test_canFindGroupControl: function() {
			Assert.areSame(false, $('#name-given').is(':-xf-group'));
			Assert.areSame(1, $('#name-given').parents(':-xf-group').length);
			Assert.areSame(document.getElementById('group'), $('#name-given').closest(':-xf-group').get(0));
		},


		test_canFindGroupLabel: function() {
			Assert.areSame("Given name(s)", $('#name-given').closest(':-xf-control').find(':-xf-label').eq(0).text());
			Assert.areSame("Name", $('#name-given').closest(':-xf-group').find(':-xf-label').eq(0).text());
		},


		test_canFindForm: function() {
			Assert.areSame(1, $('#input01').closest(':-tf-form').length, 'should find one form');
			Assert.areSame('form-container', $('#input01').closest(':-tf-form').attr('id'), 'should find correct form');
		}
	}));


	// form UI manipulation unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form UI manipulation unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
					'<form id="form" action="#form"><ol class="ftw-questions">' +
						'<li class="xf-input" id="question1"><label for="input1"><span class="xf-label">Input</span></label>' +
							'<input type="text" name="input1" id="input1" /></li>' +
						'<li class="xf-input" id="question2">' +
							'<label for="input2">' +
								'<span class="xf-label">Input</span>' +
								'<abbr class="xf-required" title="required">*</abbr>' +
							'</label>' +
							'<input type="text" name="input2" id="input2" />' +
						'</li>' +
					'</ol></form>' +
				'</div>'
			).appendTo('body').forces_enable();
		},

		tearDown: function() {
			$('#form-container').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_requiredFieldMarkerShown: function() {
			$('#input1, #input2').forces_attr('required', true);
			Assert.areSame(true, $('#question1').find('abbr.xf-required').length > 0, 'required marker should be shown');
			Assert.areSame('*', $('#question1').find('abbr.xf-required').text(), 'required marker should contain *');
			Assert.areSame('required', $('#question1').find('abbr.xf-required').attr('title'), 'required marker @title should be "required"');
			Assert.areSame(true, $('#question2').find('abbr.xf-required').length > 0, 'required marker should be shown');
			Assert.areSame(1, $('#question2').find('abbr.xf-required').length, 'only one required marker should be shown');
			$('#input1, #input2').forces_attr('required', false);
			Assert.areSame(0, $('#question1').find('abbr.xf-required').length, 'required marker should not be shown');
			Assert.areSame(0, $('#question2').find('abbr.xf-required').length, 'required marker should not be shown');
		},


		test_requiredFieldMarkerHidden: function() {
			Assert.areSame(0, $('#question1').find('abbr.xf-required').length, 'required marker should not be shown');
			Assert.areSame(1, $('#question2').find('abbr.xf-required').length, 'required marker should be shown');
			$('#input1, #input2').forces_attr('required', false);
			Assert.areSame(0, $('#question1').find('abbr.xf-required').length, 'required marker should not be shown');
		},


		test_onlyRelevantFieldsAreEnabled: function() {
			var input = $('#input1');
			Assert.areSame(false, input.get(0).hasAttribute('disabled'), 'input should not have @disabled by default');
			input.forces_attr('relevant', false);
			Assert.areSame(true, input.get(0).hasAttribute('disabled'), 'input missing @disabled when not relevant');
			Assert.areSame(true, input.attr('disabled'), '"disabled" property should be "true" when irrelevant');
			Assert.areSame('disabled', input.get(0).getAttribute('disabled'), '@disabled attribute should be "disabled" when irrelevant');
			input.forces_attr('relevant', true);
			Assert.areSame(false, input.get(0).hasAttribute('disabled'), 'input should not have @disabled when made relevant');
		},


		// TODO quality control (is this test accurate? does it fail when it should?)
		test_irrelevantFieldsAreHidden: function() {
			var input = $('#input1');
			var question = $('#question1');
			Assert.areNotSame('none', question.css('display'), 'relevant input should not be hidden');

			input.forces_attr('relevant', false);
			this.wait(function() {
				Assert.areSame('none', question.css('display'), 'irrelevant input should be hidden');
			}, $.forces.MS_DISABLED+1);

			input.forces_attr('relevant', true);
			this.wait(function() {
				Assert.areSame('block', question.css('display'), 'relevant input should not be hidden');
			}, $.forces.MS_ENABLED+1);
		},


		// TODO quality control (is this test accurate? does it fail when it should?)
		test_relevantAnimationsGlitchFree: function() {
			var input = $('#input1');
			var question = $('#question1');
			Assert.areNotSame('none', question.css('display'), 'relevant input should not be hidden');

			input.forces_attr('relevant', false).forces_attr('relevant', true);
			this.wait(function() {
				Assert.areSame('block', question.css('display'), 'false -> true causes glitch (animation not stopped?)');
			}, $.forces.MS_ENABLED+1);

			input.forces_attr('relevant', false);
			this.wait(function() {
				Assert.areSame('none', question.css('display'), 'irrelevant input should be hidden');
			}, $.forces.MS_DISABLED+1);
			input.forces_attr('relevant', true).forces_attr('relevant', false);
			this.wait(function() {
				Assert.areSame('none', question.css('display'), 'true -> false causes glitch (animation not stopped?)');
			}, $.forces.MS_DISABLED+1);
		},
		
		
		test_focusSetsActiveClass: function() {
			Assert.areSame('tf-active', $.forces.CSS_ACTIVE);

			var classActive = $.forces.CSS_ACTIVE;
			var question1 = $('#question1');
			var input1 = $('#input1');

			Assert.areSame(false, question1.hasClass(classActive));

			input1.focus();
			Assert.areSame(true, question1.hasClass(classActive));

			input1.blur();
			Assert.areSame(false, question1.hasClass(classActive));
		}
	}));


	// form validation UI unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form validation UI unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="javascript:" onsubmit="return false;"><ol class="ftw-questions">' +
					'<li class="xf-input"><label for="input1"><span class="xf-label">Input</span></label>' +
					'<input type="text" name="input1" id="input1" /></li>' +
				'</ol></form>' +
				'</div>'
			).appendTo('body');
		},

		tearDown: function() {
			$('#form-container').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_alertStatusShownOnSubmitError: function() {
			$('#form').trigger($.forces.EVENT_XF_SUBMIT_ERROR);
			var status = $('#form-container').prev('div');
			Assert.areSame(true, status.children().is('div.tf-alert'), 'div.tf-status > div.tf-alert not found');
			Assert.areSame(1, status.find('h1').length, 'h1 not found');
			Assert.areSame('Unable to submit form', status.find('h1').text());
			// second error should not create a new error box
			$('#form').trigger($.forces.EVENT_XF_SUBMIT_ERROR);
			Assert.areSame(1, $('div.tf-status').length, 'submit error box duplicated')
			// clean up
			$('div.tf-alert').remove();
		},


		test_classSetOnSubmitError: function() {
			$('#form').trigger($.forces.EVENT_XF_SUBMIT_ERROR);
			Assert.areSame('xf-submit-error', $.forces.CSS_SUBMIT_ERROR);
			Assert.areSame(true, $('#input1').closest(':-tf-form').hasClass($.forces.CSS_SUBMIT_ERROR));
			// clean up
			$('div.tf-alert').remove();
		},


		test_labelShownOnSubmitError: function() {
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame($('#input1').closest(':-xf-control').find(':-xf-label').text(), status.find('li').text(), 'control label not shown in alert');
			// clean up
			$('div.tf-alert').remove();
		}
	}));
	
	
	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUiUnitSuite);

});