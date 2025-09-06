import { protectRoute } from "../tools/tools.js"; // o como hayas guardado ese archivo
import { renderHome } from "../views/home";
import { login } from "../views/login";
import { register } from "../views/register";
import { adminViews } from "../views/adminviews";
import { customerViews } from "../views/customerviews";
import { settingsAdmin } from "../js/admin.js";
import { settingLogin } from "../js/login.js";
import { settingsregister } from "../js/register.js";
import { userviews } from "../js/user.js";
import { notFound } from "../views/notFound";
import { home } from "../js/home.js";

const routes = {
  "/": {
    showView: renderHome(),
    afterRender: null,
    private: false,
  },
  "/home": {
    showView: renderHome(),
    afterRender: home,
    private: false,
  },
  "/login": {
    showView: login(),
    afterRender: settingLogin,
    private: false,
  },
  "/register": {
    showView: register(),
    afterRender: settingsregister,
    private: false,
  },
  "/customerviews": {
    showView: customerViews(),
    afterRender: userviews,
    private: true,
  },
  "/adminviews": {
    showView: adminViews(),
    afterRender: settingsAdmin,
    private: true,
     requireAdmin: true,
  },
  "/notFound": {
    showView: notFound(),
    afterRender: null,
    private: false,
  },
};
export function router() {
  const path = window.location.pathname || "/";
  const app = document.getElementById("app");
  const currentRoute = routes[path];

  if (currentRoute) {
    // Primero: verificar autenticación
    if (currentRoute.private && !window.routeProtection.protectRoute()) {
      return; // redirigido al login
    }

    // Segundo: verificar permisos especiales (ej. admin)
    if (currentRoute.requireAdmin && !window.routeProtection.requireAdmin()) {
      console.warn("Acceso denegado: necesitas ser admin");
      // Redirigir al home o a un notFound
      window.history.pushState({}, "", "/notFound");
      window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
      return;
    }

    // Renderizar la vista
    app.innerHTML = currentRoute.showView;

    // Ejecutar afterRender si existe
    if (typeof currentRoute.afterRender === "function") {
      currentRoute.afterRender();
    }
  } else {
    app.innerHTML = notFound();
  }
}

