export function register() {
  return `
<body class="min-h-screen bg-gray-50 flex flex-col">

  <!-- Navbar -->
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center space-x-2">
          <img src="https://img.icons8.com/color/48/000000/book-shelf.png" alt="Logo" class="w-8 h-8" />
          <a href="/home" class="text-indigo-700 font-bold text-lg hover:text-indigo-500">Biblioteca Virtual</a>
        </div>
        <div>
          <a href="/home" class="text-gray-700 hover:text-indigo-700 font-medium">Inicio</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Register Section -->
  <div class="flex flex-col justify-center flex-grow px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img src="https://img.icons8.com/color/96/000000/add-user-male.png" alt="Register" class="mx-auto h-16 w-16" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Completa tus datos para registrarte en la Biblioteca Virtual
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <form id="registerForm" class="bg-white shadow rounded-lg px-6 py-8 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input id="name" name="name" type="text" required autocomplete="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input id="email" name="email" type="email" required autocomplete="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="identificacion" class="block text-sm font-medium text-gray-700">Identificación</label>
          <input id="identificacion" name="identificacion" type="number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input id="telefono" name="telefono" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input id="password" name="password" type="password" required autocomplete="new-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input id="confirm-password" name="confirm-password" type="password" required autocomplete="new-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <button type="submit" class="w-full flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
            Registrarse
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta? 
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión</a>
      </p>
    </div>
  </div>
</body>
`;
}

