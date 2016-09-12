(function() {
    'use strict';

    var fluxoCtrl = function($scope, $uibModal, dataFactory, loginFactory) {

      $scope.secao = loginFactory.secao;

      $scope.reload = function(){
        dataFactory.getAtividadeEmExecucaoSecao($scope.secao).then(function success(response){
          $scope['atividadeEmExecucaoSecao'] = dataFactory['atividadeEmExecucaoSecao'];
        }, function error(response){
        })

        dataFactory.getAtividadeDistribuidaSecao($scope.secao, 1).then(function success(response){
          $scope['atividadeDistribuidaSecao'] = dataFactory['atividadeDistribuidaSecao'];
        }, function error(response){
        })

        dataFactory.getAtividadeDistribuidaSecao($scope.secao, 0).then(function success(response){
          $scope['atividadeNaoDistribuidaSecao'] = dataFactory['atividadeNaoDistribuidaSecao'];
        }, function error(response){
        })

        dataFactory.getUsuariosSecao($scope.secao).then(function success(response){
          $scope['usuarios'] = dataFactory['usuariosSecao'];
        }, function error(response){
        })
      }
      $scope.reload();



      $scope.changeNum = function (itemNum) {
        $scope.numPerPage = itemNum;
      };

      $scope.currentPage = 1;
      $scope.numPerPage = 5;
      $scope.maxSize = 5;
      $scope.numsForPage = [5, 10, 25, 50, 100];

      $scope.pageChanged = function(page) {
        $scope.currentPage = page;
      };

      $scope.sortKey = 'nome';
      $scope.reverse = false;

      $scope.sort = function(keyname){
          $scope.sortKey = keyname;   //set the sortKey to the param passed
          $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      }


      $scope.distribuiAtiv = function(ativ) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/distribuiAtiv.html',
              controller: 'distribuiAtivCtrl',
              size: 'lg',
              resolve: {
                usuarios: function(){
                  return $scope.usuarios;
                },
                ativ: function(){
                  return ativ;
                }
              }
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                dataFactory.updateUrl(result.ativ, 'atividades').then(function success(response){
                  $scope.reload();
                }, function error(response){
                  console.log(response)
                })
              }, function(exit) {

              });
      };

    };

    fluxoCtrl.$inject = ['$scope', '$uibModal', 'dataFactory', 'loginFactory'];

    angular.module('controleApp')
        .controller('fluxoCtrl', fluxoCtrl);


    var deepCopy = function(object){
      if(object){
        return JSON.parse(JSON.stringify(object));
      } else{
        return {};
      }
    }

//distribuiAtiv CONTROLLER ----------------------------------------------------------------------
    var distribuiAtivCtrl = function($scope, $uibModalInstance, usuarios, ativ) {

      $scope.ativ = deepCopy(ativ);

       $scope.usuarios = usuarios;

        $scope.finaliza = function(){
          $uibModalInstance.close({ativ: $scope.ativ})
        };

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
    };

    distribuiAtivCtrl.$inject = ['$scope', '$uibModalInstance', 'usuarios', 'ativ'];

    angular.module('controleApp')
        .controller('distribuiAtivCtrl', distribuiAtivCtrl);

})();
