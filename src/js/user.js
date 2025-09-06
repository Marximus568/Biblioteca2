import { getCurrentUser } from "../tools/tools.js";

export async function userviews() {
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
        AVAILABLE_BOOKS: '/libros', // Todos los libros
        USER_BOOKS: '/usuarios/{userId}/libros'
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
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
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
        const user = getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');
        return await this.request(CONFIG.ENDPOINTS.USER_BOOKS.replace('{userId}', user.id_usuario));
    },

    async addBookToUser(isbn) {
        const user = getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');
        return await this.request(`/usuarios/${user.id_usuario}/libros`, {
            method: 'POST',
            body: JSON.stringify({ isbn })
        });
    }
};

// Renderizado
const Renderer = {
    createBookCard(book, isUserBook = false) {
        const isAlreadyAdded = AppState.userBooks.some(b => b.isbn === book.isbn);
        return `
            <div class="book-card bg-white rounded-xl shadow-md p-6 border border-gray-200 fade-in">
                <div class="flex flex-col h-full">
                    <div class="flex-grow space-y-3">
                        <h3 class="text-xl font-semibold text-gray-800 line-clamp-2">${book.titulo}</h3>
                        <div class="space-y-2">
                            <p class="text-gray-600"><span class="font-medium">Autor:</span> ${book.autor}</p>
                            <p class="text-gray-600"><span class="font-medium">Año:</span> ${book.año}</p>
                            <p class="text-gray-600"><span class="font-medium">Editorial:</span> ${book.editorial}</p>
                            <p class="text-sm text-gray-500"><span class="font-medium">ISBN:</span> ${book.isbn}</p>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-100">
                        ${isUserBook
                            ? `<a href="${book.link}" target="_blank" class="inline-flex items-center justify-center w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                Ver Detalles
                              </a>`
                            : `<button 
                                onclick="BookManager.addToInventory('${book.isbn}')" 
                                class="add-book-btn w-full px-4 py-2 rounded-lg transition-colors ${isAlreadyAdded ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}" 
                                ${isAlreadyAdded ? 'disabled' : ''}>
                                ${isAlreadyAdded ? 'Agregado' : 'Añadir a mi inventario'}
                              </button>`}
                    </div>
                </div>
            </div>
        `;
    },

    renderAvailableBooks(books) {
        const container = document.getElementById('availableBooksContainer');
        if (!books || books.length === 0) {
            container.innerHTML = `<div class="text-center py-12">
                <p class="text-gray-500">No se encontraron libros disponibles.</p>
            </div>`;
            return;
        }
        container.innerHTML = books.map(book => this.createBookCard(book, false)).join('');
    },

    renderUserBooks(books) {
        const container = document.getElementById('myBooksContainer');
        if (!books || books.length === 0) {
            container.innerHTML = `<div class="text-center py-12">
                <p class="text-gray-500">Tu biblioteca está vacía.</p>
            </div>`;
            return;
        }
        container.innerHTML = books.map(book => this.createBookCard(book, true)).join('');
    }
};

// Gestión principal de libros
const BookManager = {
    async loadAvailableBooks() {
        try {
            AppState.isLoading = true;
            const books = await API.getAvailableBooks();
            AppState.availableBooks = books;
            Renderer.renderAvailableBooks(books);
        } catch (err) {
            console.error('Error loading available books:', err);
            DOM.showAlert('error', 'Error al cargar los libros disponibles.');
        } finally {
            AppState.isLoading = false;
        }
    },

    async loadUserBooks() {
        try {
            AppState.isLoading = true;
            const books = await API.getUserBooks();
            AppState.userBooks = books;
            Renderer.renderUserBooks(books);
        } catch (err) {
            console.error('Error loading user books:', err);
            DOM.showAlert('error', 'Error al cargar tus libros.');
        } finally {
            AppState.isLoading = false;
        }
    },

    async addToInventory(isbn) {
        if (AppState.isLoading) return;
        try {
            await API.addBookToUser(isbn);
            await this.loadUserBooks();
            Renderer.renderAvailableBooks(AppState.availableBooks);
            const book = AppState.availableBooks.find(b => b.isbn === isbn);
            DOM.showAlert('success', `"${book?.titulo}" ha sido agregado a tu biblioteca.`);
        } catch (err) {
            console.error('Error adding book:', err);
            DOM.showAlert('error', err.message || 'Error al agregar el libro.');
        }
    },

    async init() {
        await Promise.all([
            this.loadAvailableBooks(),
            this.loadUserBooks()
        ]);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => window.loginUtils.logout());
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    BookManager.init();
});

window.BookManager = BookManager;
};

