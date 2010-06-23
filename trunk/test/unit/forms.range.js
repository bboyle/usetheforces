Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.FormRangeUnitSuite = new Y.Test.Suite("forces.forms.range unit test suite"); 

	// form objects unit tests
	Y.forces.test.FormRangeUnitSuite.add(new Y.Test.Case({
		name: "Form range unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$(
				'<div id="form-container" class="tf-form">'+
				'<form id="form" action="#form" onsubmit="return false">' +
				'<div>' +
				'<select id="select1" name="form.selectOne" class="red blue">' +
					'<option value="1">one</option>' +
					'<option value="2" selected="selected">two</option>' +
					'<option value="3">three</option>' +
					'<option value="10">ten</option>' +
				'</select>' +
				'<select id="select2" name="form.selectTwo" title="test select list">' +
					'<option>0.2</option>' +
					'<option>0.5</option>' +
					'<option>0.1</option>' +
				'</select>' +
				'<select id="select3" name="form.selectThree">' +
					'<option value="1">one</option>' +
					'<option value="abc">abc</option>' +
					'<option value="3">three</option>' +
				'</select>' +
				'</div>' +
				'</form>' +
				'</div>'
			).appendTo('body');
			isRangeSupported = $('<input type="range" />').attr('type') == 'range';
		},


		tearDown: function() {
			$('#form-container').remove();
			delete isRangeSupported;
		},


		//---------------------------------------------
		// Tests
		//---------------------------------------------


		test_selectToRange: function() {
			var select = $('#select1,#select2,#select3').forces_toRange();
			
			if (isRangeSupported) {
				Y.log('Input type range IS supported in this browser', 'info', 'TestRunner');
				
				Assert.areSame('input', $('form > div > *').get(0).tagName.toLowerCase(), 'expected range: 1, 2, 3, 10');
				Assert.areSame('input', $('form > div > *').get(1).tagName.toLowerCase(), 'expected range: 0.1, 0.2, 0.5');
				Assert.areSame('select', $('form > div > *').get(2).tagName.toLowerCase(), 'expected select (abc)');
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
				
				Assert.areSame('select', select.get(0).tagName.toLowerCase());
				Assert.areSame('select', select.get(1).tagName.toLowerCase());
				Assert.areSame('select', select.get(2).tagName.toLowerCase());
				
			}
		},
		
		test_minAttributeDeterminedFromOptionValue: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('1', select.eq(0).attr('min'));
				Assert.areSame('0.1', select.eq(1).attr('min'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_maxAttributeDeterminedFromOptionValue: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('10', select.eq(0).attr('max'));
				Assert.areSame('0.5', select.eq(1).attr('max'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_stepAttributeDeterminedFromOptionValues: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('1', select.eq(0).attr('step'));
				Assert.areSame('0.1', select.eq(1).attr('step'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_valueAttributeDeterminedFromSelectedOptionValue: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('2', select.eq(0).val());
				Assert.areSame('0.2', select.eq(1).val());
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_idAttributeCopiedFromSelect: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('select1', select.eq(0).attr('id'));
				Assert.areSame('select2', select.eq(1).attr('id'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_nameAttributeCopiedFromSelect: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('form.selectOne', select.eq(0).attr('name'));
				Assert.areSame('form.selectTwo', select.eq(1).attr('name'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_classAttributeCopiedFromSelect: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('red blue', select.eq(0).attr('class'));
				Assert.areSame(true, select.eq(0).hasClass('red'));
				Assert.areSame('', select.eq(1).attr('class'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		},
		
		test_titleAttributeCopiedFromSelect: function() {
			if (isRangeSupported) {
				
				var select = $('#select1,#select2').forces_toRange();
				Assert.areSame('', select.eq(0).attr('title'));
				Assert.areSame('test select list', select.eq(1).attr('title'));
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'warn', 'TestRunner');
			}
		}

	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormRangeUnitSuite);

});