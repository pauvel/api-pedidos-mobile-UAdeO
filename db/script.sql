-- 20/10/2020
-- -----------------------------------------------------
-- Table `dbmobile`.`clientes`
-- -----------------------------------------------------


CREATE TABLE clientes(
  id VARCHAR(10) NOT NULL,
  nombrecompleto VARCHAR(100) NOT NULL,
  localidad VARCHAR(25)  NULL,
  direccion VARCHAR(100) NULL,
  cantcompras INT NOT NULL DEFAULT 0,
  impcompras DECIMAL(11,2) NOT NULL DEFAULT 0,
  ult_visita DATETIME NOT NULL DEFAULT current_timestamp,
  password VARCHAR(32) NOT NULL,
  estatus TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Table platillos_categorias
-- -----------------------------------------------------

CREATE TABLE platillos_categorias(
  id SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(18) UNIQUE NOT NULL,
  estatus TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table platillos
-- -----------------------------------------------------

CREATE TABLE platillos(
  id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  precioch DECIMAL(8,2) NOT NULL,
  preciog DECIMAL(8,2) NOT NULL,
  unitario enum('si', 'no') NOT NULL, -- ADDED 26/10/2020
  url TEXT NOT NULL,
  categoria_id SMALLINT UNSIGNED NOT NULL,
  likes INT NULL DEFAULT 0,
  estatus TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (categoria_id) REFERENCES platillos_categorias(id)
);

-- -----------------------------------------------------
-- Table pedidos
-- -----------------------------------------------------

CREATE TABLE pedidos(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_id VARCHAR(10) NOT NULL,
  importe DECIMAL(6,2) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  entrega enum('Para recoger', 'Para entrega') NOT NULL,
  localizacion TEXT NULL,
  ubicacion TEXT NULL,
  comentario TEXT NULL,
  estatus TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- -----------------------------------------------------
-- Table pedidos_detalles
-- -----------------------------------------------------

CREATE TABLE pedidos_detalles(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  platillo_id INT UNSIGNED NOT NULL,
  precio DECIMAL(6,2) NOT NULL,
  cantidad DECIMAL(6,2) NOT NULL,
  importe DECIMAL(6,2) NOT NULL,
  ingredientes TEXT NULL,
  estatus TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (platillo_id) REFERENCES platillos(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table ingredientes
-- -----------------------------------------------------

CREATE TABLE ingredientes(
  id INT UNSIGNED AUTO_INCREMENT NOT NULL ,
  nombre VARCHAR(20) NOT NULL,
  estatus TINYINT(1) UNSIGNED NULL DEFAULT 0, 
  PRIMARY KEY (id)
);
-- -----------------------------------------------------
-- Table EXTRAS
-- -----------------------------------------------------

CREATE TABLE extras(
  id INT AUTO_INCREMENT,
  nombre VARCHAR(25) NOT NULL,
  precio NUMERIC(6,2) NOT NULL,
  url TEXT NOT NULL,
  estatus TINYINT(1) UNSIGNED NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE platillos_con_extras(
  id INT AUTO_INCREMENT NOT NULL,
  platillo_id INT UNSIGNED NOT NULL,
  extra_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (platillo_id) REFERENCES platillos(id) ON DELETE CASCADE,
  FOREIGN KEY (extra_id) REFERENCES extras(id)
);

CREATE TABLE platillos_con_ingredientes(
  id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  platillo_id INT UNSIGNED NOT NULL,
  ingrediente_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (platillo_id) REFERENCES platillos(id) ON DELETE CASCADE,
  FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id)
);

CREATE TABLE clientes_con_favoritos(
  id INT AUTO_INCREMENT NOT NULL,
  cliente_id VARCHAR(10) NOT NULL,
  platillo_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (platillo_id) REFERENCES platillos(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
