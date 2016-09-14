(function () {
  'use strict';

  var mainCtrl = function ($scope, loginFactory, $location) {

    if (!loginFactory.usuario.nomeGuerra) {
      loginFactory.logout();
      $location.path('');
    } else {
      $scope.usuario = loginFactory.usuario;
    }

    $scope.logout = function () {
      loginFactory.logout();
      $location.path('');
    };

  };

  mainCtrl.$inject = ['$scope', 'loginFactory', '$location'];

  angular.module('cmatApp')
    .controller('mainCtrl', mainCtrl);

})();
