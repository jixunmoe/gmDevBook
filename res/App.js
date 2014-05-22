/**
 *  @preserve UserScript Chinese Dev. Document, by Jixun.
 */
/* global angular */

(function (window, Angular, $, $q, $scope, $state, $global) {
	'use strict';

	Angular
		.module ('gmDev', ['ui.router', 'ui.bootstrap'/*, 'ui.utils'*/])
		.directive('tpl', function() {
			return {
				transclude: true,
				restrict: 'E',
				scope: {},
				templateUrl: function(element, attrs) {
					return 'tpl/' + attrs.src + '.html';
				},
				controller:[$scope, '$transclude', '$sce', '$compile', function($scope, $transclude, $sce, $compile){
					$transclude(function(clone){
						$scope.$content =
							// 标记为可信任的代码
							$sce.trustAsHtml(
								// 取出编译后的 HTML
								$compile(Angular.element('<div>').append(clone)[0].outerHTML)
									($scope).html()
							);
					});

				}],
				link: function(scope, element, attrs) {
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
					type: 0,
					title: '简介',
					entries: {
						gmScript: '用户脚本',
						about: '关于'
					}
				},
				tutorial: {
					type: 1,
					title: '开发教程',
					entries: {
						meta: '元数据',
						warning: '注意事项',
						other: '其它资料',
						publish: '脚本托管'
					}
				},

				api: {
					type: 2,
					title: 'API 速查',
					list: [
						"GM_info",

						"GM_addStyle",

						"GM_deleteValue", "GM_getValue", "GM_setValue", "GM_listValues",

						"GM_getResourceText", "GM_getResourceURL",

						"GM_log", "GM_openInTab", "GM_registerMenuCommand",
						"GM_setClipboard", "GM_xmlhttpRequest"
					]
				}
			};

			// Angular 会自动排序，简直差评
			$global.getKey = function (o) {
				if (!o) return [];
				return Object.keys(o);
			};

			$global.$on('$stateChangeSuccess', function (e, curRoute, $param) {
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

				// 移到页面顶部
				window.scrollTo (0,0);
			});
		}]).config (['$stateProvider', '$urlRouterProvider', function ($stateProv, $urlRouterProvider) {
			$urlRouterProvider.when ('', '/doc/intro/gmScript');

			$stateProv.state ('doc', {
				url: '/doc/:cat/:entry',
				templateUrl: function ($doc) {
					return 'doc/' + $doc.cat + '/' + $doc.entry + '.html';
				}
			});
		}]);


}) (window, angular, jQuery, '$q', '$scope', '$state', '$rootScope');
