
var inicijativaApp = angular.module('inicijativaApp', [
	'ngRoute',
	'ngFileUpload',
	'ngSanitize',
	'inicijativaControllers',
	'inicijativaDirectives'
]);

inicijativaApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'views/login.html',
			controller: 'loginCtrl'
		}).
		when('/home', {
			templateUrl: 'views/home.html',
			controller: 'homeCtrl'
		}).
		when('/list', {
			templateUrl: 'views/list.html',
			controller: 'listCtrl'
		}).
		when('/single/:itemId', {
			templateUrl: 'views/single.html',
			controller: 'singleCtrl'
		}).
		when('/map', {
			templateUrl: 'views/map.html',
			controller: 'mapCtrl'
		}).
		when('/create', {
			templateUrl: 'views/create.html',
			controller: 'createCtrl'
		}).
		when('/profile/:userId', {
			templateUrl: 'views/profile.html',
			controller: 'profileCtrl'
		}).
		when('/contact', {
			templateUrl: 'views/contact.html',
			controller: 'contactCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);

inicijativaApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
  	
    $rootScope.$on('$locationChangeStart', function($event, changeTo, changeFrom) {
      	if (changeTo == changeFrom) {
        	return;
      	}

		angular.element(document.querySelector('#wrapper')).addClass('invisible');
      
      	window.location.assign(changeTo);
      	window.location.reload(true);
    });
}]);