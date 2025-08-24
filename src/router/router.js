
import { settingsAdmin } from "../js/admin";
import { settingLogin } from "../js/login";
import { userviews } from "../js/user";
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
    afterRender: settingLogin(),
    private: false,
  },
  "/register": {
    showView: register(),
    afterRender: null,
    private: false,
  },
"/customerviews": {
    showView: customerViews(),
    afterRender: userviews(),
    private: false,
  },
  "/adminviews": {
    showView: adminViews(),
    afterRender: settingsAdmin(),
    private: false,
  },
  "/notFound": {
    showView: notFound(),
    afterRender: "",
    private: false,
  },
};

export function router() {
  //Con la variable path obtienes la url.
  const path = window.location.pathname || "/";
  //Con esta vaariable obtenemos app que se encuentra en el index
  const app = document.getElementById('app');
  //Con esto se conoce cual es la ruta actual para renderizar la vista correspondiente
  const currentRoute = routes[path];
  
if (currentRoute) {
  app.innerHTML = currentRoute.showView;
  if (typeof currentRoute.after === "function") {
    currentRoute.afterRender();
  }
}else
  app.innerHTML = notFound();

}
