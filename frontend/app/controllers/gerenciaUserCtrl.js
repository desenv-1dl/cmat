(function() {
    'use strict';

    var gerenciaUserCtrl = function($scope, $uibModal, dataFactory, loginFactory) {

      $scope.secao = loginFactory.secao;

      $scope.reload = function(){
        dataFactory.loadUrl('funcoes').then(function success(response){
          $scope['funcoes'] = dataFactory['funcoes'];
        }, function error(response){
        })

        dataFactory.getUsuariosSecao($scope.secao).then(function success(response){
          $scope['usuarios'] = dataFactory['usuariosSecao'];
        }, function error(response){
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
      $scope.modificaUsuario = function(usuario) {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/modificaUsuario.html',
              controller: 'modificaUsuarioCtrl',
              size: 'lg',
              resolve: {
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
                  dataFactory.updateUrl(result.usuario, 'usuarios').then(function success(response){
                    $scope.reload();
                  }, function error(response){
                    console.log(response)
                  })
              }, function(exit) {

              });
      };
    };

    gerenciaUserCtrl.$inject = ['$scope', '$uibModal', 'dataFactory', 'loginFactory'];

    angular.module('controleApp')
        .controller('gerenciaUserCtrl', gerenciaUserCtrl);

    var deepCopy = function(object){
      if(object){
        return JSON.parse(JSON.stringify(object));
      } else{
        return {};
      }
    }

    //CRIA modificaUsuarioCtrl CONTROLLER ----------------------------------------------------------------------
        var modificaUsuarioCtrl = function($scope, $uibModalInstance, funcoes, usuario) {

           $scope.usuario = deepCopy(usuario);
           $scope.funcoes = funcoes;

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

        modificaUsuarioCtrl.$inject = ['$scope', '$uibModalInstance', 'funcoes', 'usuario'];

        angular.module('controleApp')
            .controller('modificaUsuarioCtrl', modificaUsuarioCtrl);
})();
