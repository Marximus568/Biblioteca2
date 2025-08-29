
export function login() {
  return `
<body class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" class="mx-auto h-10 w-auto" />
    <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Inicia sesión en tu cuenta</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <div id="loginError" style="display:none;"></div>
    <form id="loginForm"  class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-900">Correo electrónico</label>
        <div class="mt-2">
          <input id="email" type="email" name="email" required autocomplete="email"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-900">Contraseña</label>
        <div class="mt-2">
          <input id="password" type="password" name="password" required autocomplete="current-password"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
        </div>
      </div>

      <div>
        <button type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Iniciar Sesión
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      ¿No tienes cuenta?
      <a href="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Regístrate</a>
    </p>
  </div>
`;
}