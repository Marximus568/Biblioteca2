USE biblioteca;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    role ENUM('admin', 'lector', 'bibliotecario') NOT NULL DEFAULT 'lector'
);

CREATE TABLE autores (
    id_autor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE libros (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    editorial VARCHAR(100),
    anio_publicacion YEAR,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    estado ENUM('disponible', 'prestado', 'reservado', 'dañado') DEFAULT 'disponible'
);

CREATE TABLE libro_autor (
    id_libro INT,
    id_autor INT,
    FOREIGN KEY (id_libro) REFERENCES libros(id_libro) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES autores(id_autor) ON DELETE CASCADE
);
