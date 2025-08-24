
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
        <a href="/register" data-link class="hover:text-indigo-700" data-link>Register</a>
      </nav>
    </div>
  </header>

  <!-- Sección de bienvenida -->
  <section class="bg-indigo-600 text-white text-center py-20">
    <h1 class="text-3xl sm:text-4xl font-bold mb-4">Bienvenido a la Biblioteca Virtual</h1>
    <p class="text-lg mb-8 max-w-2xl mx-auto">
      Explora miles de libros digitales, descubre autores y disfruta la lectura desde cualquier lugar.
    </p>
    <button class="bg-white text-indigo-700 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition">
      Explorar Catálogo
    </button>
  </section>

<section class="grid grid-cols-3 p-5 gap-5">
  <div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
<div class="flex w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-32 object-cover" src="https://images.unsplash.com/photo-1516972810927-80185027ca84" alt="Libro">
  <div class="p-4">
    <h3 class="text-lg font-semibold">📕 Título del Libro</h3>
    <p class="text-sm"><span class="font-medium">Autor:</span> Laura Méndez</p>
    <p class="text-sm"><span class="font-medium">Editorial:</span> McGraw-Hill</p>
    <p class="text-sm"><span class="font-medium">Año:</span> 2020</p>
    <p class="text-sm"><span class="font-medium">Código:</span> X-2341</p>
  </div>
</div>
</section>
`;
}
