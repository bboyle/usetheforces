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
					'<li class="xf-input" id="input01-container">' +
						'<label for="input01" id="label-input"><span class="xf-label">Input</span></label>' +
						'<input type="text" name="input01" id="input01" /></li>' +
					'<li class="xf-select" id="select-container"><fieldset><legend id="legend-select"><span><span class="xf-label">Select</span></legend>' +
						'<ul class="xf-choices">' +
							'<li><input type="checkbox" name="select" id="selectA" value="A" /><label for="selectA">A</label></li>' +
							'<li><input type="checkbox" name="select" id="selectB" value="B" /><label for="selectB">B</label></li>' +
							'<li><input type="checkbox" name="select" id="selectC" value="C" /><label for="selectC">C</label></li>' +
						'</ul></li>' +
					'</fieldset></li>' +
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
					'<li class="xf-textarea" id="textarea-container">' +
						'<label for="textarea1"><span class="xf-label">Textarea</span></label>' +
						'<textarea id="textarea1" name="textarea1"></textarea>' +
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


		test_canFindControlForTextarea: function() {
			Assert.areSame(document.getElementById('textarea-container'), $('#textarea1').closest(':-xf-control').get(0));
		},


		test_canFindLabelForTextarea: function() {
			Assert.areSame("Textarea", $('#textarea1').closest(':-xf-control').find(':-xf-label').text());
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
								'<span class="xf-label">Input 2</span>' +
								'<abbr class="xf-required" title="required">*</abbr>' +
							'</label>' +
							'<input type="text" name="input2" id="input2" />' +
						'</li>' +
						'<li class="xf-textarea" id="question3"><label for="textarea1"><span class="xf-label">Textarea</span></label>' +
							'<textarea id="textarea1" name="textarea1"></textarea>' +
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
		
		
		test_focusSetsActiveClassForInput: function() {
			Assert.areSame('tf-active', $.forces.CSS_ACTIVE);

			var classActive = $.forces.CSS_ACTIVE;
			var question1 = $('#question1');
			var input1 = $('#input1');

			Assert.areSame(false, question1.hasClass(classActive));

			input1.focus();
			Assert.areSame(true, question1.hasClass(classActive));

			input1.blur();
			Assert.areSame(false, question1.hasClass(classActive));
		},


		test_focusSetsActiveClassForTextarea: function() {
			var classActive = $.forces.CSS_ACTIVE;
			var question = $('#question3');
			var field = $('#textarea1');

			Assert.areSame(false, question.hasClass(classActive));

			field.focus();
			Assert.areSame(true, question.hasClass(classActive));

			field.blur();
			Assert.areSame(false, question.hasClass(classActive));
		}

	}));


	// form datepicker UI unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form datepicker UI unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="javascript:" onsubmit="return false;"><ol class="ftw-questions">' +
					'<li class="xf-input">' +
						'<label for="date1"><span class="xf-label">Date</span></label>' +
						'<input type="text" name="date1" id="date1" />' +
					'</li>' +
				'</ol></form>' +
				'</div>'
			).appendTo('body').forces_enable();
			christmas1977 = new Date(1977, 11, 25); // 25 May 1977
		},

		tearDown: function() {
			$('#form-container, div.tf-status').remove();
			delete christmas1977;
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------
	

		test_displaysCalendar: function() {
			var calendar = $.forces.uiHtmlCalendar({ date: christmas1977 });
			Assert.areSame('December 1977', calendar.find('caption').text());
			Assert.areSame('SMTWTFS', calendar.find('thead').text());
			Assert.areSame('123', calendar.find('tbody tr').eq(0).text());
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
					'<li class="xf-input">' +
						'<label for="input1"><span class="xf-label">Input</span></label>' +
						'<input type="text" name="input1" id="input1" />' +
					'</li>' +
					'<li class="xf-input">' +
						'<label for="email"><span class="xf-label">Email</span></label>' +
						'<input type="text" name="email" id="email" />' +
					'</li>' +
					'<li class="xf-input">' +
						'<label for="date"><span class="xf-label">Date</span></label>' +
						'<input type="text" name="date" id="date" />' +
					'</li>' +
				'</ol></form>' +
				'</div>'
			).appendTo('body').forces_enable();
		},

		tearDown: function() {
			$('#form-container, div.tf-status').remove();
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
		},


		test_classSetOnSubmitError: function() {
			$('#form').trigger($.forces.EVENT_XF_SUBMIT_ERROR);
			Assert.areSame('xf-submit-error', $.forces.CSS_SUBMIT_ERROR);
			Assert.areSame(true, $('#input1').closest(':-tf-form').hasClass($.forces.CSS_SUBMIT_ERROR));
		},


		test_classSetOnSubmitDone: function() {
			$('#form').trigger($.forces.EVENT_XF_SUBMIT_DONE);
			Assert.areSame('xf-submit-done', $.forces.CSS_SUBMIT_DONE);
			Assert.areSame(true, $('#input1').closest(':-tf-form').hasClass($.forces.CSS_SUBMIT_DONE));

			$('#form').trigger($.forces.EVENT_XF_SUBMIT_ERROR);
			Assert.areSame(true, $('#input1').closest(':-tf-form').hasClass($.forces.CSS_SUBMIT_ERROR));

			$('#form').trigger($.forces.EVENT_XF_SUBMIT_DONE);
			Assert.areSame(true, $('#input1').closest(':-tf-form').hasClass($.forces.CSS_SUBMIT_DONE));
		},


		test_labelShownOnSubmitError: function() {
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			var status = $('div.tf-status');
			var label = $('#input1').closest(':-xf-control').find(':-xf-label').text();
			Assert.areSame(0, status.find('li').text().indexOf(label), 'control label not shown in alert');
		},


		test_linkShownOnSubmitError: function() {
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame('#input1', status.find('a').attr('href'), 'validation alert not linked to control');
		},


		test_requiredAlertMessageDisplayed: function() {
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame('Input: must be completed', status.find('li').text());
		},
		
		
		test_setsValidInvalidClassOnChange: function() {
			$('#email').forces_attr('type', 'email');
			
			Assert.areSame(false, $('#email').closest(':-xf-control').hasClass($.forces.CSS_VALID), 'valid class found before validation');
			Assert.areSame(false, $('#email').closest(':-xf-control').hasClass($.forces.CSS_INVALID), 'invalid class found before validation');
			
			$('#email').focus().val('foo@example.com').blur();
			Assert.areSame(true, $('#email').closest(':-xf-control').hasClass($.forces.CSS_VALID), 'valid class not present');
			Assert.areSame(false, $('#email').closest(':-xf-control').hasClass($.forces.CSS_INVALID), 'invalid class present when valid');

			$('#email').focus().val('foo').blur();
			Assert.areSame(false, $('#email').closest(':-xf-control').hasClass($.forces.CSS_VALID), 'valid class present when invalid');
			Assert.areSame(true, $('#email').closest(':-xf-control').hasClass($.forces.CSS_INVALID), 'invalid class not present');

			$('#email').focus().val('foo@example.com').blur();
			Assert.areSame(true, $('#email').closest(':-xf-control').hasClass($.forces.CSS_VALID), 'valid class not present');
			Assert.areSame(false, $('#email').closest(':-xf-control').hasClass($.forces.CSS_INVALID), 'invalid class still present');
		},


		test_invalidEmailMessageDisplayed: function() {
			$('#email').forces_attr('type', 'email').forces_attr('required', true);

			$('#form').submit();
			Assert.areSame('Email: must be completed', $('.tf-status').find('li').text());
			
			$('#email').val('foo');
			$('#form').submit();
			Assert.areSame('Email: must contain an email address', $('.tf-status').find('li').text());

			$('#email').val('foo@example.com');
			$('#form').submit();
			Assert.areSame(0, $('.tf-status').find('li').length);
		},
	

		test_invalidDateMessageDisplayed: function() {
			$('#date').forces_attr('type', 'date').forces_attr('required', true);

			$('#form').submit();
			Assert.areSame('Date: must be completed', $('.tf-status').find('li').text());
			
			$('#date').val('foo');
			$('#form').submit();
			Assert.areSame('Date: unrecognised date format', $('.tf-status').find('li').text());

			$('#date').val('1/11/2009');
			$('#form').submit();
			Assert.areSame(0, $('.tf-status').find('li').length);
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUiUnitSuite);

});