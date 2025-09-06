import { getCurrentUser } from "../tools/tools.js";

export async function userviews() {


// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    window.loginUtils.logout();
  });
}
const user = getCurrentUser();
if (!user) return "<p>Debes iniciar sesión.</p>";

// Configuración de la API
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    AVAILABLE_BOOKS: '/libros',
    USER_BOOKS: `/usuarios/${user.id_usuario}/libros`
  }
};

// Estado global de la app
const AppState = {
  availableBooks: [],
  userBooks: [],
  isLoading: false
};

// Utilidades DOM
const DOM = {
  show: (id) => document.getElementById(id).classList.remove('hidden'),
  hide: (id) => document.getElementById(id).classList.add('hidden'),
  setContent: (id, content) => document.getElementById(id).innerHTML = content,
  showAlert: (type, message) => {
    const alertId = type === 'error' ? 'errorAlert' : 'successAlert';
    const messageId = type === 'error' ? 'errorMessage' : 'successMessage';
    DOM.setContent(messageId, message);
    DOM.show(alertId);
    setTimeout(() => DOM.hide(alertId), 5000);
  },
  updateBookCounts: () => {
    const availableCount = document.getElementById('availableBooksCount');
    const myBooksCount = document.getElementById('myBooksCount');
    if (availableCount) availableCount.textContent = AppState.availableBooks.length;
    if (myBooksCount) myBooksCount.textContent = AppState.userBooks.length;
  }
};

// Funciones API
const API = {
  async request(endpoint, options = {}) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      
      // Si es un DELETE exitoso, podría no tener JSON válido
      if (res.status === 200 || res.status === 204) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
        return { success: true };
      }
      
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: `HTTP ${res.status}: ${res.statusText}` };
        }
        throw new Error(errorData.error || `Error HTTP ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  async getAvailableBooks() {
    return await this.request(CONFIG.ENDPOINTS.AVAILABLE_BOOKS);
  },

  async getUserBooks() {
    return await this.request(CONFIG.ENDPOINTS.USER_BOOKS);
  },

  async addBookToUser(isbn) {
    return await this.request(`/usuarios/${user.id_usuario}/libros`, {
      method: 'POST',
      body: JSON.stringify({ isbn })
    });
  },

  async removeBookFromUser(isbn) {
    const encodedIsbn = encodeURIComponent(isbn);
    return await this.request(`/usuarios/${user.id_usuario}/libros/${encodedIsbn}`, {
      method: 'DELETE'
    });
  }
};

// Renderizado
const Renderer = {
  createBookCard(book, isUserBook = false) {
    const isAlreadyAdded = AppState.userBooks.some(b => b.isbn === book.isbn);

    return `
      <div class="book-card bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 fade-in">
        <div class="flex flex-col h-full">
          <div class="flex-grow space-y-4">
            <h3 class="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">${book.titulo || 'Sin título'}</h3>
            <div class="space-y-2">
              <p class="text-gray-600 flex items-start">
                <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Autor:</span> 
                <span class="flex-1">${book.autor || 'No especificado'}</span>
              </p>
              <p class="text-gray-600 flex items-start">
                <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Año:</span> 
                <span class="flex-1">${book.anio_publicacion || 'No especificado'}</span>
              </p>
              <p class="text-gray-600 flex items-start">
                <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Editorial:</span> 
                <span class="flex-1">${book.editorial || 'No especificado'}</span>
              </p>
              ${book.estado ? `
                <p class="text-blue-600 flex items-start">
                  <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Estado:</span> 
                  <span class="flex-1">${book.estado}</span>
                </p>
              ` : ''}
              ${book.genre ? `
                <p class="text-purple-600 flex items-start">
                  <span class="font-semibold text-gray-700 w-20 flex-shrink-0">Género:</span> 
                  <span class="flex-1">${book.genre}</span>
                </p>
              ` : ''}
              <div class="bg-gray-100 px-3 py-2 rounded-lg">
                <p class="text-sm text-gray-700">
                  <span class="font-semibold">ISBN:</span> 
                  <code class="bg-white px-2 py-1 rounded text-xs font-mono">${book.isbn}</code>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-gray-200 space-y-3">
            ${
              isUserBook
                ? `${book.link ? `
                    <a href="${book.link}" target="_blank" class="inline-flex items-center justify-center w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
                      📖 Ver Detalles del Libro
                    </a>` : ''}
                    <button onclick="BookManager.removeFromInventory('${book.isbn}')" class="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
                      <span>🗑️</span>
                      <span>Eliminar de mi biblioteca</span>
                    </button>`
                : `<button 
                     onclick="BookManager.addToInventory('${book.isbn}')" 
                     class="add-book-btn w-full px-4 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2 ${
                       isAlreadyAdded 
                         ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                         : 'bg-blue-600 text-white hover:bg-blue-700'
                     }" 
                     ${isAlreadyAdded ? 'disabled' : ''}>
                     <span>${isAlreadyAdded ? '✅' : '➕'}</span>
                     <span>${isAlreadyAdded ? 'Ya en tu biblioteca' : 'Añadir a mi inventario'}</span>
                   </button>`
            }
          </div>
        </div>
      </div>
    `;
  },

  renderAvailableBooks(books) {
    const container = document.getElementById('availableBooksContainer');
    if (!books || books.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📚</div>
          <p class="text-gray-500 text-xl font-medium">No se encontraron libros disponibles</p>
          <p class="text-gray-400 text-sm mt-2">Los libros aparecerán aquí cuando estén disponibles</p>
        </div>
      `;
      return;
    }
    container.innerHTML = books
      .map(book => this.createBookCard(book, false))
      .join('');
    DOM.updateBookCounts();
  },

  renderUserBooks(books) {
    const container = document.getElementById('myBooksContainer');
    if (!books || books.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📖</div>
          <p class="text-gray-500 text-xl font-medium">Tu biblioteca está vacía</p>
          <p class="text-gray-400 text-sm mt-2">Agrega libros desde la sección de libros disponibles</p>
          <button onclick="BookManager.loadAvailableBooks()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Ver libros disponibles
          </button>
        </div>
      `;
      return;
    }
    container.innerHTML = books
      .map(book => this.createBookCard(book, true))
      .join('');
    DOM.updateBookCounts();
  }
};

const BookManager = {
  async loadAvailableBooks() {
    try {
      AppState.isLoading = true;
      const books = await API.getAvailableBooks();
      AppState.availableBooks = Array.isArray(books) ? books : [];
      Renderer.renderAvailableBooks(AppState.availableBooks);
      
    } catch (err) {
      console.error('Error cargando libros disponibles:', err);
      DOM.showAlert('error', 'Error al cargar los libros disponibles.');
      
      const container = document.getElementById('availableBooksContainer');
      if (container) {
        container.innerHTML = `
          <div class="text-center py-16">
            <div class="text-6xl mb-4 text-red-500">❌</div>
            <p class="text-red-500 text-xl font-medium">Error al cargar libros</p>
            <p class="text-gray-500 text-sm mt-2">Verifica tu conexión e intenta nuevamente</p>
            <button onclick="BookManager.loadAvailableBooks()" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
              🔄 Reintentar
            </button>
          </div>
        `;
      }
    } finally {
      AppState.isLoading = false;
    }
  },

  async loadUserBooks() {
    try {
      AppState.isLoading = true;
      const books = await API.getUserBooks();
      AppState.userBooks = Array.isArray(books) ? books : [];
      Renderer.renderUserBooks(AppState.userBooks);
      
    } catch (err) {
      console.error('Error cargando libros del usuario:', err);
      DOM.showAlert('error', 'Error al cargar tus libros.');
      
      const container = document.getElementById('myBooksContainer');
      if (container) {
        container.innerHTML = `
          <div class="text-center py-16">
            <div class="text-6xl mb-4 text-red-500">❌</div>
            <p class="text-red-500 text-xl font-medium">Error al cargar tu biblioteca</p>
            <p class="text-gray-500 text-sm mt-2">Verifica tu conexión e intenta nuevamente</p>
            <button onclick="BookManager.loadUserBooks()" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
              🔄 Reintentar
            </button>
          </div>
        `;
      }
    } finally {
      AppState.isLoading = false;
    }
  },

  async addToInventory(isbn) {
    if (AppState.isLoading) return;
    
    if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
      DOM.showAlert('error', 'ISBN inválido');
      return;
    }

    try {
      AppState.isLoading = true;
      await API.addBookToUser(isbn.trim());

      await Promise.all([
        this.loadUserBooks(),
        this.loadAvailableBooks()
      ]);

      const book = AppState.userBooks.find(b => b.isbn === isbn.trim());
      const bookTitle = book?.titulo || `libro con ISBN ${isbn}`;
      DOM.showAlert('success', `"${bookTitle}" ha sido agregado a tu biblioteca.`);
      
    } catch (err) {
      console.error('Error agregando libro:', err);
      
      let errorMessage = 'Error al agregar el libro';
      if (err.message.includes('ya tiene este libro')) {
        errorMessage = 'Ya tienes este libro en tu biblioteca';
      } else if (err.message.includes('no encontrado')) {
        errorMessage = 'Libro no encontrado';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      DOM.showAlert('error', errorMessage);
    } finally {
      AppState.isLoading = false;
    }
  },

  async removeFromInventory(isbn) {
    if (AppState.isLoading) return;
    
    if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
      DOM.showAlert('error', 'ISBN inválido');
      return;
    }

    const book = AppState.userBooks.find(b => b.isbn === isbn.trim());
    const bookTitle = book?.titulo || `libro con ISBN ${isbn}`;

    if (!confirm(`¿Estás seguro de que deseas eliminar "${bookTitle}" de tu biblioteca?`)) {
      return;
    }

    try {
      AppState.isLoading = true;
      await API.removeBookFromUser(isbn.trim());

      await Promise.all([
        this.loadUserBooks(),
        this.loadAvailableBooks()
      ]);

      DOM.showAlert('success', `"${bookTitle}" ha sido eliminado de tu biblioteca.`);
      
    } catch (err) {
      console.error('Error eliminando libro:', err);
      
      let errorMessage = 'Error al eliminar el libro';
      if (err.message.includes('no encontrado') || err.message.includes('no está asociado')) {
        errorMessage = 'Este libro no está en tu biblioteca';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      DOM.showAlert('error', errorMessage);
    } finally {
      AppState.isLoading = false;
    }
  },

  async init() {
    try {
      await Promise.all([
        this.loadAvailableBooks(), 
        this.loadUserBooks()
      ]);

      // Event listeners
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (window.loginUtils && window.loginUtils.logout) {
            window.loginUtils.logout();
          } else {
            alert('Función de logout no implementada');
          }
        });
      }

      const refreshBooksBtn = document.getElementById('refreshBooksBtn');
      if (refreshBooksBtn) {
        refreshBooksBtn.addEventListener('click', () => this.loadAvailableBooks());
      }

      const refreshMyBooksBtn = document.getElementById('refreshMyBooksBtn');
      if (refreshMyBooksBtn) {
        refreshMyBooksBtn.addEventListener('click', () => this.loadUserBooks());
      }

    } catch (error) {
      console.error('Error inicializando BookManager:', error);
      DOM.showAlert('error', 'Error al inicializar la aplicación');
    }
  }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  BookManager.init();
});

// Exponer para los onclick de los botones
window.BookManager = BookManager;}