const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    console.log("¡VetCare Sistema con Pasarela e Imágenes Iniciado!");
    
    if (document.getElementById('loginForm')) inicializerLogin();
    if (document.getElementById('registroForm')) inicializarRegistro();
    if (document.getElementById('contenedor-productos')) cargarProductosTienda();
    if (document.getElementById('productForm')) inicializarAdminForm();
    if (document.getElementById('pasarelaForm')) inicializarPasarelaForm();
});

// ==========================================================================
// 1. LOGIN
// ==========================================================================
let intentosFallidos = 0;
function inicializerLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginMsg = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginMsg.innerText = '';

        if (intentosFallidos >= 3) {
            loginMsg.innerText = '❌ Acceso denegado. Cuenta bloqueada.';
            return;
        }

        const correo = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('password').value;

        if (correo === 'admin@gmail.com' && contrasena === 'Admin123') {
            alert('¡Acceso como Administrador!');
            window.location.href = 'admin.html';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });
            const resultado = await response.json();

            if (response.ok) {
                alert(`¡Bienvenido, ${resultado.nombre}!`);
                window.location.href = 'tienda.html';
            } else {
                intentosFallidos++;
                loginMsg.innerText = `❌ Datos inválidos. Quedan ${3 - intentosFallidos} intentos.`;
            }
        } catch (error) {
            loginMsg.innerText = '❌ Error de red con el Servidor.';
        }
    });
}

// ==========================================================================
// 2. REGISTRO
// ==========================================================================
function inicializarRegistro() {
    const registroForm = document.getElementById('registroForm');
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('regNombre').value.trim();
        const correo = document.getElementById('regEmail').value.trim();
        const contrasena = document.getElementById('regPassword').value;

        try {
            const response = await fetch(`${API_URL}/usuarios/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo, contrasena })
            });
            if (response.ok) {
                alert('¡Registrado en MongoDB Atlas con éxito!');
                window.location.href = 'login.html';
            } else {
                alert('Error al registrar usuario.');
            }
        } catch (error) {
            alert('❌ Servidor desconectado.');
        }
    });
}

// ==========================================================================
// 3. TIENDA CON IMÁGENES Y BOTÓN DE COMPRA
// ==========================================================================
async function cargarProductosTienda() {
    const contenedor = document.getElementById('contenedor-productos');
    try {
        const response = await fetch(`${API_URL}/productos`);
        const productos = await response.json();

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos disponibles.</p>';
            return;
        }

        contenedor.innerHTML = '';
        productos.forEach(prod => {
            // Si el admin no puso imagen o el enlace se cae, usa una veterinaria genérica por defecto
            const imgUrl = prod.imagenUrl || 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400';
            
            contenedor.innerHTML += `
                <div class="card-producto">
                    <span class="tag">${prod.categoria || 'General'}</span>
                    <img src="${imgUrl}" alt="${prod.nombre}" onerror="this.src='https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400'">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion || 'Sin descripción.'}</p>
                    <p class="precio">₡${Number(prod.precio).toLocaleString('es-CR')}</p>
                    <button class="btn-comprar" onclick="abrirPasarela('${prod.nombre}', ${prod.precio})">🛒 Comprar Artículo</button>
                </div>
            `;
        });
    } catch (error) {
        contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ff4d4d;">❌ Error al conectar con MongoDB Atlas.</p>';
    }
}

// ==========================================================================
// 4. SUBIDA DE PRODUCTOS DESDE EL ADMIN (MANDA IMAGEN URL)
// ==========================================================================
function inicializarAdminForm() {
    const productForm = document.getElementById('productForm');
    const adminSuccess = document.getElementById('adminSuccess');

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('prodNombre').value.trim();
        const precio = document.getElementById('prodPrecio').value;
        const categoria = document.getElementById('prodCategoria').value;
        const imagenUrl = document.getElementById('prodImagen').value.trim();
        const descripcion = document.getElementById('prodDescripcion').value.trim();

        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio, categoria, imagenUrl, descripcion })
            });

            if (response.ok) {
                adminSuccess.innerText = '✅ ¡Producto e imagen guardados en MongoDB Atlas!';
                productForm.reset();
            } else {
                alert('Error al inyectar el item.');
            }
        } catch (error) {
            alert('❌ Backend caído.');
        }
    });
}

// ==========================================================================
// 5. FUNCIONES CONTROLADORAS DE LA PASARELA DE PAGO SIMULADA
// ==========================================================================
function abrirPasarela(nombreProducto, precioProducto) {
    const modal = document.getElementById('modalPago');
    const infoText = document.getElementById('pagoInfoProducto');
    infoText.innerText = `Estás pagando: ${nombreProducto} (₡${Number(precioProducto).toLocaleString('es-CR')})`;
    modal.style.display = 'flex';
}

function cerrarPasarela() {
    document.getElementById('modalPago').style.display = 'none';
    document.getElementById('pasarelaForm').reset();
}

function inicializarPasarelaForm() {
    const pasarelaForm = document.getElementById('pasarelaForm');
    pasarelaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulación visual de procesamiento de pago inmediato
        alert('💳 Conectando con los servidores bancarios...');
        alert('✅ ¡Transacción aprobada con éxito! Su orden fue procesada en la nube.');
        cerrarPasarela();
    });
}