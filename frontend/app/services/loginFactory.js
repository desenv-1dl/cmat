(function() {
    "use strict";
    var loginFactory = function($http, $q) {

        var loginUrl = 'http://localhost:3001/login'

        var factory = {};

        factory.usuario = {};
        factory.secao = {};

        factory.login = function(info){
          var q = $q.defer();

          $http({
    				method: 'POST',
    				url: loginUrl,
            data: info
    			}).then(function successCallback(response) {
            if('erro' in response.data){
              console.log(response.data.erro);
              q.reject(response.data.erro);
            } else {

              factory.usuario = response.data;

              factory.secao = factory.usuario.secao;

              q.resolve(response.data);
            }

    			}, function errorCallback(response) {
    				q.reject('Erro de conexão');
    			});

    			return q.promise;
        }

        factory.logout = function(){
          factory.usuario = {};
          factory.secao = {};
        }

        return factory;

}
    loginFactory.$inject = ['$http', '$q'];

    angular.module('controleApp')
        .factory('loginFactory', loginFactory);

})();
