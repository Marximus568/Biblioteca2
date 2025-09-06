export function protectRoute() {
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

export function initLogin() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

// Funciones de utilidad para verificar autenticación
export function isAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

// Función para obtener el usuario actual
export function getCurrentUser() {
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

window.loginUtils = {
  isAuthenticated,
  getCurrentUser,
  logout
};


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
