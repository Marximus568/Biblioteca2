
export function customerViews() {
return `
<header class="w-full flex justify-end p-4 bg-white shadow">
  <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-lg">
    Cerrar sesión
  </button>
</header>

<!-- Contenido principal -->
<section class="flex-1 bg-gray-100 p-6 overflow-y-auto">
  
  <!-- Vista de libros disponibles -->
  <div id="vista-disponibles" class="space-y-4">
    <h2 class="text-2xl font-bold">Libros disponibles</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Tarjeta -->
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
        <h3 class="text-lg font-semibold">Nombre del libro</h3>
        <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">
          Ver más
        </button>
      </div>
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
        <h3 class="text-lg font-semibold">Nombre del libro</h3>
        <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">
          Ver más
        </button>
      </div>
    </div>
  </div>

  <!-- Vista de mis libros -->
  <div id="vista-mis-libros" class="space-y-4 ">
    <h2 class="text-2xl font-bold">Mis libros</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
        <h3 class="text-lg font-semibold">Nombre de mi libro</h3>
        <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">
          Ver más
        </button>
      </div>
    </div>
  </div>
  
</section>

`}
