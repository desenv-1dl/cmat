(function () {
  'use strict';

  var mainCtrl = function ($scope, loginFactory, $location) {
    //redireciona usuário não logado.
    if (!('perfil' in loginFactory.usuario)) {
      $location.path('');
    } else {
      $scope.usuario = loginFactory.usuario;

      if (loginFactory.usuario.perfil === 'Administrador') {
        $scope.abaAtiva = 'projetos';
      } else if (loginFactory.usuario.perfil === 'Visualizador') {
        $scope.abaAtiva = 'relatorio_geral';
      } else {
        $scope.abaAtiva = 'atividades';
      }
    }

    $scope.logout = function () {
      loginFactory.logout();
      $location.path('');
    };

    $scope.acessa = function (area) {
      var disponiveis = [];
      if (loginFactory.usuario.perfil === 'Operador') {
        disponiveis = ['atividades', 'relatorio_ind'];
      }

      if (loginFactory.usuario.perfil === 'Gerente de Fluxo') {
        disponiveis = ['atividades', 'relatorio_ind', 'g_fluxo', 'relatorio_geral'];
      }

      if (loginFactory.usuario.perfil === 'Chefe de Seção') {
        disponiveis = ['atividades', 'relatorio_ind', 'g_fluxo', 'g_usuarios', 'relatorio_geral'];
      }

      if (loginFactory.usuario.perfil === 'Visualizador') {
        disponiveis = ['relatorio_geral'];
      }

      if (loginFactory.usuario.perfil === 'Administrador') {
        disponiveis = ['usuarios', 'projetos', 'sdt'];
      }

      if (disponiveis.indexOf(area) != -1) {
        return true;
      } else {
        return false;
      }
    };

  };

  mainCtrl.$inject = ['$scope', 'loginFactory', '$location'];

  angular.module('controleApp')
    .controller('mainCtrl', mainCtrl);

})();
