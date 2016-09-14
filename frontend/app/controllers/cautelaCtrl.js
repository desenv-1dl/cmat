(function () {
  'use strict';

  var cautelaCtrl = function ($scope, $uibModal, dataFactory) {

    $scope.reload = function () {
      dataFactory.getCautelas().then(function success(response) {
        $scope.cautelas = dataFactory.cautelas;

      }, function error(response) {
        //FIXME
      });
    };

    $scope.reload();

    //paginação
    $scope.changeNum = function (itemNum) {
      $scope.numPerPage = itemNum;
    };

    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 5;
    $scope.numsForPage = [5, 10, 25, 50, 100];

    $scope.pageChanged = function (page) {
      $scope.currentPage = page;
    };

    $scope.sortKey = 'nome';
    $scope.reverse = false;

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    //modal
    $scope.criaCautela = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/views/modal/criacautela.html',
        controller: 'criaCautelaCtrl',
        size: 'lg',
      });

      modalInstance.result
      .then(function (result) {
        //result.projeto
        dataFactory.postCautelas(result.cautela).then(function success(response) {
          $scope.reload();
        },

        function error(response) {
          console.log(response);
        });
      }, function (exit) {

      });
    };

  };

  cautelaCtrl.$inject = ['$scope', '$uibModal', 'dataFactory'];

  angular.module('cmatApp')
  .controller('cautelaCtrl', cautelaCtrl);

  var criaCautelaCtrl = function ($scope, $uibModalInstance, dataFactory) {

    $scope.cautela = {};

    dataFactory.getEquipamentos().then(function success(response) {
      $scope.equipamentos = dataFactory.equipamentos;
      $scope.equipamentos.forEach(function(d){
        d.desc = d.nome + " - " + d.carga;
      })
    }, function error(response) {
      //FIXME
    });

    //datepicker
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };

      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };

    $scope.finaliza = function () {
      $scope.cautela.equipamentos = [];
      $scope.cautela.eqp.forEach(function(d){
        $scope.cautela.equipamentos.push(d.id)
      })
      console.log($scope.cautela)
      $uibModalInstance.close({
        cautela: $scope.cautela,
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

  criaCautelaCtrl.$inject = ['$scope', '$uibModalInstance', 'dataFactory'];

  angular.module('cmatApp')
  .controller('criaCautelaCtrl', criaCautelaCtrl);

})();
