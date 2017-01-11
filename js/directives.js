var inicijativaDirectives = angular.module('inicijativaDirectives', []);

inicijativaDirectives.directive('delayedScripts', ['mainService', 
	function(mainService) {
		return function(scope) {
			if (scope.$last) {
				mainService.customjQuery();
			}
		}
	}
]);