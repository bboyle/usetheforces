Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.DomUnitSuite = new Y.Test.Suite("forces.dom test suite"); 

	Y.forces.test.DomUnitSuite.add(new Y.Test.Case({

		name: "$.forces_id() unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function() {
			$('<div id="test">foo</div><div class="noid">noid</div><div id="test-1">bar</div>').appendTo('body');
		},

		tearDown: function() {
			$('#test, #test-1, .noid').remove();
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_returnsId: function() {
			Assert.areSame('test', $('#test').forces_id());
		},

		test_createsId: function() {
			Assert.areSame($('.noid').forces_id(), $('.noid').attr('id'));
			Assert.isNotNull($('.noid').attr('id'));
		},

		test_doesNotOverwriteId: function() {
			Assert.areSame('test', $('#test').forces_id());
			Assert.areSame(document.getElementById('test'), $('#test').get(0));
		},

		test_usesSuggestedId: function() {
			$('.noid').forces_id('foo');
			Assert.areSame('foo', $('.noid').attr('id'));
		},
		
		test_avoidsConflictsWithSuggestedIds: function() {
			var id = $('.noid').forces_id('test');
			Assert.areNotSame('test', id);
			Assert.areNotSame(document.getElementById(id), document.getElementById('test'));
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.DomUnitSuite);

});