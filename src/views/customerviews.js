
export function customerViews() {
return `
<style>
        .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .book-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .book-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
    </style>
</head>
  <header class="w-full flex justify-between items-center p-4 bg-white shadow-md">
    <h1 class="text-2xl font-bold text-gray-800">Mi Biblioteca</h1>
    <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-lg shadow-sm">
      Cerrar sesión
    </button>
  </header>  <!-- Loading Overlay -->
        <div id="loadingOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="loading-spinner"></div>
                <span class="text-gray-700">Procesando...</span>
            </div>
        </div>

        <!-- Error Alert -->
        <div id="errorAlert" class="hidden mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <span id="errorMessage"></span>
            </div>
        </div>

        <!-- Success Alert -->
        <div id="successAlert" class="hidden mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span id="successMessage"></span>
            </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
            <!-- Libros Disponibles Section -->
            <section class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-gray-800">Libros Disponibles</h2>
                    <button id="refreshBooksBtn" class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        <span>Actualizar</span>
                    </button>
                </div>
                
                <div id="availableBooksContainer" class="space-y-4">
                    <div class="flex items-center justify-center py-12">
                        <div class="loading-spinner"></div>
                        <span class="ml-3 text-gray-600">Cargando libros...</span>
                    </div>
                </div>
            </section>

            <!-- Mis Libros Section -->
            <section class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-gray-800">Mis Libros</h2>
                    <button id="refreshMyBooksBtn" class="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        <span>Actualizar</span>
                    </button>
                </div>
                
                <div id="myBooksContainer" class="space-y-4">
                    <div class="flex items-center justify-center py-12">
                        <div class="loading-spinner"></div>
                        <span class="ml-3 text-gray-600">Cargando mis libros...</span>
                    </div>
                </div>
            </section>
        </div>
    </div>

`}
