export function home()  {
    // Scroll al catálogo al hacer click en "Explorar Catálogo"
window.scrollToCatalog = async function() {
  const catalog = document.getElementById('homeBooksContainer');
  catalog.scrollIntoView({ behavior: 'smooth' });

  try {
    const books = await API.getAvailableBooks();
    HomeRenderer.renderBooks(books);
  } catch (err) {
    console.error('Error cargando libros:', err);
    catalog.innerHTML = `<div class="text-center py-12 col-span-full">
      <p class="text-red-500">Error al cargar los libros.</p>
    </div>`;
  }
};



// API helper
const API = {
  API_BASE_URL: 'http://localhost:3000',

  async getAvailableBooks() {
    const res = await fetch(`${this.API_BASE_URL}/libros`);
    if (!res.ok) throw new Error('Error al obtener libros');
    return await res.json();
  }
};

const HomeRenderer = {
  createBookCard(book) {
    return `
      <div class="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <!-- Imagen del libro -->
        <div class="w-24 h-32 flex-shrink-0">
          <img src="${book.image || `https://picsum.photos/100/150?random=${Math.floor(Math.random()*1000)}`}" alt="${book.titulo}" class="w-full h-full object-cover">

        </div>
        <!-- Información -->
        <div class="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 line-clamp-2">${book.titulo}</h3>
            <p class="text-sm text-gray-600"><span class="font-medium">Autor:</span> ${book.autor}</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Editorial:</span> ${book.editorial}</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Año:</span> ${book.anio_publicacion}</p>
            <p class="text-xs text-gray-500"><span class="font-medium">ISBN:</span> ${book.isbn}</p>
          </div>
          <button 
            onclick="window.location.href='/login'" 
            class="mt-2 self-start px-3 py-1 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors">
            Conocer más
          </button>
        </div>
      </div>
    `;
  },

  renderBooks(books) {
    const container = document.getElementById('homeBooksContainer');
    if (!books || books.length === 0) {
      container.innerHTML = `<div class="text-center py-12 col-span-full">
        <p class="text-gray-500">No se encontraron libros disponibles.</p>
      </div>`;
      return;
    }
    container.innerHTML = books.map(book => this.createBookCard(book)).join('');
  }
};

// Carga de libros en el home
const HomeManager = {
  async loadBooks() {
    try {
      const books = await API.getAvailableBooks();
      HomeRenderer.renderBooks(books);
    } catch (err) {
      console.error('Error cargando libros:', err);
      const container = document.getElementById('homeBooksContainer');
      container.innerHTML = `<div class="text-center py-12 col-span-full">
        <p class="text-red-500">Error al cargar los libros.</p>
      </div>`;
    }
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => this.loadBooks());
  }
};

HomeManager.init();



}