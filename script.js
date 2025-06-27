document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias para el menú móvil ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');

    // Manejo del menú móvil
    if (mobileMenuToggle && mainNavigation) {
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
    }

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

    // --- Referencias para el carrusel de banners (pueden ser nulas en productos.html) ---
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');

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
        { id: 'prod009', name: 'Altavoz Bluetooth Portátil', price: 40.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Altavoz', category: 'audio', isNew: true, description: 'Sonido potente en un diseño compacto. Llévalo a todas partes con su batería de larga duración.' },
        // Más productos para asegurar al menos 10 páginas con 8 productos por página
        { id: 'prod021', name: 'Juego de Copas de Cristal', price: 35.00, image: 'https://placehold.co/150x140/ffcdd2/000?text=Copas', category: 'hogar', isNew: false, description: 'Elegante juego de copas, ideal para cenas y celebraciones.' },
        { id: 'prod022', name: 'Mochila Urbana Impermeable', price: 45.00, image: 'https://placehold.co/150x140/f48fb1/000?text=Mochila', category: 'ropa', isNew: true, description: 'Diseño moderno y protección contra la lluvia, perfecta para el día a día.' },
        { id: 'prod023', name: 'Agenda 2025 Planificador', price: 18.00, image: 'https://placehold.co/150x140/ec2678/ffffff?text=Agenda', category: 'oficina', isNew: false, description: 'Organiza tu año con esta completa agenda con diseño minimalista.' },
        { id: 'prod024', name: 'Drone con Cámara 4K', price: 180.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Drone', category: 'electronica', isNew: true, description: 'Captura vistas aéreas impresionantes con estabilidad y alta resolución.' },
        { id: 'prod025', name: 'Cama para Mascota Suave', price: 55.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=CamaMascota', category: 'hogar', isNew: false, description: 'Confort y descanso garantizado para tu mejor amigo.' },
        { id: 'prod026', name: 'Set de Mancuernas Ajustables', price: 90.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Mancuernas', category: 'deportes', isNew: true, description: 'Ahorra espacio con este set versátil para entrenamientos en casa.' },
        { id: 'prod027', name: 'Lámpara de Escritorio LED', price: 28.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Lampara', category: 'hogar', isNew: false, description: 'Iluminación ajustable para lectura o trabajo, con base antideslizante.' },
        { id: 'prod028', name: 'Funda para Smartphone (Varios Modelos)', price: 12.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=FundaMovil', category: 'electronica', isNew: true, description: 'Protección y estilo para tu dispositivo móvil.' },
        { id: 'prod029', name: 'Juego de Mesa Familiar', price: 25.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=JuegoMesa', category: 'juguetes', isNew: false, description: 'Diversión asegurada para todas las edades.' },
        { id: 'prod030', name: 'Cepillo de Limpieza Facial Eléctrico', price: 30.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=CepilloFacial', category: 'belleza', isNew: true, description: 'Limpieza profunda y exfoliación suave para una piel radiante.' },
        { id: 'prod031', name: 'Reloj de Pared Minimalista', price: 22.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=RelojPared', category: 'hogar', isNew: false, description: 'Diseño elegante que complementa cualquier decoración.' },
        { id: 'prod032', name: 'Balón de Fútbol N°5', price: 20.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=BalonFutbol', category: 'deportes', isNew: true, description: 'Alta durabilidad y rendimiento para tus partidos.' },
        { id: 'prod033', name: 'Cargador Rápido USB-C', price: 19.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Cargador', category: 'electronica', isNew: false, description: 'Carga tus dispositivos en tiempo récord.' },
        { id: 'prod034', name: 'Manta Suave de Lana', price: 38.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Manta', category: 'hogar', isNew: true, description: 'Perfecta para las noches frías, gran confort.' },
        { id: 'prod035', name: 'Kit de Jardinería Básico', price: 29.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Jardineria', category: 'hogar', isNew: false, description: 'Herramientas esenciales para empezar tu huerto o jardín.' },
        { id: 'prod036', name: 'Juego de Bloques de Construcción Magnéticos', price: 50.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=BloquesMag', category: 'juguetes', isNew: true, description: 'Desarrolla la creatividad y la lógica en niños.' },
        { id: 'prod037', name: 'Filtro de Agua para Grifo', price: 27.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=FiltroAgua', category: 'hogar', isNew: false, description: 'Agua pura y fresca directamente de tu grifo.' },
        { id: 'prod038', name: 'Libro - Cien años de soledad', price: 17.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=CienAños', category: 'libros', isNew: true, description: 'Obra maestra de Gabriel García Márquez.' },
        { id: 'prod039', name: 'Set de brochas de maquillaje', price: 25.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Brochas', category: 'belleza', isNew: false, description: 'Brochas suaves y de alta calidad para un acabado perfecto.' },
        { id: 'prod040', name: 'Termo de Acero Inoxidable', price: 23.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Termo', category: 'cocina', isNew: true, description: 'Mantiene tus bebidas frías o calientes por horas.' },
        { id: 'prod041', name: 'Cinta de Correr Plegable', price: 450.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=CintaCorrer', category: 'deportes', isNew: false, description: 'Entrena en casa con esta cinta compacta y eficiente.' },
        { id: 'prod042', name: 'Kit de Pintura Acrílica', price: 32.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Pintura', category: 'juguetes', isNew: true, description: 'Ideal para artistas de todas las edades, colores vibrantes.' },
        { id: 'prod043', name: 'Auriculares de Diadema Gaming', price: 70.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=GamingHeadset', category: 'electronica', isNew: false, description: 'Sonido envolvente y micrófono con cancelación de ruido para gamers.' },
        { id: 'prod044', name: 'Mascarilla Facial de Arcilla', price: 10.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=Mascarilla', category: 'belleza', isNew: true, description: 'Piel purificada y suave con ingredientes naturales.' },
        { id: 'prod045', name: 'Set de Utensilios de Cocina Silicona', price: 40.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Utensilios', category: 'cocina', isNew: false, description: 'No rayan tus sartenes, resistentes al calor y fáciles de limpiar.' },
        { id: 'prod046', name: 'Adaptador USB Hub', price: 15.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=USBHub', category: 'electronica', isNew: true, description: 'Expande la conectividad de tu laptop o PC.' },
        { id: 'prod047', name: 'Balón Medicinal de 5kg', price: 30.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=BalonMed', category: 'deportes', isNew: false, description: 'Ideal para ejercicios de fuerza y rehabilitación.' },
        { id: 'prod048', name: 'Set de 3 Velas Aromáticas', price: 18.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Velas', category: 'hogar', isNew: true, description: 'Crea un ambiente relajante con fragancias suaves.' },
        { id: 'prod049', name: 'Lámpara de Sal del Himalaya', price: 25.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=LamparaSal', category: 'hogar', isNew: false, description: 'Purifica el aire y aporta una luz cálida y acogedora.' },
        { id: 'prod050', name: 'Libro - El Señor de los Anillos', price: 22.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=ESDLA', category: 'libros', isNew: true, description: 'Clásico de fantasía épica de J.R.R. Tolkien.' },
        { id: 'prod051', name: 'Cámara de Seguridad WiFi', price: 80.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=CamaraSeg', category: 'electronica', isNew: false, description: 'Monitorea tu hogar desde cualquier lugar con tu smartphone.' },
        { id: 'prod052', name: 'Collar Antiladridos Ultrasónico', price: 40.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Antiladridos', category: 'hogar', isNew: true, description: 'Ayuda a entrenar a tu perro de forma segura y eficaz.' },
        { id: 'prod053', name: 'Juego de Cartas UNO', price: 8.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=UNO', category: 'juguetes', isNew: false, description: 'El clásico juego de cartas para toda la familia.' },
        { id: 'prod054', name: 'Zapatillas Deportivas Hombre', price: 65.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Zapatillas', category: 'ropa', isNew: true, description: 'Comodidad y soporte para tu rutina de ejercicios.' },
        { id: 'prod055', name: 'Acondicionador para Cabello Seco', price: 12.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Acondicionador', category: 'belleza', isNew: false, description: 'Nutre e hidrata intensamente el cabello seco y dañado.' },
        { id: 'prod056', name: 'Máquina de Coser Portátil', price: 110.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=MaquinaCoser', category: 'hogar', isNew: true, description: 'Ideal para pequeños arreglos y proyectos de costura.' },
        { id: 'prod057', name: 'Juego de Destornilladores de Precisión', price: 20.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Destornilladores', category: 'electronica', isNew: false, description: 'Esenciales para reparar electrónica y pequeños aparatos.' },
        { id: 'prod058', name: 'Esterilla de Yoga Antideslizante', price: 25.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=EsterillaYoga', category: 'deportes', isNew: true, description: 'Comodidad y agarre seguro para tus sesiones de yoga.' },
        { id: 'prod059', name: 'Libro de Cocina Saludable', price: 19.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Recetas', category: 'libros', isNew: false, description: 'Recetas fáciles y deliciosas para una vida sana.' },
        { id: 'prod060', name: 'Bloques de Yoga de Corcho', price: 15.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=BloquesYoga', category: 'deportes', isNew: true, description: 'Soporte adicional para mejorar tus posturas de yoga.' },
        { id: 'prod061', name: 'Sartén de Hierro Fundido', price: 48.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=SartenHierro', category: 'cocina', isNew: false, description: 'Excelente retención de calor para cocción uniforme.' },
        { id: 'prod062', name: 'Cargador Portátil Power Bank 10000mAh', price: 30.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=PowerBank', category: 'electronica', isNew: true, description: 'Carga tus dispositivos en cualquier lugar.' },
        { id: 'prod063', name: 'Juego de Juguetes para Perros', price: 14.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=JuguetesPerro', category: 'juguetes', isNew: false, description: 'Variedad de juguetes para mantener a tu mascota entretenida.' },
        { id: 'prod064', name: 'Crema Antiedad Noche', price: 35.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=CremaAntiedad', category: 'belleza', isNew: true, description: 'Reduce arrugas y mejora la firmeza de la piel mientras duermes.' },
        { id: 'prod065', name: 'Tostadora de Acero Inoxidable', price: 40.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Tostadora', category: 'hogar', isNew: false, description: 'Tuesta tu pan a la perfección, con múltiples funciones.' },
        { id: 'prod066', name: 'Balón de Yoga Antiexplosión', price: 20.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=BalonYoga', category: 'deportes', isNew: true, description: 'Mejora tu equilibrio y fuerza central.' },
        { id: 'prod067', name: 'Libro - 1984 (George Orwell)', price: 16.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=1984', category: 'libros', isNew: false, description: 'Clásico distópico que invita a la reflexión.' },
        { id: 'prod068', name: 'Secador de Pelo Profesional', price: 55.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=SecadorPelo', category: 'belleza', isNew: true, description: 'Secado rápido y resultados de salón en casa.' },
        { id: 'prod069', name: 'Máquina para hacer palomitas de maíz', price: 30.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Palomitas', category: 'hogar', isNew: false, description: 'Disfruta de palomitas frescas en minutos.' },
        { id: 'prod070', name: 'Juego de Construcción de Ciudad', price: 75.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=CiudadLego', category: 'juguetes', isNew: true, description: 'Crea tu propia ciudad con este completo set.' },
        { id: 'prod071', name: 'Banda Elástica de Resistencia Set', price: 20.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=BandasRes', category: 'deportes', isNew: false, description: 'Perfectas para ejercicios de fuerza y flexibilidad.' },
        { id: 'prod072', name: 'Vaporizador Facial', price: 45.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Vaporizador', category: 'belleza', isNew: true, description: 'Abre los poros y prepara tu piel para una limpieza profunda.' },
        { id: 'prod073', name: 'Set de Cuchillos de Cocina Premium', price: 60.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Cuchillos', category: 'cocina', isNew: false, description: 'Corte preciso y durabilidad excepcional.' },
        { id: 'prod074', name: 'Ropa Interior Femenina (Set de 3)', price: 25.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=RopaInterior', category: 'ropa', isNew: true, description: 'Comodidad y estilo para tu día a día.' },
        { id: 'prod075', name: 'Libro - El Principito', price: 10.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=Principito', category: 'libros', isNew: false, description: 'Un clásico atemporal para todas las edades.' },
        { id: 'prod076', name: 'Dron de Carreras FPV', price: 150.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=DroneCarreras', category: 'electronica', isNew: true, description: 'Experimenta la adrenalina de las carreras de drones.' },
        { id: 'prod077', name: 'Sillón Reclinable Ergonómico', price: 300.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Sillon', category: 'hogar', isNew: false, description: 'Máximo confort para tu sala de estar o estudio.' },
        { id: 'prod078', name: 'Patines en Línea Ajustables', price: 55.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Patines', category: 'deportes', isNew: true, description: 'Diversión sobre ruedas para niños y adultos.' },
        { id: 'prod079', name: 'Set de Belleza para Manicura y Pedicura', price: 30.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=Manicura', category: 'belleza', isNew: false, description: 'Todo lo necesario para unas uñas perfectas en casa.' },
        { id: 'prod080', name: 'Set de Construcción de Robot Educativo', price: 85.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=RobotEduc', category: 'juguetes', isNew: true, description: 'Aprende robótica de forma divertida.' },
        // Añadimos más productos para asegurar muchas páginas
        { id: 'prod081', name: 'Libro - Harry Potter y la Piedra Filosofal', price: 20.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=HarryPotter', category: 'libros', isNew: false, description: 'El inicio de la mágica saga de Harry Potter.' },
        { id: 'prod082', name: 'Mochila de Senderismo 40L', price: 70.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=MochilaSend', category: 'deportes', isNew: true, description: 'Ideal para excursiones y aventuras al aire libre.' },
        { id: 'prod083', name: 'Altavoz Inteligente con Asistente', price: 99.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=SmartSpeaker', category: 'electronica', isNew: false, description: 'Controla tu hogar y reproduce música con tu voz.' },
        { id: 'prod084', name: 'Set de Toallas de Algodón Orgánico', price: 45.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Toallas', category: 'hogar', isNew: true, description: 'Suaves y absorbentes, para un baño de lujo.' },
        { id: 'prod085', name: 'Pista de Autos de Juguete', price: 35.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=PistaAutos', category: 'juguetes', isNew: false, description: 'Horas de diversión con carreras emocionantes.' },
        { id: 'prod086', name: 'Crema Corporal Hidratante', price: 15.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=CremaC', category: 'belleza', isNew: true, description: 'Nutre tu piel dejándola suave y sedosa.' },
        { id: 'prod087', name: 'Bicicleta Estática Plegable', price: 220.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=BiciEstatica', category: 'deportes', isNew: false, description: 'Entrenamiento cardiovascular en casa, fácil de guardar.' },
        { id: 'prod088', name: 'Juego de Ajedrez Clásico', price: 28.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Ajedrez', category: 'juguetes', isNew: true, description: 'Desarrolla la estrategia y el pensamiento crítico.' },
        { id: 'prod089', name: 'Batidora de Mano Eléctrica', price: 35.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Batidora', category: 'cocina', isNew: false, description: 'Prepara tus recetas favoritas de forma rápida y sencilla.' },
        { id: 'prod090', name: 'Kit de Inicio para Dibujo', price: 20.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Dibujo', category: 'juguetes', isNew: true, description: 'Explora tu creatividad con este completo set.' },
        { id: 'prod091', name: 'Gafas de Sol Polarizadas', price: 40.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=GafasSol', category: 'ropa', isNew: false, description: 'Protección UV y estilo para cualquier ocasión.' },
        { id: 'prod092', name: 'Termómetro Digital de Cocina', price: 18.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=TermometroCocina', category: 'cocina', isNew: true, description: 'Asegura la cocción perfecta de tus alimentos.' },
        { id: 'prod093', name: 'Audífonos In-ear con Cancelación de Ruido', price: 75.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=InEarNoise', category: 'electronica', isNew: false, description: 'Sumérgete en tu música sin distracciones externas.' },
        { id: 'prod094', name: 'Set de Herramientas Básicas para el Hogar', price: 50.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=Herramientas', category: 'hogar', isNew: true, description: 'Imprescindible para cualquier arreglo o montaje en casa.' },
        { id: 'prod095', name: 'Balón de Voleibol Oficial', price: 22.00, image: 'https://placehold.co/150x140/880e4f/ffffff?text=Voleibol', category: 'deportes', isNew: false, description: 'Diseñado para rendimiento y durabilidad en la cancha.' },
        { id: 'prod096', name: 'Perfume Floral para Mujer', price: 55.00, image: 'https://placehold.co/150x140/ff69b4/ffffff?text=Perfume', category: 'belleza', isNew: true, description: 'Fragancia fresca y duradera para el día a día.' },
        { id: 'prod097', name: 'Mesa Plegable para Exteriores', price: 80.00, image: 'https://placehold.co/150x140/f06292/ffffff?text=MesaPlegable', category: 'hogar', isNew: false, description: 'Ideal para picnics, camping o como mesa auxiliar.' },
        { id: 'prod098', name: 'Set de Maquetas para Armar (Avión)', price: 40.00, image: 'https://placehold.co/150x140/fce4ec/ffffff?text=MaquetaAvion', category: 'juguetes', isNew: true, description: 'Desafío y diversión para entusiastas del modelismo.' },
        { id: 'prod099', name: 'Balanza de Cocina Digital', price: 20.00, image: 'https://placehold.co/150x140/e91e63/ffffff?text=BalanzaCocina', category: 'cocina', isNew: false, description: 'Precisión para tus recetas, fácil de usar y limpiar.' },
        { id: 'prod100', name: 'Mochila Antirrobo con Puerto USB', price: 50.00, image: 'https://placehold.co/150x140/c2185b/ffffff?text=MochilaAntirrobo', category: 'electronica', isNew: true, description: 'Seguridad y carga de dispositivos en movimiento.' }
    ];

    // --- Variables de Paginación y Filtrado ---
    const productsPerPage = 8;
    let currentPage = 1;
    let currentCategory = 'all';

    // --- Funciones del Carrusel ---
    let currentBannerIndex = 0;
    let totalBanners = 0;
    let autoAdvance;

    if (carouselInner && carouselItems.length > 0) {
        totalBanners = carouselItems.length;

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

        const CAROUSEL_INTERVAL = 12000;
        autoAdvance = setInterval(nextBanner, CAROUSEL_INTERVAL);

        // --- Funcionalidad Táctil para el Carrusel ---
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        carouselInner.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isSwiping = true;
            carouselInner.style.transition = 'none'; // Desactivar transición durante el swipe
            clearInterval(autoAdvance); // Detener el auto-avance durante el swipe
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
            carouselInner.style.transition = 'transform 0.3s ease-out'; // Reactivar transición

            const swipeThreshold = 50; // Mínimo de 50px para considerarse un swipe

            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe a la izquierda (siguiente)
                nextBanner();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe a la derecha (anterior)
                currentBannerIndex = (currentBannerIndex - 1 + totalBanners) % totalBanners;
                showBanner(currentBannerIndex);
            } else {
                // No fue un swipe válido, volver al banner actual
                showBanner(currentBannerIndex);
            }

            // Reanudar el auto-avance después del swipe
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextBanner, CAROUSEL_INTERVAL);
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
            clearInterval(autoAdvance); // Detener el auto-avance durante el arrastre
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
            carouselInner.style.transition = 'transform 0.3s ease-out'; // Reactivar transición

            const swipeThreshold = 50; // Mínimo de 50px para considerarse un swipe

            if (dragStartX - dragEndX > swipeThreshold) {
                // Swipe a la izquierda (siguiente)
                nextBanner();
            } else if (dragEndX - dragStartX > swipeThreshold) {
                // Swipe a la derecha (anterior)
                currentBannerIndex = (currentBannerIndex - 1 + totalBanners) % totalBanners;
                showBanner(currentBannerIndex);
            } else {
                // No fue un swipe válido, volver al banner actual
                showBanner(currentBannerIndex);
            }

            // Reanudar el auto-avance después del arrastre
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextBanner, CAROUSEL_INTERVAL);
        });

        carouselInner.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                carouselInner.style.cursor = 'grab';
                carouselInner.style.transition = 'transform 0.3s ease-out';
                showBanner(currentBannerIndex); // Volver al banner actual si el mouse sale del carrusel
                // Reanudar el auto-avance
                clearInterval(autoAdvance);
                autoAdvance = setInterval(nextBanner, CAROUSEL_INTERVAL);
            }
        });
    } // Fin del bloque if (carouselInner)
 
     // --- Funciones del Carrito de Compras ---
 
     function saveCartToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function loadCartFromLocalStorage() {
        cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartCount();
    }

    function updateCartCount() {
        if (!cartCountSpan) return;
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function renderCartItems() {
        if (!cartItemsList || !cartTotalSpan) return;
        cartItemsList.innerHTML = '';
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
            renderCartItems();
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
        if (!productsGrid) return;
        const filteredProducts = currentCategory === 'all'
            ? dummyProducts
            : dummyProducts.filter(product => product.category === currentCategory);

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 0;
        } else if (currentPage === 0 && totalPages > 0) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

        renderProducts(productsToDisplay);
        renderPaginationControls(totalPages);
    }

    function renderProducts(products) {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; margin-top: 2rem; font-size: 1.2rem; color: #555;">No hay productos en esta categoría.</p>';
            return;
        }
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
        if (!paginationControls) return; // <-- Esto evita el error
        paginationControls.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.classList.add('prev-page');
            prevButton.textContent = 'Anterior';
            paginationControls.appendChild(prevButton);
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.classList.add('page-number');
            firstPageButton.dataset.page = 1;
            firstPageButton.textContent = 1;
            paginationControls.appendChild(firstPageButton);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationControls.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.classList.add('page-number');
            if (i === currentPage) {
                pageNumberButton.classList.add('active');
            }
            pageNumberButton.dataset.page = i;
            pageNumberButton.textContent = i;
            paginationControls.appendChild(pageNumberButton);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationControls.appendChild(ellipsis);
            }
            const lastPageButton = document.createElement('button');
            lastPageButton.classList.add('page-number');
            lastPageButton.dataset.page = totalPages;
            lastPageButton.textContent = totalPages;
            paginationControls.appendChild(lastPageButton);
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
    if (cartIcon && shoppingCartModal && cartItemsList) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            shoppingCartModal.style.display = 'flex';
            renderCartItems();
        });
    }

    // Cerrar modal del carrito al hacer clic en la "x"
    if (closeCartButton && shoppingCartModal) {
        closeCartButton.addEventListener('click', () => {
            shoppingCartModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido del modal
    if (shoppingCartModal) {
        shoppingCartModal.addEventListener('click', (e) => {
            if (e.target === shoppingCartModal) {
                shoppingCartModal.style.display = 'none';
            }
        });
    }

    // Manejo de clicks en la cuadrícula de productos (para agregar al carrito)
    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            }
        });
    }

    // Manejo de clicks en los controles del carrito dentro del modal
    if (cartItemsList) {
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
    }

    // Vaciar carrito
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // --- Funcionalidad del botón "Comprar" para WhatsApp ---
    if (checkoutButton && cartTotalSpan) {
        checkoutButton.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('El carrito está vacío. Agrega productos antes de comprar.');
                return;
            }

            let whatsappMessage = "¡Hola! Me gustaría hacer un pedido con los siguientes productos:\n\n";
            cartItems.forEach(item => {
                whatsappMessage += `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})\n`;
            });
            whatsappMessage += `\nTotal: ${cartTotalSpan.textContent}`;
            whatsappMessage += "\n\n¡Espero tu confirmación!";

            const phoneNumber = '542255445566';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Manejo de clicks en los controles de paginación
    if (paginationControls) {
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Manejo del filtro de categorías en la sidebar ---
    const categoryNav = document.querySelector('.category-nav');
    const mobileCategoryNav = document.querySelector('.mobile-category-nav');
    const mobileCategoriesToggle = document.querySelector('.mobile-categories-toggle');

    function handleCategoryClick(e) {
        if (e.target.classList.contains('category-link')) {
            e.preventDefault();

            const category = e.target.dataset.category;

            document.querySelectorAll('.category-link').forEach(link => {
                if (link.dataset.category === category) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            currentCategory = category;
            currentPage = 1;
            filterAndPaginateProducts();

            const floatingPopup = document.querySelector('.floating-categories-popup');
            if (floatingPopup && floatingPopup.classList.contains('open')) {
                floatingPopup.classList.remove('open');
            }
            const mobileCategoryNav = document.querySelector('.mobile-category-nav');
            if (mobileCategoryNav && mobileCategoryNav.classList.contains('open')) {
                mobileCategoryNav.classList.remove('open');
            }
        }
    }

    document.querySelectorAll('.category-nav, .mobile-category-nav, .floating-categories-popup').forEach(nav => {
        if (nav) nav.addEventListener('click', handleCategoryClick);
    });

    // --- Inicialización ---
    if (carouselInner && carouselItems.length > 0) {
        showBanner(currentBannerIndex);
    }
    if (productsGrid) {
        filterAndPaginateProducts();
    }
    loadCartFromLocalStorage();
});

// --- Categorías flotantes para móvil ---
const floatingBtn = document.querySelector('.floating-categories-btn');
const floatingPopup = document.querySelector('.floating-categories-popup');

if (floatingBtn && floatingPopup) {
    floatingBtn.addEventListener('click', () => {
        floatingPopup.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (
            !floatingBtn.contains(e.target) &&
            !floatingPopup.contains(e.target)
        ) {
            floatingPopup.classList.remove('open');
        }
    });
    floatingPopup.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-link')) {
            e.preventDefault();
            document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            if (typeof filterAndPaginateProducts === 'function') {
                filterAndPaginateProducts();
            }
            floatingPopup.classList.remove('open');
        }
    });
}
