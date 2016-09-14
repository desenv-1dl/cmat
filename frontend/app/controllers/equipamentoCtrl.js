(function () {
  'use strict';

  var equipamentoCtrl = function ($scope, $uibModal, dataFactory) {

    $scope.reload = function () {
      dataFactory.getEquipamentos().then(function success(response) {
        $scope.equipamentos = dataFactory.equipamentos;

        var situacoes = [
          {id:1, nome: "Disponível"},
          {id:2, nome: "Cautelado"},
          {id:3, nome: "Em manutenção"},
          {id:4, nome: "Indisponível"},
        ];
        $scope.equipamentos.forEach(function(e){
          situacoes.forEach(function(d){
            if( d.id === e.situacao){
              e.situacaoText = d.nome;
            }
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

  var criaEquipCtrl = function ($scope, $uibModalInstance) {

    $scope.equipamento = {};

    $scope.situacoes = [
      {id:1, nome: "Disponível"},
      {id:2, nome: "Cautelado"},
      {id:3, nome: "Em manutenção"},
      {id:4, nome: "Indisponível"},
    ];

    $scope.finaliza = function () {
      $scope.situacoes.forEach(function(d){
        if (d.nome === $scope.equipamento.situacaoText.nome) {
          $scope.equipamento.situacao = d.id;
        }
      })
      $uibModalInstance.close({
        equipamento: $scope.equipamento,
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

  criaEquipCtrl.$inject = ['$scope', '$uibModalInstance'];

  angular.module('cmatApp')
  .controller('criaEquipCtrl', criaEquipCtrl);

})();
