document.addEventListener('DOMContentLoaded', () => {

    // --- PRODUCT DATA ---
    // UPDATED: Prices converted from USD to INR (using a 1 USD = 80 INR rate)
    const products = [
        {
            id: 1,
            name: 'Modern Armchair',
            price: 15199, // Was 189.99 USD
            description: 'A comfortable and stylish armchair, perfect for any modern living room.',
            image: 'https://i.pinimg.com/originals/57/ae/8f/57ae8fa8a5d0ee15d25ae89c3b9c532a.jpg'
        },
        {
            id: 2,
            name: 'Minimalist Desk Lamp',
            price: 3960, // Was 49.50 USD
            description: 'Sleek and functional desk lamp with adjustable brightness for your workspace.',
            image: 'https://img.freepik.com/premium-photo/photo-contemporary-desk-lamp-with-minimalist-aesthetics_933496-38629.jpg'
        },
        {
            id: 3,
            name: 'Ceramic Planter Pot',
            price: 1920, 
            description: 'Add a touch of green to your space with this elegant ceramic pot.',
          image: 'https://tse3.mm.bing.net/th/id/OIP.nGE0cPn1-0ownLt1SqSjVQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 4,
            name: 'Wooden Coffee Table',
            price: 20000, 
            description: 'Solid oak coffee table with a rustic finish. Built to last and impress.',
           image: 'https://blitsy.com/wp-content/uploads/2021/04/DIY-Industrial-Style-Coffee-Table.jpg'
        },
        {
            id: 5,
            name: 'Cozy Throw Blanket',
            price: 6000, 
            description: 'Soft and warm, this merino wool throw blanket is perfect for chilly evenings.',
           image: 'https://ik.imagekit.io/2xkwa8s1i/img/npl_modified_images/Sofa_throws/Mellow_Rose/WTHCTBL5060_WB_4.jpg?tr=w-828'
        },
        {
            id: 6,
            name: 'Abstract Wall Art',
            price: 9600, 
            description: 'A vibrant piece of abstract art to brighten up any wall and spark conversation.',
         image: 'https://ik.imagekit.io/2xkwa8s1i/img/npl_raw_images/Wallartlot1/WWARTLUMEBL20/WWARTLUMEBL20_LS_1.jpg?tr=w-828'
        }
    ];

   
    let cart = [];

    
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');

   
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">Rs. ${product.price.toLocaleString('en-IN')}</div>
                    <div class="product-buttons">
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        <button class="buy-now-btn" data-id="${product.id}">Buy Now</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            
            cartTotalSpan.textContent = '0';
            updateCartCount();
            return;
        }
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-item-btn" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        
        cartTotalSpan.textContent = total.toLocaleString('en-IN');
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }
    
    function addToCart(productId, openModal = false) {
        const productToAdd = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const productCard = productsGrid.querySelector(`.add-to-cart-btn[data-id="${productId}"]`).closest('.product-card');
            const actualImageSrc = productCard.querySelector('img').src;
            cart.push({ ...productToAdd, image: actualImageSrc, quantity: 1 });
        }
        renderCart();

        if (openModal) {
            cartModal.style.display = 'block';
        }
    }

    function updateCartItem(productId, action) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        const item = cart[itemIndex];

        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        } else if (action === 'remove') {
            cart.splice(itemIndex, 1);
        }
        renderCart();
    }
    
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }
    
    // --- EVENT LISTENERS ---
    renderProducts(products);
    
    searchInput.addEventListener('input', handleSearch);

    productsGrid.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.getAttribute('data-id'));

        if (target.classList.contains('add-to-cart-btn')) {
            addToCart(productId);
            target.textContent = 'Added!';
            setTimeout(() => { target.textContent = 'Add to Cart'; }, 1000);
        } else if (target.classList.contains('buy-now-btn')) {
            addToCart(productId, true);
        }
    });

    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const productId = parseInt(target.getAttribute('data-id'));
        
        if (target.classList.contains('quantity-btn')) {
            const action = target.getAttribute('data-action');
            updateCartItem(productId, action);
        } else if (target.classList.contains('remove-item-btn')) {
            updateCartItem(productId, 'remove');
        }
    });
});