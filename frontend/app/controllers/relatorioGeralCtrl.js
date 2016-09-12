(function() {
    'use strict';

    var relatorioGeralCtrl = function($scope, dataFactory, c3SimpleService, $timeout) {

      var map;

      $scope.loadMap = function(){
        //Leaflet
        // create a map in the "map" div, set the view to a given place and zoom
        map = L.map("map").setView([-29.04, -51.20], 6);

        // add an OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        //setTimeout(function(){ map.invalidateSize()}, 400);
        $timeout(function(){map.invalidateSize()},400);


      }

      $scope.reload = function(){
            dataFactory.loadUrl('usuarios').then(function success(response){
              dataFactory.usuarios.forEach(function(d){
                d.postoNome = d.postGrad+" "+d.nomeGuerra
              })
              $scope.usuarios = dataFactory.usuarios;
            }, function error(response){
            })
      }
      $scope.reload();

      $scope.loadChartTab = function(){
        $timeout(function(){
          for(var key in c3SimpleService){
            c3SimpleService[key].resize();
          }
        }, 100);
      }

      $scope.chart1 = {
        data : {
          columns: [
            ['Vetorização', 19, 18, 25, 27, 17],
            ['Efetivo', 8, 7, 10, 11, 11]
          ],
          type: 'bar',
          types: {
            'Efetivo': 'spline'
          },
          colors: {
              'Efetivo': '#ff0000',
              'Vetorização': 'green'
          }
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        axis: {
          x:{
            label: {
              text: 'Meses',
              position: 'outer-center'
            },
            type: 'category',
            categories: ['jan 16', 'fev 16', 'mar 16', 'abr 16', 'mai 16']
          },
          y: {
            label: {
              text: 'Cartas por mês',
              position: 'outer-middle'
            }
          }
        }
      };

      $scope.chart2 = {
        data : {
          columns: [
            ['Aquisição', 19, 18, 25, 27, 17],
            ['Efetivo', 8, 7, 10, 11, 11]
          ],
          type: 'bar',
          types: {
            'Efetivo': 'spline'
          },
          colors: {
              'Efetivo': '#ff0000',
              'Aquisição': 'green'
          }
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        axis: {
          x:{
            label: {
              text: 'Meses',
              position: 'outer-center'
            },
            type: 'category',
            categories: ['jan 16', 'fev 16', 'mar 16', 'abr 16', 'mai 16']
          },
          y: {
            label: {
              text: 'Cartas por mês',
              position: 'outer-middle'
            }
          }
        }
      };

      $scope.chart3 = {
        data : {
          columns: [
            ['Validação', 19, 18, 25, 27, 17],
            ['Efetivo', 8, 7, 10, 11, 11]
          ],
          type: 'bar',
          types: {
            'Efetivo': 'spline'
          },
          colors: {
              'Efetivo': '#ff0000',
              'Validação': 'green'
          }
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        axis: {
          x:{
            label: {
              text: 'Meses',
              position: 'outer-center'
            },
            type: 'category',
            categories: ['jan 16', 'fev 16', 'mar 16', 'abr 16', 'mai 16']
          },
          y: {
            label: {
              text: 'Cartas por mês',
              position: 'outer-middle'
            }
          }
        }
      };

      $scope.chart4 = {
        data : {
          columns: [
            ['Média', 40, 39, 36, 34, 35]
          ],
          type: 'bar',
          types: {
            'Média': 'line',
            'Usuário': 'bar'
          },
          colors: {
              'Média': '#ff0000',
              'Usuário': 'green'
          }
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        axis: {
          x:{
            label: {
              text: 'Meses',
              position: 'outer-center'
            },
            type: 'category',
            categories: ['jan 16', 'fev 16', 'mar 16', 'abr 16', 'mai 16']
          },
          y: {
            label: {
              text: 'Horas por atividade',
              position: 'outer-middle'
            }
          }
        }
      };

      $scope.chart5 = {
        data : {
          columns: [
          ],
          type: 'pie'
        }
      };


      $scope.updateUserGraph = function(){
        $scope.selecionado = true;

        var porcentagemAdm = Math.random()/10;
        var porcentagemTec = 1 - porcentagemAdm;
        c3SimpleService['#chart5'].load({
          columns: [
              ["Técnico", porcentagemTec],
              ["Administrativo", porcentagemAdm]
          ]
        });

        var mediaUser = [40+ (Math.random()-0.5)*5,39+(Math.random()-0.5)*5 ,36+(Math.random()-0.5)*5 ,34+(Math.random()-0.5)*5,35+(Math.random()-0.5)*5 ]
        mediaUser = ['Usuário'].concat(mediaUser.map(function(d){
          return Math.floor(d);
        }))

        c3SimpleService['#chart4'].load({
          columns: [
            mediaUser,
            ['Média', 40, 39, 36, 34, 35]
          ]
        });

        //$scope.loadChartTab();
      }

    }
    relatorioGeralCtrl.$inject = ['$scope', 'dataFactory', 'c3SimpleService', '$timeout'];

    angular.module('controleApp')
        .controller('relatorioGeralCtrl', relatorioGeralCtrl);

})();
