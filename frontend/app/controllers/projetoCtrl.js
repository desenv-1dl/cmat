(function() {
    'use strict';

    var projetoCtrl = function($scope, $uibModal, dataFactory) {

      var dados = ['projetos', 'subprojetos', 'subfases']

      $scope.reload = function(){
        dados.forEach(function(d){
          dataFactory.loadUrl(d).then(function success(response){
            $scope[d] = dataFactory[d];
          }, function error(response){
          })
        })
      }
      $scope.reload();


      //paginação

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



      //modal
      $scope.criaProjeto = function() {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaProjeto.html',
              controller: 'criaProjetoCtrl',
              size: 'lg'
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                dataFactory.saveUrl(result.projeto, 'projetos').then(function success(response){
                  $scope.reload();
                }, function error(response){
                  console.log(response)
                })
              }, function(exit) {

              });
      };



      $scope.modificaSubprojeto = function(subprojeto) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/modificaSubprojeto.html',
              controller: 'modificaSubprojetoCtrl',
              size: 'lg',
              resolve: {
                subprojeto: function(){
                  return subprojeto;
                }
              }
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                console.log(result.subprojeto)
                dataFactory.updateUrl(result.subprojeto, 'subprojetos').then(function success(response){
                  $scope.reload();
                }, function error(response){
                  console.log(response)
                })
              }, function(exit) {

              });
      };

      $scope.criaSubprojeto = function() {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaSubprojeto.html',
              controller: 'criaSubprojetoCtrl',
              size: 'lg',
              resolve: {
                  projetos: function() {
                      return $scope.projetos;
                    },
                  subfases: function() {
                      return $scope.subfases;
                  }
              }
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                dataFactory.saveUrl(result.subprojeto, 'subprojetos').then(function success(response){
                  $scope.reload();
                }, function error(response){
                  console.log(response)
                })
              }, function(exit) {

              });
      };

    };

    projetoCtrl.$inject = ['$scope', '$uibModal', 'dataFactory'];

    angular.module('controleApp')
        .controller('projetoCtrl', projetoCtrl);

//CRIA PROJETO CONTROLLER ----------------------------------------------------------------------
    var criaProjetoCtrl = function($scope, $uibModalInstance) {

       $scope.projeto = {};

        $scope.finaliza = function(){
          $uibModalInstance.close({projeto: $scope.projeto})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaProjetoCtrl.$inject = ['$scope', '$uibModalInstance'];

    angular.module('controleApp')
        .controller('criaProjetoCtrl', criaProjetoCtrl);

//CRIA SUBPROJETO CONTROLLER ----------------------------------------------------------------------
    var criaSubprojetoCtrl = function($scope, $uibModalInstance, dataFactory, projetos, subfases) {

       $scope.page = 1;

       $scope.subprojeto = {};
       $scope.projetos = projetos;
       $scope.subfases = subfases;

       $scope.subprojeto.tarefas = [];
       $scope.subprojeto.subfases = [];

       $scope.listaSubfases = [];
       $scope.addSubfase = function(){
         if($scope.subfaseAdd != undefined){
           $scope.listaSubfases.push($scope.subfaseAdd);
         }
       }

       $scope.miAdd = '';
       $scope.listaBuscaMi = [];
       $scope.pesquisaMi = function(){
         dataFactory.pesquisaMi($scope.miAdd).then(function success(response){
           $scope.listaBuscaMi = dataFactory.listaMi;
         }, function error(response){
         })
       }

       $scope.addMi = function(mi){
         if(!$scope.subprojeto.tarefas.some(function(e){return e._id === mi._id})){
           var tarefa = {};
           tarefa._id = mi._id
           tarefa.mi = mi.properties.mi;
           tarefa.inom = mi.properties.inom;
           tarefa.asc = mi.properties.asc;
           tarefa.escala = mi.properties.escala;
           tarefa.geometria = mi.geometry;
           tarefa.concluido = false;
           tarefa.subfaseAtual = $scope.subprojeto.subfases[0];

           $scope.subprojeto.tarefas.push(tarefa);
         }
       }

       $scope.proximo = function(){
         $scope.page+=1;
       }

       $scope.anterior = function(){
         $scope.page-=1;
       }

        $scope.finaliza = function(){
          $scope.listaSubfases.forEach(function(d, i){
            $scope.subprojeto.subfases.push({subfase: d, ordem: i})
          })
          $uibModalInstance.close({subprojeto: $scope.subprojeto})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaSubprojetoCtrl.$inject = ['$scope', '$uibModalInstance', 'dataFactory', 'projetos', 'subfases'];

    angular.module('controleApp')
        .controller('criaSubprojetoCtrl', criaSubprojetoCtrl);


//MODIFICA SUBPROJETO CONTROLLER ----------------------------------------------------------------------
    var modificaSubprojetoCtrl = function($scope, $uibModalInstance, dataFactory, subprojeto) {

       $scope.subprojeto = subprojeto;

       $scope.miAdd = '';
       $scope.listaBuscaMi = [];
       $scope.pesquisaMi = function(){
         dataFactory.pesquisaMi($scope.miAdd).then(function success(response){
           $scope.listaBuscaMi = dataFactory.listaMi;
         }, function error(response){
         })
       }

       $scope.addMi = function(mi){
         if(!$scope.subprojeto.tarefas.some(function(e){return e._id === mi._id})){
           var tarefa = {};
           tarefa._id = mi._id
           tarefa.mi = mi.properties.mi;
           tarefa.inom = mi.properties.inom;
           tarefa.asc = mi.properties.asc;
           tarefa.escala = mi.properties.escala;
           tarefa.geometria = mi.geometry;
           tarefa.concluido = false;
           tarefa.subfaseAtual = $scope.subprojeto.subfases[0];

           $scope.subprojeto.tarefas.push(tarefa);
         }
       }

        $scope.finaliza = function(){
          $uibModalInstance.close({subprojeto: $scope.subprojeto})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    modificaSubprojetoCtrl.$inject = ['$scope', '$uibModalInstance', 'dataFactory', 'subprojeto'];

    angular.module('controleApp')
        .controller('modificaSubprojetoCtrl', modificaSubprojetoCtrl);


})();
