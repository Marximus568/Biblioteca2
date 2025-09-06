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

const routes = {
  "/": {
    showView: renderHome(),
    afterRender: null,
    private: false,
  },
  "/home": {
    showView: renderHome(),
    afterRender: null,
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
    // 👇 proteger rutas privadas
    if (currentRoute.private && !protectRoute()) {
      return; // protectRoute ya redirige al login
    }

    // Renderizar la vista
    app.innerHTML = currentRoute.showView;

    // Ejecutar lógica de la vista
    if (typeof currentRoute.afterRender === "function") {
      currentRoute.afterRender();
    }
  } else {
    app.innerHTML = notFound();
  }
}
