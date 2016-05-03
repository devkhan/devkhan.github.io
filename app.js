/**
 * Global angular file.
 *
 * Created by devesh.khandelwal
 */
console.log('app.js loading...');

// Colors assignment based on values.
var colors = {
	"High": "red",
	"Moderate": "blue",
	"Low": "cyan",
	"Negative": "gray"
};
var dataUrl = "https://gist.githubusercontent.com/ddtxra/ad7f3c159ef68c73a73a/raw/a6a697002e6ef28d177563968b02a2bfd04e5110/data.json";

/**
 * Main angular module.
 * @type {angular.module}
 */
app = angular.module('main', ['ngRoute', 'ui-tree'])
	.config(
		'$routeProvider',
		function ($routeProvider)
		{
			$routeProvider
				.otherwise({
					templateUrl: 'index.html',
					controller: 'MainController'
				});
		}
	);

/**
 * Main Controller. Handles everything for the current app.
 */
angular
	.module('main', ['ngRoute'])
	.controller('MainController', function($scope) {
		$scope.list = [];
		$scope.colors = colors;

		// GET data.
		$.get(dataUrl,
			function (data) {

				data = JSON.parse(data);
				data = data["data"];

				// Initializing table.
				data.forEach( function(system, index) {
					// Collapsing initially.
					system.expand = false;

					if (!system.hasOwnProperty('children')) {
						system.children = [ $.extend({}, system) ];
					}

					system.children.forEach( function(organ, index) {
						// Collapsing initially.
						organ.expand = false;

						if (!organ.hasOwnProperty('children')) {
							organ.children = [ $.extend({}, organ) ];
						}

						organ.children.forEach( function(cell, index) {

							// Converting values from a list format to an object.
							var tempValues = {};
							cell.values.forEach( function(param, index) {
								tempValues[param.columnLabel] = param.value;
							});
							cell.values = tempValues;
						});

						// Converting values from a list format to an object.
						var tempValues = {};
						organ.values.forEach( function(param, index) {
							tempValues[param.columnLabel] = param.value;
						});
						organ.values = tempValues;

					});

					// Converting values from a list format to an object.
					var tempValues = {};
					system.values.forEach( function(param, index) {
						tempValues[param.columnLabel] = param.value;
					});
					system.values = tempValues;

				});

				$scope.list = data;
				console.log(data);
				$scope.$apply();
			});
		
		// Function to expand all items.
		$scope.expandAll = function () {
			$scope.list.forEach( function(system, index) {
				system.expand = true;

				system.children.forEach( function(organ, index) {
					organ.expand = true;
				});
			});
			$scope.$apply();
		}
		
		// Function to collapse all items.
		$scope.collapseAll = function () {
			$scope.list.forEach( function(system, index) {
				system.expand = false;

				system.children.forEach( function(organ, index) {
					organ.expand = false;
				});
			});
			$scope.$apply();
		}
	});

console.log('app.js loaded.');