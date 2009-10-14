Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormUiUnitSuite = new Y.Test.Suite("forces.forms.ui unit test suite"); 

	// form objects unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form objects unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="#form"><ol class="ftw-questions">' +
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

	// form validation UI unit tests
	Y.forces.test.FormUiUnitSuite.add(new Y.Test.Case({
		name: "Form validation UI unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="#form"><ol class="ftw-questions">' +
					'<li class="xf-input" id="input01-container"><label for="input01" id="label-input"><span class="xf-label">Input</span></label>' +
					'<input type="text" name="input01" id="input01" /></li>' +
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
			$('#form').trigger($.forces.EVENT_SUBMIT_ERROR);
			var status = $('#form-container').prev('div');
			Assert.areSame(true, status.is('div.tf-status'), 'div.tf-status not found');
			Assert.areSame(true, status.children().is('div.tf-alert'), 'div.tf-status > div.tf-alert not found');
			Assert.areSame(1, status.find('h1').length, 'h1 not found');
			Assert.areSame('Unable to submit form', status.find('h1').text());
			// clean up
			status.remove();
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormUiUnitSuite);

});