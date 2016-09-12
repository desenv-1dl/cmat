(function() {
    "use strict";
    var dataFactory = function($http, $q) {
        var factory = {};

        factory.secoes = [];
        factory.funcoes = [];


        var url = {};
        var urlpath = 'http://localhost:3001/data/'
        var classes = ['secoes', 'fases', 'subfases', 'funcoes', 'projetos', 'subprojetos', 'usuarios', 'tarefas', 'atividades', 'molduras', 'atividadesespeciais', 'tipoatividadesespecial']

        classes.forEach(function(d){
          url[d] = urlpath + d;
        })

        factory.loadUrl = function(classe){
            //promise that the data will load
            var q = $q.defer();

            factory[classe] = null;

            $http({
                method: 'GET',
                url: url[classe]
            }).then(function successCallback(response) {
                //merge arrays
                factory[classe] = response.data;

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };


        factory.saveUrl = function(data, classe){
            //promise that the data will load
            var q = $q.defer();

            $http({
                method: 'POST',
                url: url[classe],
                data: data
            }).then(function successCallback(response) {
                //merge arrays
                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        factory.updateUrl = function(data, classe){
            //Só pode dar update em 1 record
            var q = $q.defer();

            $http({
                method: 'PUT',
                url: url[classe]+'/'+data._id,
                data: data
            }).then(function successCallback(response) {
                //merge arrays
                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };



        factory.pesquisaMi = function(nome){
            //promise that the data will load
            var q = $q.defer();

            factory.listaMi = null;

            var buscaUrl = url['molduras'] + '?buscami='+nome

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                factory.listaMi = response.data;

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };


        //retorna a atividades pausadas pelo usuário
        factory.getAtividadesIniciadas = function(usuario){
            //promise that the data will load
            var q = $q.defer();

            var usuarioId = usuario._id;

            var buscaUrl = url['atividades'] + "?usuario="+usuarioId+'&status=Iniciado';

            factory.atividadesIniciadas =[];

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                var dados1 = response.data;
                if(response.data.length>0){
                  dados1.forEach(function(d){
                    d.nome = d.tarefa.mi+" - "+d.subfase.nome;
                  })
                }

                var buscaUrl = url['atividadesespeciais'] + "?usuario="+usuarioId+'&status=Iniciado';
                $http({
                    method: 'GET',
                    url: buscaUrl
                }).then(function successCallback(response) {
                    //merge arrays
                    //deve ser somente uma atividade
                    var dados2 = response.data;
                    if(response.data.length>0){
                      dados2.forEach(function(d){
                        d.nome = d.tipoAtividadeEspecial.nome;
                      })
                    }
                    factory.atividadesIniciadas = factory.atividadesIniciadas.concat(dados1,dados2);

                    q.resolve('success');

                }, function errorCallback(response) {
                    //FIXME show message Layer not available
                     q.reject('erro');
                });

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        //retorna a atividade em execução pelo usuário
        factory.getAtividadeEmExecucao = function(usuario){
            //promise that the data will load
            var q = $q.defer();


            factory.atividadeEmExecucao = null;

            var usuarioId = usuario._id;
            var buscaUrl = url['atividades'] + "?usuario="+usuarioId+'&status=Em execução';

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                if(response.data[0] != undefined){
                  factory.atividadeEmExecucao = response.data[0];
                  factory.atividadeEmExecucao.nome = factory.atividadeEmExecucao.tarefa.mi+" - "+factory.atividadeEmExecucao.subfase.nome;
                  q.resolve('success');
                } else {
                  var buscaUrl = url['atividadesespeciais'] + "?usuario="+usuarioId+'&status=Em execução';
                  $http({
                    method: 'GET',
                    url: buscaUrl
                  }).then(function successCallback(response) {
                      if(response.data[0] != undefined){
                        factory.atividadeEmExecucao = response.data[0];
                        factory.atividadeEmExecucao.nome = factory.atividadeEmExecucao.tipoAtividadeEspecial.nome;
                      }

                    q.resolve('success');
                  }, function errorCallback(response) {
                    //FIXME show message Layer not available
                    q.reject('erro');
                  });
                }

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        //retorna a atividade em execução pelo usuário
        factory.getHistorioUsuario = function(usuario){
            //promise that the data will load
            var q = $q.defer();

            factory.historicoUsuario = null;

            var usuarioId = usuario._id;

            var buscaUrl = url['atividades'] + "?usuario="+usuarioId+'&status=Pausado,Finalizado';

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                factory.historicoUsuario = response.data;

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };


        function converteHoras(minutos){
          var horas = Math.floor( minutos / 60);
          var min = minutos % 60;

          if(horas<10){
            horas = "0"+horas;
          }

          if(min<10){
            min = "0"+min;
          }

          return horas+":"+min;
        }

        factory.getHistorioUsuarioEspecial = function(usuario){
            //promise that the data will load
            var q = $q.defer();

            factory.historicoUsuarioEspecial = null;

            var usuarioId = usuario._id;

            var buscaUrl = url['atividadesespeciais'] + "?usuario="+usuarioId+'&status=Pausado,Finalizado';

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                factory.historicoUsuarioEspecial = response.data;

                factory.historicoUsuarioEspecial.forEach(function(d){
                  d.tempoTotal = converteHoras(d.horasTrabalhadas);
                });

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        factory.sumarizaHistoricoUsuario = function(historico){

          //historico é um array de atividades;
          var tarefa_subfase = [];
          historico.forEach(function(ativ){
            var match = false;
            tarefa_subfase.forEach(function(d){
              if(d.tarefa._id === ativ.tarefa._id && d.subfase._id === ativ.subfase._id){
                match = true;
                d.tempoTotal += ativ.horasTrabalhadas;
                //errado
              }
            })
            if(!match){
              tarefa_subfase.push({tarefa: ativ.tarefa, subfase: ativ.subfase, usuario: ativ.usuario, tempoTotal: ativ.horasTrabalhadas})
            }
          })


          tarefa_subfase.forEach(function(d){
              d.tempoTotal = converteHoras(d.tempoTotal);
          });

          return tarefa_subfase;
        }

        //retorna as duas primeiras atividades referentes a um usuario
        factory.getAtividadePrioritaria = function(usuario){
            //promise that the data will load
            var q = $q.defer();

            factory.atividadePrioritaria1 = null;
            factory.atividadePrioritaria2 = null;

            var usuarioId = usuario._id;

            var buscaUrl = url['atividades'] + "?status=Não iniciado&usuario_fila="+usuarioId+
              '&orderby=prioridade&count=2';

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                factory.atividadePrioritaria1 = response.data[0];
                factory.atividadePrioritaria2 = response.data[1];

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };


        //retorna a atividade em execução de uma secao
        factory.getAtividadeEmExecucaoSecao = function(secao){
            //promise that the data will load
            var q = $q.defer();

            var secaoId = secao._id;

            factory.atividadeEmExecucaoSecao = [];

            var buscaUrl = url['atividades'] + "?secao="+secaoId+'&status=Em execução,Iniciado';

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                var dados1 = response.data;
                if(response.data.length>0){
                  dados1.forEach(function(d){
                    d.nome = d.tarefa.mi+" - "+d.subfase.nome;
                  })
                }
                var buscaUrl = url['atividadesespeciais'] + "?secao="+secaoId+'&status=Em execução,Iniciado';

                $http({
                    method: 'GET',
                    url: buscaUrl
                }).then(function successCallback(response) {
                  var dados2 = response.data;
                  if(response.data.length>0){
                    dados2.forEach(function(d){
                      d.nome = d.tipoAtividadeEspecial.nome;
                    })
                  }
                  factory.atividadeEmExecucaoSecao = factory.atividadeEmExecucaoSecao.concat(dados1,dados2);

                    q.resolve('success');
                }, function errorCallback(response) {
                    //FIXME show message Layer not available
                     q.reject('erro');
                });


            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        //retorna a atividade em execução de uma secao
        factory.getAtividadeDistribuidaSecao = function(secao, distribuida){
            //distribuida = 1 retorna as atividades distribuidas, distribuida = 0 as não distribuidas

            //promise that the data will load
            var q = $q.defer();

            factory.atividadeDistribuidaSecao = null;
            factory.atividadeNaoDistribuidaSecao = null;


            var secaoId = secao._id;

            //parametro distribuida=1 retorna as atividaades que foram distribuidas
            var buscaUrl = url['atividades'] + "?secao="+secaoId+'&status=Não iniciado&distribuida='+distribuida;

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                //deve ser somente uma atividade
                if(distribuida === 1){
                  factory.atividadeDistribuidaSecao = response.data;

                  factory.atividadeDistribuidaSecao.forEach(function(d){
                    d.usuariosTexto = d.filaOperador.map(function(e){
                        return e.postGrad+" "+e.nomeGuerra;
                    }).join(', ')
                  })

                } else {
                  factory.atividadeNaoDistribuidaSecao = response.data;
                }

                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        //retorna todos os usuarios de uma secao
        factory.getUsuariosSecao = function(secao){
            //promise that the data will load
            var q = $q.defer();

            factory.usuariosSecao = null;

            var secaoId = secao._id;

            var buscaUrl = url['usuarios'] + "?secao="+secaoId

            $http({
                method: 'GET',
                url: buscaUrl
            }).then(function successCallback(response) {
                //merge arrays
                factory.usuariosSecao = response.data;
                q.resolve('success');

            }, function errorCallback(response) {
                //FIXME show message Layer not available
                 q.reject('erro');
            });

            return q.promise;
        };

        return factory

}
    dataFactory.$inject = ['$http', '$q'];

    angular.module('controleApp')
        .factory('dataFactory', dataFactory);

})();
