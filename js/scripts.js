document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. POP-UP EMERGENTE DE BIENVENIDA ---
    const popup = document.getElementById("welcomePopup");
    const closeBtn = document.getElementById("closePopup");

    if (popup && closeBtn) {
        // Muestra el pop-up automáticamente medio segundo después de cargar la página
        setTimeout(() => {
            popup.style.display = "flex";
        }, 500);

        // Oculta el pop-up al hacer clic en el botón de cerrar/explorar
        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    // --- 2. MOTOR DE BÚSQUEDA DINÁMICA ---
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function ejecutarBusqueda() {
        const query = searchInput.value.toLowerCase().trim();
        const productos = document.querySelectorAll(".product-card");

        productos.forEach(producto => {
            const titulo = producto.querySelector("h3").textContent.toLowerCase();
            if (titulo.includes(query)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", ejecutarBusqueda);
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") ejecutarBusqueda();
        });
    }

    // --- 3. ASISTENTE IA Y BOTÓN DE ASESORÍA ---
    const chatHeader = document.getElementById("toggleChatBtn");
    const chatMessages = document.getElementById("chatMessages");
    const chatInputDiv = document.getElementById("chatInput");
    const chatIcon = document.getElementById("chat-icon");
    const botInputField = document.getElementById("botInputField");
    const sendBotMsgBtn = document.getElementById("sendBotMsgBtn");
    const asesoriaHeaderBtn = document.getElementById("asesoriaHeaderBtn");

    function abrirChat() {
        if (chatMessages && chatInputDiv && chatIcon) {
            chatMessages.style.display = "block";
            chatInputDiv.style.display = "flex";
            chatIcon.textContent = "▼";
        }
    }

    function toggleChat() {
        if (chatMessages.style.display === "block") {
            chatMessages.style.display = "none";
            chatInputDiv.style.display = "none";
            chatIcon.textContent = "▲";
        } else {
            abrirChat();
        }
    }

    if (chatHeader) chatHeader.addEventListener("click", toggleChat);
    if (asesoriaHeaderBtn) {
        asesoriaHeaderBtn.addEventListener("click", (e) => {
            e.preventDefault();
            abrirChat();
            if (botInputField) botInputField.focus();
        });
    }

    function enviarMensajeChat() {
        const mensaje = botInputField.value.trim();
        if (mensaje === "") return;

        const userMsgDiv = document.createElement("div");
        userMsgDiv.className = "bot-msg";
        userMsgDiv.style.background = "transparent";
        userMsgDiv.style.borderLeft = "none";
        userMsgDiv.style.borderRight = "3px solid var(--white)";
        userMsgDiv.style.textAlign = "right";
        userMsgDiv.style.color = "var(--white)";
        userMsgDiv.textContent = mensaje;
        chatMessages.appendChild(userMsgDiv);

        botInputField.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const aiMsgDiv = document.createElement("div");
            aiMsgDiv.className = "bot-msg";
            aiMsgDiv.textContent = "Analizando su requerimiento con el catálogo de Marathon... Le sugiero revisar nuestras opciones de Proteínas para optimizar sus resultados.";
            chatMessages.appendChild(aiMsgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    if (sendBotMsgBtn && botInputField) {
        sendBotMsgBtn.addEventListener("click", enviarMensajeChat);
        botInputField.addEventListener("keyup", (e) => {
            if (e.key === "Enter") enviarMensajeChat();
        });
    }

    // --- 4. GESTIÓN DEL CARRITO DE COMPRAS (AÑADIR Y QUITAR) ---
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartDropdown = document.getElementById("cartDropdown");
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartCount = document.getElementById("cartCount");
    const cartTotalValue = document.getElementById("cartTotalValue");

    let cart = [];

    if (cartToggleBtn && cartDropdown) {
        cartToggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
        });
    }

    // Función global para permitir la eliminación de productos desde el HTML dinámico del carrito
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        actualizarCarrito();
    };

    function actualizarCarrito() {
        cartItemsList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="empty-cart">El carrito está vacío.</li>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${item.title}</span> 
                    <span>
                        $${item.price.toFixed(2)} 
                        <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Quitar">✖</button>
                    </span>`;
                cartItemsList.appendChild(li);
            });
        }

        cartCount.textContent = cart.length;
        cartTotalValue.textContent = total.toFixed(2);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".product-card");
            const title = card.querySelector("h3").textContent;
            const price = parseFloat(card.querySelector(".price").getAttribute("data-value"));

            cart.push({ title, price });
            actualizarCarrito();
            
            // Retroalimentación visual en el botón
            const originalText = btn.textContent;
            btn.textContent = "¡Añadido!";
            btn.style.backgroundColor = "var(--white)";
            btn.style.color = "var(--anthracite)";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = "transparent";
                btn.style.color = "var(--white)";
            }, 1000);
        });
    });

    // --- 4.5 FILTRADO POR CATEGORÍA (NAV SUPERIOR Y TARJETAS DE CATEGORÍA) ---
    const categoryButtons = document.querySelectorAll(".nav-category-btn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    const fullProductsGrid = document.getElementById("fullProductsGrid");

    function filtrarPorCategoria(categoria) {
        if (!fullProductsGrid) return;

        // Solo se filtran las tarjetas del catálogo completo (grid),
        // el carrusel de destacados siempre muestra todo.
        const tarjetas = fullProductsGrid.querySelectorAll(".product-card");
        tarjetas.forEach(tarjeta => {
            if (tarjeta.getAttribute("data-category") === categoria) {
                tarjeta.style.display = "block";
            } else {
                tarjeta.style.display = "none";
            }
        });

        // Resalta el botón/categoría activa
        categoryButtons.forEach(btn => btn.classList.remove("active-category"));
        categoryButtons.forEach(btn => {
            if (btn.getAttribute("data-category") === categoria) {
                btn.classList.add("active-category");
            }
        });
    }

    function limpiarFiltroCategoria() {
        if (!fullProductsGrid) return;
        const tarjetas = fullProductsGrid.querySelectorAll(".product-card");
        tarjetas.forEach(tarjeta => { tarjeta.style.display = "block"; });
        categoryButtons.forEach(btn => btn.classList.remove("active-category"));
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const categoria = btn.getAttribute("data-category");
            filtrarPorCategoria(categoria);

            const destino = document.getElementById("catalogFull");
            if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener("click", limpiarFiltroCategoria);
    }

    // --- 5. CARRUSEL INTERACTIVO Y AUTOMÁTICO (CADA 10 SEGUNDOS) ---
    const track = document.getElementById("carouselTrack");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    
    let autoScroll = setInterval(scrollRight, 5000);

    function scrollRight() {
        if (track) {
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: 280, behavior: 'smooth' });
            }
        }
    }

    function scrollLeft() {
        if (track) track.scrollBy({ left: -280, behavior: 'smooth' });
    }

    function resetInterval() {
        clearInterval(autoScroll);
        autoScroll = setInterval(scrollRight, 5000);
    }

    if (btnNext && btnPrev) {
        btnNext.addEventListener("click", () => { scrollRight(); resetInterval(); });
        btnPrev.addEventListener("click", () => { scrollLeft(); resetInterval(); });
    }
});