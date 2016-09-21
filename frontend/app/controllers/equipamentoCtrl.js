(function () {
  'use strict';

  var equipamentoCtrl = function ($scope, $uibModal, dataFactory) {

    $scope.reload = function () {
      dataFactory.getEquipamentos().then(function success(response) {
         dataFactory.getSituacao().then(function success(response) {
          $scope.equipamentos = dataFactory.equipamentos;
          $scope.situacao = dataFactory.situacao;
          
          $scope.equipamentos.forEach(function(e){
             $scope.situacao.forEach(function(s){
              if( s.codigo === e.situacao){
                e.situacaoText = s.valor;
              }
            })
          })
      })
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
    $scope.criaEquip = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/views/modal/criaequip.html',
        controller: 'criaEquipCtrl',
        size: 'lg',
        resolve: {
          situacao: function () {
            return $scope.situacao;
          },
        },
      });

      modalInstance.result
      .then(function (result) {
        //result.projeto
        dataFactory.postEquipamentos(result.equipamento).then(function success(response) {
          $scope.reload();
        },

        function error(response) {
          console.log(response);
        });
      }, function (exit) {

      });
    };

    $scope.verificaEquipamento = function (equipamento) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/views/modal/verificaequip.html',
        controller: 'verificaEquipCtrl',
        size: 'lg',
        resolve: {
          equipamento: function () {
            return equipamento;
          },
        },
      });

      modalInstance.result
      .then(function (result) {

      }, function (exit) {

      });
    };

  };

  equipamentoCtrl.$inject = ['$scope', '$uibModal', 'dataFactory'];

  angular.module('cmatApp')
  .controller('equipamentoCtrl', equipamentoCtrl);

  var criaEquipCtrl = function ($scope, $uibModalInstance, situacao) {

    $scope.equipamento = {};

    $scope.situacoes = situacao.filter(function(d){
      return d.valor === 'Disponível' || d.valor === 'Indisponível'
    });

    $scope.finaliza = function () {
      $scope.equipamento.situacao = $scope.equipamento.situacaoText.codigo;

      $uibModalInstance.close({
        equipamento: $scope.equipamento,
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

  criaEquipCtrl.$inject = ['$scope', '$uibModalInstance', 'situacao'];

  angular.module('cmatApp')
  .controller('criaEquipCtrl', criaEquipCtrl);

})();
