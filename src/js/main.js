
import { router } from "../router/router";

//Es para que las direccionales cel navegador  nos permitan avanzar y retroceder
window.addEventListener('popstate',router); 

//Para que se rendirice el contenido dinamico la primera vez
window.addEventListener('load',router);

router()

document.addEventListener('click',e =>{
    if (e.target.matches('[data-link]')){
        e.preventDefault()
        history.pushState(null,null, e.target.href);
        router()
    }})