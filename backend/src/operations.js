
//https://www.npmjs.com/package/mongoose-geojson-schema
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var settings = require('../config.json');

//connects to mongodb
var db = mongoose.createConnection(settings.db, function(error){
	if(error){
		console.log(error);
	}
});


var Schema = mongoose.Schema;

var secaoSchema = new Schema({
  nome:  String
});
var Secao = db.model('Secao', secaoSchema);

var funcaoSchema = new Schema({
  nome:  String,
  secao: secaoSchema
});
var Funcao = db.model('Funcao', funcaoSchema);

var usuarioSchema = new Schema({
  nome:  String,
  nomeGuerra: String,
  login:   String,
  senha: String,
  postGrad:  {type: String, enum: ['MOT', 'Civil', 'Sd', 'Cb', '3ºSgt', '2ºSgt', '1ºSgt',
              'STen', 'Asp', '2ºTen', '1ºTen', 'Cap', 'Maj', 'TC', 'Cel', 'Gen']},
  turno:  {type: String, enum: ['Integral', 'Manhã', 'Tarde']},
  secao: secaoSchema,
  perfil:  {type: String, enum: ['Operador', 'Gerente de Fluxo', 'Chefe de Seção',
              'Visualizador', 'Administrador']},
  funcoes: [{funcao: funcaoSchema, dataInicio: Date, dataFim: Date }],
	funcoesTexto: String
});
var Usuario = db.model('Usuario', usuarioSchema);

var faseSchema = new Schema({
  nome:  String
});
var Fase = db.model('Fase', faseSchema);

var subfaseSchema = new Schema({
  nome:  String,
  fase: faseSchema,
  funcoes: [funcaoSchema],
	funcoesTexto: String
});

subfaseSchema.post('update', function() {
	  //encontra documentos que tiveram update
		this.find({}, function(err,doc){
			doc.forEach(function(d){
				d.funcoesTexto = d.funcoes.map(function(d){
					return d.nome;
				}).join(',')
				d.save();
			})
		})
});

var Subfase = db.model('Subfase', subfaseSchema);

var projetoSchema = new Schema({
  nome:  String
});
var Projeto = db.model('Projeto', projetoSchema);

var subProjetoSchema = new Schema({
  nome:  String,
  projeto: projetoSchema,
  subfases: [{subfase: subfaseSchema, ordem: Number}],
});

subProjetoSchema.post('find', function(doc, next) {
	//pega tarefas de um projeto
	var aux = {};
	doc.forEach(function(d){
		aux[d._id] = []
	})

	Tarefa.find({},function(err,documents){
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		doc.forEach(function(d){
			documents.forEach(function(tar){
				if(tar.subprojeto._id.toString() === d._id.toString()){
					aux[d._id].push(tar)
				}
			})
		})
		doc.forEach(function(d){
			d.set('tarefas', aux[d._id], {strict: false})
		})
		next();
	})

});

var Subprojeto = db.model('Subprojeto', subProjetoSchema);


var tarefaSchema = new Schema({
  mi: String,
  inom: String,
  escala: Number,
  asc:  {type: String, enum: ['1ª DL', 'CIGEX', '3ª DL', '4ª DL', '5ª DL']},
	subprojeto: subProjetoSchema,
  subfaseAtual: subfaseSchema,
  concluido: Boolean,
  nomeFolha: String,
  palavrasChave: [String],
  datasetIndividual: String,
  datasetContinuo: String,
  geometria: mongoose.Schema.Types.Polygon
});
var Tarefa = db.model('Tarefa', tarefaSchema);

var tipoAtividadeEspecialSchema = new Schema({
  nome:  String,
  descricao: String
});
var Tipoatividadeespecial = db.model('Tipoatividadeespecial', tipoAtividadeEspecialSchema);

var atividadeSchema = new Schema({
  operador: usuarioSchema,
  dataInicio: Date,
  dataFim:   Date,
  horasTrabalhadas: Number,
  tarefa: tarefaSchema,
	subfase: subfaseSchema,
  status:  {type: String, enum: ['Em execução', 'Pausado', 'Finalizado', 'Iniciado', 'Não iniciado']},
  regime:  {type: String, enum: ['Turno', 'Integral', 'Serviço', 'Saindo de serviço']},
  motivoPausa: tipoAtividadeEspecialSchema,
  filaOperador: [usuarioSchema],
	observacao: String,
	prioridade: Number,
  nomeBloco: String,

});
atividadeSchema.add({atividadesBloco: [atividadeSchema]})
var Atividade = db.model('Atividade', atividadeSchema);

var atividadeEspecialSchema = new Schema({
  operador:  usuarioSchema,
  dataInicio: Date,
  dataFim: Date,
  horasTrabalhadas: Number,
  tipoAtividadeEspecial: tipoAtividadeEspecialSchema,
  status: {type: String, enum: ['Em execução', 'Pausado', 'Finalizado', 'Iniciado', 'Não iniciado']},
  regime: {type: String, enum: ['Turno', 'Integral', 'Serviço', 'Saindo de serviço']},
  observacao: String,
  atividadeTecnica: Boolean
});

var Atividadeespecial = db.model('Atividadeespecial', atividadeEspecialSchema);

//
// function addativ(){
// 	var data1 = new Tipoatividadeespecial({nome: 'Sindicância'})
// 	data1.save();
// 	var data2 = new Tipoatividadeespecial({nome: 'Exame pagamento'})
// 	data2.save();
// 	var data3 = new Tipoatividadeespecial({nome: 'Fim expediente'})
// 	data3.save();
// 	var data4 = new Tipoatividadeespecial({nome: 'Almoço'})
// 	data4.save();
// 	var data5 = new Tipoatividadeespecial({nome: 'Intervalo'})
// 	data5.save();
// 	var data6 = new Tipoatividadeespecial({nome: 'Tabela FME'})
// 	data6.save();
// }
// addativ()

var molduraSchema = new Schema({
	type:  {type: String, enum: ['Feature']},
	geometry: mongoose.Schema.Types.Polygon,
	properties: {
		mi: String,
		inom: String,
		escala: Number,
		asc:  {type: String, enum: ['1ª DL', 'CIGEX', '3ª DL', '4ª DL', '5ª DL']}
	}
});
var Moldura = db.model('Moldura', molduraSchema);

var deepCopy = function(object){
	if(object){
		return JSON.parse(JSON.stringify(object));
	} else{
		return {};
	}
}


function login(req,res){

	Usuario.findOne({nome: req.body.login, senha: req.body.senha},function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result === null){
				//Did not find any entry
				//returns empty feature collection
				return res.json({erro: 'Usuário ou senha inválida'});
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}



function getMolduras(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	if(req.query.mi !== undefined){
		match['properties.mi'] = req.query.mi;
	}

	if(req.query.buscami !== undefined){
		var regex = "^"+req.query.buscami+".*"
		match['properties.mi'] = {'$regex': regex};
	}

	aggregate.push({$match : match});

	Moldura.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function getSecoes(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Secao.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postSecoes(req, res){
	//só insere uma secao
	var novaSecao = new Secao(req.body)

	novaSecao.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});
}


function putSecoes(req, res, id){

	delete req.body._id
	delete req.body.__v

	var id = new mongoose.Types.ObjectId(id);
	//update em funcoes, usuarios, subfases, tarefa, atividade

	//update em fases
	Secao.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		if(result === null){
			//Did not find any entry
			res.status(404).end();
		} else {
			//Found result
			Funcao.update({'secao._id': id}, {$set: {'secao.nome': req.body.nome}}, {multi: true}, function(e, docs){
				if (e){
					console.log(err);
					return res.status(500).end();
				} else {
					console.log(docs)
					return res.status(200).end();
				}
			})
		}
	});
}

function getFuncoes(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Funcao.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postFuncoes(req, res){
	//só insere uma Funcao
	var novaFuncao = new Funcao(req.body)

	novaFuncao.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});

}

function putFuncoes(req, res, id){

	delete req.body._id
	delete req.body.__v

	var id = new mongoose.Types.ObjectId(id);
	//update em usuarios, subfases, tarefa, atividade

	//update em fases
	Funcao.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		if(result === null){
			//Did not find any entry
			res.status(404).end();
		} else {
			//Found result
			Subfase.update({'funcoes._id': id}, {$set: {'funcoes.$.nome': req.body.nome, 'funcoes.$.secao': req.body.secao}}, {multi: true}, function(e, docs){
				if (e){
					console.log(e);
					return res.status(500).end();
				} else {
					return res.status(200).end();
				}
			})
		}
	});
}

function getUsuarios(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};
	//secao
	if(req.query.secao !== undefined){
		var id = new mongoose.Types.ObjectId(req.query.secao);

		match['secao._id'] = id;
	}

	aggregate.push({$match : match});

	Usuario.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postUsuarios(req, res){
	var novoUsuario = new Usuario(req.body)

	novoUsuario.save(function (err, doc) {
	  if (err){
			console.log(err);
			return res.status(500).end();
		}
		return res.status(201).end();
	});
}

function putUsuarios(req, res, id){

	delete req.body._id
	delete req.body.__v

	var id = new mongoose.Types.ObjectId(id);
	//update em atividades, atividadesespeciais

	//update em fases
	Usuario.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		if(result === null){
			//Did not find any entry
			res.status(404).end();
		} else {
			//Found result
			return res.status(200).end();
		}
	});
}

function getFases(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Fase.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postFases(req, res){
	//só insere uma Fase
	var novaFase = new Fase(req.body)

	novaFase.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});
}

function putFases(req, res, id){

	delete req.body._id
	delete req.body.__v


	var id = new mongoose.Types.ObjectId(id);
	//update em subfase, subprojeto, tarefa, atividade

	//update em fases
	Fase.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		if(result === null){
			//Did not find any entry
			res.status(404).end();
		} else {
			//Found result
			Subfase.update({'fase._id': id}, {$set: {'fase.nome': req.body.nome}}, {multi: true}, function(e, docs){
				if (e){
					console.log(err);
					return res.status(500).end();
				} else {
					return res.status(200).end();
				}
			})
		}
	});
}

function getSubfases(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	if(req.query.fase !== undefined){
		var id = new mongoose.Types.ObjectId(req.query.fase);
		match['fase._id'] = id;
	}

	aggregate.push({$match : match});

	Subfase.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postSubfases(req, res){
	//só insere uma subfase
	var novaSubFase = new Subfase(req.body)

	novaSubFase.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});

}

function putSubfases(req, res, id){

	delete req.body._id
	delete req.body.__v

	var id = new mongoose.Types.ObjectId(id);
	//update em subfase, subprojeto, tarefa, atividade

	//update em fases
	Subfase.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		if(result === null){
			//Did not find any entry
			res.status(404).end();
		} else {
			//Found result
			return res.status(200).end();
		}
	});
}

function getProjetos(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Projeto.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postProjetos(req, res){
	//só insere um projeto
	var novoProjeto = new Projeto(req.body)

	novoProjeto.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});

}

//putprojetos

function getSubprojetos(req,res){

	Subprojeto.find({},function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {

			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);

				}
			}
	});
}

function postSubprojetos(req, res){
	//só insere um subprojeto
	// problemas com atomicidade

	var primeiraSub;
	req.body.subfases.forEach(function(s){
		if(s.ordem === 0){
			primeiraSub = s.subfase;
		}
	})

	var secao = primeiraSub.funcoes[0].secao;

	req.body.tarefas.forEach(function(d){
		d.subfaseAtual = primeiraSub;
	})

	//não salva as tarefas
	var novoSubProjeto = new Subprojeto({nome: req.body.nome, projeto: req.body.projeto, subfases: req.body.subfases})

	novoSubProjeto.save(function (err, doc) {
		if (err){
			console.log(err);
			return res.status(500).end();
		}

		req.body.tarefas.forEach(function(d){
			//d.subprojeto = deepCopy(doc);
			d.subprojeto = doc.toObject();
		})


		Tarefa.collection.insert(req.body.tarefas, function(err,results){
			if (err) {
				console.log(err);
				return res.status(500).end();
			} else {
				//garante os Ids;
				//req.body.tarefas = results.ops;
				//pega menor prioridade (maior numero)
				var prioridade = 1;
				var ativQuery = Atividade.find({'subfase.funcoes': { $elemMatch : { 'secao._id': new mongoose.Types.ObjectId(secao._id)}}})
					.sort({prioridade : -1}).limit(1);

				ativQuery.exec(function(err, maxResult){
				    if (err) {
							console.log(err);
							return res.status(500).end();
						}
						if(maxResult.length>0){
							prioridade = maxResult[0].prioridade+1;
						}

						results.ops.forEach(function(d){
							var ativ = {};
							ativ.tarefa = d;
							ativ.subfase = primeiraSub;
							ativ.status = 'Não iniciado';
							ativ.prioridade = prioridade;
							prioridade++;
							var novaAtiv = new Atividade(ativ);
							novaAtiv.save(function (err, doc) {
								if (err){
									console.log(err);
									return res.status(500).end();
								}
							});
						})
						return res.status(201).end();
				});

			}
	})

	});

}

function putSubprojetos(req, res, id){
	//adiciona tarefas
	//cria tarefas e atividades

	//apaga lixo
	delete req.body.__v

	//encontra tarefas pertencentes ao subprojeto
	Tarefa.find({'subprojeto._id': id}, function(err,results){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		}
		//verifica se não encontrou subprojeto correspondente (todo subprojeto já deve ter tarefas)
		if(results.length === 0){
			res.status(404).end();
		} else {
			//descobre quais tarefas estão sendo adicionadas
			var novaTarefas = [];
			req.body.tarefas.forEach(function(d){
				var novo = !results.some(function(tarefa){
					return tarefa._id.toString() === d._id;
				})
				if(novo){
					novaTarefas.push(d)
				}
			})

			//descobre a primeira subfase do subprojeto
			var primeiraSub;
			req.body.subfases.forEach(function(s){
				if(s.ordem === 0){
					primeiraSub = s.subfase;
				}
			})

			//descobre a seção da primeira subfase do projeto
			var secao = primeiraSub.funcoes[0].secao;

			//adiciona informação do subprojeto e subfase atual as tarefas novas
			novaTarefas.forEach(function(d){
				d.subfaseAtual = primeiraSub;
				d.subprojeto = results[0].subprojeto.toObject();
			})

			//insere novas tarefas
			Tarefa.collection.insert(novaTarefas, function(err,tarefasInsert){
					if (err) {
						console.log(err);
						return res.status(500).end();
					} else {
						//pega menor prioridade da seção (maior numero)
						var prioridade = 1;
						var ativQuery = Atividade.find({'subfase.funcoes': { $elemMatch : { 'secao._id': new mongoose.Types.ObjectId(secao._id)}}})
							.sort({prioridade : -1}).limit(1);

						ativQuery.exec(function(err, maxResult){
						    if (err) {
									console.log(err);
									return res.status(500).end();
								}
								if(maxResult.length>0){
									prioridade = maxResult[0].prioridade+1;
								}
							//cria atividades para cada tarefa adicionada
							tarefasInsert.ops.forEach(function(d){
								var ativ = {};
								ativ.tarefa = d;
								ativ.subfase = primeiraSub;
								ativ.prioridade = prioridade;
								prioridade++;
								ativ.status = 'Não iniciado';
								var novaAtiv = new Atividade(ativ);
								novaAtiv.save(function (err, doc) {
									if (err){
										console.log(err);
										return res.status(500).end();
									}
								});
							})
							return res.status(200).end();

						});
					}
			})
		}
	});
}

function getTarefas(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Tarefa.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function getTipoAtividadeEspecial(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};

	aggregate.push({$match : match});

	Tipoatividadeespecial.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function getAtividades(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};
	match['$and'] = [];

	//multiple
	if(req.query.status !== undefined){
		var status = req.query.status.split(',');
		if(status.length >1){
			var or = {};
			or['$or'] = [];
			status.forEach(function(d){
				or['$or'].push({status: d})
			})
			match['$and'].push(or);
		} else{
			match['$and'].push({status: status[0]});
		}
	}

	if(req.query.usuario !== undefined){
		match['$and'].push({'operador._id': new mongoose.Types.ObjectId(req.query.usuario)});
	}

	if(req.query.distribuida !== undefined){
		if(req.query.distribuida === '1'){
			//true
			match['$and'].push({filaOperador: { $gt: [] }});

		} else {
			//false
			match['$and'].push({filaOperador: { $eq: [] }});

		}
	}

	if(req.query.secao !== undefined){
		match['$and'].push({'subfase.funcoes': { $elemMatch : { 'secao._id': new mongoose.Types.ObjectId(req.query.secao)}}});
	}

	if(req.query.usuario_fila !== undefined){
		match['$and'].push({'filaOperador': { $elemMatch : { '_id': new mongoose.Types.ObjectId(req.query.usuario_fila)}}});
	}


	if(match['$and'].length > 0){
		aggregate.push({$match: match});
	} else {
		aggregate.push({$match: {}});
	}


	// sortby = -att1,att2,-att3
	if(req.query.orderby !== undefined){
		var sort = {};
		var atts = req.query.orderby.split(',');
		atts.forEach( function(val){
			if(val.charAt(0) === '-') {
				sort[val.slice( 1 )] = -1;
			} else {
				sort[val] = 1;
			}
		});
		aggregate.push({ $sort: sort });
	}

	//positive integer
	if(req.query.offset !== undefined){
		aggregate.push({ $skip: parseInt(req.query.offset) });
	}

	//positive integer
	if(req.query.count !== undefined){
		aggregate.push({ $limit: parseInt(req.query.count) });
	}

	Atividade.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function putAtividades(req, res, id){

	delete req.body._id
	delete req.body.__v

	Atividade.findById(id,function(err,document){
		if (err) {
			console.log(err);
			return res.status(500).end();
		}
		if(document === null){
			//Did not find any entry
			console.log('erro na query, não retornou resultados')
			res.status(500).end();
		}

		//se estiver mudando prioridade só atualiza prioridade e fila de usuarios
		if(document.prioridade != req.body.prioridade){
			var secao = req.body.subfase.funcoes[0].secao;
			var ativQuery = Atividade.find({'subfase.funcoes': { $elemMatch : { 'secao._id': new mongoose.Types.ObjectId(secao._id)}}})
			.sort({prioridade : 1});

			ativQuery.exec(function(err, results){
				if (err) {
					console.log(err);
					return res.status(500).end();
				}
				if(results === null){
					//Did not find any entry
					console.log('erro na query, não retornou resultados')
					res.status(500).end();
				}

				var count = 1;
				var passed = false;
				results.forEach(function(d,i){
					if(id === d._id.toString()){
						Object.keys(req.body).forEach(function(key){
							d[key] = req.body[key];
						})
						if(d.prioridade === req.body.prioridade){
							count++;
						}
						passed = true;
					} else {
						if((i+1) === req.body.prioridade && !passed){
							count++;
						}
						d.prioridade = count;
						count++;
						if((i+1) === req.body.prioridade && passed){
							count++;
						}
					}
					d.save();
				})
				return res.status(200).end();

			})
		} else {
			//atualiza atividade
			Object.keys(req.body).forEach(function(key){
				document[key] = req.body[key];
			})
			document.save(function (err, doc) {
				if (err){
					console.log(err);
					return res.status(500).end();
				}
			});


			//verifica se Finalizado
			if(req.body.status === 'Finalizado'){
				//cria atividade no proximo ordenamento

				var subfaseatual = req.body.subfase._id;
				var subprojetoId = req.body.tarefa.subprojeto._id;

				Subprojeto.findById(subprojetoId,function(err,subproj){
					if (err) {
						console.log(err);
						return res.status(500).end();
					}
					if(subproj === null){
						//Did not find any entry
						console.log('erro na query, não retornou resultados')
						res.status(500).end();
					}

					var ordemAtual;
					subproj.subfases.forEach(function(s){
						if(s.subfase._id.toString() === subfaseatual){
							ordemAtual = s.ordem;
						}
						if(s.ordem === ordemAtual+1){
							proximaSub = s.subfase;
						}
					})
					var secao = proximaSub.funcoes[0].secao;

					var prioridade = 1;
					var prioridadeQuery = Atividade.find({'subfase.funcoes': { $elemMatch : { 'secao._id': new mongoose.Types.ObjectId(secao._id)}}})
					.sort({prioridade : -1}).limit(1);

					prioridadeQuery.exec(function(err, maxResult){
						if (err) {
							console.log(err);
							return res.status(500).end();
						}
						if(maxResult.length>0){
							prioridade = maxResult[0].prioridade+1;
						}

						var ativ = {};
						ativ.tarefa = req.body.tarefa;
						ativ.subfase = proximaSub;
						ativ.status = 'Não iniciado';
						ativ.prioridade = prioridade;
						var novaAtiv = new Atividade(ativ);
						novaAtiv.save(function (err, doc) {
							if (err){
								console.log(err);
								return res.status(500).end();
							}
						});
					})
				})

			} else if(req.body.status === 'Pausado'){
				//cria copia da atividade
				var ativ = deepCopy(req.body);
				delete ativ.dataFim;
				delete ativ.horasTrabalhadas;
				delete ativ.dataInicio;
				delete ativ.motivoPausa;
				delete ativ.regime;
				ativ.status = 'Iniciado';
				var novaAtiv = new Atividade(ativ);
				novaAtiv.save(function (err, doc) {
					if (err){
						console.log(err);
						return res.status(500).end();
					}
				});

			}

			return res.status(200).end();

		}

	});
}

function getAtividadesEspeciais(req,res){

	//this variable is used for querying mongoDB
	var aggregate = [];
	//just to be able to run aggregate in case of no query parameters
	var match = {};
	match['$and'] = [];

	//multiple
	if(req.query.status !== undefined){
		var status = req.query.status.split(',');
		if(status.length >1){
			var or = {};
			or['$or'] = [];
			status.forEach(function(d){
				or['$or'].push({status: d})
			})
			match['$and'].push(or);
		} else{
			match['$and'].push({status: status[0]});
		}
	}

	if(req.query.usuario !== undefined){
		match['$and'].push({'operador._id': new mongoose.Types.ObjectId(req.query.usuario)});
	}

	if(match['$and'].length > 0){
		aggregate.push({$match: match});
	} else {
		aggregate.push({$match: {}});
	}

	// sortby = -att1,att2,-att3
	if(req.query.orderby !== undefined){
		var sort = {};
		var atts = req.query.orderby.split(',');
		atts.forEach( function(val){
			if(val.charAt(0) === '-') {
				sort[val.slice( 1 )] = -1;
			} else {
				sort[val] = 1;
			}
		});
		aggregate.push({ $sort: sort });
	}

	//positive integer
	if(req.query.offset !== undefined){
		aggregate.push({ $skip: parseInt(req.query.offset) });
	}

	//positive integer
	if(req.query.count !== undefined){
		aggregate.push({ $limit: parseInt(req.query.count) });
	}

	Atividadeespecial.aggregate(aggregate,function(err,result){
		//error
		if (err){
			console.log(err);
			return res.status(500).end();
		} else {
			//results
			if(result.length === 0){
				//Did not find any entry
				//returns empty feature collection
				return res.json([]);
			} else {
				//Found result
				return res.json(result);
				}
			}
	});
}

function postAtividadesEspeciais(req, res, id){
	var novaAtiv = new Atividadeespecial(req.body)

	novaAtiv.save(function (err, doc) {
	  if (err){
			console.log('error');
			return res.status(500).end();
		}
		return res.status(201).end();
	});
}

function putAtividadesEspeciais(req, res, id){

		delete req.body._id
		delete req.body.__v

		var id = new mongoose.Types.ObjectId(id);
		//update em usuarios, subfases, tarefa, atividade

		//update em fases
		Atividadeespecial.findByIdAndUpdate(id, { $set: req.body}, function(err,result){
			//error
			if (err){
				console.log(err);
				return res.status(500).end();
			}
			if(result === null){
				//Did not find any entry
				res.status(404).end();
			} else {
				 if(req.body.status === 'Pausado'){
						 //cria copia da atividade
		 				var ativ = deepCopy(req.body);
		 				delete ativ.dataFim;
		 				delete ativ.horasTrabalhadas;
		 				delete ativ.dataInicio;
		 				delete ativ.motivoPausa;
		 				delete ativ.regime;
		 				ativ.status = 'Iniciado';
		 				var novaAtiv = new Atividadeespecial(ativ);
		 				novaAtiv.save(function (err, doc) {
		 					if (err){
		 						console.log(err);
		 						return res.status(500).end();
		 					}
							return res.status(200).end();
		 				});
				 } else {
					 return res.status(200).end();

				 }
			}
		});
}

// function delFuncoes(res, id){
//
// 	funcoes.findByIdAndRemove(id, function(err,result){
// 		//error
// 		if (err){
// 			console.log(err);
// 			return res.status(500).end();
// 		}
// 		if(result === null){
// 			//Did not find any entry
// 			res.status(404).end();
// 		} else {
// 			//Found result
// 			return res.status(204).end();
// 		}
// 	});
// }
//
// function delSecoes(res, id){
//
// 	secoes.findByIdAndRemove(id, function(err,result){
// 		//error
// 		if (err){
// 			console.log(err);
// 			return res.status(500).end();
// 		}
// 		if(result === null){
// 			//Did not find any entry
// 			res.status(404).end();
// 		} else {
// 			//Found result
// 			return res.status(204).end();
// 		}
// 	});
// }



var get = {}
get.usuarios = getUsuarios;
get.atividades = getAtividades;
get.funcoes = getFuncoes;
get.secoes = getSecoes;
get.projetos = getProjetos;
get.subprojetos = getSubprojetos;
get.fases = getFases;
get.subfases = getSubfases;
get.tarefas = getTarefas;
get.atividadesespeciais = getAtividadesEspeciais;
get.tipoatividadesespecial = getTipoAtividadeEspecial;

get.molduras = getMolduras;

var post = {};
post.usuarios = postUsuarios;
post.funcoes = postFuncoes;
post.secoes = postSecoes;
post.projetos = postProjetos;
post.subprojetos = postSubprojetos;
post.fases = postFases;
post.subfases = postSubfases;
post.atividadesespeciais = postAtividadesEspeciais;
// post.tipoatividadesespecial = postTipoAtividadeEspecial;

var put = {};
put.usuarios = putUsuarios;
put.atividades = putAtividades;
put.funcoes = putFuncoes;
put.secoes = putSecoes;
// put.projetos = putProjetos;
put.subprojetos = putSubprojetos;
 put.fases = putFases;
put.subfases = putSubfases;
// put.tarefas = putTarefas;
put.atividadesespeciais = putAtividadesEspeciais;
// put.tipoatividadesespecial = putTipoAtividadeEspecial;

var del = {};
// del.usuarios = delUsuarios;
// del.atividades = delAtividades;
// del.funcoes = delFuncoes;
// del.secoes = delSecoes;
// del.projetos = delProjetos;
// del.subprojetos = delSubprojetos;
// del.fases = delFases;
// del.subfases = delSubfases;
// del.tarefas = delTarefas;
// del.atividadesespeciais = delAtividadesEspeciais;
// del.tipoatividadesespecial = delTipoAtividadeEspecial;

module.exports.get = get;
module.exports.post = post;
module.exports.del = del;
module.exports.put = put;

module.exports.login = login;
