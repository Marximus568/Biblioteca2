
CREATE DATABASE biblioteca;
use biblioteca;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nombre_completo VARCHAR(225),
password VARCHAR(225),
identificacion INT UNIQUE,
correo VARCHAR(225),
telefono VARCHAR(225),
role VARCHAR(225),
created_at TIMESTAMP,
update_at TIMESTAMP);


DROP TABLE IF EXISTS libros;
CREATE TABLE libros(
titulo VARCHAR(225),
editorial  VARCHAR(225),
anio_publicacion INT,
isbn VARCHAR(50) NOT NULL PRIMARY KEY,
genre VARCHAR(225),
estado VARCHAR(225),
autor VARCHAR(225),
link VARCHAR(225),
created_at TIMESTAMP,
update_at TIMESTAMP
);

DROP TABLE IF EXISTS estados;
CREATE TABLE estados(
id_estado INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(225),
created_at TIMESTAMP,
update_at TIMESTAMP
);

DROP TABLE IF EXISTS prestamos;
CREATE TABLE prestamos(
id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
fecha_prestamo DATE NULL,
fecha_devolucion DATE NULL,
id_estado INT NULL,
created_at TIMESTAMP,
update_at TIMESTAMP,

FOREIGN KEY (id_estado) REFERENCES estados(id_estado) ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE usuario_libros (
  id_usuario INT NOT NULL,
  isbn VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_usuario, isbn),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (isbn) REFERENCES libros(isbn) ON DELETE CASCADE
);

