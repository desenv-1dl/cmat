(function() {
    'use strict';

    var atividadeCtrl = function($scope, $uibModal, dataFactory, loginFactory) {

      $scope.usuario = loginFactory.usuario;

      $scope.proximaAtiv = null;

      $scope.palavrasChave = [];

      $scope.reload = function(){
        dataFactory.getAtividadePrioritaria($scope.usuario).then(function success(response){
          $scope['atividadePrioritaria1'] = dataFactory['atividadePrioritaria1'];
          $scope['atividadePrioritaria2'] = dataFactory['atividadePrioritaria2'];

          dataFactory.getAtividadesIniciadas($scope.usuario).then(function success(response){
            $scope['atividadesIniciadas'] = dataFactory['atividadesIniciadas'];

            if($scope['atividadesIniciadas'].length > 0 ){
              $scope.proximaAtiv = $scope['atividadePrioritaria1'];
            } else {
              $scope.proximaAtiv = $scope['atividadePrioritaria2'];
            }

          }, function error(response){
          })
        }, function error(response){
        })

        dataFactory.getAtividadeEmExecucao($scope.usuario).then(function success(response){
          $scope['atividadeEmExecucao'] = dataFactory['atividadeEmExecucao'];

          if($scope.atividadeEmExecucao && $scope.atividadeEmExecucao.tarefa){
            $scope.palavrasChave = $scope.atividadeEmExecucao.tarefa.palavrasChave || [];

          }
        }, function error(response){
        })

        dataFactory.loadUrl('tipoatividadesespecial').then(function success(response){
          var index;
          dataFactory.tipoatividadesespecial.forEach(function(d,i){
            if(d.nome === "Fim expediente"){
              $scope.fimExpediente = d;
              index = i;
            }
          })
          dataFactory.tipoatividadesespecial.splice(index ,1);
          $scope.tipoatividadesespecial = dataFactory.tipoatividadesespecial;
        }, function error(response){
        })
      }



      $scope.reload();


      $scope.finaliza = function(ativ){
        $scope.limpaPalavraChave();

        var confirmInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/views/modal/confirma.html',
            controller: 'confirmaCtrl',
            size: 'sm',
            resolve: {
              msg: function(){
                return 'Deseja finalizar a atividade?'
              }
            }
       });

       confirmInstance.result
           .then(function(res) {
             if(res.result){
               ativ.dataFim = new Date().toISOString();
               ativ.horasTrabalhadas = Math.floor((Date.parse(ativ.dataFim) - Date.parse(ativ.dataInicio))/ 60000);
               ativ.status = 'Finalizado';



               var classe;
               if(ativ.tarefa){
                 classe = 'atividades';
                 ativ.tarefa.palavrasChave = $scope.palavrasChave;
               } else {
                 classe = 'atividadesespeciais';
               }
               dataFactory.updateUrl(ativ, classe).then(function success(response){
                 $scope.reload();
               }, function error(response){
                 console.log(response)
               })
             }
           }, function(exit) {
           });
      }

      $scope.inicia = function(ativ){

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/views/modal/addRegime.html',
            controller: 'addRegimeCtrl',
            size: 'sm'
       });

        modalInstance.result
            .then(function(result) {
              ativ.operador = $scope.usuario;
              ativ.dataInicio = new Date().toISOString();
              ativ.status = 'Em execução';
              ativ.regime = result.regime;

              var classe;
              if(ativ.tarefa){
                classe = 'atividades';
              } else {
                classe = 'atividadesespeciais';
              }

              dataFactory.updateUrl(ativ, classe).then(function success(response){
                $scope.reload();
              }, function error(response){
                console.log(response)
              })
            }, function(exit) {

            });

      };



      $scope.pausa = function(ativ){
        $scope.limpaPalavraChave();
        //chama cria atividade especial

        var confirmInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/views/modal/confirma.html',
            controller: 'confirmaCtrl',
            size: 'sm',
            resolve: {
              msg: function(){
                return 'Fim do expediente?'
              }
            }
       });

       confirmInstance.result
           .then(function(res) {

             if(res.result){
               //fim do expediente
                 ativ.dataFim = new Date().toISOString();
                 ativ.horasTrabalhadas = Math.floor((Date.parse(ativ.dataFim) - Date.parse(ativ.dataInicio))/ 60000);
                 ativ.status = 'Pausado';
                 ativ.motivoPausa = $scope.fimExpediente;

                 var classe;
                 if(ativ.tarefa){
                   classe = 'atividades';
                   ativ.tarefa.palavrasChave = $scope.palavrasChave;

                 } else {
                   classe = 'atividadesespeciais';
                 }
                 dataFactory.updateUrl(ativ, classe).then(function success(response){
                   $scope.reload();
                 }, function error(response){
                   console.log(response)
                 })
             } else {
               var modalInstance = $uibModal.open({
                   animation: true,
                   templateUrl: 'app/views/modal/criaAtividadeEspecial.html',
                   controller: 'criaAtividadeEspecialCtrl',
                   size: 'lg',
                   resolve: {
                       tipoatividadesespecial: function() {
                           return $scope.tipoatividadesespecial;
                         },
                       usuario: function(){
                         return $scope.usuario;
                          }
                     }
                    });

               modalInstance.result
                   .then(function(result) {
                     ativ.dataFim = new Date().toISOString();
                     ativ.horasTrabalhadas = Math.floor((Date.parse(ativ.dataFim) - Date.parse(ativ.dataInicio))/ 60000);
                     ativ.status = 'Pausado';
                     ativ.motivoPausa = result.atividadeEspecial.tipoAtividadeEspecial;

                     var classe;
                     if(ativ.tarefa){
                       classe = 'atividades';
                     } else {
                       classe = 'atividadesespeciais';
                     }
                     dataFactory.updateUrl(ativ, classe).then(function success(response){
                       $scope.reload();
                     }, function error(response){
                       console.log(response)
                     })

                       dataFactory.saveUrl(result.atividadeEspecial, 'atividadesespeciais').then(function success(response){
                         $scope.reload();
                       }, function error(response){
                         console.log(response)
                       })

                   }, function(exit) {

                   });
             }
           }, function(exit) {

           });
    };

      $scope.criaAtividadeEspecial = function() {

          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/views/modal/criaAtividadeEspecial.html',
              controller: 'criaAtividadeEspecialCtrl',
              size: 'lg',
              resolve: {
                  tipoatividadesespecial: function() {
                      return $scope.tipoatividadesespecial;
                    },
                  usuario: function(){
                    return $scope.usuario;
                  }
              }
         });

          modalInstance.result
              .then(function(result) {
                dataFactory.saveUrl(result.atividadeEspecial, 'atividadesespeciais').then(function success(response){
                  $scope.reload();
                }, function error(response){
                  console.log(response)
                })
              }, function(exit) {

              });
      };


      $scope.addPalavraChave = function() {
          $scope.palavrasChave.push("");
      };

      $scope.remPalavraChave = function() {
          $scope.palavrasChave.pop();
      };

      $scope.limpaPalavraChave = function() {
          $scope.palavrasChave = $scope.palavrasChave.filter(function(d){
            return d.trim()!="";
          })
      };
    };

    atividadeCtrl.$inject = ['$scope', '$uibModal', 'dataFactory', 'loginFactory'];

    angular.module('controleApp')
        .controller('atividadeCtrl', atividadeCtrl);

    var deepCopy = function(object){
      if(object){
        return JSON.parse(JSON.stringify(object));
      } else{
        return {};
      }
    }

//CRIA ATIV ESPECIAL CONTROLLER ----------------------------------------------------------------------
    var criaAtividadeEspecialCtrl = function($scope, $uibModalInstance, tipoatividadesespecial, usuario) {

       $scope.tipoatividadesespecial = deepCopy(tipoatividadesespecial);

       $scope.regimes = ['Turno', 'Integral', 'Serviço', 'Saindo de serviço'];

       $scope.atividadeEspecial = {};

        $scope.finaliza = function(){
          $scope.atividadeEspecial.operador = usuario;
          $scope.atividadeEspecial.status = 'Em execução';
          $scope.atividadeEspecial.dataInicio = new Date().toISOString();
          $scope.atividadeEspecial.atividadeTecnica = ($scope.atividadeTecnica === 'sim');
          $uibModalInstance.close({atividadeEspecial: $scope.atividadeEspecial})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    criaAtividadeEspecialCtrl.$inject = ['$scope', '$uibModalInstance', 'tipoatividadesespecial', 'usuario'];

    angular.module('controleApp')
        .controller('criaAtividadeEspecialCtrl', criaAtividadeEspecialCtrl);

//CRIA ATIV ESPECIAL CONTROLLER ----------------------------------------------------------------------
    var addRegimeCtrl = function($scope, $uibModalInstance) {

       $scope.regimes = ['Turno', 'Integral', 'Serviço', 'Saindo de serviço'];

        $scope.finaliza = function(){
          $uibModalInstance.close({regime: $scope.regime})
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    addRegimeCtrl.$inject = ['$scope', '$uibModalInstance'];

    angular.module('controleApp')
        .controller('addRegimeCtrl', addRegimeCtrl);


//confirmaCtrl
var confirmaCtrl = function($scope, $uibModalInstance, msg) {

    $scope.msg= msg;

    $scope.finaliza = function(){
      $uibModalInstance.close({result: true})
    };

    $scope.cancel = function() {
      $uibModalInstance.close({result: false})
    };
};

confirmaCtrl.$inject = ['$scope', '$uibModalInstance', 'msg'];

angular.module('controleApp')
    .controller('confirmaCtrl', confirmaCtrl);


})();
