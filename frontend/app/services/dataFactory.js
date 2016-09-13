(function () {
  'use strict';
  var dataFactory = function ($http, $q) {
    var factory = {};
    factory.secoes = [];
    factory.funcoes = [];

    var url = {};
    var urlpath = 'http://localhost:3002/';

    function getUrl(classe, url) {
      //promise that the data will load
      var q = $q.defer();

      factory[classe] = null;

      $http({
        method: 'GET',
        url: url,
      }).then(function successCallback(response) {
        //merge arrays
        factory[classe] = response.data;

        q.resolve('success');

      }, function errorCallback(response) {
        //FIXME show message Layer not available
        q.reject('erro');
      });

      return q.promise;
    }

    factory.getEquipamentos = function () {
      //promise that the data will load
      return getUrl('equipamentos', urlpath + 'equipamentos');
    };

    factory.getEquipamentos = function () {
      //promise that the data will load
      return getUrl('cautelas', urlpath + 'cautelas');
    };

    factory.getEquipamentos = function () {
      //promise that the data will load
      return getUrl('manutencoes', urlpath + 'manutencoes');
    };

    factory.saveUrl = function (data, classe) {
      //promise that the data will load
      var q = $q.defer();

      $http({
        method: 'POST',
        url: url[classe],
        data: data,
      }).then(function successCallback(response) {
        //merge arrays
        q.resolve('success');

      }, function errorCallback(response) {
        //FIXME show message Layer not available
        q.reject('erro');
      });

      return q.promise;
    };

    factory.updateUrl = function (data, classe) {
      //Só pode dar update em 1 record
      var q = $q.defer();

      $http({
        method: 'PUT',
        url: url[classe] + '/' + data._id,
        data: data,
      }).then(function successCallback(response) {
        //merge arrays
        q.resolve('success');

      }, function errorCallback(response) {
        //FIXME show message Layer not available
        q.reject('erro');
      });

      return q.promise;
    };

    return factory;

  };

  dataFactory.$inject = ['$http', '$q'];

  angular.module('cmatApp')
  .factory('dataFactory', dataFactory);

})();
