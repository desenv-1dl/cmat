(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var bodyParser = require('body-parser');
  var cors = require('cors');

  // create application/json parser
  var jsonParser = bodyParser.json();

  //Javascript com operações de banco
  var operations = require('../src/operations');

  //CORS middleware
  router.use(cors({
    exposedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Link, Location',
  }));

  router.get('/equipamentos', function (req, res, next) {
    operations.getEquipamentos(req, res, next);
  });

  router.post('/equipamentos', jsonParser, function (req, res, next) {
    operations.postEquipamentos(req, res, req.body, next);
  });

  router.get('/cautelas', function (req, res, next) {
    operations.getCautelas(req, res, next);
  });

  router.post('/cautelas', jsonParser, function (req, res, next) {
    operations.postCautelas(req, res, req.body, next);
  });

  router.put('/cautelas/:id', jsonParser, function (req, res, next) {
    operations.putCautelas(req, res, parseInt(req.params.id), req.body, next);
  });

  router.get('/manutencoes', function (req, res, next) {
    operations.getManutencoes(req, res, next);
  });

  router.post('/manutencoes', jsonParser, function (req, res, next) {
    operations.postManutencoes(req, res, req.body, next);
  });

  router.put('/manutencoes/:id', jsonParser, function (req, res, next) {
    operations.putManutencoes(req, res, parseInt(req.params.id), req.body, next);
  });

  module.exports = router;
})();
