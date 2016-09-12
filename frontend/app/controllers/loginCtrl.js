(function() {
    'use strict';

    var loginCtrl = function($scope, loginFactory, $location) {

      $scope.errorMsg = null;

      $scope.info = {};

      $scope.login = function () {
  			//Returns an URL or an Error

  			loginFactory.login($scope.info)
  				.then(function sucess(response) {
  					//redirects application
  					$location.path('main')

  				}, function error(response) {

  					$scope.errorMsg = response;
            console.log($scope.errorMsg)

  				});
  		}

    };

    loginCtrl.$inject = ['$scope', 'loginFactory', '$location'];

    angular.module('controleApp')
        .controller('loginCtrl', loginCtrl);

})();
