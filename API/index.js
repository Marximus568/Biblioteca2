import express from "express";
import cors from "cors";
import { pool } from "./conexion_db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// RUTAS PARA USUARIOS
// ================================
// GET - Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", details: error.message });
  }
});

// GET - Obtener un usuario por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuario", details: error.message });
  }
});

// POST - Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  try {
    const {
      nombre_completo,
      password,
      identificacion,
      correo,
      telefono,
      role = "lector",
    } = req.body;

    if (
      !nombre_completo ||
      !password ||
      !identificacion ||
      !correo ||
      !telefono ||
      !role
    ) {
      return res.status(400).json({ error: "Ningún campo puede estar vacío." });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    const [result] = await pool.execute(
      `INSERT INTO usuarios 
        (nombre_completo, password, identificacion, correo, telefono, role, created_at, update_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_completo,
        password,
        identificacion,
        correo,
        telefono,
        role,
        createdAt,
        updatedAt,
      ]
    );

    const [newUser] = await pool.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear usuario", details: error.message });
  }
});

// PUT - Actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { nombre_completo, identificacion, correo, telefono } = req.body;
    const userId = req.params.id;

    if (!nombre_completo || !identificacion || !correo || !telefono) {
      return res.status(400).json({ error: "Ningun campo puede faltar" });
    }

    const [result] = await pool.execute(
      "UPDATE usuarios SET nombre_completo = ?, identificacion = ?, correo = ?, telefono = ? WHERE id_usuario = ?",
      [nombre_completo, identificacion, correo, telefono, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const [updatedUser] = await pool.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [userId]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar usuario", details: error.message });
  }
});

// DELETE - Eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar usuario", details: error.message });
  }
});
// ================================
// RUTAS PARA LIBROS
// ================================

// GET - Obtener todos los libros
app.get("/libros", async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM libros;`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener libros", details: error.message });
  }
});

// GET - Obtener un libro por ID
app.get("/libros/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM libros WHERE isbn = ?`, [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener libro", details: error.message });
  }
});
// POST - Crear un nuevo libro
app.post("/libros", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let { titulo, editorial, anio_publicacion, isbn, estado, autor, link, genre } = req.body;

    if (!titulo || !isbn) {
      return res.status(400).json({ error: "El título y el ISBN son requeridos" });
    }

    // Convertir campos vacíos o undefined a null
    editorial = editorial || null;
    anio_publicacion = anio_publicacion || null;
    genre = genre || null;
    estado = estado || null;
    autor = autor || null;
    link = link || null;

    // Insertar el libro
    const [result] = await connection.execute(
      `INSERT INTO libros (titulo, editorial, anio_publicacion, isbn, genre, estado, autor, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, editorial, anio_publicacion, isbn, genre, estado, autor, link]
    );

    await connection.commit();
    res.status(201).json({ message: "Libro creado exitosamente" });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "El código del libro ya existe" });
    } else {
      res.status(500).json({ error: "Error al crear libro", details: error.message });
    }
  } finally {
    connection.release();
  }
});

// PUT - Actualizar un libro
app.put("/libros/:id", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let { titulo, editorial, anio_publicacion, genre, estado, autor, link } = req.body;
    const isbn = req.params.id;

    if (!titulo || !isbn) {
      return res.status(400).json({ error: "El título y el ISBN son requeridos" });
    }

    // Convertir campos vacíos o undefined a null
    editorial = editorial || null;
    anio_publicacion = anio_publicacion || null;
    genre = genre || null;
    estado = estado || null;
    autor = autor || null;
    link = link || null;

    // Actualizar el libro
    const [result] = await connection.execute(
      `UPDATE libros 
       SET titulo = ?, editorial = ?, anio_publicacion = ?, genre = ?, estado = ?, autor = ?, link = ?
       WHERE isbn = ?`,
      [titulo, editorial, anio_publicacion, genre, estado, autor, link, isbn]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    // Obtener el libro actualizado
    const [updatedLibro] = await connection.execute(
      "SELECT * FROM libros WHERE isbn = ?",
      [isbn]
    );

    await connection.commit();
    res.json(updatedLibro[0]);
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "El código del libro ya existe" });
    } else {
      res.status(500).json({ error: "Error al actualizar libro", details: error.message });
    }
  } finally {
    connection.release();
  }
});


// DELETE - Eliminar un libro
app.delete("/libros/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM libros WHERE isbn = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json({ message: "Libro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar libro", details: error.message });
  }
});

// ================================
// RUTAS PARA INVENTARIO DE USUARIO
// ================================

// GET - Obtener libros de un usuario
app.get("/usuarios/:id_usuario/libros", async (req, res) => {
  try {
    const userId = req.params.id_usuario;

    const [rows] = await pool.execute(
      `SELECT l.* 
       FROM libros l
       INNER JOIN usuario_libros ul ON l.isbn = ul.isbn
       WHERE ul.id_usuario = ?`,
      [userId]
    );

    // Devuelve array vacío si no hay libros
    res.json(rows || []);
  } catch (err) {
    console.error("Error al obtener libros del usuario:", err);
    res
      .status(500)
      .json({
        error: "Error al obtener los libros del usuario",
        details: err.message,
      });
  }
});

// POST - Agregar libro al inventario del usuario
app.post("/usuarios/:id_usuario/libros", async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const { isbn } = req.body;

    // Verificar que el libro existe
    const [libro] = await pool.execute("SELECT * FROM libros WHERE isbn = ?", [
      isbn,
    ]);
    if (libro.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    // Insertar en usuario_libros (maneja duplicados)
    try {
      await pool.execute(
        "INSERT INTO usuario_libros (id_usuario, isbn) VALUES (?, ?)",
        [id_usuario, isbn]
      );
      res.json({ message: "Libro agregado al usuario" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "El usuario ya tiene este libro" });
      } else {
        throw err;
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error agregando libro al usuario",
        details: err.message,
      });
  }
});

// ================================
// RUTAS ADICIONALES ÚTILES
// ================================

// GET - Obtener libros por estado
app.get("/libros/estado/:estado", async (req, res) => {
  try {
    const estado = req.params.estado; // ejemplo: 'disponible'
    const [rows] = await pool.execute(
      `SELECT titulo, editorial, anio_publicacion, isbn, estado, autor, link 
       FROM libros 
       WHERE estado = ?`,
      [estado]
    );
    res.json(rows); // devuelve array aunque esté vacío
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error al obtener libros por estado",
        details: err.message,
      });
  }
});

// GET - Obtener libros de un usuario
app.get("/usuarios/:id_usuario/libros", async (req, res) => {
  try {
    const userId = req.params.id_usuario;
    const [rows] = await pool.execute(
      `SELECT l.* 
       FROM libros l
       INNER JOIN usuario_libros ul ON l.isbn = ul.isbn
       WHERE ul.id_usuario = ?`,
      [userId]
    );
    res.json(rows || []); // devuelve array vacío si no hay libros
  } catch (err) {
    console.error("Error al obtener libros del usuario:", err);
    res
      .status(500)
      .json({
        error: "Error al obtener los libros del usuario",
        details: err.message,
      });
  }
});

// POST - Agregar libro al inventario del usuario
app.post("/usuarios/:id_usuario/libros", async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const { isbn } = req.body;

    // Verificar que el libro existe
    const [libro] = await pool.execute("SELECT * FROM libros WHERE isbn = ?", [
      isbn,
    ]);

    if (libro.length === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    // Insertar en usuario_libros (si ya existe, devolver error)
    try {
      await pool.execute(
        "INSERT INTO usuario_libros (id_usuario, isbn) VALUES (?, ?)",
        [id_usuario, isbn]
      );
      res.json({ message: "Libro agregado al usuario" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "El usuario ya tiene este libro" });
      } else {
        throw err;
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error agregando libro al usuario",
        details: err.message,
      });
  }
});
// DELETE - Eliminar libro del inventario de un usuario
app.delete('/usuarios/:id/libros/:isbn', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const idUsuario = parseInt(req.params.id, 10);
    const isbnLibro = req.params.isbn?.toString().trim();

    if (isNaN(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    if (!isbnLibro) {
      return res.status(400).json({ error: 'ISBN es requerido' });
    }

    // Verificar usuario
    const [userRows] = await connection.execute(
      'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
      [idUsuario]
    );
    if (!userRows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar libro
    const [bookRows] = await connection.execute(
      'SELECT isbn FROM libros WHERE isbn = ?',
      [isbnLibro]
    );
    if (!bookRows.length) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verificar relación usuario-libro
    const [relationRows] = await connection.execute(
      'SELECT * FROM usuario_libros WHERE id_usuario = ? AND isbn = ?',
      [idUsuario, isbnLibro]
    );
    if (!relationRows.length) {
      return res.status(404).json({ error: 'Este libro no está en la biblioteca del usuario' });
    }

    // Eliminar relación
    const [deleteResult] = await connection.execute(
      'DELETE FROM usuario_libros WHERE id_usuario = ? AND isbn = ?',
      [idUsuario, isbnLibro]
    );
    if (!deleteResult || deleteResult.affectedRows === 0) {
      return res.status(400).json({ error: 'No se pudo eliminar el libro' });
    }

    res.status(200).json({
      message: 'Libro eliminado correctamente',
      data: { id_usuario: idUsuario, isbn: isbnLibro }
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error interno al eliminar libro',
      details: err.message
    });
  } finally {
    if (connection) connection.release();
  }
});



// GET - Buscar libros por título
app.get("/libros/buscar/titulo", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
    }

    const [rows] = await pool.execute(
      `
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.titulo LIKE ?
      GROUP BY l.id_libro
    `,
      [`%${q}%`]
    );

    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en la búsqueda", details: error.message });
  }
});

// GET - Obtener libros por estado
app.get("/libros/:estado", async (req, res) => {
  try {
    const estado = req.params.estado;

    const [rows] = await pool.execute(
      `SELECT 
         titulo,
         editorial,
         anio_publicacion,
         isbn,
         estado,
         autor,
         link
       FROM libros
       WHERE estado = ?`,
      [estado]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron libros con ese estado" });
    }

    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener libros por estado",
        details: error.message,
      });
  }
});

// Middleware de manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
