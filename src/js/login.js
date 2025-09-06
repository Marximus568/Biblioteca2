
export function settingLogin(){
  // login.js - Lógica de autenticación para SPA

const LOGIN_CONFIG = {
  apiUrl: 'http://localhost:3000/usuarios'
};

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para mostrar errores
function showError(errorDiv, message) {
  if (errorDiv) {
    errorDiv.innerHTML = `
      <div class="rounded-md bg-red-50 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error de autenticación</h3>
            <p class="mt-1 text-sm text-red-700">${message}</p>
          </div>
        </div>
      </div>
    `;
    errorDiv.style.display = 'block';
  }
}

// Función para ocultar errores
function hideError(errorDiv) {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = '';
  }
}

// Función para mostrar loading
function showLoading() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Iniciando sesión...
    `;
  }
}

// Función para ocultar loading
function hideLoading() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Iniciar Sesión';
  }
}

// Función para autenticar usuario
async function authenticateUser(email, password) {
  try {
    const response = await fetch(LOGIN_CONFIG.apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const usuarios = await response.json();
    
    // Buscar usuario con credenciales coincidentes
    const user = usuarios.find(usuario => 
      usuario.correo === email && usuario.password === password
    );
    
    return user || null;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Función para manejar login exitoso
function handleSuccessfulLogin(user) {
  // Preparar datos del usuario para localStorage (sin password)
  const userData = {
    id_usuario: user.id_usuario,
    nombre_completo: user.nombre_completo,
    correo: user.correo,
    telefono: user.telefono,
    identificacion: user.identificacion,
    role: user.role,
    loginTime: new Date().toISOString()
  };
  
  // Guardar en localStorage
  localStorage.setItem('currentUser', JSON.stringify(userData));
  localStorage.setItem('isAuthenticated', 'true');
  
  // Redirigir según el role
  redirectUser(user.role);
}

// Función para redirigir usuario según rol
function redirectUser(role) {
  let redirectPath = '/';
  
  switch (role?.toLowerCase()) {
    case 'admin':
      redirectPath = '/adminviews';
      break;
    case 'lector':
      redirectPath = '/customerviews';
      break;
    default:
      console.warn('Rol no reconocido:', role);
      redirectPath = '/customerviews'; // Default para usuarios sin rol específico
      break;
  }
  
  // Para SPA - usar history.pushState para navegación sin recarga
  if (window.history && window.history.pushState) {
    window.history.pushState({}, '', redirectPath);
    
    // Disparar evento personalizado para que el router SPA maneje la navegación
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    
    // También disparar evento personalizado específico
    window.dispatchEvent(new CustomEvent('spa-navigate', { 
      detail: { path: redirectPath, user: JSON.parse(localStorage.getItem('currentUser')) } 
    }));
  } else {
    // Fallback para navegadores antiguos
    window.location.href = redirectPath;
  }
}

// Función principal para manejar el login
async function handleLogin(event) {
  event.preventDefault(); // Prevenir recarga de página
  
  // Obtener elementos del formulario
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('loginError');
  
  // Limpiar errores previos
  hideError(errorDiv);
  
  // Obtener valores
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  // Validaciones básicas
  if (!email || !password) {
    showError(errorDiv, 'Por favor, completa todos los campos');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError(errorDiv, 'Por favor, ingresa un correo electrónico válido');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    showLoading();
    
    // Realizar autenticación
    const user = await authenticateUser(email, password);
    
    if (user) {
      // Login exitoso
      handleSuccessfulLogin(user);
    } else {
      // Credenciales inválidas
      showError(errorDiv, 'Correo electrónico o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    showError(errorDiv, 'Error de conexión. Por favor, inténtalo de nuevo');
  } finally {
    hideLoading();
  }
}

// Función para inicializar eventos
function initLogin() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

// Funciones de utilidad para verificar autenticación
function isAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

// Función para obtener el usuario actual
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
  
  // Redirigir al login
  if (window.history && window.history.pushState) {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    window.dispatchEvent(new CustomEvent('spa-navigate', { 
      detail: { path: '/login' } 
    }));
  } else {
    window.location.href = '/login';
  }
}

// Inicialización automática
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}

// Exportar funciones para uso global
window.loginUtils = {
  isAuthenticated,
  getCurrentUser,
  logout
};

// Función para proteger rutas (puedes usarla en tu router)
function protectRoute() {
  if (!isAuthenticated()) {
    // Redirigir al login si no está autenticado
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      window.dispatchEvent(new CustomEvent('spa-navigate', { 
        detail: { path: '/login' } 
      }));
      
      if (typeof window.router !== 'undefined' && window.router.navigate) {
        window.router.navigate('/login');
      }
    } else {
      window.location.href = '/login';
    }
    return false;
  }
  return true;
}

// Función para verificar permisos de administrador
function requireAdmin() {
  const user = getCurrentUser();
  return user && user.role && user.role.toLowerCase() === 'admin';
}

// Exportar también las funciones de protección de rutas
window.routeProtection = {
  protectRoute,
  requireAdmin
};
}