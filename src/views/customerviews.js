
export function customerViews() {
return `
<style>
        .alert {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Alertas -->
    <div id="successAlert" class="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
        <div class="flex items-center">
            <span id="successMessage" class="font-medium"></span>
        </div>
    </div>

    <div id="errorAlert" class="hidden fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
        <div class="flex items-center">
            <span id="errorMessage" class="font-medium"></span>
        </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Sistema de Biblioteca</h1>
            <p class="text-gray-600">Gestiona tu colección personal de libros</p>
        </div>
        
        <!-- User Info -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                <div>
                    <p class="text-gray-600 text-sm">Bienvenido,</p>
                    <p class="text-xl font-semibold text-blue-800" id="userName">Usuario</p>
                </div>
                <div class="flex space-x-3">
                    <button id="refreshBooksBtn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        Actualizar Disponibles
                    </button>
                    <button id="refreshMyBooksBtn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        Actualizar Mi Biblioteca
                    </button>
                    <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                        Salir
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Libros Disponibles -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                    <h2 class="text-2xl font-bold">Libros Disponibles</h2>
                </div>
                <div class="p-6 max-h-[800px] overflow-y-auto">
                    <div id="availableBooksContainer">
                        <div class="text-center py-12">
                            <p class="text-gray-500">Cargando libros disponibles...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mi Biblioteca -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                    <h2 class="text-2xl font-bold">Mi Biblioteca</h2>
                </div>
                <div class="p-6 max-h-[800px] overflow-y-auto">
                    <div id="myBooksContainer">
                        <div class="text-center py-12">
                            <p class="text-gray-500">Cargando tu biblioteca...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
    </div>
</body>

`}
