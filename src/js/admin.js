import { getCurrentUser } from "../tools/tools";

export function settingsAdmin() {

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.loginUtils.logout();
    });
  }
  const user = getCurrentUser ();
  if (!user) return "<p>Debes iniciar sesión.</p>";

  // --- Configuración API ---
  const API_BASE_URL = "http://localhost:3000";
  const API_BOOKS_URL = `${API_BASE_URL}/libros`;

  // Variables globales
  let books = [];
  let editingBookId = null;
  let bookToDelete = null;
  let elements = {};

  // --- Helper: manejar respuestas fetch ---
  async function handleFetchResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }

  // --- Inicializar referencias a elementos DOM ---
  async function initializeElements() {
    return new Promise((resolve) => {
      const checkElements = () => {
        elements = {
          showFormBtn: document.getElementById("showFormBtn"),
          logoutBtn: document.getElementById("logoutBtn"),
          formContainer: document.getElementById("formContainer"),
          bookForm: document.getElementById("bookForm"),
          formTitle: document.getElementById("formTitle"),
          cancelBtn: document.getElementById("cancelBtn"),
          saveBtn: document.getElementById("saveBtn"),
          bookId: document.getElementById("bookId"),
          title: document.getElementById("title"),
          author: document.getElementById("author"),
          editorial: document.getElementById("editorial"),
          year: document.getElementById("year"),
          genre: document.getElementById("genre"),
          code: document.getElementById("code"),
          link: document.getElementById("link"),
          booksTable: document.getElementById("booksTable"),
          loadingSpinner: document.getElementById("loadingSpinner"),
          notification: document.getElementById("notification"),
          noBooks: document.getElementById("noBooks"),
          confirmModal: document.getElementById("confirmModal"),
          confirmDelete: document.getElementById("confirmDelete"),
          cancelDelete: document.getElementById("cancelDelete"),
        };
        const allFound = Object.values(elements).every((e) => e !== null);
        if (allFound) resolve();
        else setTimeout(checkElements, 50);
      };
      checkElements();
    });
  }

  // --- Eventos ---
  async function setupEventListeners() {
    elements.showFormBtn.addEventListener("click", showCreateForm);
    elements.cancelBtn.addEventListener("click", hideForm);
    elements.bookForm.addEventListener("submit", handleSubmit);
    elements.logoutBtn.addEventListener("click", handleLogout);
    elements.confirmDelete.addEventListener("click", confirmDelete);
    elements.cancelDelete.addEventListener("click", hideConfirmModal);
  }

  // --- Cargar libros desde API y renderizar ---
  async function loadBooks() {
    showLoading(true);
    try {
      const resp = await fetch(API_BOOKS_URL);
      const data = await handleFetchResponse(resp);
      books = Array.isArray(data) ? data : Object.values(data || {});
      renderBooks();
    } catch (err) {
      console.error("Error cargando libros:", err);
      books = [];
      renderBooks();
      showNotification(`Error al cargar libros: ${err.message}`, "error");
    } finally {
      showLoading(false);
    }
  }

  function renderBooks() {
    const tbody = elements.booksTable;
    tbody.innerHTML = "";
    if (books.length === 0) {
      elements.noBooks.classList.remove("hidden");
      return;
    }
    elements.noBooks.classList.add("hidden");
    tbody.innerHTML = books
      .map(
        (book) => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3">${book.isbn || ""}</td>
            <td class="px-4 py-3">${escapeHtml(book.titulo || "")}</td>
            <td class="px-4 py-3">${escapeHtml(book.autor || "")}</td>
            <td class="px-4 py-3">${escapeHtml(book.editorial || "")}</td>
            <td class="px-4 py-3">${book.anio_publicacion || ""}</td>
            <td class="px-4 py-3">${escapeHtml(book.genero || "")}</td>
            <td class="px-4 py-3">
                ${
                  book.link
                    ? `<a href="${book.link}" target="_blank" class="text-blue-500 underline">Ver enlace</a>`
                    : ""
                }
            </td>
            <td class="px-4 py-3 flex gap-2">
                <button onclick="editBook('${
                  book.isbn
                }')" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                <button onclick="deleteBook('${
                  book.isbn
                }')" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td>
        </tr>
    `
      )
      .join("");
  }

  // --- Crear/editar libro ---
  async function handleSubmit(e) {
    e.preventDefault();
    
  const bookData = {
    isbn: elements.code.value.trim(),
    titulo: elements.title.value.trim(),
    autor: elements.author.value.trim() || null,
    editorial: elements.editorial.value.trim() || null,
    anio_publicacion: parseInt(elements.year.value) || null,
    genre: elements.genre?.value.trim() || null,
    estado: "disponible",
    link: elements.link.value.trim() || null,
  };

  try {
    let resp;
    if (editingBookId) {
      resp = await fetch(`${API_BOOKS_URL}/${editingBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    } else {
      resp = await fetch(API_BOOKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    }

    await handleFetchResponse(resp);
    hideForm();
    loadBooks();
    showNotification(
      editingBookId ? "Libro actualizado" : "Libro creado",
      "success"
    );
  } catch (err) {
    console.error("Error guardando libro", err);
    showNotification("Error guardando libro", "error");
  }
}

  function showEditForm(book) {
    editingBookId = book.isbn;
    elements.formTitle.textContent = "Editar Libro";
    elements.formContainer.classList.remove("hidden");
    elements.bookId.value = book.isbn;
    elements.title.value = book.titulo;
    elements.author.value = book.autor;
    elements.editorial.value = book.editorial;
    elements.year.value = book.anio_publicacion;
    elements.genre.value = book.genero;
    elements.code.value = book.isbn;
    elements.link.value = book.link;
  }

  function showCreateForm() {
    editingBookId = null;
    elements.formTitle.textContent = "Agregar Nuevo Libro";
    elements.formContainer.classList.remove("hidden");
    elements.bookForm.reset();
  }

  function hideForm() {
    elements.formContainer.classList.add("hidden");
    editingBookId = null;
  }

  function editBook(isbn) {
    const b = books.find((x) => x.isbn == isbn);
    if (b) showEditForm(b);
  }

  function deleteBook(isbn) {
    bookToDelete = isbn;
    elements.confirmModal.classList.remove("hidden");
  }

  async function confirmDelete() {
    if (!bookToDelete) return;
    try {
      const resp = await fetch(`${API_BOOKS_URL}/${bookToDelete}`, {
        method: "DELETE",
      });
      await handleFetchResponse(resp);
      showNotification("Libro eliminado", "success");
      loadBooks();
    } catch (err) {
      showNotification("Error eliminando", "error");
    } finally {
      hideConfirmModal();
    }
  }

  function hideConfirmModal() {
    elements.confirmModal.classList.add("hidden");
    bookToDelete = null;
  }

  function escapeHtml(txt) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return txt.replace(/[&<>"']/g, (m) => map[m]);
  }

  function showNotification(msg, type) {
    elements.notification.textContent = msg;
    elements.notification.className = `mb-4 p-4 rounded ${
      type === "success"
        ? "bg-green-100 text-green-700 border border-green-400"
        : "bg-red-100 text-red-700 border border-red-400"
    }`;
    elements.notification.classList.remove("hidden");
    setTimeout(() => elements.notification.classList.add("hidden"), 5000);
  }

  function showLoading(show) {
    if (show) elements.loadingSpinner.classList.remove("hidden");
    else elements.loadingSpinner.classList.add("hidden");
  }

  function handleLogout() {
    if (confirm("¿Cerrar sesión?")) window.location.href = "/login";
  }

  // --- Inicializar aplicación ---
  async function initializeApp() {
    await initializeElements();
    await setupEventListeners();
    await loadBooks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }

  window.editBook = editBook;
  window.deleteBook = deleteBook;
}
