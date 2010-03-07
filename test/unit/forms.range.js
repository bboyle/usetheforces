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
				'<select id="select1">' +
					'<option value="1">one</option>' +
					'<option value="2">two</option>' +
					'<option value="3">three</option>' +
				'</select>' +
				'<select id="select2">' +
					'<option>0.2</option>' +
					'<option>0.1</option>' +
					'<option>0.5</option>' +
				'</select>' +
				'<select id="select3">' +
					'<option value="1">one</option>' +
					'<option value="abc">abc</option>' +
					'<option value="3">three</option>' +
				'</select>' +
				'</div>' +
				'</form>' +
				'</div>'
			).appendTo('body');
		},


		tearDown: function() {
			$('#form-container').remove();
		},


		//---------------------------------------------
		// Tests
		//---------------------------------------------


		test_selectToRange: function() {
			var isRangeSupported = $('<input type="range" />').attr('type') == 'range';
			var select = $('#select1,#select2,#select3').forces_toRange();
			
			if (isRangeSupported) {
				Y.log('Input type range IS supported in this browser', 'info', 'TestRunner');
				
				Assert.areSame('input', select.get(0).tagName.toLowerCase(), 'expected range: 1, 2, 3');
				Assert.areSame('input', select.get(1).tagName.toLowerCase(), 'expected range: 0.1, 0.2, 0.5');
				Assert.areSame('select', select.get(2).tagName.toLowerCase(), 'expected select (abc)');
				
			} else {
				Y.log('Input type range IS NOT supported in this browser', 'info', 'TestRunner');
				
				Assert.areSame('select', select.get(0).tagName.toLowerCase());
				Assert.areSame('select', select.get(1).tagName.toLowerCase());
				Assert.areSame('select', select.get(2).tagName.toLowerCase());
				
			}
		}

	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormRangeUnitSuite);

});