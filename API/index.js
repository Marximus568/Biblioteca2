import express from 'express';
import cors from 'cors';
import { pool } from './conexion_db.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// RUTAS PARA USUARIOS
// ================================

// GET - Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
});

// GET - Obtener un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id_usuario = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
});

// POST - Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, role = 'lector' } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, role) VALUES (?, ?)',
      [nombre, role]
    );

    const [newUser] = await pool.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
});

// PUT - Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nombre, role } = req.body;
    const userId = req.params.id;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, role = ? WHERE id_usuario = ?',
      [nombre, role, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [updatedUser] = await pool.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
});

// DELETE - Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
});

// ================================
// RUTAS PARA AUTORES
// ================================

// GET - Obtener todos los autores
app.get('/autores', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autores');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener autores', details: error.message });
  }
});

// GET - Obtener un autor por ID
app.get('/autores/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autores WHERE id_autor = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener autor', details: error.message });
  }
});

// POST - Crear un nuevo autor
app.post('/autores', async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await pool.execute(
      'INSERT INTO autores (nombre) VALUES (?)',
      [nombre]
    );

    const [newAutor] = await pool.execute(
      'SELECT * FROM autores WHERE id_autor = ?',
      [result.insertId]
    );

    res.status(201).json(newAutor[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear autor', details: error.message });
  }
});

// PUT - Actualizar un autor
app.put('/autores/:id', async (req, res) => {
  try {
    const { nombre } = req.body;
    const autorId = req.params.id;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await pool.execute(
      'UPDATE autores SET nombre = ? WHERE id_autor = ?',
      [nombre, autorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const [updatedAutor] = await pool.execute(
      'SELECT * FROM autores WHERE id_autor = ?',
      [autorId]
    );

    res.json(updatedAutor[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar autor', details: error.message });
  }
});

// DELETE - Eliminar un autor
app.delete('/autores/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM autores WHERE id_autor = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    res.json({ message: 'Autor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar autor', details: error.message });
  }
});

// ================================
// RUTAS PARA LIBROS
// ================================

// GET - Obtener todos los libros (con autores)
app.get('/libros', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      GROUP BY l.id_libro
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros', details: error.message });
  }
});

// GET - Obtener un libro por ID (con autores)
app.get('/libros/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores,
        GROUP_CONCAT(a.id_autor) as ids_autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.id_libro = ?
      GROUP BY l.id_libro
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libro', details: error.message });
  }
});

// POST - Crear un nuevo libro
app.post('/libros', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { titulo, editorial, anio_publicacion, codigo, estado = 'disponible', autores = [] } = req.body;
    
    if (!titulo || !codigo) {
      return res.status(400).json({ error: 'El título y código son requeridos' });
    }

    // Insertar el libro
    const [result] = await connection.execute(
      'INSERT INTO libros (titulo, editorial, anio_publicacion, codigo, estado) VALUES (?, ?, ?, ?, ?)',
      [titulo, editorial, anio_publicacion, codigo, estado]
    );

    const libroId = result.insertId;

    // Insertar las relaciones libro-autor
    if (autores.length > 0) {
      for (const autorId of autores) {
        await connection.execute(
          'INSERT INTO libro_autor (id_libro, id_autor) VALUES (?, ?)',
          [libroId, autorId]
        );
      }
    }

    await connection.commit();

    // Obtener el libro completo con autores
    const [newLibro] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.id_libro = ?
      GROUP BY l.id_libro
    `, [libroId]);

    res.status(201).json(newLibro[0]);
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'El código del libro ya existe' });
    } else {
      res.status(500).json({ error: 'Error al crear libro', details: error.message });
    }
  } finally {
    connection.release();
  }
});

// PUT - Actualizar un libro
app.put('/libros/:id', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { titulo, editorial, anio_publicacion, codigo, estado, autores = [] } = req.body;
    const libroId = req.params.id;

    if (!titulo || !codigo) {
      return res.status(400).json({ error: 'El título y código son requeridos' });
    }

    // Actualizar el libro
    const [result] = await connection.execute(
      'UPDATE libros SET titulo = ?, editorial = ?, anio_publicacion = ?, codigo = ?, estado = ? WHERE id_libro = ?',
      [titulo, editorial, anio_publicacion, codigo, estado, libroId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Eliminar relaciones existentes
    await connection.execute('DELETE FROM libro_autor WHERE id_libro = ?', [libroId]);

    // Insertar nuevas relaciones
    if (autores.length > 0) {
      for (const autorId of autores) {
        await connection.execute(
          'INSERT INTO libro_autor (id_libro, id_autor) VALUES (?, ?)',
          [libroId, autorId]
        );
      }
    }

    await connection.commit();

    // Obtener el libro actualizado
    const [updatedLibro] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.id_libro = ?
      GROUP BY l.id_libro
    `, [libroId]);

    res.json(updatedLibro[0]);
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'El código del libro ya existe' });
    } else {
      res.status(500).json({ error: 'Error al actualizar libro', details: error.message });
    }
  } finally {
    connection.release();
  }
});

// DELETE - Eliminar un libro
app.delete('/libros/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM libros WHERE id_libro = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar libro', details: error.message });
  }
});

// ================================
// RUTAS PARA LIBRO_AUTOR
// ================================

// GET - Obtener todas las relaciones libro-autor
app.get('/libro-autor', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        la.*,
        l.titulo as libro_titulo,
        a.nombre as autor_nombre
      FROM libro_autor la
      JOIN libros l ON la.id_libro = l.id_libro
      JOIN autores a ON la.id_autor = a.id_autor
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener relaciones libro-autor', details: error.message });
  }
});

// GET - Obtener autores de un libro específico
app.get('/libros/:id/autores', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT a.*
      FROM autores a
      JOIN libro_autor la ON a.id_autor = la.id_autor
      WHERE la.id_libro = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener autores del libro', details: error.message });
  }
});

// GET - Obtener libros de un autor específico
app.get('/autores/:id/libros', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT l.*
      FROM libros l
      JOIN libro_autor la ON l.id_libro = la.id_libro
      WHERE la.id_autor = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros del autor', details: error.message });
  }
});

// POST - Crear relación libro-autor
app.post('/libro-autor', async (req, res) => {
  try {
    const { id_libro, id_autor } = req.body;
    
    if (!id_libro || !id_autor) {
      return res.status(400).json({ error: 'ID del libro y ID del autor son requeridos' });
    }

    // Verificar si la relación ya existe
    const [existing] = await pool.execute(
      'SELECT * FROM libro_autor WHERE id_libro = ? AND id_autor = ?',
      [id_libro, id_autor]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'La relación libro-autor ya existe' });
    }

    await pool.execute(
      'INSERT INTO libro_autor (id_libro, id_autor) VALUES (?, ?)',
      [id_libro, id_autor]
    );

    const [newRelation] = await pool.execute(`
      SELECT 
        la.*,
        l.titulo as libro_titulo,
        a.nombre as autor_nombre
      FROM libro_autor la
      JOIN libros l ON la.id_libro = l.id_libro
      JOIN autores a ON la.id_autor = a.id_autor
      WHERE la.id_libro = ? AND la.id_autor = ?
    `, [id_libro, id_autor]);

    res.status(201).json(newRelation[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear relación libro-autor', details: error.message });
  }
});

// DELETE - Eliminar relación libro-autor
app.delete('/libro-autor/:id_libro/:id_autor', async (req, res) => {
  try {
    const { id_libro, id_autor } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM libro_autor WHERE id_libro = ? AND id_autor = ?',
      [id_libro, id_autor]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación libro-autor no encontrada' });
    }

    res.json({ message: 'Relación libro-autor eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar relación libro-autor', details: error.message });
  }
});

// ================================
// RUTAS ADICIONALES ÚTILES
// ================================

// GET - Buscar libros por título
app.get('/libros/buscar/titulo', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.titulo LIKE ?
      GROUP BY l.id_libro
    `, [`%${q}%`]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda', details: error.message });
  }
});

// GET - Obtener libros por estado
app.get('/libros/estado/:estado', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        GROUP_CONCAT(a.nombre SEPARATOR ', ') as autores
      FROM libros l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
      LEFT JOIN autores a ON la.id_autor = a.id_autor
      WHERE l.estado = ?
      GROUP BY l.id_libro
    `, [req.params.estado]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros por estado', details: error.message });
  }
});

// Middleware de manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('\n=== RUTAS DISPONIBLES ===');
  console.log('USUARIOS:');
  console.log('  GET    /usuarios');
  console.log('  GET    /usuarios/:id');
  console.log('  POST   /usuarios');
  console.log('  PUT    /usuarios/:id');
  console.log('  DELETE /usuarios/:id');
  console.log('\nAUTORES:');
  console.log('  GET    /autores');
  console.log('  GET    /autores/:id');
  console.log('  POST   /autores');
  console.log('  PUT    /autores/:id');
  console.log('  DELETE /autores/:id');
  console.log('\nLIBROS:');
  console.log('  GET    /libros');
  console.log('  GET    /libros/:id');
  console.log('  POST   /libros');
  console.log('  PUT    /libros/:id');
  console.log('  DELETE /libros/:id');
  console.log('\nLIBRO-AUTOR:');
  console.log('  GET    /libro-autor');
  console.log('  GET    /libros/:id/autores');
  console.log('  GET    /autores/:id/libros');
  console.log('  POST   /libro-autor');
  console.log('  DELETE /libro-autor/:id_libro/:id_autor');
  console.log('\nBÚSQUEDAS:');
  console.log('  GET    /libros/buscar/titulo?q=texto');
  console.log('  GET    /libros/estado/:estado');
});

