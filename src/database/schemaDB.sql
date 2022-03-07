DROP TABLE IF EXISTS "db_user";
DROP TABLE IF EXISTS "client";
DROP TABLE IF EXISTS "invoice";

CREATE TABLE db_user (
  id serial PRIMARY KEY,
  cpf varchar(40),
  userName varchar(60) NOT NULL,
  email varchar(30) NOT NULL UNIQUE,
  phone int default NULL,
  passwd text NOT NULL
)



CREATE TABLE "client" (
  id serial PRIMARY KEY,
  cpf bigint NOT NULL UNIQUE,
  username varchar(60) NOT NULL,
  phone bigint NOT NULL,
  email varchar(60) NOT NULL UNIQUE,
  city varchar(60) default NULL,
  cep varchar(30) default NULL,
  uf varchar(20) default NULL,
  street TEXT default NULL,
  region TEXT default NULL,
  complement TEXT default NULL,
  overdue boolean
);

CREATE TABLE "invoice" (
  id serial PRIMARY KEY,
  dueDate timestamptz NOT NULL,
  total int NOT NULL,
  client_id int NOT NULL,
  paidOut boolean NOT NULL,
  description text NOT NULL,
  FOREIGN KEY (client_id) references client (cpf)
);

INSERT INTO client (userName,phone,email,city,cep,uf,street,cpf,region,complement, overdue)
VALUES
  ('Cris Vieira',11943428497,'cris.vieira@yahoo.net','Campo Grande','91511-011','MS','Rua 51',96266121967,'Norte','Nmr 16', true),
  ('Camilla Straider',672234307,'cami-stdr@protonmail.edu','São Bernardo do Campo','62368-470','SP','Rua Cruz Solitária',89940018237,'Sul','Ao lado do mercado', false),
  ('Dio Costa',61958096329,'dicosta@hotmail.net','Manaus','60770-851','AM','Rua General Arqueiro',02180514173,'Centro','P.O. Box 481, apt 9256', true);

INSERT INTO invoice (dueDate, total, client_id, paidOut, description)
VALUES
  ('1549850400000', 500, 96266121967, false, 'Compra de 02 lotes de Red Bull'),
  ('1653102000000', 900, 89940018237, false, 'Serviços de limpeza'),
  ('1599102000000', 2000, 02180514173, true, 'Construção de um castelo Lego');