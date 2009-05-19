//create the test suite
var TS_date = new YAHOO.tool.TestSuite("forces.date test suite"); 


var Assert = YAHOO.util.Assert;
var DateAssert = YAHOO.util.DateAssert;


// forces.dateFormat unit tests
var TC_dateFormat = new YAHOO.tool.TestCase({

	name: "forces.dateFormat unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		epoch = new Date(1970, 0, 1); // 1 January 1970
		releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1975
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
});


// forces.dateParse unit tests
var TC_dateParse = new YAHOO.tool.TestCase({

	name: "forces.dateParse unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		epoch = new Date(1970, 0, 1); // 1 January 1970
		releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1975
	},

	tearDown: function () {
		delete epoch;
		delete releaseStarWarsIV;
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_dmyyyy_slash: function () {
		DateAssert.datesAreEqual(epoch, $.forces.dateParse('1/1/1970'));
		DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25/5/1977'));
	},
	test_ddmmyyyy_slash: function () {
		DateAssert.datesAreEqual(epoch, $.forces.dateParse('01/01/1970'));
		DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25/05/1977'));
	},
	test_dmy_space: function () {
		DateAssert.datesAreEqual(epoch, $.forces.dateParse('1 1 1970'));
		DateAssert.datesAreEqual(releaseStarWarsIV, $.forces.dateParse('25 5 1977'));
	}
});


// forces.TC_dateCalc unit tests
var TC_dateCalc = new YAHOO.tool.TestCase({

	name: "forces.TC_dateCalc unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1975
	},

	tearDown: function () {
		delete releaseStarWarsIV;
	},

	//---------------------------------------------
	// Tests
	//---------------------------------------------

	test_plus1day: function () {
		DateAssert.datesAreEqual(new Date(1977, 4, 26), $.forces.dateCalc(releaseStarWarsIV, {date:1}));
	},
	test_plus30days: function () {
		DateAssert.datesAreEqual(new Date(1977, 5, 24), $.forces.dateCalc(releaseStarWarsIV, {date:30}));
	},
	test_plus1month: function () {
		DateAssert.datesAreEqual(new Date(1977, 5, 25), $.forces.dateCalc(releaseStarWarsIV, {month:1}));
	},
	test_plus12months: function () {
		DateAssert.datesAreEqual(new Date(1978, 4, 25), $.forces.dateCalc(releaseStarWarsIV, {month:12}));
	},
	test_plus1year: function () {
		DateAssert.datesAreEqual(new Date(1978, 4, 25), $.forces.dateCalc(releaseStarWarsIV, {year:1}));
	},
	test_minus1day: function () {
		DateAssert.datesAreEqual(new Date(1977, 4, 24), $.forces.dateCalc(releaseStarWarsIV, {date:-1}));
	},
	test_minus30days: function () {
		DateAssert.datesAreEqual(new Date(1977, 3, 25), $.forces.dateCalc(releaseStarWarsIV, {date:-30}));
	},
	test_minus1month: function () {
		DateAssert.datesAreEqual(new Date(1977, 3, 25), $.forces.dateCalc(releaseStarWarsIV, {month:-1}));
	},
	test_minus12months: function () {
		DateAssert.datesAreEqual(new Date(1976, 4, 25), $.forces.dateCalc(releaseStarWarsIV, {month:-12}));
	},
	test_minus1year: function () {
		DateAssert.datesAreEqual(new Date(1976, 4, 25), $.forces.dateCalc(releaseStarWarsIV, {year:-1}));
	}
});


// forces.dateEquals unit tests
var TC_dateEquals = new YAHOO.tool.TestCase({

	name: "forces.dateEquals unit tests",

	//---------------------------------------------
	// Setup and tear down
	//---------------------------------------------

	setUp: function () {
		releaseStarWarsIV = new Date(1977, 4, 25); // 25 May 1975
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
});


//add test cases
TS_date.add(TC_dateFormat);
TS_date.add(TC_dateParse);
TS_date.add(TC_dateCalc);
TS_date.add(TC_dateEquals);
