Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.XpathUnitSuite = new Y.Test.Suite("forces.xpath test suite"); 

	// forces.dateFormat unit tests
	Y.forces.test.XpathUnitSuite.add(new Y.Test.Case({

		name: "forces.generateId unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$('<div id="test"></div>').appendTo('body');
		},

		tearDown: function() {
			$('#test').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_generateId: function () {
			for (var i = 0; i < 100; i++) {
				Assert.areSame(null, document.getElementById($.forces.generateId()));
			}
			var id = $.forces.generateId();
			Assert.areSame(null, document.getElementById(id));
			var div = $('<div>' + id + '</div>').attr('id', id).appendTo('#test');
			Assert.areSame(div.get(0), document.getElementById(id), 'unable to find element with generated id');
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.XpathUnitSuite);

});