export function userviews() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.loginUtils.logout();
    });
    console.log("Listener de logout agregado ");
  } else {
    console.error("No se encontró el botón de logout ");
  }
}
