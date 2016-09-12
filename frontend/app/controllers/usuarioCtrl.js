(function() {
    'use strict';

    var usuarioCtrl = function($scope, $uibModal, dataFactory) {

      var dados = ['usuarios', 'secoes', 'funcoes']

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

      $scope.sortKey = 'nomeGuerra';
      $scope.reverse = false;

      $scope.sort = function(keyname){
          $scope.sortKey = keyname;   //set the sortKey to the param passed
          $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      }

      //modal
      $scope.criaUsuario = function(usuario) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaUsuario.html',
              controller: 'criaUsuarioCtrl',
              size: 'lg',
              resolve: {
                  secoes: function() {
                      return $scope.secoes;
                    },
                  funcoes: function() {
                      return $scope.funcoes;
                  },
                  usuario: function() {
                    return usuario;
                  }
              }
         });

          modalInstance.result
              .then(function(result) {
                //result.projeto
                if(usuario === undefined){
                  dataFactory.saveUrl(result.usuario, 'usuarios').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                } else {
                  dataFactory.updateUrl(result.usuario, 'usuarios').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
                }


              }, function(exit) {

              });
      };

    };

    usuarioCtrl.$inject = ['$scope', '$uibModal', 'dataFactory'];

    angular.module('controleApp')
        .controller('usuarioCtrl', usuarioCtrl);

        var deepCopy = function(object){
          if(object){
            return JSON.parse(JSON.stringify(object));
          } else{
            return {};
          }
        }

//CRIA PROJETO CONTROLLER ----------------------------------------------------------------------
    var criaUsuarioCtrl = function($scope, $uibModalInstance, secoes, funcoes, usuario) {

       $scope.usuario = deepCopy(usuario);
       $scope.secoes = secoes;
       $scope.funcoes = funcoes;
       $scope.postGrads = ['Sd', 'Cb', '3ºSgt', '2ºSgt', '1ºSgt',
                   'STen', 'Asp', '2ºTen', '1ºTen', 'Cap', 'Maj', 'TC', 'Cel', 'Gen'];
       $scope.perfis = ['Operador', 'Gerente de Fluxo', 'Chefe de Seção',
                   'Visualizador', 'Administrador'];
       $scope.turnos = ['Integral', 'Manhã', 'Tarde'];


       $scope.usuario.listaFuncoes = [];
       if('funcoes' in $scope.usuario){
         $scope.usuario.funcoes.forEach(function(d){
           $scope.usuario.listaFuncoes.push(d.funcao);
         })
       }


        $scope.finaliza = function(){
          $scope.usuario.funcoes = [];
          $scope.usuario.listaFuncoes.forEach(function(d){
            $scope.usuario.funcoes.push({funcao: d, dataInicio: new Date().toISOString()})
          })

          $scope.usuario.funcoesTexto = $scope.usuario.funcoes.map(function(d){
              if(d.dataFim === undefined){
                return d.funcao.nome;
              }
          }).join(',')
          delete $scope.usuario.listaFuncoes;

          $uibModalInstance.close({usuario: $scope.usuario})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaUsuarioCtrl.$inject = ['$scope', '$uibModalInstance', 'secoes', 'funcoes', 'usuario'];

    angular.module('controleApp')
        .controller('criaUsuarioCtrl', criaUsuarioCtrl);

})();
