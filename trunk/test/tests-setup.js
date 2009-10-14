Tester = YUI({ logInclude: { TestRunner: true } }).use('console-filters', 'test', function(Y){
	//initialize the console
	new Y.Console({
		logLevel: 'debug',
		height: '40em',
		newestOnTop: false,
		plugins: [ Y.Plugin.ConsoleFilters ]
	}).render('#log');
});
