(function() {
    'use strict';

    var relatorioIndCtrl = function($scope, $uibModal, loginFactory, dataFactory) {

       $scope.usuario = loginFactory.usuario;

        $scope.reload = function(){
          dataFactory.getHistorioUsuario($scope.usuario).then(function success(response){
            $scope['atividades'] = dataFactory['historicoUsuario'];

            $scope.atividadesSum = dataFactory.sumarizaHistoricoUsuario($scope.atividades);

          }, function error(response){
          })

          dataFactory.getHistorioUsuarioEspecial($scope.usuario).then(function success(response){
            $scope['atividadesEspeciais'] = dataFactory['historicoUsuarioEspecial'];

          }, function error(response){
          })

        }
        $scope.reload();




        $scope.dateOptions = {
          startingDay: 1
        };


        $scope.open1 = function() {
            $scope.popup1.opened = true;
          };

          $scope.open2 = function() {
            $scope.popup2.opened = true;
          };
          $scope.popup1 = {
              opened: false
          };

          $scope.popup2 = {
            opened: false
          };


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

    };

    relatorioIndCtrl.$inject =  ['$scope', '$uibModal', 'loginFactory', 'dataFactory'];

    angular.module('controleApp')
        .controller('relatorioIndCtrl', relatorioIndCtrl);

})();
