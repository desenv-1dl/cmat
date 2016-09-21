BEGIN;

CREATE TABLE IF NOT EXISTS "posto_graduacao" (
  "id" SERIAL NOT NULL PRIMARY KEY ,
  "nome" VARCHAR(45) UNIQUE NOT NULL,
  "nomeAbrev" VARCHAR(15) UNIQUE NOT NULL
  );
INSERT INTO "posto_graduacao" VALUES
(DEFAULT,'Soldado EV','Sd EV'),
(DEFAULT,'Soldado EP','Sd EP'),
(DEFAULT,'Cabo EV','Cb EV'),
(DEFAULT,'Cabo EP','Cb EP'),
(DEFAULT,'Terceiro-Sargento','3º Sgt'),
(DEFAULT,'Segundo-Sargento','2º Sgt'),
(DEFAULT,'Primeiro-Sargento','1º Sgt'),
(DEFAULT,'Subtenente','ST'),
(DEFAULT,'2º Tenente','2º Ten'),
(DEFAULT,'1º Tenente','1º Ten'),
(DEFAULT,'Capitão','Cap'),
(DEFAULT,'Major','Maj'),
(DEFAULT,'Tenente-Coronel','Ten Cel'),
(DEFAULT,'Coronel','Coronel'),
(DEFAULT,'Servidor Civil','SC'),
(DEFAULT,'Mão de Obra Temporária','MOT');


-- -----------------------------------------------------
-- "secao"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "secao" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "nome" VARCHAR(100) UNIQUE NOT NULL
  );
INSERT INTO "secao" VALUES
(DEFAULT,'Vetorização'),
(DEFAULT,'Validação'),
(DEFAULT,'Imagem'),
(DEFAULT,'Edição'),
(DEFAULT,'Secretaria'),
(999,'A ser preenchido');
-- -----------------------------------------------------
-- Table "perfil"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "perfil" (
  "id" smallint NOT NULL PRIMARY KEY,
  "tipo" VARCHAR(50) UNIQUE NOT NULL
  );
INSERT INTO "perfil" VALUES
(0,'Bloqueado'),
(1,'Usuario'),
(2,'Gerente'),
(3,'Administrador');
-- -----------------------------------------------------
-- Table "operador"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "operador" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "nome" VARCHAR(100) NOT NULL,
  "turno" VARCHAR(50) NOT NULL CHECK('turno' IN('Manhã','Tarde','Noite','Integral')),
  "login" VARCHAR(255) UNIQUE NOT NULL,
  "senha" VARCHAR(255) NOT NULL,
  "posto_graduacao_id" smallint NOT NULL REFERENCES "posto_graduacao" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  "secao_id" smallint NOT NULL REFERENCES "secao" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
  
);

CREATE TABLE IF NOT EXISTS "sistema" (
  "id" smallint NOT NULL PRIMARY KEY,
  "nome" VARCHAR(50) UNIQUE NOT NULL,
  "descricao" TEXT
  );


CREATE TABLE IF NOT EXISTS "operador_sistema_perfil" (
  "id" SMALLINT NOT NULL PRIMARY KEY,
  "operador_id" INTEGER NOT NULL REFERENCES "operador" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  "sistema_id" INTEGER NOT NULL REFERENCES "sistema" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  "perfil_id" INTEGER NOT NULL REFERENCES "perfil" ("id") ON DELETE NO ACTION ON UPDATE CASCADE DEFAULT 0,
  "data_hora_login" TIMESTAMP
  );


COMMIT;
