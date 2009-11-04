Tester.use('console', 'test', function(Y){
	var Assert = Y.Assert;
	var DateAssert = Y.DateAssert;

	Y.namespace('forces.test');

	//create the test suite
	Y.forces.test.DateUnitSuite = new Y.Test.Suite("forces.date test suite"); 

	// forces.dateFormat unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.dateFormat unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			epoch = new Date(1970, 0, 1); // 1 January 1970
			releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1977
		},

		tearDown: function () {
			delete epoch;
			delete releaseStarWarsIV;
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_YYYY: function () {
			Assert.areSame('1970', $.forces.dateFormat(epoch, 'YYYY'));
			Assert.areSame('1977', $.forces.dateFormat(releaseStarWarsIV, 'YYYY'));
		},
		test_yyyy: function () {
			Assert.areSame('1970', $.forces.dateFormat(epoch, 'yyyy'));
			Assert.areSame('1977', $.forces.dateFormat(releaseStarWarsIV, 'yyyy'));
		},
		test_percentY: function () {
			Assert.areSame('1970', $.forces.dateFormat(epoch, '%Y'));
			Assert.areSame('1977', $.forces.dateFormat(releaseStarWarsIV, '%Y'));
		},
		test_MM: function () {
			Assert.areSame('01', $.forces.dateFormat(epoch, 'MM'));
			Assert.areSame('05', $.forces.dateFormat(releaseStarWarsIV, 'MM'));
		},
		test_percentm: function () {
			Assert.areSame('01', $.forces.dateFormat(epoch, '%m'));
			Assert.areSame('05', $.forces.dateFormat(releaseStarWarsIV, '%m'));
		},
		test_dd: function () {
			Assert.areSame('01', $.forces.dateFormat(epoch, 'dd'));
			Assert.areSame('25', $.forces.dateFormat(releaseStarWarsIV, 'dd'));
		},
		test_percentd: function () {
			Assert.areSame('01', $.forces.dateFormat(epoch, '%d'));
			Assert.areSame('25', $.forces.dateFormat(releaseStarWarsIV, '%d'));
		},
		test_percente: function () {
			Assert.areSame(' 1', $.forces.dateFormat(epoch, '%e'));
			Assert.areSame('25', $.forces.dateFormat(releaseStarWarsIV, '%e'));
		},
		test_d: function () {
			Assert.areSame('1', $.forces.dateFormat(epoch, 'd'));
			Assert.areSame('25', $.forces.dateFormat(releaseStarWarsIV, 'd'));
		},
		test_percentB: function () {
			Assert.areSame('January', $.forces.dateFormat(epoch, '%B'));
			Assert.areSame('May', $.forces.dateFormat(releaseStarWarsIV, '%B'));
		},
		test_percentA: function () {
			Assert.areSame('Thursday', $.forces.dateFormat(epoch, '%A'));
			Assert.areSame('Wednesday', $.forces.dateFormat(releaseStarWarsIV, '%A'));
		}
	}));


	// forces.dateParse unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.dateParse unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			epoch = new Date(1970, 0, 1); // 1 January 1970
			releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1977
		},

		tearDown: function () {
			delete epoch;
			delete releaseStarWarsIV;
		},
		
		_should: {
			fail: {
				test_error_dmyyy_slash: true
			}
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_dmyyyy_slash: function () {
			Assert.isInstanceOf(Date, $.forces.dateParse('25/5/1977'));
			DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25/5/1977'));
			DateAssert.datesAreEqual(epoch, $.forces.dateParse('1/1/1970'));
		},
		test_ddmmyyyy_slash: function () {
			Assert.isInstanceOf(Date, $.forces.dateParse('25/05/1977'));
			DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25/05/1977'));
			DateAssert.datesAreEqual(epoch, $.forces.dateParse('01/01/1970'));
		},
		test_dmy_space: function () {
			Assert.isInstanceOf(Date, $.forces.dateParse('25 5 1977'));
			DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25 5 1977'));
			DateAssert.datesAreEqual(epoch, $.forces.dateParse('1 1 1970'));
		},
		test_error_dmyyy_slash: function() {
			Assert.isInstanceOf(Date, $.forces.dateParse('25/5/077'));
		}

	}));


	// forces.TC_dateCalc unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.TC_dateCalc unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1977
			releaseStarWarsIVplusOneDay = new Date(1977, 4, 26); // 26 May 1977
			releaseStarWarsIVplusThirtyDays = new Date(1977, 5, 24); // 24 June 1977
			releaseStarWarsIVplusOneMonth = new Date(1977, 5, 25); // 25 June 1977
			releaseStarWarsIVplusTwelveMonths = new Date(1978, 4, 25); // 25 May 1978
			releaseStarWarsIVplusOneYear = new Date(1978, 4, 25); // 26 May 1978
			releaseStarWarsIVminusOneDay = new Date(1977, 4, 24); // 24 May 1977
			releaseStarWarsIVminusThirtyDays = new Date(1977, 3, 25); // 25 April 1977
			releaseStarWarsIVminusOneMonth = new Date(1977, 3, 25); // 25 April 1977
			releaseStarWarsIVminusTwelveMonths = new Date(1976, 4, 25); // 25 May 1976
			releaseStarWarsIVminusOneYear = new Date(1976, 4, 25); // 26 May 1976
		},

		tearDown: function () {
			delete releaseStarWarsIV;
			delete releaseStarWarsIVplusOneDay;
			delete releaseStarWarsIVplusThirtyDays;
			delete releaseStarWarsIVplusOneMonth;
			delete releaseStarWarsIVplusTwelveMonths;
			delete releaseStarWarsIVplusOneYear;
			delete releaseStarWarsIVminusOneDay;
			delete releaseStarWarsIVminusThirtyDays;
			delete releaseStarWarsIVminusOneMonth;
			delete releaseStarWarsIVminusTwelveMonths;
			delete releaseStarWarsIVminusOneYear;
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_plusOneDday: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVplusOneDay, $.forces.dateCalc(releaseStarWarsIV, {date:1}));
		},
		test_plusThirtyDays: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVplusThirtyDays, $.forces.dateCalc(releaseStarWarsIV, {date:30}));
		},
		test_plusOneMonth: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVplusOneMonth, $.forces.dateCalc(releaseStarWarsIV, {month:1}));
		},
		test_plusTwelveMonths: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVplusTwelveMonths, $.forces.dateCalc(releaseStarWarsIV, {month:12}));
		},
		test_plusOneYear: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVplusOneYear, $.forces.dateCalc(releaseStarWarsIV, {year:1}));
		},
		test_minusOneDay: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVminusOneDay, $.forces.dateCalc(releaseStarWarsIV, {date:-1}));
		},
		test_minusThirtyDays: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVminusThirtyDays, $.forces.dateCalc(releaseStarWarsIV, {date:-30}));
		},
		test_minusOneMonth: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVminusOneMonth, $.forces.dateCalc(releaseStarWarsIV, {month:-1}));
		},
		test_minusTwelveMonths: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVminusTwelveMonths, $.forces.dateCalc(releaseStarWarsIV, {month:-12}));
		},
		test_minusOneYear: function () {
			DateAssert.datesAreEqual(releaseStarWarsIVminusOneYear, $.forces.dateCalc(releaseStarWarsIV, {year:-1}));
		}
	}));


	// forces.dateEquals unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.dateEquals unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1977
		},

		tearDown: function () {
			delete releaseStarWarsIV;
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_equals: function () {
			Assert.areSame(true, $.forces.dateEquals(releaseStarWarsIV, 1977, 5, 25));
		},
		test_notEquals: function () {
			Assert.areSame(false, $.forces.dateEquals(releaseStarWarsIV, 1977, 4, 25));
		}
	}));


	// forces.DATE_TODAY unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.DATE_TODAY unit tests",

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_isToday: function () {
			DateAssert.datesAreEqual(new Date(), $.forces.DATE_TODAY());
		}
	}));


	// forces.DATE_TODAY unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.DATE_TODAY unit tests",

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_isToday: function () {
			DateAssert.datesAreEqual(new Date(), $.forces.DATE_TODAY());
		}
	}));


	// forces.WEEKDAYS unit tests
	Y.forces.test.DateUnitSuite.add(new Y.Test.Case({

		name: "forces.WEEKDAYS unit tests",

		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------

		setUp: function () {
			releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1977
		},

		tearDown: function () {
			delete releaseStarWarsIV;
		},

		//---------------------------------------------
		// Tests
		//---------------------------------------------

		test_areWeekdaysCorrect: function () {
			Assert.areSame("Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday", $.forces.WEEKDAYS().join(', '));
			Assert.areSame("Wednesday", $.forces.WEEKDAYS()[releaseStarWarsIV.getDay()]);
		}
	}));


	//add the test suite
	Y.Test.Runner.add(Y.forces.test.DateUnitSuite);

});