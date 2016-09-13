(function () {
  'use strict';

  var settings = require('../config.json');

  var promise = require('bluebird');
  var options = {
    // Initialization Options
    promiseLib: promise,
  };
  var pgp = require('pg-promise')(options);
  var db = pgp(settings.connectionString);

  function getEquipamentos(req, res, next) {
    db.any('select * from equipamento')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Recuperado todos os equipamentos',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getCautelas(req, res, next) {
    db.any('select * from cautela')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Recuperado todas as cautelas',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getManutencoes(req, res, next) {
    db.any('select * from manutencao')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Recuperado todas as manutenções',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getCautelasByEquipId(req, res, id, next) {
    db.any('select * from cautela as c inner join cautela_equipamento as ce ' +
            'on c.id = ce.cautela_id where equipamento_id = $1', id)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Recuperado todas as cautelas para um determinado equipamento',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getManutencoesByEquipId(req, res, id, next) {
    db.any('select * from manutencao where equipamento_id = $1', id)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Recuperado todas as manutenções para um determinado equipamento',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  module.exports.getEquipamentos = getEquipamentos;
  module.exports.getCautelas = getCautelas;
  module.exports.getCautelasByEquipId = getCautelasByEquipId;
  module.exports.getManutencoes = getManutencoes;
  module.exports.getManutencoesByEquipId = getManutencoesByEquipId;

})();
