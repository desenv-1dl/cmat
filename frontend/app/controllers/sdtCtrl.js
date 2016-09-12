(function() {
    'use strict';

    var sdtCtrl = function($scope, $uibModal, dataFactory) {


      var dados = ['secoes', 'funcoes', 'fases', 'subfases'];

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

      $scope.criaFase = function(fase) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaFase.html',
              controller: 'criaFaseCtrl',
              size: 'lg',
              resolve: {
                fase: function(){
                  return fase;
                }
              }
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                if(fase === undefined){
                  dataFactory.saveUrl(result.fase, 'fases').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                } else {
                  dataFactory.updateUrl(result.fase, 'fases').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                }
              }, function(exit) {

              });
      };


      $scope.criaSubfase = function(subfase) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaSubfase.html',
              controller: 'criaSubfaseCtrl',
              size: 'lg',
              resolve: {
                  funcoes: function() {
                      return $scope.funcoes;
                    },
                  fases: function(){
                    return $scope.fases;
                  },
                  subfase: function(){
                    return subfase;
                  }
              }
         });

          modalInstance.result
              .then(function(result) {
                if(subfase === undefined){
                  dataFactory.saveUrl(result.subfase, 'subfases').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                } else {
                  dataFactory.updateUrl(result.subfase, 'subfases').then(function success(response){
                    var index;
                    $scope.subfases.forEach(function(d,i){
                      $scope.reload();
                    })
                  }, function error(response){
                    console.log(response)
                  })
                }
              }, function(exit) {

              });
      };

      $scope.criaSecao = function(secao) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaSecao.html',
              controller: 'criaSecaoCtrl',
              size: 'lg',
              resolve: {
                secao: function() {
                  return secao;
                }
              }
         });

          modalInstance.result
              .then(function(result) {
                if(secao === undefined){
                  dataFactory.saveUrl(result.secao, 'secoes').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                } else {
                  dataFactory.updateUrl(result.secao, 'secoes').then(function success(response){
                    var index;
                    $scope.secoes.forEach(function(d,i){
                      $scope.reload();
                    })
                  }, function error(response){
                    console.log(response)
                  })
                }
              }, function(exit) {

          });
      };

      $scope.criaFuncao = function(funcao) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaFuncao.html',
              controller: 'criaFuncaoCtrl',
              size: 'lg',
              resolve: {
                  secoes: function() {
                      return $scope.secoes;
                    },
                  funcao: function() {
                    return funcao
                  }
              }
         });

          modalInstance.result
              .then(function(result) {
                if(funcao === undefined){
                  dataFactory.saveUrl(result.funcao, 'funcoes').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                } else {
                  dataFactory.updateUrl(result.funcao, 'funcoes').then(function success(response){
                    var index;
                    $scope.funcoes.forEach(function(d,i){
                      $scope.reload();
                    })
                  }, function error(response){
                    console.log(response)
                  })
                }
              }, function(exit) {

              });
      };

    };

    sdtCtrl.$inject = ['$scope', '$uibModal', 'dataFactory'];

    angular.module('controleApp')
        .controller('sdtCtrl', sdtCtrl);

    var deepCopy = function(object){
      if(object){
        return JSON.parse(JSON.stringify(object));
      } else{
        return {};
      }
    }

//CRIA FASE CONTROLLER ----------------------------------------------------------------------
    var criaFaseCtrl = function($scope, $uibModalInstance, fase) {

       $scope.fase = deepCopy(fase);

        $scope.finaliza = function(){
          $uibModalInstance.close({fase: $scope.fase})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaFaseCtrl.$inject = ['$scope', '$uibModalInstance', 'fase'];

    angular.module('controleApp')
        .controller('criaFaseCtrl', criaFaseCtrl);

//CRIA SUBFASE CONTROLLER ----------------------------------------------------------------------
    var criaSubfaseCtrl = function($scope, $uibModalInstance, funcoes, fases, subfase) {

      $scope.subfase = deepCopy(subfase);

       $scope.funcoes = funcoes;

       $scope.fases = fases;

        $scope.finaliza = function(){
          $scope.subfase.funcoesTexto = $scope.subfase.funcoes.map(function(d){
              return d.nome;
          }).join(', ')
          $uibModalInstance.close({subfase: $scope.subfase})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaSubfaseCtrl.$inject = ['$scope', '$uibModalInstance', 'funcoes', 'fases', 'subfase'];

    angular.module('controleApp')
        .controller('criaSubfaseCtrl', criaSubfaseCtrl);

//CRIA SECAO CONTROLLER ----------------------------------------------------------------------
    var criaSecaoCtrl = function($scope, $uibModalInstance, secao) {

       $scope.secao = deepCopy(secao);

        $scope.finaliza = function(){
          $uibModalInstance.close({secao: $scope.secao})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaSecaoCtrl.$inject = ['$scope', '$uibModalInstance', 'secao'];

    angular.module('controleApp')
        .controller('criaSecaoCtrl', criaSecaoCtrl);

//CRIA FUNCAO CONTROLLER ----------------------------------------------------------------------
    var criaFuncaoCtrl = function($scope, $uibModalInstance, secoes, funcao) {

       $scope.funcao = deepCopy(funcao);

       $scope.secoes = secoes;

        $scope.finaliza = function(funcao){
          $uibModalInstance.close({funcao: $scope.funcao})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaFuncaoCtrl.$inject = ['$scope', '$uibModalInstance', 'secoes', 'funcao'];

    angular.module('controleApp')
        .controller('criaFuncaoCtrl', criaFuncaoCtrl);


})();
