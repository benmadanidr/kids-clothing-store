document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            pages.forEach(page => {
                page.classList.add('d-none');
                if (page.id === `${targetPage}-page`) {
                    page.classList.remove('d-none');
                }
            });
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Add Product Modal
    const addProductBtn = document.getElementById('add-product-btn');
    const addProductModal = new bootstrap.Modal(document.getElementById('add-product-modal'));
    const saveProductBtn = document.getElementById('save-product');
    const addProductForm = document.getElementById('add-product-form');

    addProductBtn.addEventListener('click', () => {
        addProductModal.show();
    });

    saveProductBtn.addEventListener('click', async () => {
        const formData = new FormData(addProductForm);
        const productData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                addProductModal.hide();
                addProductForm.reset();
                loadInventory();
            } else {
                alert('حدث خطأ أثناء حفظ المنتج');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال بالخادم');
        }
    });

    // Load Inventory
    async function loadInventory() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            const inventoryTable = document.getElementById('inventory-table');
            
            inventoryTable.innerHTML = products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${translateCategory(product.category)}</td>
                    <td>${product.size}</td>
                    <td>${product.price} ر.س</td>
                    <td>${product.quantity}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-product" data-id="${product._id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product._id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Sales Management
    const productSearch = document.getElementById('product-search');
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const completeSaleBtn = document.getElementById('complete-sale');
    let cart = [];

    productSearch.addEventListener('input', async (e) => {
        if (e.target.value.length < 2) return;

        try {
            const response = await fetch(`/api/products/search?q=${e.target.value}`);
            const products = await response.json();
            // Show product suggestions...
        } catch (error) {
            console.error('Error:', error);
        }
    });

    completeSaleBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('الرجاء إضافة منتجات إلى السلة أولاً');
            return;
        }

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cart,
                    total: calculateTotal()
                })
            });

            if (response.ok) {
                alert('تم إتمام عملية البيع بنجاح');
                cart = [];
                updateCart();
                loadInventory();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ أثناء إتمام عملية البيع');
        }
    });

    function translateCategory(category) {
        const translations = {
            'Tops': 'ملابس علوية',
            'Bottoms': 'ملابس سفلية',
            'Dresses': 'فساتين',
            'Shoes': 'أحذية',
            'Accessories': 'إكسسوارات'
        };
        return translations[category] || category;
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCart() {
        cartItems.innerHTML = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.price} ر.س</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                           class="form-control form-control-sm" style="width: 70px"
                           onchange="updateItemQuantity('${item._id}', this.value)">
                </td>
                <td>${item.price * item.quantity} ر.س</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        totalAmount.textContent = calculateTotal();
    }

    // Initial load
    loadInventory();
});
