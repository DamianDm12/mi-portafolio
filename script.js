document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias para el menú móvil ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');

    // Manejo del menú móvil
    mobileMenuToggle.addEventListener('click', () => {
        mainNavigation.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainNavigation.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mainNavigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mainNavigation.classList.remove('active');
        }
    });

    // --- Referencias a elementos del DOM para el carrito ---
    const cartIcon = document.querySelector('.cart-link');
    const cartCountSpan = document.querySelector('.cart-count');
    const shoppingCartModal = document.getElementById('shopping-cart-modal');
    const closeCartButton = document.querySelector('.close-cart-button');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutButton = document.querySelector('.checkout-button');

    // --- Referencias para la paginación y productos ---
    const productsGrid = document.getElementById('products-grid');
    const paginationControls = document.getElementById('pagination-controls');

    // --- Referencias para el carrusel de banners ---
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    // Array para almacenar los ítems del carrito (cargado desde localStorage)
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // --- Datos de Productos de Ejemplo ---
    const dummyProducts = [
        { id: 'prod001', name: 'Auriculares Inalámbricos Pro', price: 59.99, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Auriculares', category: 'electronica', isNew: true, description: 'Sonido cristalino, máxima comodidad y cancelación de ruido activa. Ideal para viajes y uso diario.' },
        { id: 'prod002', name: 'Teclado Mecánico RGB Gamer', price: 89.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Teclado', category: 'electronica', isNew: false, description: 'Switches táctiles, retroiluminación personalizable y durabilidad extrema para tus sesiones de juego.' },
        { id: 'prod003', name: 'Mouse Óptico Ergonómico', price: 34.50, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Mouse', category: 'electronica', isNew: true, description: 'Diseño ergonómico para largas horas de uso, sensor óptico de alta precisión para gaming y productividad.' },
        { id: 'prod004', name: 'Webcam Full HD', price: 45.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Webcam', category: 'electronica', isNew: false, description: 'Video nítido en 1080p, micrófono incorporado. Perfecta para videollamadas y streaming.' },
        { id: 'prod005', name: 'Monitor Curvo 27 Pulgadas', price: 299.99, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Monitor', category: 'electronica', isNew: true, description: 'Inmersión total con pantalla curva, resolución QHD y alta tasa de refresco para gamers y profesionales.' },
        { id: 'prod006', name: 'Disco Duro Externo 1TB', price: 65.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=HDD', category: 'almacenamiento', isNew: false, description: 'Almacenamiento portátil de alta velocidad para todos tus archivos importantes.' },
        { id: 'prod007', name: 'Router Wi-Fi 6', price: 120.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Router', category: 'redes', isNew: true, description: 'Conexión ultrarrápida y estable con la última tecnología Wi-Fi 6. Ideal para hogares conectados.' },
        { id: 'prod008', name: 'Impresora Multifuncional', price: 150.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Impresora', category: 'oficina', isNew: false, description: 'Imprime, escanea y copia con facilidad. Conectividad inalámbrica y alta eficiencia.' },
        { id: 'prod010', name: 'Tableta Gráfica', price: 95.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Tableta', category: 'electronica', isNew: false, description: 'Perfecta para artistas digitales y diseñadores. Alta sensibilidad a la presión y área de trabajo amplia.' },
        { id: 'prod011', name: 'Cámara Mirrorless', price: 600.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Camara', category: 'fotografia', isNew: true, description: 'Captura fotos y videos impresionantes con calidad profesional en un cuerpo compacto.' },
        { id: 'prod012', name: 'Smartwatch Deportivo', price: 130.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Smartwatch', category: 'wearables', isNew: false, description: 'Monitoriza tu actividad física, ritmo cardíaco y recibe notificaciones. Ideal para un estilo de vida activo.' },
        { id: 'prod013', name: 'Robot Aspirador', price: 250.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Robot', category: 'hogar', isNew: true, description: 'Mantén tu hogar limpio sin esfuerzo. Programable y con mapeo inteligente de habitaciones.' },
        { id: 'prod014', name: 'Cafetera Programable', price: 75.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Cafetera', category: 'hogar', isNew: false, description: 'Prepara tu café favorito a la hora deseada. Gran capacidad y fácil de limpiar.' },
        { id: 'prod015', name: 'Set de Sartenes Antiadherentes', price: 60.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Sartenes', category: 'cocina', isNew: true, description: 'Cocina sin que nada se pegue. Distribución uniforme del calor y mango ergonómico.' },
        { id: 'prod016', name: 'Libro - El Gran Gatsby', price: 15.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Libro', category: 'libros', isNew: false, description: 'Clásico de la literatura estadounidense. Una historia de amor, riqueza y tragedia.' },
        { id: 'prod017', name: 'Kit de Construcción LEGO', price: 40.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=LEGO', category: 'juguetes', isNew: true, description: 'Estimula la creatividad y la motricidad fina. Horas de diversión construyendo.' },
        { id: 'prod018', name: 'Pelota de Baloncesto Oficial', price: 25.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Pelota', category: 'deportes', isNew: false, description: 'Agarre superior y durabilidad. Perfecta para entrenamientos y partidos.' },
        { id: 'prod019', name: 'Set de Maquillaje Profesional', price: 70.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Maquillaje', category: 'belleza', isNew: true, description: 'Todo lo que necesitas para un look impecable. Tonos variados y de larga duración.' },
        { id: 'prod020', name: 'Crema Hidratante Facial', price: 20.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Crema', category: 'belleza', isNew: false, description: 'Hidratación profunda por 24 horas. Para todo tipo de piel.' },
        { id: 'prod009', name: 'Altavoz Bluetooth Portátil', price: 40.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Altavoz', category: 'audio', isNew: true, description: 'Sonido potente en un diseño compacto. Llévalo a todas partes con su batería de larga duración.' } // Asegurado que Altavoz está aquí
    ];


    // --- Variables de Paginación y Filtrado ---
    const productsPerPage = 8;
    let currentPage = 1;
    let currentCategory = 'all'; // 'all' para mostrar todas las categorías por defecto

    // --- Funciones del Carrusel ---
    let currentBannerIndex = 0;
    const totalBanners = carouselItems.length;

    function showBanner(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
        carouselInner.style.transform = `translateX(${-index * 100}%)`;
    }

    function nextBanner() {
        currentBannerIndex = (currentBannerIndex + 1) % totalBanners;
        showBanner(currentBannerIndex);
    }

    function prevBanner() {
        currentBannerIndex = (currentBannerIndex - 1 + totalBanners) % totalBanners;
        showBanner(currentBannerIndex);
    }

    // Navegación del carrusel
    if(prevButton && nextButton) {
        prevButton.addEventListener('click', prevBanner);
        nextButton.addEventListener('click', nextBanner);
    }

    // Auto-avance del carrusel
    setInterval(nextBanner, 5000); // Cambia cada 5 segundos

    // --- Funcionalidad Táctil para el Carrusel ---
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    carouselInner.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
        carouselInner.style.transition = 'none'; // Desactivar transición durante el swipe
    });

    carouselInner.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - touchStartX;
        carouselInner.style.transform = `translateX(calc(${-currentBannerIndex * 100}% + ${diffX}px))`;
    });

    carouselInner.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].clientX;
        isSwiping = false;
        carouselInner.style.transition = 'transform 0.5s ease-in-out'; // Reactivar transición

        const swipeThreshold = 50; // Mínimo de 50px para considerarse un swipe

        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe a la izquierda (siguiente)
            nextBanner();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe a la derecha (anterior)
            prevBanner();
        } else {
            // No fue un swipe válido, volver al banner actual
            showBanner(currentBannerIndex);
        }
    });
 
    // --- Funcionalidad de Arrastre con Mouse para el Carrusel ---
    let isDragging = false;
    let dragStartX = 0;
    let dragEndX = 0;

    carouselInner.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        carouselInner.style.cursor = 'grabbing';
        carouselInner.style.transition = 'none'; // Desactivar transición durante el arrastre
    });

    carouselInner.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diffX = currentX - dragStartX;
        carouselInner.style.transform = `translateX(calc(${-currentBannerIndex * 100}% + ${diffX}px))`;
    });

    carouselInner.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        dragEndX = e.clientX;
        carouselInner.style.cursor = 'grab';
        carouselInner.style.transition = 'transform 0.5s ease-in-out'; // Reactivar transición

        const swipeThreshold = 50; // Mínimo de 50px para considerarse un swipe

        if (dragStartX - dragEndX > swipeThreshold) {
            // Swipe a la izquierda (siguiente)
            nextBanner();
        } else if (dragEndX - dragStartX > swipeThreshold) {
            // Swipe a la derecha (anterior)
            prevBanner();
        } else {
            // No fue un swipe válido, volver al banner actual
            showBanner(currentBannerIndex);
        }
    });

    carouselInner.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselInner.style.cursor = 'grab';
            carouselInner.style.transition = 'transform 0.5s ease-in-out';
            showBanner(currentBannerIndex); // Volver al banner actual si el mouse sale del carrusel
        }
    });
 
     // --- Funciones del Carrito de Compras ---
 
     function saveCartToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function loadCartFromLocalStorage() {
        cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartCount();
        // NOTA: renderCartItems() NO se llama aquí para evitar que el modal se abra al cargar la página.
    }

    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function renderCartItems() {
        cartItemsList.innerHTML = ''; // Limpiar la lista antes de renderizar
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<li style="text-align: center; color: #555;">El carrito está vacío.</li>';
        } else {
            cartItems.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('cart-item');
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button data-product-id="${item.id}" data-action="decrease">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button data-product-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-item-button" data-product-id="${item.id}">Quitar</button>
                    </div>
                `;
                cartItemsList.appendChild(li);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        saveCartToLocalStorage();
    }

    function addToCart(productId) {
        const product = dummyProducts.find(p => p.id === productId);
        if (product) {
            const existingItem = cartItems.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }
            updateCartCount();
            renderCartItems(); // Re-renderizar el modal al añadir un ítem para que se actualice si está abierto
        }
    }

    function updateCartItemQuantity(productId, change) {
        const item = cartItems.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItemFromCart(productId);
            } else {
                renderCartItems();
            }
        }
    }

    function removeItemFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        updateCartCount();
        renderCartItems();
    }

    function clearCart() {
        cartItems = [];
        updateCartCount();
        renderCartItems();
    }

    // --- Funciones de Renderizado de Productos y Paginación ---

    function filterAndPaginateProducts() {
        const filteredProducts = currentCategory === 'all'
            ? dummyProducts
            : dummyProducts.filter(product => product.category === currentCategory);

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

        renderProducts(productsToDisplay);
        renderPaginationControls(totalPages);
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                ${product.isNew ? '<span class="new-tag">¡Nuevo!</span>' : ''}
                ${product.category ? `<span class="category-tag">${product.category}</span>` : ''}
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Agregar al carrito
                </button>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    function renderPaginationControls(totalPages) {
        paginationControls.innerHTML = '';

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.classList.add('prev-page');
            prevButton.textContent = 'Anterior';
            paginationControls.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.classList.add('page-number');
            if (i === currentPage) {
                pageNumberButton.classList.add('active');
            }
            pageNumberButton.dataset.page = i;
            pageNumberButton.textContent = i;
            paginationControls.appendChild(pageNumberButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('next-page');
            nextButton.textContent = 'Siguiente';
            paginationControls.appendChild(nextButton);
        }
    }

    // --- Event Listeners ---

    // Abrir modal del carrito
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        shoppingCartModal.style.display = 'flex'; // Usar flex para centrar
        renderCartItems(); // Asegura que el contenido esté actualizado al abrir
    });

    // Cerrar modal del carrito al hacer clic en la "x"
    closeCartButton.addEventListener('click', () => {
        shoppingCartModal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido del modal
    shoppingCartModal.addEventListener('click', (e) => {
        if (e.target === shoppingCartModal) {
            shoppingCartModal.style.display = 'none';
        }
    });

    // Manejo de clicks en la cuadrícula de productos (para agregar al carrito)
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        }
    });

    // Manejo de clicks en los controles del carrito dentro del modal
    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.dataset.productId;
        const action = target.dataset.action;

        if (action === 'increase') {
            updateCartItemQuantity(productId, 1);
        } else if (action === 'decrease') {
            updateCartItemQuantity(productId, -1);
        } else if (target.classList.contains('remove-item-button')) {
            removeItemFromCart(productId);
        }
    });

    // Vaciar carrito
    clearCartBtn.addEventListener('click', clearCart);

    // --- Funcionalidad del botón "Comprar" para WhatsApp ---
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            console.log('El carrito está vacío. No se puede realizar la compra.');
            alert('El carrito está vacío. Agrega productos antes de comprar.'); // Alerta al usuario
            return;
        }

        let whatsappMessage = "¡Hola! Me gustaría hacer un pedido con los siguientes productos:\n\n";
        cartItems.forEach(item => {
            whatsappMessage += `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})\n`;
        });
        whatsappMessage += `\nTotal: ${cartTotalSpan.textContent}`;
        whatsappMessage += "\n\n¡Espero tu confirmación!";

        const phoneNumber = '549555555'; // Reemplaza con tu número de teléfono de WhatsApp real (sin +)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    });


    // Manejo de clicks en los controles de paginación
    paginationControls.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-number')) {
            currentPage = parseInt(e.target.dataset.page);
            filterAndPaginateProducts();
        } else if (e.target.classList.contains('prev-page')) {
            currentPage--;
            filterAndPaginateProducts();
        } else if (e.target.classList.contains('next-page')) {
            currentPage++;
            filterAndPaginateProducts();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazarse al inicio de la página
    });

    // --- Manejo del filtro de categorías en la sidebar ---
    const categoryNav = document.querySelector('.category-nav');

    if (categoryNav) {
        categoryNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-link')) {
                e.preventDefault();
                
                // Quitar la clase 'active' de todos los enlaces y añadirla al que se hizo clic
                document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');

                // Actualizar la categoría y renderizar los productos
                currentCategory = e.target.dataset.category;
                currentPage = 1; // Resetear a la primera página
                filterAndPaginateProducts();
            }
        });
    }


    // --- Manejo del menú móvil ---
    if (mobileMenuToggle && mainNavigation) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNavigation.classList.toggle('is-open');
        });
    }

    // --- Inicialización ---
    showBanner(currentBannerIndex); // Muestra el primer banner
    filterAndPaginateProducts(); // Renderiza los productos iniciales y paginación
    loadCartFromLocalStorage(); // Carga el carrito al iniciar la página (solo los datos, no muestra el modal)
});
