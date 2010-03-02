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
				'<select id="select1"></select>' +
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
			var select = $('#select1').forces_toRange();
			
			Assert.areSame('input', select.get(0).tagName.toLowerCase());
			// only works in browsers supporting HTML5 range controls
			// Assert.areSame('range', select.attr('type'));
		}

	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.FormRangeUnitSuite);

});