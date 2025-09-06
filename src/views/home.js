
export function renderHome() {
  return `
  
  <!-- Navbar -->
<header class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
    <!-- Logo y nombre -->
    <div class="flex items-center space-x-2">
      <img src="https://img.icons8.com/color/48/000000/book-shelf.png" alt="Logo" class="w-8 h-8" />
      <span class="text-lg font-semibold text-indigo-700">Biblioteca Virtual</span>
    </div>

    <!-- Navegación -->
    <nav class="space-x-6 text-sm text-gray-700">
      <a href="/login" data-link class="hover:text-indigo-700">Login</a>
      <a href="/register" data-link class="hover:text-indigo-700">Register</a>
    </nav>
  </div>
</header>

<!-- Sección de bienvenida -->
<section class="bg-indigo-600 text-white text-center py-20">
  <h1 class="text-3xl sm:text-4xl font-bold mb-4">Bienvenido a la Biblioteca Virtual</h1>
  <p class="text-lg mb-8 max-w-2xl mx-auto">
    Explora miles de libros digitales, descubre autores y disfruta la lectura desde cualquier lugar.
  </p>
  <button class="bg-white text-indigo-700 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition" 
        onclick="scrollToCatalog()">
  Explorar Catálogo
</button>
</section>

<!-- Catálogo de libros -->
<section id="homeBooksContainer" class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 p-6">
  <div class="flex items-center justify-center py-12 col-span-full">
    <div class="loading-spinner"></div>
    <span class="ml-3 text-gray-600">Cargando libros...</span>
  </div>
</section> 
`;
}
