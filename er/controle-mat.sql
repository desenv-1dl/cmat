BEGIN;
CREATE TABLE equipamento(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255),
	fabricante VARCHAR(255),
	tipo VARCHAR(255),
	carga VARCHAR(255), --NUMERO DE CARGA NO SISCOFIS
	situacao INTEGER NOT NULL,
	foto bytea
);
GRANT ALL ON TABLE equipamento TO public;
--##########################################
CREATE TABLE cautela(
	id SERIAL NOT NULL PRIMARY KEY,
	numero VARCHAR(255) NOT NULL, --AUTOMATIZAR O NUMERO CONCATENADO COM O ANO
	operador VARCHAR(255) NOT NULL,
	missao VARCHAR(255),
	data_inicio DATE NOT NULL,
	data_fim DATE
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
	valor REAL,
	equipamento_id INTEGER NOT NULL REFERENCES equipamento (id)
);
GRANT ALL ON TABLE manutencao TO public;
--############################################################
--CREATE TABLE documento(
--);
COMMIT;
