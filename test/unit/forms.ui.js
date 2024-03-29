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
						'<input type="text" name="input01" id="input01" />' +
					'</li>' +
					'<li class="xf-input" id="email01-container">' +
						'<label for="email01" id="label-email"><span class="xf-label">Email</span></label>' +
						'<input type="text" name="email01" id="email01" />' +
					'</li>' +
					'<li class="xf-select" id="select-container"><fieldset><legend id="legend-select"><span class="xf-label">Select</span></legend>' +
						'<ul class="xf-choices">' +
							'<li><input type="checkbox" name="select" id="selectA" value="A" /><label for="selectA">A</label></li>' +
							'<li><input type="checkbox" name="select" id="selectB" value="B" /><label for="selectB">B</label></li>' +
							'<li><input type="checkbox" name="select" id="selectC" value="C" /><label for="selectC">C</label></li>' +
						'</ul></li>' +
					'</fieldset></li>' +
					'<li class="xf-group" id="group"><fieldset>' +
						'<legend><span class="xf-label">Name</span></legend>' +
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


		test_canFindRequiredMarkerForEmail: function() {
			$('#email01').forces_attr('required', true);
			Assert.areSame(1, $('#label-email').find('.xf-required').length);
			Assert.areSame("Email*", $('#label-email').text());
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


		test_canSetAlertForControls: function() {
			Assert.areSame(0, $('#input01-container, #select-container').find('.xf-alert').length);

			$('#input01-container, #select-container').forces_alert('test alert');
			Assert.areSame(1, $('#input01-container').find('.xf-alert').length, 'expected alert on input');
			Assert.areSame(1, $('#select-container').find('.xf-alert').length, 'expected alert on select');
			Assert.areSame('test alert', $('#input01-container').find('.xf-alert').text(), 'expected "test alert" on input');
			Assert.areSame('test alert', $('#select-container').find('.xf-alert').text(), 'expected "test alert" on select');

			$('#input01-container').forces_alert('foo');
			Assert.areSame(1, $('#input01-container').find('.xf-alert').length, 'expected 1 alert');
			Assert.areSame('foo', $('#input01-container').find('.xf-alert').text());
			Assert.areSame(1, $('#select-container').find('.xf-alert').length);
			Assert.areSame('test alert', $('#select-container').find('.xf-alert').text());

			$('#input01-container').forces_alert();
			Assert.areSame(0, $('#input01-container').find('.xf-alert').length, 'alert still present');
		},


		test_canSetHintForControls: function() {
			Assert.areSame(0, $('#input01-container, #select-container').find('.xf-hint').length);

			$('#input01-container, #select-container').forces_hint('test hint');
			Assert.areSame(1, $('#input01-container').find('.xf-hint').length, 'expected hint on input');
			Assert.areSame(1, $('#select-container').find('.xf-hint').length, 'expected hint on select');
			Assert.areSame('test hint', $('#input01-container').find('.xf-hint').text(), 'expected "test hint" on input');
			Assert.areSame('test hint', $('#select-container').find('.xf-hint').text(), 'expected "test hint" on select');

			$('#input01-container').forces_hint('foo');
			Assert.areSame(1, $('#input01-container').find('.xf-hint').length, 'expected 1 hint');
			Assert.areSame('foo', $('#input01-container').find('.xf-hint').text());
			Assert.areSame(1, $('#select-container').find('.xf-hint').length);
			Assert.areSame('test hint', $('#select-container').find('.xf-hint').text());

			$('#input01-container').forces_hint();
			Assert.areSame(0, $('#input01-container').find('.xf-hint').length, 'hint still present');
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
						'<li class="xf-select1" id="question4"><fieldset id="radio1">' +
							'<legend><span class="xf-label">Radio buttons</span></legend>' +
							'<ul class="xf-choices>' +
								'<li><label for="radio1-A"><input type="radio" name="radio1" id="radio1-A" value="A" />A</label></li>' +
								'<li><label for="radio1-B"><input type="radio" name="radio1" id="radio1-B" value="B" />B</label></li>' +
								'<li><label for="radio1-C"><input type="radio" name="radio1" id="radio1-C" value="C" />C</label></li>' +
							'</ul>' +
						'</fieldset></li>' +
						'<li class="xf-group" id="question5">' +
							'<fieldset id="group1">' +
								'<legend><span class="xf-label">Group</span></legend>' +
								'<div class="ftw-instructions">' +
									'<p>This is a test group.</p>' +
								'</div>' +
								'<ol class="ftw-questons">' +
									'<li class="xf-input" id="group1question1">' +
										'<label for="group1input1">' +
											'<span class="xf-label">Grouped input 1</span>' +
											'<abbr class="xf-required" title="required">*</abbr>' +
										'</label>' +
										'<input type="text" name="group1input1" id="group1input1" />' +
									'</li>' +
									'<li class="xf-input" id="group1question2">' +
										'<label for="group1input2">' +
											'<span class="xf-label">Grouped input 2</span>' +
											'<abbr class="xf-required" title="required">*</abbr>' +
										'</label>' +
										'<input type="text" name="group1input2" id="group1input2" />' +
									'</li>' +
								'</ol>' +
							'</fieldset>' +
						'</li>' +
						'<li class="xf-secret" id="question6"><label for="password1"><span class="xf-label">Password</span></label>' +
							'<input type="password" name="password1" id="password1" /></li>' +
						'<li class="section" id="section1">' +
							'<fieldset>' +
								'<legend>Section</legend>' +
								'<div class="ftw-instructions">' +
									'<p>This is a test section.</p>' +
								'</div>' +
								'<ol class="ftw-questons">' +
									'<li class="xf-input" id="section1question1">' +
										'<label for="section1input1">' +
											'<span class="xf-label">Section input 1</span>' +
											'<abbr class="xf-required" title="required">*</abbr>' +
										'</label>' +
										'<input type="text" name="section1input1" id="section1input1" />' +
									'</li>' +
								'</ol>' +
							'</fieldset>' +
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
			$('#input1, #input2, #password1').forces_attr('required', true);
			Assert.areSame(true, $('#question1').find('abbr.xf-required').length > 0, 'required marker should be shown');
			Assert.areSame('Input*', $('#question1').text(), 'required marker should contain *');
			Assert.areSame('required', $('#question1').find('abbr.xf-required').attr('title'), 'required marker @title should be "required"');
			Assert.areSame(true, $('#question2').find('abbr.xf-required').length > 0, 'required marker should be shown');
			Assert.areSame(1, $('#question2').find('abbr.xf-required').length, 'only one required marker should be shown');
			Assert.areSame(true, $('#question6').find('abbr.xf-required').length > 0, 'required marker should be shown');
			Assert.areSame('Password*', $('#question6').text(), 'required marker should contain *');
			Assert.areSame('required', $('#question6').find('abbr.xf-required').attr('title'), 'required marker @title should be "required"');
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
			// 2011-05-04 input.get(0).disabled instead of input.attr('disabled') for jquery 1.6 attr() changes
			Assert.areSame(false, input.get(0).disabled, 'input should not have @disabled by default');

			// 2011-02-26 needed to slow down these tests for jquery 1.5
			// was seeing false positives, likey due to test executing faster than event handling
			input.forces_attr('relevant', false);
			this.wait(function() {
				Assert.areSame(true, input.get(0).disabled, '"disabled" property should be "true" when irrelevant');
			}, 1);

			input.forces_attr('relevant', true);
			this.wait(function() {
				Assert.areSame(false, input.get(0).disabled, 'input should not have @disabled when made relevant');
			}, 1);
		},


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


		test_irrelevantGroupsAreHidden: function() {
			Assert.areSame(true, $('#group1').is(':-xf-relevant'), 'group should be relevant by default');
			Assert.areSame(false, $('#group1').is(':hidden'), 'group should not be hidden by default');
			Assert.areSame(false, $('#group1 p').is(':hidden'), 'group content should not be hidden by default');

			$('#group1').forces_attr('relevant', false);
			Assert.areSame(false, $('#group1').is(':-xf-relevant'), 'irrelevant group should not be relevant');
			Assert.areSame(true, $('#group1').is(':hidden'), 'irrelevant group should be hidden');
			Assert.areSame(true, $('#group1 p').is(':hidden'), 'irrelevant group content should be hidden');

			$('#group1').forces_attr('relevant', true);
			Assert.areSame(true, $('#group1').is(':-xf-relevant'), 'relevant group should be relevant');
			Assert.areSame(false, $('#group1').is(':hidden'), 'relevant group should not be hidden');
			Assert.areSame(false, $('#group1 p').is(':hidden'), 'relevant group content should not be hidden');
		},


		test_irrelevantSectionsAreHidden: function() {
			Assert.areSame(true, $('#section1').is(':-xf-relevant'), 'section should be relevant by default');
			Assert.areSame(false, $('#section1').is(':hidden'), 'section should not be hidden by default');
			Assert.areSame(false, $('#section1 p').is(':hidden'), 'section content should not be hidden by default');

			$('#section1').forces_attr('relevant', false);
			Assert.areSame(false, $('#section1').is(':-xf-relevant'), 'irrelevant section should not be relevant');
			Assert.areSame(true, $('#section1').is(':hidden'), 'irrelevant section should be hidden');
			Assert.areSame(true, $('#section1 p').is(':hidden'), 'irrelevant section content should be hidden');

			$('#section1').forces_attr('relevant', true);
			Assert.areSame(true, $('#section1').is(':-xf-relevant'), 'relevant section should be relevant');
			Assert.areSame(false, $('#section1').is(':hidden'), 'relevant section should not be hidden');
			Assert.areSame(false, $('#section1 p').is(':hidden'), 'relevant section content should not be hidden');
		},
		
		
		test_ancestorRelevanceNotTriggeredByDescendent: function() {
			$('#group1input1').forces_attr('relevant', false);
			Assert.areSame(false, $('#group1').is(':hidden'), 'relevant group should be visible');
			Assert.areSame(true, $('#group1input1').is(':hidden'), 'irrelevant question should be hidden');
			Assert.areSame(false, $('#group1input2').is(':hidden'), 'relevant question should be visible');
		},


/* http://code.google.com/p/usetheforces/issues/detail?id=30
		test_descendentRelevanceNotTriggeredByAncestor: function() {
			$('#group1,#group1input1').forces_attr('relevant', false);
			Assert.areSame(true, $('#group1').is(':hidden'), 'irrelevant group should be hidden');
			Assert.areSame(true, $('#group1input1').is(':hidden'), 'irrelevant question should be hidden');
			Assert.areSame(true, $('#group1input2').is(':hidden'), 'relevant question within irrelevant group should be hidden');

			$('#group1').forces_attr('relevant', true);
			Assert.areSame(false, $('#group1').is(':hidden'), 'relevant group should be visible');
			Assert.areSame(true, $('#group1input1').is(':hidden'), 'irrelevant question should be hidden (when group made relevant)');
			Assert.areSame(false, $('#group1input2').is(':hidden'), 'relevant question should be visible');
		},*/


		test_relevantAnimationsGlitchFree: function() {
			var input = $('#input1');
			var question = $('#question1');
			Assert.isTrue(question.is(':visible'), 'relevant input should not be hidden');

			// quickly hide then show the control
			input.forces_attr('relevant', false).forces_attr('relevant', true);
			// 2011-02-26 need this delay or test fails
			this.wait(function() {}, 1);
			Assert.isTrue(question.is(':visible'), 'quickly become relevant failed (animation not stopped?)');

			// hide the control
			input.forces_attr('relevant', false);
			this.wait(function() {}, $.forces.MS_DISABLED);
			Assert.isFalse(question.is(':visible'), 'irrelevant input should be hidden');

			// quickly show then hide the control
			input.forces_attr('relevant', true).forces_attr('relevant', false);
			this.wait(function() {}, $.forces.MS_DISABLED);
			Assert.isFalse(question.is(':visible'), 'quickly become irrelevant failed (animation not stopped?)');
		},
		
		
		test_focusSetsActiveClassForInput: function() {
			Assert.areSame('tf-active', $.forces.CSS_ACTIVE);

			var classActive = $.forces.CSS_ACTIVE;
			var question1 = $('#question1');
			var question4 = $('#question4');

			Assert.areSame(false, question1.hasClass(classActive), 'input should not be active (default)');

			$('#input1').focus();
			Assert.areSame(true, question1.hasClass(classActive), 'input should be active onfocus');

			$('#input1').blur();
			Assert.areSame(true, question1.hasClass(classActive), 'input should remain active onblur');

			$('#input2').focus();
			Assert.areSame(false, question1.hasClass(classActive), 'input1 should not remain active when input2 is active');

			Assert.areSame(false, question4.hasClass(classActive), 'radio should not be active (default)');

			$('#radio1-A').focus();
			Assert.areSame(true, question4.hasClass(classActive), 'radio should be active onfocus');

			$('#radio1-A').blur();
			Assert.areSame(true, question4.hasClass(classActive), 'radio should remain active onblur');

			$('#radio1-B').focus();
			Assert.areSame(true, question4.hasClass(classActive), 'radio should remain active as focus moves through items');
			
			$('#input1').focus();
			Assert.areSame(false, question4.hasClass(classActive), 'radio should not remain active when another field is active');
		},


		test_focusSetsActiveClassForTextarea: function() {
			var classActive = $.forces.CSS_ACTIVE;
			var question = $('#question3');
			var field = $('#textarea1');

			Assert.areSame(false, question.hasClass(classActive));

			field.focus();
			Assert.areSame(true, question.hasClass(classActive));

			field.blur();
			Assert.areSame(true, question.hasClass(classActive));
			
			$('#input1').focus();
			Assert.areSame(false, question.hasClass(classActive));
		},


		test_focusSetsActiveClassForGroup: function() {
			var classActive = $.forces.CSS_ACTIVE;

			Assert.areSame(false, $('#question5').hasClass(classActive), 'group should not be active by default');
			Assert.areSame(false, $('#group1question1').hasClass(classActive), 'group1input1 in group should not be active by default');
			Assert.areSame(false, $('#group1question2').hasClass(classActive), 'group1input2 in group should not be active by default');
			Assert.areSame(0, $('#form').find('.' + classActive).length, 'nothing should be active');

			$('#group1input1').focus();
			Assert.areSame(true, $('#question5').hasClass(classActive), 'group should be active when group1input1 is active');
			Assert.areSame(true, $('#group1question1').hasClass(classActive), 'group1input1 should be active');
			Assert.areSame(false, $('#group1question2').hasClass(classActive), 'group1input2 should not be active when group1input1 is');
			Assert.areSame(2, $('#form').find('.' + classActive).length, 'group + input1 should be active');

			$('#group1input2').focus();
			Assert.areSame(true, $('#question5').hasClass(classActive), 'group should be active when group1input2 is active');
			Assert.areSame(false, $('#group1question1').hasClass(classActive), 'group1input1 should not be active when group1input2 is');
			Assert.areSame(true, $('#group1question2').hasClass(classActive), 'group1input2 should be active');
			Assert.areSame(2, $('#form').find('.' + classActive).length, 'group + input2 should be active');

			$('#input1').focus();
			Assert.areSame(false, $('#question5').hasClass(classActive), 'group should not be active');
			Assert.areSame(false, $('#group1question1').hasClass(classActive), 'group1input1 should not be active');
			Assert.areSame(false, $('#group1question2').hasClass(classActive), 'group1input2 should not be active');
			Assert.areSame(1, $('#form').find('.' + classActive).length, '1 input should be active');
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
						'<label for="input1"><span class="xf-label">Input?</span></label>' +
						'<input type="text" name="input1" id="input1" />' +
					'</li>' +
					'<li class="xf-textarea">' +
						'<label for="textarea1"><span class="xf-label">Textarea</span></label>' +
						'<textarea name="textarea1" id="textarea1" rows="3" cols="40"></textarea>' +
					'</li>' +
					'<li class="xf-input">' +
						'<label for="email"><span class="xf-label">Email:</span></label>' +
						'<input type="email" name="email" id="email" />' +
					'</li>' +
					'<li class="xf-input">' +
						'<label for="number"><span class="xf-label">Number:</span></label>' +
						'<input type="text" name="number" id="number" />' +
					'</li>' +
					'<li class="xf-input">' +
						'<label for="date"><span class="xf-label">Date</span></label>' +
						'<input type="text" name="date" id="date" />' +
					'</li>' +
					'<li class="xf-select1"><fieldset id="radio1">' +
						'<legend><span class="xf-label">Radio buttons</span></legend><ul class="xf-choices">' +
						'<li><label for="radio1-true"><input type="radio" name="radio1" id="radio1-true" value="true" />true</label></li>' +
						'<li><label for="radio1-false"><input type="radio" name="radio1" id="radio1-false" value="false" />false</label></li>' +
						'<li><label for="radio1-null"><input type="radio" name="radio1" id="radio1-null" value="" />Not specified</label></li>' +
					'</ul></fieldset></li>' +
					'<li><fieldset id="group1"><ol>' +
						'<li class="xf-input">' +
							'<label for="input2"><span class="xf-label">Input2</span></label>' +
							'<input type="text" name="input2" id="input2" />' +
						'</li>' +
					'</ol></fieldset></li>' +
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
			Assert.areSame('Unable to process this form', status.find('h1').text());
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
			var label = $('#input1').closest(':-xf-control').find(':-xf-label').text().replace(/[:?]*$/, ': ');
			Assert.areSame(0, status.find('li').text().indexOf(label), 'control label not shown in alert');
		},


		test_linkShownOnSubmitError: function() {
			$('#input1').forces_attr('required', true);
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame('#input1', status.find('a').attr('href').match(/#input1$/).toString(), 'validation alert not linked to control');
		},


		test_requiredAlertMessageDisplayed: function() {
			$('#input1,#textarea1,#email,#radio1').forces_attr('required', true);
			
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame(4, status.find('li').length, 'expected 4 alerts in status');
			Assert.areSame('Input: must be completed', status.find('li').eq(0).text());
			Assert.areSame('Textarea: must be completed', status.find('li').eq(1).text());
			Assert.areSame('Email: must be completed', status.find('li').eq(2).text());
			Assert.areSame('Radio buttons: must be completed', status.find('li').eq(3).text());
			Assert.areSame(1, $('#input1').closest(':-xf-control').find('.xf-alert').length, 'alert not present on input');
			Assert.areSame('must be completed', $('#input1').closest(':-xf-control').find('.xf-alert').text());
			Assert.areSame(1, $('#email').closest(':-xf-control').find('.xf-alert').length, 'alert not present on email');
			Assert.areSame('must be completed', $('#email').closest(':-xf-control').find('.xf-alert').text());
			Assert.areSame(1, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert not present on radio buttons');
			Assert.areSame('must be completed', $('#radio1').closest(':-xf-control').find('.xf-alert').text());

			$('#form').submit();
			Assert.areSame(1, $('#input1').closest(':-xf-control').find('.xf-alert').length, 'alert not present on input after submit');
			Assert.areSame('must be completed', $('#input1').closest(':-xf-control').find('.xf-alert').text());
			
			$('#radio1-true').click();
			$('#form').submit();
			Assert.areSame(0, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert still present on checked radio after submit');
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


		test_requiredInlineAlertMessageDisplayed: function() {
			$('#number,#radio1').forces_attr('required', true);

			Assert.areSame(0, $('#number').closest(':-xf-control').find('.xf-alert').length, 'alert (input) present before interation');
			Assert.areSame(0, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert (radio) present before interaction');

			$('#number').focus().val('foo').blur();
			Assert.areSame(0, $('#number').closest(':-xf-control').find('.xf-alert').length, 'alert (input) present when value is foo');
			$('#number').focus().val('').blur();
			Assert.areSame(1, $('#number').closest(':-xf-control').find('.xf-alert').length, 'alert (input) not present when value missing');
			Assert.areSame('must be completed', $('#number').closest(':-xf-control').find('.xf-alert').text(), 'wrong alert message (input)');

			$('#radio1-true').click().blur();
			Assert.areSame(0, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert (radio) present when value selected');
			$('#radio1-null').click().blur();
			Assert.areSame(1, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert (radio) not present when empty value selected');
			Assert.areSame('must be completed', $('#number').closest(':-xf-control').find('.xf-alert').text(), 'wrong alert message (radio)');
			$('#radio1-true').click().blur();
			Assert.areSame(0, $('#radio1').closest(':-xf-control').find('.xf-alert').length, 'alert (radio) present when value selected again');
		},


		test_invalidNumberMessageDisplayed: function() {
			$('#number').forces_attr('type', 'number').forces_attr('required', true);

			$('#form').submit();
			Assert.areSame('Number: must be completed', $('.tf-status').find('li').text(), 'required status alert not shown');
			Assert.areSame('must be completed', $('#number').closest(':-xf-control').find('.xf-alert').text(), 'required inline alert not shown');
			
			$('#number').val('abc');
			$('#form').submit();
			Assert.areSame('Number: must contain only digits', $('.tf-status').find('li').text(), 'invalid status alert not shown');
			Assert.areSame('must contain only digits', $('#number').closest(':-xf-control').find('.xf-alert').text(), 'invalid inline alert not shown');

			$('#number').val('12345');
			$('#form').submit();
			Assert.areSame(0, $('.tf-status').find('li').length, 'status alert still present');
			Assert.areSame(0, $('#number').closest(':-xf-control').find('.xf-alert').length, 'inline alert still present');
		},


		test_invalidEmailMessageDisplayed: function() {
			$('#email').forces_attr('type', 'email').forces_attr('required', true);

			$('#form').submit();
			Assert.areSame('Email: must be completed', $('.tf-status').find('li').text(), 'required status alert not shown');
			Assert.areSame('must be completed', $('#email').closest(':-xf-control').find('.xf-alert').text(), 'required inline alert not shown');
			
			$('#email').val('foo');
			$('#form').submit();
			Assert.areSame('Email: must contain an email address', $('.tf-status').find('li').text(), 'invalid status alert not shown');
			Assert.areSame('must contain an email address', $('#email').closest(':-xf-control').find('.xf-alert').text(), 'invalid inline alert not shown');

			$('#email').val('foo@example.com');
			$('#form').submit();
			Assert.areSame(0, $('.tf-status').find('li').length, 'status alert still present');
			Assert.areSame(0, $('#email').closest(':-xf-control').find('.xf-alert').length, 'inline alert still present');
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
		},
		

		test_invalidCustomMessageDisplayed: function() {
			$('#textarea1').forces_setCustomValidity('foo');
			$('#form').submit();
			Assert.areSame('Textarea: foo', $('.tf-status').find('li').text());
			Assert.areSame('foo', $('#textarea1').closest(':-xf-control').find('.xf-alert').text());
			
			$('#textarea1').forces_setCustomValidity('bar');
			$('#form').submit();
			Assert.areSame('Textarea: bar', $('.tf-status').find('li').text());
			Assert.areSame('bar', $('#textarea1').closest(':-xf-control').find('.xf-alert').text());

			$('#textarea1').forces_setCustomValidity('');
			$('#form').submit();
			Assert.areSame(0, $('.tf-status').find('li').length);
		},


		test_irrelevantMessagesNotDisplayed: function() {
			$('#input1,#input2').forces_attr('required', true).forces_validate();
			$('#group1').forces_attr('relevant', false);
			$('#form').submit();

			Assert.areSame(1, $('.tf-status').find('li').length, 'expected 1 alert');
			Assert.areSame('Input: must be completed', $('.tf-status').find('ol').text(), 'expected only relevant alert message');
		},


		test_shouldReuseExistingStatusAlertBlock: function() {
			$('#input1').forces_attr('required', true);
			
			$('.tf-form').before($.forces.HTML_STATUS());
			$('.tf-form').before('<div class="tf-status"><div class="tf-info inner">Test info box</div></div>');
			Assert.areSame(1, $('.tf-status > .tf-info').length, 'expected 1 info block before submit');
			Assert.areSame(1, $('.tf-status > .tf-alert').length, 'expected 1 alert block before submit');
			
			$('#form').submit();
			Assert.areSame(1, $('.tf-status > .tf-info').length, 'expected 1 info block after submit');
			Assert.areSame(1, $('.tf-status > .tf-alert').length, 'expected 1 alert block after submit');
			Assert.areSame(2, $('.tf-status').length, 'expected 2 status blocks after submit');
		},


		test_shouldListSubmitErrorsInSourceOrder: function() {
			$('#input1,#date').forces_attr('required', true);
			$('#email').forces_attr('type', 'email').val('foo');
			
			$('#form').submit();
			var status = $('div.tf-status');
			Assert.areSame('Input: must be completed', status.find('li').eq(0).text());
			Assert.areSame('Email: must contain an email address', status.find('li').eq(1).text());
			Assert.areSame('Date: must be completed', status.find('li').eq(2).text());
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUiUnitSuite);

});