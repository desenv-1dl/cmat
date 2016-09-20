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
    db.task(function (t) {
      return t.batch([
        t.any('SELECT * FROM equipamento'),
        t.any('SELECT ce.*, c.* FROM cautela AS c INNER JOIN cautela_equipamento AS ce ' +
        'ON c.id = ce.cautela_id'),
        t.any('SELECT * FROM manutencao'),
      ]);
    }).then(function (data) {
      data[0].forEach(function (e) {
        e.cautelas = [];
        e.manutencoes = [];
        data[1].forEach(function (c) {
          if (c.equipamento_id === e.id) {
            delete c.equipamento_id;
            delete c.cautela_id;
            e.cautelas.push(c);
          }
        });

        data[2].forEach(function (m) {
          if (m.equipamento_id === e.id) {
            delete m.equipamento_id;
            e.manutencoes.push(m);
          }
        });
      });

      res.status(200).json(data[0]);
    })
    .catch(function (err) {
      return next(err);
    });
  }

  function getCautelas(req, res, next) {
    db.task(function (t) {
      return t.batch([
        db.any('SELECT * FROM cautela'),
        db.any('SELECT ce.*, e.* FROM equipamento AS e INNER JOIN cautela_equipamento AS ce ' +
        'ON e.id = ce.equipamento_id'),
      ]);
    }).then(function (data) {
      data[0].forEach(function (c) {
        c.equipamentos = [];
        c.data_inicio = c.data_inicio.toISOString().split('T')[0];
        c.data_fim = c.data_fim ? c.data_fim.toISOString().split('T')[0] : null;
        data[1].forEach(function (e) {
          if (e.cautela_id === c.id) {
            delete e.cautela_id;
            delete e.equipamento_id;
            c.equipamentos.push(e);
          }
        });
      });

      res.status(200).json(data[0]);
    })
    .catch(function (err) {
      return next(err);
    });
  }

  function getManutencoes(req, res, next) {
    //resolução de conflito de nomes de atributos para pegar id de manutencao
    db.any('SELECT e.*, m.* FROM manutencao AS m INNER JOIN equipamento AS e ' +
          ' ON m.equipamento_id = e.id')
      .then(function (data) {
        data.forEach(function (m) {
          m.data_inicio = m.data_inicio.toISOString().split('T')[0];
          m.data_fim = m.data_fim ? m.data_fim.toISOString().split('T')[0] : null;
          m.equipamento = {};
          m.equipamento.id = m.equipamento_id;
          m.equipamento.nome = m.nome;
          m.equipamento.fabricante = m.fabricante;
          m.equipamento.tipo = m.tipo;
          m.equipamento.carga = m.carga;
          m.equipamento.situacao = m.situacao;
          m.equipamento.foto = m.foto;

          delete m.equipamento_id;
          delete m.nome;
          delete m.fabricante;
          delete m.tipo;
          delete m.carga;
          delete m.disponivel;
          delete m.foto;

        });

        res.status(200).json(data);
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function postEquipamentos(req, res, data, next) {
    db.none('INSERT INTO equipamento(nome, fabricante, tipo, carga, situacao)' +
        'values(${nome}, ${fabricante}, ${tipo}, ${carga}, ${situacao})',
      data)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserido um novo equipamento',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function postManutencoes(req, res, data, next) {
    if (!data.data_fim) {
      data.data_fim = null;
    }

    if (!data.valor) {
      data.valor = null;
    }

    db.none('INSERT INTO manutencao(data_inicio, data_fim, descricao, empresa,' +
        'valor, equipamento_id) values(${data_inicio}, ${data_fim}, ${descricao},' +
        '${empresa}, ${valor}, ${equipamento_id})', data)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserida uma nova manutenção',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function postCautelas(req, res, data, next) {
    if (!data.data_fim) {
      data.data_fim = null;
    }

    //gera numero da cautela automaticamente. Padrão ANO - nº

    var anoAtual = new Date().getFullYear();
    db.tx(function (t) {
        return db.one('SELECT numero FROM cautela WHERE numero LIKE \'$1-%\' ' +
              ' ORDER BY numero DESC LIMIT 1', anoAtual)
          .then(function (result) {
            data.numero = anoAtual + '-' + (parseInt(result.numero.split('-')[1]) + 1).toString();
            console.log(data.numero)

            return t.one('INSERT INTO cautela(numero, operador, missao, data_inicio, data_fim, situacao)' +
            'values(${numero}, ${operador}, ${missao}, ${data_inicio}, ${data_fim}, ${situacao}) returning id',
            data).then(function (resp) {
              var queries = [];
              data.equipamentos.forEach(function (e) {
                queries.push(
                  t.none('INSERT INTO cautela_equipamento(equipamento_id, cautela_id)' +
                  'values($1, $2)', [e, resp.id])
                );
              });

              return t.batch(queries);
            });
        })
      })
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserida uma nova cautela',
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function putManutencoes(req, res, id, data, next) {
    if (!data.data_fim) {
      data.data_fim = null;
    }

    if (!data.valor) {
      data.valor = null;
    }

    db.none('UPDATE manutencao SET data_inicio=$1, data_fim=$2, descricao=$3, ' +
            'empresa=$4, valor=$5, equipamento_id=$6 where id=$7',
            [data.data_inicio, data.data_fim, data.descricao, data.empresa,
            data.valor, data.equipamento_id, id,
      ])
      .then(function () {
        res.status(200)
        .json({
          status: 'success',
          message: 'Manutenção atualizada',
        });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function putCautelas(req, res, id, data, next) {
    if (!data.data_fim) {
      data.data_fim = null;
    }

    db.tx(function (t) {
        return t.none('UPDATE cautela SET numero=$1, operador=$2, data_inicio=$3, ' +
        'data_fim=$4 where id=$5',
        [
          data.numero, data.operador, data.data_inicio, data.data_fim, id,
        ]).then(function () {
          return t.none('DELETE from cautela_equipamento where cautela_id=$1', id)
            .then(function () {
              var queries = [];
              data.equipamentos.forEach(function (e) {
                queries.push(
                  t.none('INSERT INTO cautela_equipamento(equipamento_id, cautela_id)' +
                  'values($1, $2)', [e, id])
                );
              });

              return t.batch(queries);
            });
        });
      })
      .then(function () {
        res.status(200)
        .json({
          status: 'success',
          message: 'Manutenção atualizada',
        });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  module.exports.getEquipamentos = getEquipamentos;
  module.exports.postEquipamentos = postEquipamentos;
  module.exports.getCautelas = getCautelas;
  module.exports.postCautelas = postCautelas;
  module.exports.putCautelas = putCautelas;
  module.exports.getManutencoes = getManutencoes;
  module.exports.postManutencoes = postManutencoes;
  module.exports.putManutencoes = putManutencoes;

})();
