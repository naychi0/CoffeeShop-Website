/* ==========================================================
   GLOBAL FUNCTIONS (HTML မှ တိုက်ရိုက်လှမ်းခေါ်မည့် Function များ)
   ========================================================== */

// 💡 1. Size Selection Logic (Product Detail Page အတွက်)
let currentItemPrice = 6.50; // Default Grande Price

window.selectSize = function(element, price) {
    // တခြား Size တွေဆီက active ဖျက်မည်
    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('active'));
    // နှိပ်လိုက်တဲ့ Size ကို active ပေးမည်
    element.classList.add('active');
    // စျေးနှုန်းပြောင်းမည်
    currentItemPrice = price;
    const priceDisplay = document.getElementById('currentPrice');
    if (priceDisplay) priceDisplay.innerText = currentItemPrice.toFixed(2);
};

// 💡 2. Authentication Popups (Sign In / Sign Up)
window.openAuthModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Page ကို Lock ချမယ်
    }
};

window.closeAuthModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Lock ပြန်ဖွင့်မယ်
    }
};

window.switchAuth = function(closeId, openId) {
    window.closeAuthModal(closeId);
    setTimeout(() => { window.openAuthModal(openId); }, 300); 
};

// Add to Cart ခလုတ်များကို ရှာမည်
const addBtns = document.querySelectorAll('.btn-instant-cart');

addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // ၁။ ခလုတ်ဆီက နာမည်နဲ့ ဈေးကို ယူမယ်
        const itemName = e.target.getAttribute('data-name');
        const itemPrice = parseFloat(e.target.getAttribute('data-price'));

        // ၂။ Local Storage ထဲမှာ အရင်သိမ်းထားတဲ့ Cart ရှိမရှိ ပြန်ခေါ်မယ် (မရှိရင် အလွတ် Array)
        let cart = JSON.parse(localStorage.getItem('myCart')) || [];

        // ၃။ ပစ္စည်းကို ခြင်းတောင်းထဲ ထည့်မယ်
        // (တကယ်လို့ ပါပြီးသားဆိုရင် အရေအတွက်ပဲ တိုးမယ်၊ မပါသေးရင် အသစ်ထည့်မယ်)
        const existingItem = cart.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: itemName, price: itemPrice, quantity: 1 });
        }

        // ၄။ Local Storage ထဲကို အသစ်ပြန်သိမ်းမယ်
        localStorage.setItem('myCart', JSON.stringify(cart));

        alert(`${itemName} added to cart!`);
    });
});

// 💡 3. Event Registration Modal (Events Page အတွက်)
window.openRegistration = function(eventName) {
    const regModal = document.getElementById('registrationModal');
    const eventNameDisplay = document.getElementById('eventNameDisplay');
    if (eventNameDisplay && regModal) {
        eventNameDisplay.innerText = eventName;
        regModal.style.display = 'flex';
    }
};

window.closeRegistration = function() {
    const regModal = document.getElementById('registrationModal');
    if (regModal) regModal.style.display = 'none';
};


/* ==========================================================
   MAIN DOMContentLoaded (Website ပွင့်လာလျှင် အလုပ်လုပ်မည့်အပိုင်း)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // MODULE 1: COFFEE SUB-NAVBAR TOGGLE
    // ==========================================================
    const coffeeMenuBtn = document.getElementById('coffeeMenuBtn');
    const coffeeSubNav = document.getElementById('coffeeSubNav');

    if (coffeeMenuBtn && coffeeSubNav) {
        coffeeMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            coffeeSubNav.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!coffeeMenuBtn.contains(e.target) && !coffeeSubNav.contains(e.target)) {
                coffeeSubNav.classList.remove('show');
            }
        });
    }



    // ==========================================================
    // MODULE 3: HOME PAGE (Slideshow, Order Btn, Discount Modal)
    // ==========================================================
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            window.location.href = 'Coffee.html'; // Order နှိပ်လျှင် Coffee သို့သွားမည်
        });
    }

    const discountModal = document.getElementById('discountModal');
    const closeDiscountBtn = document.getElementById('closeModal');
    const discountForm = document.getElementById('discountForm');

    if (discountModal && closeDiscountBtn && discountForm) {
        const hasSeenModal = sessionStorage.getItem('hasSeenDiscountModal');
        if (!hasSeenModal) {
            setTimeout(() => { discountModal.style.display = 'flex'; }, 2000);
        }

        closeDiscountBtn.addEventListener('click', () => {
            discountModal.style.display = 'none';
            sessionStorage.setItem('hasSeenDiscountModal', 'true');
        });

        window.addEventListener('click', (e) => {
            if (e.target === discountModal) {
                discountModal.style.display = 'none';
                sessionStorage.setItem('hasSeenDiscountModal', 'true');
            }
        });

        discountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('userEmail').value;
            alert(`Thank you! A 15% discount code has been sent to ${email}`);
            discountModal.style.display = 'none';
            sessionStorage.setItem('hasSeenDiscountModal', 'true');
        });
    }

    let slideIndex = 0;
    const slides = document.getElementsByClassName("slide");
    function showSlides() {
        if (slides.length === 0) return; 
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1; }    
        slides[slideIndex - 1].style.display = "block";  
        setTimeout(showSlides, 4000); 
    }
    showSlides();

    // ==========================================================
    // MODULE 4: AUTHENTICATION OVERLAYS
    // ==========================================================
    const authOverlays = document.querySelectorAll('.auth-modal-overlay');
    authOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // ==========================================================
    // MODULE 5: OFFERS PAGE LOGIC (Pickup vs Delivery)
    // ==========================================================
    const btnPickup = document.getElementById('btnPickup');
    const btnDelivery = document.getElementById('btnDelivery');
    const deliveryTitle = document.getElementById('deliveryTitle');
    const deliveryDesc = document.getElementById('deliveryDesc');

    if (btnPickup && btnDelivery && deliveryTitle && deliveryDesc) {
        btnPickup.addEventListener('click', () => {
            btnPickup.classList.add('active');
            btnDelivery.classList.remove('active');
            deliveryTitle.innerText = "Order ahead for pickup";
            deliveryDesc.innerHTML = "Skip the line. Order on the app and pick up your favorites at your local Bean Boutique.";
        });

        btnDelivery.addEventListener('click', () => {
            btnDelivery.classList.add('active');
            btnPickup.classList.remove('active');
            deliveryTitle.innerText = "Today deserves delivery";
            deliveryDesc.innerHTML = 'Enjoy Bean Boutique delivery powered by local partners. For additional help, visit <a href="#" class="delivery-link">Delivery FAQs</a>.';
        });
    }

    // ==========================================================
    // MODULE 6: EVENTS PAGE LOGIC (Registration Submit)
    // ==========================================================
    const regModal = document.getElementById('registrationModal');
    const eventForm = document.getElementById('eventForm');

    if (regModal) {
        window.addEventListener('click', (e) => {
            if (e.target === regModal) window.closeRegistration();
        });
    }

    if (eventForm) {
        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fName = document.getElementById('regFirstName').value;
            const eventNameDisplay = document.getElementById('eventNameDisplay');
            const eventName = eventNameDisplay ? eventNameDisplay.innerText : 'the event';
            alert(`Thank you ${fName}! Your registration for '${eventName}' has been submitted. Check your email for confirmation.`);
            window.closeRegistration();
            eventForm.reset();
        });
    }

    // ==========================================================
    // MODULE 7: SMOOTH PAGE TRANSITION
    // ==========================================================
    const navLinks = document.querySelectorAll('.nav-links a');

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetUrl = link.getAttribute('href');

                // Cart (သို့) Coffee နှိပ်တာ (သို့) Link အလွတ်တွေကို Smooth Transition ကနေ ဖယ်ထုတ်မယ်
                if (!targetUrl || 
                    targetUrl === '#' || 
                    targetUrl === 'javascript:void(0)' || 
                    targetUrl.startsWith('#') || 
                    link.id === 'navCartLink' || 
                    link.id === 'coffeeMenuBtn' ||
                    link.hasAttribute('onclick')) {
                    return;
                }

                e.preventDefault(); 
                document.body.classList.add('fade-out');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400); 
            });
        });
    }

});

// ==========================================================
    // MODULE 2: GLOBAL SHOPPING CART LOGIC (LocalStorage ဖြင့်)
    // ==========================================================
    const cartSidebar = document.querySelector('.cart-sidebar') || document.getElementById('cartSidebar');
    const cartOverlay = document.querySelector('.cart-overlay') || document.getElementById('cartOverlay');
    const closeCartBtn = document.querySelector('.close-cart') || document.getElementById('closeCartBtn');
    const cartItemsContainer = document.querySelector('.cart-items') || document.getElementById('cartItemsContainer');
    const cartTotalValue = document.getElementById('cartTotalValue') || document.querySelector('.cart-total span:last-child');
    const navCartLink = document.getElementById('navCartLink');
    
    // ခလုတ် (၂) မျိုးလုံးကို ဖမ်းမည်
    const addToOrderBtn = document.querySelector('.btn-add-order') || document.getElementById('addToOrderBtn'); // Card.html မှ ခလုတ်
    const instantCartBtns = document.querySelectorAll('.btn-instant-cart'); // Coffee.html မှ ခလုတ်များ

    // 💡 1. LocalStorage မှ Cart Data ကို ပြန်ခေါ်မည် (မရှိရင် အလွတ် Array)
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];

    // Cart အဖွင့်/အပိတ် Functions
    function openCart() {
        if(cartSidebar) cartSidebar.classList.add('open');
        if(cartOverlay) cartOverlay.classList.add('open');
        updateCartUI(); // ဖွင့်တိုင်း UI ကို အသစ်ပြန်ရေးမည်
    }
    
    function closeCart() {
        if(cartSidebar) cartSidebar.classList.remove('open');
        if(cartOverlay) cartOverlay.classList.remove('open');
    }

    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if(navCartLink) {
        navCartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    // 💡 2. Cart ထဲ ပစ္စည်းထည့်သည့် Core Function
    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }
        
        // LocalStorage သို့ ပြန်သိမ်းမည် (Page ကူးလည်း မပျောက်တော့ပါ)
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
        
        openCart(); // ထည့်ပြီးတာနဲ့ ဖွင့်ပြမည်
    }

    // 💡 3A. Card.html မှ "Add to Order" ကို နှိပ်လျှင်
    if (addToOrderBtn) {
        addToOrderBtn.addEventListener('click', () => {
            const titleElement = document.querySelector('.product-title-info h1');
            const productTitle = titleElement ? titleElement.innerText.replace('\n', ' ') : 'Custom Coffee';
            
            const activeSizeElement = document.querySelector('.size-option.active .size-name');
            const activeSize = activeSizeElement ? activeSizeElement.innerText : 'Grande';
            
            const finalName = `${productTitle} (${activeSize})`;
            
            addItemToCart(finalName, currentItemPrice); 
        });
    }

    // 💡 3B. Coffee.html မှ "Add to Cart" များကို နှိပ်လျှင် (Instant Add)
    if (instantCartBtns.length > 0) {
        instantCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                addItemToCart(name, price);
            });
        });
    }

    // 💡 4. Cart UI Update (HTML ပြန်ဆောက်မည်)
    function updateCartUI() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = ''; 
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            if(cartTotalValue) cartTotalValue.innerText = '$0.00';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>$${itemTotal.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <span class="remove-item" onclick="removeItem(${index})">Remove</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        if(cartTotalValue) cartTotalValue.innerText = `$${total.toFixed(2)}`;
    }

    // 💡 5. Cart အတိုးအလျှော့ နှင့် ဖျက်ရန် 
    window.changeQuantity = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart)); // Update LocalStorage
        updateCartUI(); 
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart)); // Update LocalStorage
        updateCartUI(); 
    };


  

// ==========================================================
    // Checkout ခလုတ် အလုပ်လုပ်စေရန် (Proceed to Checkout)
    // ==========================================================
    const checkoutBtn = document.getElementById('checkoutBtn') || document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length > 0) {
                // 💡 Alert အစား Checkout.html (သို့ C.html) သို့ သွားမည်
                closeCart();
                window.location.href = 'Card.html'; // 👈 သင့် Checkout ဖိုင်နာမည် အတိအကျ ပြင်ပေးပါ
            } else {
                alert('Your cart is empty! Please add items first.');
            }
        });
    }

     document.addEventListener('DOMContentLoaded', () => {
            const cartTableBody = document.getElementById('cartTableBody');
            const cartGrandTotal = document.getElementById('cartGrandTotal');
            const cartContent = document.getElementById('cartContent');
            
            // ၁။ Local Storage ထဲက Data ကို ဆွဲထုတ်မည်
            let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];

            // ၂။ UI ကို ရေးဆွဲမည့် Function
            function renderCartPage() {
                cartTableBody.innerHTML = '';
                let total = 0;

                // ခြင်းတောင်း လွတ်နေပါက
                if (cart.length === 0) {
                    cartContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-basket-shopping" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
                            <h2>Your cart is currently empty</h2>
                            <p style="margin-bottom: 20px;">Looks like you haven't made your choice yet.</p>
                            <a href="Coffee.html" class="btn-checkout-page">Explore Coffee</a>
                        </div>
                    `;
                    return;
                }

                // ခြင်းတောင်းထဲ ပစ္စည်းရှိပါက ဇယားဆွဲမည်
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Product"><span class="item-name">${item.name}</span></td>
                        <td data-label="Price">$${item.price.toFixed(2)}</td>
                        <td data-label="Quantity">
                            <div class="qty-controls">
                                <button class="btn-qty" onclick="updatePageQty(${index}, -1)">-</button>
                                <span style="font-weight: 600;">${item.quantity}</span>
                                <button class="btn-qty" onclick="updatePageQty(${index}, 1)">+</button>
                            </div>
                        </td>
                        <td data-label="Subtotal" style="font-weight: 600; color: #1e3932;">$${itemTotal.toFixed(2)}</td>
                        <td data-label="Action">
                            <button class="btn-remove" onclick="removePageItem(${index})" title="Remove Item">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    `;
                    cartTableBody.appendChild(row);
                });

                cartGrandTotal.innerText = `$${total.toFixed(2)}`;
            }

            // ၃။ အရေအတွက် အတိုး/အလျှော့ Function
            window.updatePageQty = function(index, change) {
                cart[index].quantity += change;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1); // သုညဖြစ်လျှင် ဖျက်မည်
                }
                localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart)); // မှတ်ဉာဏ်ထဲ ပြန်သိမ်းမည်
                renderCartPage(); // UI ပြန်ဆွဲမည်
            };

            // ၄။ အမှိုက်ပုံးနှိပ်၍ ဖျက်မည့် Function
            window.removePageItem = function(index) {
                cart.splice(index, 1);
                localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
                renderCartPage();
            };

            // Page Load ဖြစ်သည်နှင့် ဇယားကို စတင်ဆွဲမည်
            renderCartPage();
        });