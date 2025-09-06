import { settingsAdmin } from "../js/admin.js";
import { settingLogin } from "../js/login.js";
import { settingsregister } from "../js/register.js";
import { userviews } from "../js/user.js";
import { adminViews } from "../views/adminviews";
import { customerViews } from "../views/customerviews";
import { renderHome } from "../views/home";
import { login } from "../views/login";
import { notFound } from "../views/notFound";
import { register } from "../views/register";

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
    private: false,
  },
  "/adminviews": {
    showView: adminViews(),
    afterRender: settingsAdmin,
    private: false,
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
    // Renderiza la vista
    app.innerHTML = currentRoute.showView;

    // Ejecuta el afterRender si existe y es una función
    if (typeof currentRoute.afterRender === "function") {
      currentRoute.afterRender();
    }
  } else {
    app.innerHTML = notFound();
  }
}
