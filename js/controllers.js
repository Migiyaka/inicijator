var inicijativaControllers = angular.module('inicijativaControllers', []);

inicijativaControllers.controller('mainCtrl', ['$scope', '$route', 'mainService',
	function($scope, $route, mainService) {
		$scope.$route = $route;
		
		mainService.getUserData().then(function success(userData) {
			$scope.username = userData.user.name;
		});
		
		$scope.loadUserProfile = function() {
			mainService.getUserData().then(function success(userData) {
				mainService.loadProfile(userData.user.id);
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
			$scope.startdate_start = '';
			$scope.startdate_end = '';
			$scope.enddate_start = '';
			$scope.enddate_end = '';
			
			mainService.sharedFunction();
			mainService.listInitiatives('', true).then(function success(results) {
				$scope.results = results;
				
				if ($scope.results.initiatives.length == 0 || $scope.results.type == 'error')
					$scope.isError = true;
				else
					$scope.isError = false;
			});
		}
		
		$scope.submit = function() {
			$scope.startdate_start = jQuery('#startdate_start').val();
			$scope.startdate_end = jQuery('#startdate_end').val();
			$scope.enddate_start = jQuery('#enddate_start').val();
			$scope.enddate_end = jQuery('#enddate_end').val();
			
			var data = '';
			data += ($scope.keywords != '') ? 'keywords::' + $scope.keywords + '##' : '';
			data += (jQuery('#category').selectpicker('val') != null) ? 'categories::' + jQuery('#category').selectpicker('val') + '##' : '';
			data += ($scope.startdate_start != '') ? 'startdate_start::' + $scope.startdate_start + '##' : '';
			data += ($scope.startdate_end != '') ? 'startdate_end::' + $scope.startdate_end + '##' : '';
			data += ($scope.enddate_start != '') ? 'enddate_start::' + $scope.enddate_start + '##' : '';
			data += ($scope.enddate_end != '') ? 'enddate_end::' + $scope.enddate_end + '##' : '';
			data += (jQuery('#orderby').selectpicker('val') != null) ? 'orderby::' + jQuery('#orderby').selectpicker('val') + '##' : '';

			mainService.listInitiatives(data, true).then(function success(results) {
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
			
			mainService.listInitiatives('', true).then(function success(results) {
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
			
			mainService.listInitiatives('id::' + $routeParams.itemId + '##').then(function success(results) {
				$scope.results = results;
				
				if ($scope.results.type == 'error' || $scope.results.initiatives.length == 0) {
					$scope.pageError = true;
				}
				else {
					$scope.map = mainService.initGoogleMap();
					$scope.initOver = $scope.results.initiatives[0].isOver;
					
					mainService.getUserData().then(function success(userData) {
						$scope.supportButton = !($scope.results.users[0].id == userData.user.id);
					});
					
					mainService.setMarkers($scope.map, $scope.results);
				}
			});
		}
		
		$scope.support = function() {
			
			mainService.getUserData().then(function success(userData) {
				var userId = userData.user.id;
				var alreadySupported = false;
				
				for (var i = 0; i < $scope.results.signatories.length; i++)
					for (var j = 0; j < $scope.results.signatories[i].length; j++)
						if ($scope.results.signatories[i][j].id == userId)
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
			
			mainService.getUserData($routeParams.userId, true).then(function success(userData) {
				$scope.userData = userData;
				
				if ($scope.userData.type == 'error' || $scope.userData.user.id == null)
					$scope.pageError = true;
				
				if ($scope.userData.createdInits.length == 0)
					$scope.createdError = true;
				
				if ($scope.userData.supportedInits.length == 0)
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