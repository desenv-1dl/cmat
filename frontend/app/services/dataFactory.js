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

    factory.getCautelas = function () {
      //promise that the data will load
      return getUrl('cautelas', urlpath + 'cautelas');
    };

    factory.getManutencoes = function () {
      //promise that the data will load
      return getUrl('manutencoes', urlpath + 'manutencoes');
    };

    function saveUrl (data, url) {
      //promise that the data will load
      var q = $q.defer();

      $http({
        method: 'POST',
        url: url,
        data: data,
      }).then(function successCallback(response) {
        q.resolve('success');

      }, function errorCallback(response) {
        //FIXME show message Layer not available
        q.reject('erro');
      });

      return q.promise;
    };

    factory.postEquipamentos = function (data) {
      //promise that the data will load
      return saveUrl(data, urlpath + 'equipamentos');
    };

    factory.postCautelas = function (data) {
      //promise that the data will load
      return saveUrl(data, urlpath + 'cautelas');
    };

    factory.postManutencoes = function (data) {
      //promise that the data will load
      return saveUrl(data, urlpath + 'manutencoes');
    };


    function updateUrl (data, url) {
      //Só pode dar update em 1 record
      var q = $q.defer();

      $http({
        method: 'PUT',
        url: url + '/' + data.id,
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

    factory.putEquipamentos = function (data) {
      //promise that the data will load
      return updateUrl(data, urlpath + 'equipamentos');
    };

    factory.putCautelas = function (data) {
      //promise that the data will load
      return updateUrl(data, urlpath + 'cautelas');
    };

    factory.putManutencoes = function (data) {
      //promise that the data will load
      return updateUrl(data, urlpath + 'manutencoes');
    };

    return factory;

  };

  dataFactory.$inject = ['$http', '$q'];

  angular.module('cmatApp')
  .factory('dataFactory', dataFactory);

})();
