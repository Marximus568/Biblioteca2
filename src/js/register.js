export function settingsregister() {
  // Función principal para manejar el registro de usuarios
  async function handleRegistration(event) {
    event.preventDefault();
    console.log("Interceptando submit...");

    try {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const identificacion = document.getElementById("identificacion").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Verifica e intenta nuevamente.");
        return;
      }

      const userData = {
        nombre_completo: name,
        correo: email,
        identificacion: parseInt(identificacion),
        telefono: telefono,
        password: password,
        role: "lector",
      };

      console.log("Enviando datos al backend:", userData);

      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Estado de la respuesta:", response.status);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Error en backend:", errorData);
          errorMessage += `: ${errorData.message || errorData.error}`;
        } catch {
          errorMessage += ": Error desconocido en el servidor";
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Usuario creado en backend:", result);

      alert(`¡Usuario registrado exitosamente! Bienvenido/a ${userData.nombre_completo}`);

      event.target.reset();

      setTimeout(() => {
        window.location.pathname = "/login";
      }, 2000);

    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario: " + error.message);
    }
  }

 
   const form = document.getElementById("registerForm");
  if (form) {
    // Eliminar cualquier listener previo
    form.removeEventListener("submit", handleRegistration);
    // Agregar el nuevo listener
    form.addEventListener("submit", handleRegistration);
    console.log("Listener agregado al formulario ✅");
  } else {
    console.error("No se encontró el formulario con id registerForm ❌");
  }

  // Validación en tiempo real de contraseñas
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  if (passwordInput && confirmPasswordInput) {
    function validatePasswords() {
      if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden");
      } else {
        confirmPasswordInput.setCustomValidity("");
      }
    }

    passwordInput.addEventListener("input", validatePasswords);
    confirmPasswordInput.addEventListener("input", validatePasswords);
  }
}
