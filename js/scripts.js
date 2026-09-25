document.addEventListener("DOMContentLoaded", () => {

    // --- 0. CARRUSEL PRINCIPAL DE BANNERS (HERO) ---
    const heroCarousel = document.getElementById("heroBannerCarousel");

    if (heroCarousel) {
        const heroSlides = heroCarousel.querySelectorAll(".hero-slide");
        let heroIndex = 0;

        if (heroSlides.length > 1) {
            setInterval(() => {
                heroSlides[heroIndex].classList.remove("active");
                heroIndex = (heroIndex + 1) % heroSlides.length;
                heroSlides[heroIndex].classList.add("active");
            }, 5000);
        }
    }

    // --- 1. POP-UP EMERGENTE DE BIENVENIDA ---
    const popup = document.getElementById("welcomePopup");
    const closeBtn = document.getElementById("closePopup");

    if (popup && closeBtn) {
        setTimeout(() => {
            popup.style.display = "flex";
        }, 500);

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

    // --- 4. GESTIÓN DEL CARRITO DE COMPRAS ---
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

    // --- 4.6 PROCESAR PAGO EN CARRITO ---
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length > 0) {
                alert("Su compra fue procesada y le enviamos la información por correo.");
                cart = [];
                actualizarCarrito();
                if (cartDropdown) cartDropdown.style.display = "none";
            } else {
                alert("Su carrito está vacío. Agregue productos para proceder al pago.");
            }
        });
    }

    // --- 4.5 FILTRADO Y EXPANSIÓN DE CATÁLOGO (MÁXIMO 8 INICIAL) ---
    const fullProductsGrid = document.getElementById("fullProductsGrid");
    const toggleCatalogBtn = document.getElementById("toggleCatalogBtn");
    const categoryButtons = document.querySelectorAll(".nav-category-btn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");

    if (fullProductsGrid && toggleCatalogBtn) {
        const productCards = Array.from(fullProductsGrid.querySelectorAll(".product-card"));
        let isExpanded = false;

        function renderCatalog() {
            const activeFilter = document.querySelector(".nav-category-btn.active-category");

            productCards.forEach((card, index) => {
                if (activeFilter) {
                    toggleCatalogBtn.style.display = "none";
                    const categoria = activeFilter.getAttribute("data-category");
                    if (card.getAttribute("data-category") === categoria) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                } else {
                    toggleCatalogBtn.style.display = "inline-block";
                    if (isExpanded || index < 8) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                }
            });

            toggleCatalogBtn.textContent = isExpanded ? "Contraer Catálogo" : "Ver Catálogo Completo";
        }

        renderCatalog();

        toggleCatalogBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;
            renderCatalog();
            
            if (!isExpanded) {
                fullProductsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        categoryButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                categoryButtons.forEach(b => b.classList.remove("active-category"));
                btn.classList.add("active-category");
                renderCatalog();
                if (fullProductsGrid) fullProductsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });

        if (clearFilterBtn) {
            clearFilterBtn.addEventListener("click", () => {
                categoryButtons.forEach(btn => btn.classList.remove("active-category"));
                isExpanded = false;
                renderCatalog();
            });
        }
    }

    // --- 5. CARRUSEL INTERACTIVO Y AUTOMÁTICO (CADA 5 SEGUNDOS) ---
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

// --- 6. RUEDA DE LA FORTUNA Y REGISTRO PUBLICITARIO ---
    const wheelTrigger = document.getElementById("wheelTrigger");
    const wheelModal = document.getElementById("wheelModal");
    const closeWheelBtn = document.getElementById("closeWheelBtn");
    const spinBtn = document.getElementById("spinBtn");
    const wheel = document.getElementById("wheel");
    const wheelResult = document.getElementById("wheelResult");
    const showRegisterFormBtn = document.getElementById("showRegisterFormBtn");
    const wheelRegisterForm = document.getElementById("wheelRegisterForm");
    const couponFinalMsg = document.getElementById("couponFinalMsg");

    if (wheelTrigger && wheelModal) {
        wheelTrigger.addEventListener("click", () => {
            wheelModal.style.display = "flex";
        });

        if (closeWheelBtn) {
            closeWheelBtn.addEventListener("click", () => {
                wheelModal.style.display = "none";
            });
        }

        let hasSpun = false;
        if (spinBtn && wheel) {
            spinBtn.addEventListener("click", () => {
                if (hasSpun) return;
                hasSpun = true;
                spinBtn.disabled = true;
                spinBtn.style.opacity = "0.5";

                /*
                   Cálculo para alinear el sector del 80% (300° a 360°, centro en 330°) 
                   directamente con la flecha superior (0° / 360°):
                   Giro de 5 vueltas completas (1800°) + 30° de compensación = 1830°.
                */
                const degrees = 1830; 
                wheel.style.transform = `rotate(${degrees}deg)`;

                setTimeout(() => {
                    if (wheelResult) {
                        wheelResult.style.display = "block";
                    }
                }, 4000);
            });
        }

        // Mostrar formulario de registro publicitario
        if (showRegisterFormBtn && wheelRegisterForm) {
            showRegisterFormBtn.addEventListener("click", () => {
                wheelResult.style.display = "none";
                wheelRegisterForm.style.display = "block";
            });
        }

        // Procesar formulario de registro
        if (wheelRegisterForm) {
            wheelRegisterForm.addEventListener("submit", (e) => {
                e.preventDefault();
                wheelRegisterForm.style.display = "none";
                if (couponFinalMsg) {
                    couponFinalMsg.style.display = "block";
                }
            });
        }
    }
});
