
CREATE TABLE situacao(
	id SERIAL NOT NULL PRIMARY KEY UNIQUE,
	codigo INTEGER UNIQUE,
	valor VARCHAR(255)
);
INSERT INTO situacao (codigo,valor)VALUES
(1,'Disponível'),
(2,'Inisponível'),
(3,'Em manutenção'),
(4,'Cautelado'),
(5,'Finalizada'),
(6,'Aprovada'),
(7,'Aguardando aprovação'),
(8,'Não enviada');

CREATE TABLE equipamento(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255),
	fabricante VARCHAR(255),
	tipo VARCHAR(255),
	carga VARCHAR(255), --NUMERO DE CARGA NO SISCOFIS
	situacao SMALLINT NOT NULL REFERENCES situacao (codigo) CHECK (situacao IN(1,2,3,4)),
	foto VARCHAR(255)
);
GRANT ALL ON TABLE equipamento TO public;
--##########################################
CREATE TABLE cautela(
	id SERIAL NOT NULL PRIMARY KEY,
	numero VARCHAR(255) NOT NULL, --AUTOMATIZAR O NUMERO CONCATENADO COM O ANO
	operador VARCHAR(255) NOT NULL,
	missao VARCHAR(255),
	data_inicio DATE NOT NULL,
	data_fim DATE,
	situacao SMALLINT REFERENCES situacao(codigo) CHECK (situacao IN(5,6,7,8)),
	observacao TEXT
);
GRANT ALL ON TABLE cautela TO public;
--#############################################

CREATE TABLE cautela_equipamento(
	id SERIAL NOT NULL PRIMARY KEY,
	equipamento_id INTEGER NOT NULL REFERENCES equipamento (id),
	cautela_id INTEGER NOT NULL REFERENCES cautela (id)

);
GRANT ALL ON TABLE cautela_equipamento TO public;
--################################################

CREATE TABLE manutencao(
	id SERIAL NOT NULL PRIMARY KEY,
	data_inicio DATE NOT NULL,
	data_fim DATE,
	descricao TEXT,
	empresa VARCHAR(255),
	valor REAL

);
GRANT ALL ON TABLE manutencao TO public;
--############################################################

CREATE TABLE manutencao_equipamento(
	id SERIAL NOT NULL PRIMARY KEY,
	manutencao_id INTEGER NOT NULL REFERENCES manutencao (id),
	equipamento_id INTEGER NOT NULL REFERENCES equipamento (id)
);
GRANT ALL ON TABLE manutencao_equipamento TO public;
--CREATE TABLE documento(
--);
commit;