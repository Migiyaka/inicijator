inicijativaApp.factory('mainService', ['$http', '$location', '$window', '$sanitize', 'Upload',
	function($http, $location, $window, $sanitize, Upload) {
		
		var ajaxUrl = $location.protocol() + '://' + $location.host() + '/inicijator-server/server.php';
		var ajaxHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
		var service = {};
		
		//function that gets called between all of the controllers
		service.sharedFunction = function() {
			pluginsScript();
			bsSelectScript();
			bsFilestyleScript();
			momentScript();
			datepickerScript();
			functionsScript();
			
			service.customjQuery();
			service.redirectPage();
		}
		
		service.initGoogleMap = function() {
			var googleMap = new google.maps.Map(document.getElementById('google-map'), {
				zoom: 14,
				center: {lat: 43.3214956, lng: 21.907},
				disableDefaultUI: true	
			});
			
			return googleMap;
		}
		
		service.googleMapClick = function(event, map, marker) {
			if (marker == null)
				marker = new google.maps.Marker({
					position: event.latLng,
					map: map,
					draggable: true
				});
			else
				marker.setPosition(event.latLng);
			
			map.panTo(event.latLng);
			return marker;
		}
		
		service.setMarkers = function(map, markerContent, bigMap) {
			if (typeof bigMap === undefined) bigMap = false;
			
			var infoWindow = new google.maps.InfoWindow();
			var initiatives = (markerContent.initiative != undefined) ? [markerContent.initiative] : markerContent.initiatives;
			
			for (var i = 0; i < initiatives.length; i++) {
				var position = { lat: parseFloat(initiatives[i].lat), lng: parseFloat(initiatives[i].lng) };
				
				var markerIcon = (bigMap) ? { url: 'img/icons/' + initiatives[i].category + '.png', scaledSize: new google.maps.Size(24, 24) } : '';
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: markerIcon
				});
				
				if (bigMap) {
					var infoContent = 	'<div class="gmap-info-content">' +
											'<h4 class="gmap-info-title">' + initiatives[i].title + '</h4>' +
											'<div class="gmap-info-boxes">' +
												'<span><i class="icon-user"></i><a href="#/profile/' + initiatives[i].creator.id + '">' + initiatives[i].creator.name + ' ' + initiatives[i].creator.surname + '</a></span>' +
												'<span><i class="icon-calendar3"></i>' + initiatives[i].start_date + ' do ' + initiatives[i].end_date + '</span>' +
												'<span><i class="icon-thumbs-up"></i>' + initiatives[i].sig_num + '</span>' +
											'</div>' +
											'<p class="gmap-info-text">' + initiatives[i].textExcerpt + '<a href="#/single/' + initiatives[i].id + '"> Detaljnije</a></p>' +
										'</div>';
					
					marker.customContent = infoContent;
					google.maps.event.addListener(marker, 'click', (function(marker) {
						return function() {
							infoWindow.setContent(marker.customContent);
							infoWindow.open(map, marker);
							map.panTo(marker.position);
						}
					})(marker));
				}
				else
					map.panTo(position);
			}
		}

		service.login = function(email, password) {
			
			return $http({
		
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'login', email: email, password: password }),
				headers : ajaxHeaders
						
			}).then(function success(response) {
				var alert = {message: '', class: 'hidden'};
				
				if (response.data.type == 'success') {
					$location.path('/home');
				}
				else {
					alert.message = response.data.message;
					alert.class = '';
				}
				
				return alert;
			});
		}
		
		service.logout = function() {
			$http({
		
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'logout' }),
				headers: ajaxHeaders
				
			}).then(function success(response) {
				$location.path('/');
			});
		}
		
		service.getUserData = function(userId, getInitiatives) {
			if (typeof userId === undefined) userId = '';
			if (typeof getInitiatives === undefined) getInitiatives = false;
			
			return $http({
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'getUserData', userId: userId, getInitiatives: getInitiatives }),
				headers: ajaxHeaders
			}).then(function success(response) {
				return response.data;
			});
		}
		
		//redirect from login to home page if logged in, redirect to login page from any page if not logged in
		service.redirectPage = function() {
			service.getUserData().then(function success(results) {
				if ($location.path() == '/' && results.user.id != undefined)
					$location.path('/home');
				else if (results.user.id == undefined)
					$location.path('/');
			});
		}
		
		//load the initiatives on the list page
		service.listInitiatives = function(keywords, categories, startdate_start, startdate_end, enddate_start, enddate_end, orderby) {
			if (typeof keywords === undefined) keywords = '';
			if (typeof categories === undefined) categories = '';
			if (typeof startdate_start === undefined) startdate_start = '';
			if (typeof startdate_end === undefined) startdate_end = '';
			if (typeof enddate_start === undefined) enddate_start = '';
			if (typeof enddate_end === undefined) enddate_end = '';
			if (typeof orderby === undefined) orderby = '';
			
			return $http({
		
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'listInitiatives', keywords: keywords, categories: categories, startdate_start: startdate_start, startdate_end: startdate_end, enddate_start: enddate_start, enddate_end: enddate_end, orderby: orderby }),
				headers: ajaxHeaders
				
			}).then(function success(response) {
				return response.data;
			});
		}
		
		service.singleInitiative = function(id) {
			return $http({
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'singleInitiative', id: id }),
				headers: ajaxHeaders
			}).then(function success(response) {
				console.log(response.data);
				return response.data;
			});
		}
		
		service.createInitiative = function(title, text, end_date, lat, lng) {
			return Upload.upload({
				url: ajaxUrl,
				data: { action: 'createInitiative', category: jQuery('#category').selectpicker('val'), end_date: end_date, title: $sanitize(title), text: $sanitize(text), lat: lat, lng: lng, image: jQuery('#image').fileinput('getFileStack')[0] }
			}).then(function success(response) {
				if (response.data.type == 'success')
					$location.path('/list');
				else
					return response.data;
			});
		}
		
		service.supportInitiative = function(initId) {
			return $http({
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'supportInitiative', initId: initId }),
				headers: ajaxHeaders
			}).then(function success(response) {
				window.location.reload(true);
			});
		}
		
		service.sendComment = function(initId, text) {
			return $http({
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'sendComment', initId: initId, text: $sanitize(text) }),
				headers: ajaxHeaders
			}).then(function success(response) {
				window.location.reload(true);
			});
		}
		
		service.sendEmail = function(title, text) {
			return $http({
				method: 'POST',
				url: ajaxUrl,
				data: jQuery.param({ action: 'sendEmail', title: $sanitize(title), text: $sanitize(text) }),
				headers: ajaxHeaders
			}).then(function success(response) {
				if (response.data.type == 'error')
					console.log(response.data.error);
				return response.data;
			});
		}
		
		service.loadProfile = function(id) {
			$location.path('/profile/' + id);
		}
		
		service.customjQuery = function() {
			(function($) {
				$(document).ready(function() {
					
					$('.category-select').selectpicker({
						noneSelectedText: "Sve kategorije"
					});
					
					$('.category-create').selectpicker();
					$('#orderby').selectpicker();
					
					$('#startdate_start, #startdate_end, #enddate_start, #enddate_end, #enddate').datepicker({
						format: 'yyyy-mm-dd',
						weekStart: 1
					});
					
					$('.postcontent').pajinate({
						items_per_page : 3,
						item_container_id : '#initiatives-list',
						nav_panel_id : '.pagination-container ul',
						show_first_last: false,
						num_page_links_to_display: 4,
						nav_label_next: "Sledeća",
						nav_label_prev: "Prethodna"
					});
					
					$('#create-form #image').fileinput({
						allowedFileTypes: ['image'],
						showUpload: false,
						browseLabel: 'Pronađi ...',
						removeLabel: 'Obriši',
						removeTitle: 'Obrišite selektovanu sliku',
						msgInvalidFileType: 'Pogrešan tip za fajl "{name}". Samo fajlovi tipa "{types}" su podržani.',
						msgValidationError: 'Greška pri upload-u fajla.'
					});
					
					if ($('[data-lightbox="image"]').length > 0) {
						$('[data-lightbox="image"]').magnificPopup({
							type: 'image',
							closeOnContentClick: true,
							closeBtnInside: false,
							fixedContentPos: true,
							mainClass: 'mfp-no-margins mfp-fade',
							image: {
								verticalFit: true
							}
						});
					}
				});
			})(jQuery)
		}
		
		return service;
	}
]);