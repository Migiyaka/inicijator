var inicijativaControllers = angular.module('inicijativaControllers', []);

inicijativaControllers.controller('mainCtrl', ['$scope', '$route', 'mainService',
	function($scope, $route, mainService) {
		$scope.$route = $route;
		
		mainService.getUserData().then(function success(results) {
			$scope.username = results.user.name;
		});
		
		$scope.loadUserProfile = function() {
			mainService.getUserData().then(function success(results) {
				mainService.loadProfile(results.user.id);
			});
		}
		
		$scope.logout = function() {
			mainService.logout();
		}
	}
]);

inicijativaControllers.controller('loginCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.submit = function() {
			if ($scope.email == '' || $scope.password == '') {
				$scope.alertClass = '';
				$scope.alertMessage = 'Molim Vas unesite vašu email adresu i šifru.';
			}
			else {
				$scope.alertClass = 'hidden';
				$scope.alertMessage = '';
			
				mainService.login($scope.email, $scope.password).then(function success(alert) {
					$scope.alertMessage = alert.message;
					$scope.alertClass = alert.class;
				});
			}
		}
		
		$scope.init = function() {
			$scope.pageTitle = 'Ulogujte se - Inicijator';
			$scope.headerClass = 'hidden';
			$scope.footerClass = 'hidden';
			$scope.alertClass = 'hidden';
			
			$scope.email = '';
			$scope.password = '';
			
			mainService.sharedFunction();
		}
	}	
]);

inicijativaControllers.controller('homeCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Glavna strana - Inicijator';
			$scope.headerClass = 'transparent-header';
			$scope.footerClass = '';
			
			mainService.sharedFunction();
		}
	}	
]);

inicijativaControllers.controller('listCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Lista - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			
			$scope.isError = false;
			
			$scope.keywords = '';
			$scope.categories = '';
			$scope.startdate_start = '';
			$scope.startdate_end = '';
			$scope.enddate_start = '';
			$scope.enddate_end = '';
			$scope.orderby = '';
			
			mainService.sharedFunction();
			mainService.listInitiatives().then(function success(results) {
				$scope.results = results;
				
				if ($scope.results.initiatives.length == 0 || $scope.results.type == 'error')
					$scope.isError = true;
				else
					$scope.isError = false;
			});
		}
		
		$scope.submit = function() {
			$scope.categories = (jQuery('#category').selectpicker('val') == null) ? '' : jQuery('#category').selectpicker('val');
			$scope.startdate_start = jQuery('#startdate_start').val();
			$scope.startdate_end = jQuery('#startdate_end').val();
			$scope.enddate_start = jQuery('#enddate_start').val();
			$scope.enddate_end = jQuery('#enddate_end').val();
			$scope.orderby = jQuery('#orderby').selectpicker('val');

			mainService.listInitiatives($scope.keywords, $scope.categories, $scope.startdate_start, $scope.startdate_end, $scope.enddate_start, $scope.enddate_end, $scope.orderby).then(function success(results) {
				$scope.results = results;
				
				if ($scope.results.type == 'error' || $scope.results.initiatives.length == 0)
					$scope.isError = true;
				else
					$scope.isError = false;
			});
		}
	}
]);

inicijativaControllers.controller('mapCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Mapa - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			
			mainService.sharedFunction();
			
			$scope.map = mainService.initGoogleMap();
			
			mainService.listInitiatives().then(function success(results) {
				$scope.results = results;
				mainService.setMarkers($scope.map, $scope.results, true);
			});
		}
	}
]);

inicijativaControllers.controller('createCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Pokreni - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			$scope.error = false;
			
			$scope.title = '';
			$scope.text = '';
			$scope.lat = '';
			$scope.lng = '';
			
			$scope.loading = false;
			$scope.buttonDisabled = false;
			
			mainService.sharedFunction();
			
			$scope.map = mainService.initGoogleMap();
			$scope.marker = null;
			
			$scope.map.addListener('click', function(event) {
				$scope.marker = mainService.googleMapClick(event, $scope.map, $scope.marker);
				$scope.lat = $scope.marker.position.lat();
				$scope.lng = $scope.marker.position.lng();
			});
		}
		
		$scope.submit = function() {
			if ($scope.title == '' || $scope.text == '' || $scope.lat == '' || $scope.lng == '' || jQuery('#enddate').val() == '' || jQuery('#image').fileinput('getFileStack')[0] == null) {
				$scope.error = true;
				$scope.errorMessage = 'Molim Vas popunite sva polja.';
			}
			else {
				$scope.loading = true;
				$scope.buttonDisabled = true;
				
				mainService.createInitiative($scope.title, $scope.text, jQuery('#enddate').val(), $scope.lat, $scope.lng).then(function success(results) {
					console.log(results);
					$scope.results = results;
					
					if ($scope.results.type == 'error') {
						$scope.errorMessage = 'Inicijativa nije uspešno kreirana.';
						$scope.error = true;
						$scope.loading = false;
						$scope.buttonDisabled = false;
					}
				});
			}
		}
	}
]);

inicijativaControllers.controller('singleCtrl', ['$scope', '$routeParams', 'mainService',
	function($scope, $routeParams, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Inicijativa - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			$scope.text = '';

			$scope.pageError = false;
			$scope.supportError = false;
			$scope.commentError = false; 
			
			mainService.sharedFunction();
			
			mainService.singleInitiative($routeParams.itemId).then(function success(results) {
				$scope.results = results;
				
				if ($scope.results.type == 'error' || $scope.results.initiative.length == 0) {
					$scope.pageError = true;
				}
				else {
					$scope.map = mainService.initGoogleMap();
					$scope.init = $scope.results.initiative;
					
					mainService.getUserData().then(function success(userData) {
						$scope.supportButton = !($scope.init.creator.id == userData.user.id);
					});
					
					mainService.setMarkers($scope.map, $scope.results);
				}
			});
		}
		
		$scope.support = function() {
			
			mainService.getUserData().then(function success(results) {
				var userId = results.user.id;
				var alreadySupported = false;
				console.log(userId);
				
				for (var i = 0; i < $scope.init.signatories.length; i++)
					if ($scope.init.signatories[i].id == userId)
						alreadySupported = true;
				
				if (!alreadySupported)
					mainService.supportInitiative($routeParams.itemId);
				else
					$scope.supportError = true;
			});
		}
		
		$scope.submit = function() {
			if ($scope.text == '')
				$scope.commentError = true;
			else {
				$scope.commentError = false;
				mainService.sendComment($routeParams.itemId, $scope.text)
			}
		}
		
		$scope.loadProfile = function(id) {
			mainService.loadProfile(id);
		}
	}
]);

inicijativaControllers.controller('profileCtrl', ['$scope', '$routeParams', 'mainService',
	function($scope, $routeParams, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Profil - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			
			$scope.pageError = false;
			$scope.createdError = false;
			$scope.supportedError = false;
			
			mainService.sharedFunction();
			
			mainService.getUserData($routeParams.userId, true).then(function success(results) {
				$scope.user = results.user;
				
				if ($scope.user.type == 'error' || $scope.user.id == null)
					$scope.pageError = true;
				
				if ($scope.user.createdInits.length == 0)
					$scope.createdError = true;
				
				if ($scope.user.supportedInits.length == 0)
					$scope.supportedError = true;
			});
		}
	}
]);

inicijativaControllers.controller('contactCtrl', ['$scope', 'mainService',
	function($scope, mainService) {
		
		$scope.init = function() {
			$scope.pageTitle = 'Kontakt - Inicijator';
			$scope.headerClass = '';
			$scope.footerClass = '';
			
			$scope.title = '';
			$scope.text = '';
			
			$scope.response = false;
			$scope.error = false;
			$scope.fillError = false;
			$scope.loading = false;
			$scope.buttonDisabled = false;
			
			mainService.sharedFunction();
		}
		
		$scope.submit = function() {
			$scope.response = false;
			$scope.fillError = false;
			
			if ($scope.title == '' || $scope.text == '')
				$scope.fillError = true;
			else {
				$scope.loading = true;
				$scope.buttonDisabled = true;

				mainService.sendEmail($scope.title, $scope.text).then(function success(response) {
					$scope.response = true;
					$scope.loading = false;
					$scope.buttonDisabled = false;
					
					if (response.type == 'error')
						$scope.error = true;
				});
			}
		}
	}
]);