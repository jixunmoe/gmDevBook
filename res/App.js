/**
 *  @preserve UserScript Chinese Dev. Document, by Jixun.
 */
/* global angular */

(function (window, Angular, $, _, $q, $scope, $state, $global) {
	'use strict';

	Angular
		.module ('gmDev', ['ui.router'])
		.directive ('api', ['$state', function ($state) {
			return {
				transclude: true,
				restrict: 'E',

				// 不需要 scope :3
				// scope: {},
				compile: function ($element, tAttrs, transclude) {
					transclude ({}, function (clone) {
						var txt = $('<div>').append(clone).text();

						$element.after($('<a>').attr('href', $state.href ('doc', {
							cat: $element.attr('cat') || 'api',
							entry: $element.attr('entry') || txt
						})).text(txt)).remove();
					});
				}
			};
		}])
		.directive('tpl', function() {
			return {
				transclude: true,
				restrict: 'E',
				scope: {},
				templateUrl: function(element, attrs) {
					return 'tpl/' + attrs.src + '.html';
				},
				controller:[$scope, '$transclude', '$sce', '$compile', 
					function($scope, $transclude, $sce, $compile){
					$transclude(function(clone){
						$scope.$content =
							// Sign as trusted code.
							$sce.trustAsHtml(
								// Compile the content
								$compile(Angular.element('<div>').append(clone)[0].outerHTML)
									($scope).html()
							);
					});
				}],
				link: function(scope, element, attrs) {
					scope.$split = function (str, what) {
						if (str)
							return str.split(what || ',');
					};
					scope.$have = function (what) {
						return attrs.hasOwnProperty(what);
					};
					for (var x in attrs) {
						if (attrs.hasOwnProperty(x) && x.indexOf('$')) {
							var attr = attrs[x];
							if (!attr.indexOf('$')) {
								attr = scope.$eval(attr.slice(1));
							}
							scope[x] = attr;
						}
					}
				}
			};
		})
		.run ([$global, function ($global) {
			var Nav = $global.Nav = {
				intro: {
					type: 0, // Hide Title
					title: '帮助',
					entries: {
						gmScript: '关于用户脚本',
						about: '关于该项目'
					}
				},
				tutorial: {
					type: 1, // Normal one
					title: '开发教程',
					entries: {
						meta: '元数据',
						warning: '注意事项',
						other: '其它资料',
						publish: '脚本托管'
					}
				},

				api: {
					type: 2, // URL = Name
					title: 'API 速查',
					list: [
						"GM_info",

						"GM_addStyle",

						"GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues",

						"GM_getResourceText", "GM_getResourceURL",

						"GM_log", "GM_openInTab", "GM_registerMenuCommand",
						"GM_setClipboard", "GM_xmlhttpRequest"
					]
				}
			};

			// Angular Sort the object auto 
			$global.getKey = function (o) {
				if (!o) return [];
				return Object.keys(o);
			};

			$global.$on('$stateChangeStart', function (e, curRoute, $param) {
				if (!Nav.hasOwnProperty($param.cat))
					return ;

				var curCat = Nav[$param.cat];
				$global.cat = curCat.title;

				if (curCat.type === 2) {
					$global.entry = $param.entry;
				} else {
					var curEntry = curCat.entries;
					if (!curEntry.hasOwnProperty($param.entry))
						return ;

					$global.entry = curEntry[$param.entry];
				}

				// Scroll page to the top.
				$(window).scrollTo (_('viewpt'), 800);
			});
		}]).config (['$stateProvider', '$urlRouterProvider', function ($stateProv, $urlRouterProvider) {
			$urlRouterProvider.when ('', '/doc/intro/gmScript');

			$stateProv.state ('doc', {
				url: '/doc/:cat/:entry',
				templateUrl: function ($param) {
					return 'doc/' + $param.cat + '/' + $param.entry + '.html';
				}
			});
		}]);


}) (window, angular, jQuery, function ($) {
	return document.getElementById($);
}, '$q', '$scope', '$state', '$rootScope');
