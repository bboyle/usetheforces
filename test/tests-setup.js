Tester = YUI({ logInclude: { TestRunner: true } }).use('console-filters', 'test', function(Y) {
	//initialize the console
	new Y.Console({
		logLevel: 'debug',
		height: '40em',
		newestOnTop: false,
		plugins: [ Y.Plugin.ConsoleFilters ]
	}).render('#log');

	$('body').addClass('yui3-skin-sam');
});

document.write('<script type="text/javascript" src="unit/date.js"></script>');
document.write('<script type="text/javascript" src="unit/dom.js"></script>');
document.write('<script type="text/javascript" src="unit/forms.js"></script>');
document.write('<script type="text/javascript" src="unit/forms.validate.js"></script>');
document.write('<script type="text/javascript" src="unit/forms.ui.js"></script>');
document.write('<script type="text/javascript" src="unit/forms.range.js"></script>');
document.write('<script type="text/javascript" src="integration/forms.js"></script>');
