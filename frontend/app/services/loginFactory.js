(function () {
  'use strict';
  var loginFactory = function ($http, $q) {

      //var loginUrl = 'http://localhost:3001/login';

      var factory = {};

      factory.usuario = {};
      factory.secao = {};

      factory.login = function (info) {
        var q = $q.defer();

        factory.usuario = {};
        factory.usuario.nomeGuerra = info.login;
        factory.usuario.postGrad = '1º Ten';
        factory.usuario.perfil = 'Administrador';
        q.resolve(factory.usuario);

        return q.promise;
      };

      factory.logout = function () {
        factory.usuario = {};
        factory.secao = {};
      };

      return factory;

    };

  loginFactory.$inject = ['$http', '$q'];

  angular.module('cmatApp')
      .factory('loginFactory', loginFactory);

})();
