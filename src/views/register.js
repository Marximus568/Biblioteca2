
export function register() {
  return `
     <!-- formulario de registro -->
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" class="mx-auto h-10 w-auto" />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form id="registerForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Full Name</label>
            <input id="name" name="name" type="text" required autocomplete="name" class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <input id="email" name="email" type="email" required autocomplete="email" class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label for="identificacion" class="block text-sm/6 font-medium text-gray-900">Identificación</label>
            <input id="identificacion" name="identificacion" type="number" required class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label for="telefono" class="block text-sm/6 font-medium text-gray-900">Teléfono</label>
            <input id="telefono" name="telefono" type="text" required class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <input id="password" name="password" type="password" required autocomplete="new-password" class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label for="confirm-password" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
            <input id="confirm-password" name="confirm-password" type="password" required autocomplete="new-password" class="block w-full rounded-md border border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <button type="submit" class="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>

`;
}