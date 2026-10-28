
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-cart')) || []
    } catch {
      return []
    }
  })

  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-orders')) || []
    } catch {
      return []
    }
  })

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-wishlist')) || []
    } catch {
      return []
    }
  })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('default')
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('shopsphere-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('shopsphere-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 1499,
      image: '/src/assets/products/headphones.jpg',
      category: 'Electronics',
      description: 'Enjoy your favourite music with these wireless headphones.',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 2499,
      image: '/src/assets/products/smartwatch.jpg',
      category: 'Electronics',
      description: 'Track your everyday activities with this smart watch.',
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 1999,
      image: '/src/assets/products/shoes.jpg',
      category: 'Fashion',
      description: 'Comfortable running shoes for everyday use.',
    },
    {
      id: 4,
      name: 'Travel Backpack',
      price: 1299,
      image: '/src/assets/products/bag.jpg',
      category: 'Accessories',
      description: 'Carry your everyday essentials in this travel backpack.',
    },
    {
      id: 5,
      name: 'Classic Sunglasses',
      price: 799,
      image: '/src/assets/products/sunglasses.jpg',
      category: 'Fashion',
      description: 'Complete your style with these classic sunglasses.',
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      price: 1799,
      image: '/src/assets/products/speaker.jpg',
      category: 'Electronics',
      description: 'Enjoy music anywhere with this Bluetooth speaker.',
    },
  ]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price
      if (sortOrder === 'high-low') return b.price - a.price
      return a.id - b.id
    })

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const alreadyAdded = currentWishlist.some(
        (item) => item.id === product.id
      )

      if (alreadyAdded) {
        return currentWishlist.filter(
          (item) => item.id !== product.id
        )
      }

      return [...currentWishlist, product]
    })
  }

  const isWishlisted = (product) =>
    wishlist.some((item) => item.id === product.id)

  const updateQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const handleCustomerChange = (event) => {
    const { name, value } = event.target

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const startCheckout = () => {
    if (cart.length === 0) {
      alert('Please add products to your cart first.')
      return
    }

    setShowCheckout(true)
  }

  const placeOrder = (event) => {
    event.preventDefault()

    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    const newOrder = {
      id: `SS${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString('en-IN'),
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
      customer: { ...customer },
    }

    setOrders((currentOrders) => [newOrder, ...currentOrders])
    setOrderNumber(newOrder.id)
    setCart([])
    setShowCheckout(false)
    setShowCart(false)

    setCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
    })

    setTimeout(() => {
      document.getElementById('orders')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          Shop<span>Sphere</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#wishlist">Wishlist ({wishlist.length})</a>
          <a href="#orders">My Orders ({orders.length})</a>
          <a href="#footer">About</a>
        </div>

        <button
          className="cart-button"
          onClick={() => {
            setShowCart(!showCart)
            setShowCheckout(false)
            setSelectedProduct(null)
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </nav>

      <section className="hero" id="home">
        <p className="tagline">YOUR STYLE, YOUR CHOICE</p>
        <h1>Discover Your Next Favorite Thing.</h1>
        <p>
          Explore amazing products at prices you'll love.
          Your next favorite purchase is waiting for you.
        </p>
        <a className="shop-button" href="#products">
          Shop Now →
        </a>
      </section>

      {selectedProduct ? (
        <main className="products">
          <button
            className="clear-button"
            onClick={() => setSelectedProduct(null)}
          >
            ← Back to Products
          </button>

          <section
            className="product-card"
            style={{ maxWidth: '700px', margin: '25px auto', padding: '24px' }}
          >
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{ maxHeight: '320px', objectFit: 'contain' }}
            />

            <p className="product-category">
              {selectedProduct.category}
            </p>

            <h2>{selectedProduct.name}</h2>

            <h3>
              ₹{selectedProduct.price.toLocaleString('en-IN')}
            </h3>

            <p>
              {selectedProduct.description}
            </p>

            <button
              className="add-button"
              onClick={() => addToCart(selectedProduct)}
            >
              Add to Cart +
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(selectedProduct)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '10px',
              }}
              aria-label={
                isWishlisted(selectedProduct)
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
            >
              {isWishlisted(selectedProduct) ? '❤️' : '🤍'}
            </button>
          </section>
        </main>
      ) : (
        <main className="products" id="products">
          <p className="section-tag">OUR COLLECTION</p>
          <h2>Featured Products</h2>
          <p className="section-description">
            Find something you will love.
          </p>

          <input
            className="search-input"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="categories">
            {['All', 'Electronics', 'Fashion', 'Accessories'].map(
              (item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? 'category-button active'
                      : 'category-button'
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="sort-container">
            <label htmlFor="sortOrder">Sort by price:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="default">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: 'pointer' }}
                />

                <p className="product-category">
                  {product.category}
                </p>

                <h3
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.name}
                </h3>

                <div className="product-bottom">
                  <strong>
                    ₹{product.price.toLocaleString('en-IN')}
                  </strong>

                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    isWishlisted(product)
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  {isWishlisted(product) ? '❤️' : '🤍'}
                </button>

                <button
                  className="clear-button"
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </button>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty-message">No products found.</p>
          )}
        </main>
      )}

      <section className="cart-section" id="wishlist">
        <h2>My Wishlist ❤️</h2>
        <p>Your saved favourite products.</p>

        {wishlist.length === 0 ? (
          <p>Your wishlist is empty. Add products using the heart button.</p>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
              <article className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: 'pointer' }}
                />

                <h3>{product.name}</h3>
                <p>
                  ₹{product.price.toLocaleString('en-IN')}
                </p>

                <button
                  className="add-button"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart +
                </button>

                <button
                  className="clear-button"
                  onClick={() => toggleWishlist(product)}
                >
                  Remove ❤️
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {showCart && (
        <section className="cart-section" id="cart">
          <div className="cart-heading">
            <h2>Your Shopping Cart</h2>

            <button
              className="close-button"
              onClick={() => {
                setShowCart(false)
                setShowCheckout(false)
              }}
            >
              Close ✕
            </button>
          </div>

          {showCheckout ? (
            <div className="checkout-section">
              <h2>Checkout</h2>
              <p>Enter your delivery details.</p>

              <div className="cart-total">
                <strong>
                  Order total: ₹{totalPrice.toLocaleString('en-IN')}
                </strong>
              </div>

              <form onSubmit={placeOrder} className="checkout-form">
                <label htmlFor="customer-name">Full Name</label>
                <input
                  id="customer-name"
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  placeholder="Your full name"
                  required
                />

                <label htmlFor="customer-email">Email</label>
                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  placeholder="Your email address"
                  required
                />

                <label htmlFor="customer-phone">Phone Number</label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="Your phone number"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  required
                />

                <label htmlFor="customer-address">
                  Delivery Address
                </label>
                <textarea
                  id="customer-address"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  placeholder="House number, street, city, PIN code"
                  rows={4}
                  required
                />

                <button type="submit" className="checkout-button">
                  Place Demo Order
                </button>

                <button
                  type="button"
                  className="clear-button"
                  onClick={() => setShowCheckout(false)}
                >
                  Back to Cart
                </button>
              </form>

              <p>Demo only: payment is not connected.</p>
            </div>
          ) : cart.length === 0 ? (
            <p>Your cart is empty. Add some products!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                <strong>
                  Total: ₹{totalPrice.toLocaleString('en-IN')}
                </strong>
              </div>

              <button
                className="checkout-button"
                onClick={startCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                className="clear-button"
                onClick={() => setCart([])}
              >
                Clear Cart
              </button>
            </>
          )}
        </section>
      )}

      {orderNumber && (
        <section className="cart-section">
          <h2>Order Placed Successfully!</h2>
          <p>Your demo order number: {orderNumber}</p>
          <p>Your order is available in My Orders.</p>

          <button
            className="checkout-button"
            onClick={() => setOrderNumber('')}
          >
            Continue Shopping
          </button>
        </section>
      )}

      <section className="cart-section" id="orders">
        <h2>My Order History</h2>
        <p>View your previously placed demo orders.</p>

        {orders.length === 0 ? (
          <p>No orders yet. Place your first demo order!</p>
        ) : (
          orders.map((order) => (
            <article
              className="cart-item"
              key={order.id}
              style={{
                display: 'block',
                marginBottom: '20px',
                padding: '16px',
              }}
            >
              <h3>Order #{order.id}</h3>
              <p>Date: {order.date}</p>
              <p>Customer: {order.customer.name}</p>
              <p>Email: {order.customer.email}</p>
              <p>Phone: {order.customer.phone}</p>
              <p>Address: {order.customer.address}</p>

              <h4>Products</h4>

              {order.items.map((item) => (
                <p key={item.id}>
                  {item.name} × {item.quantity} — ₹
                  {(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              ))}

              <div className="cart-total">
                <strong>
                  Order Total: ₹{order.total.toLocaleString('en-IN')}
                </strong>
              </div>
            </article>
          ))
        )}
      </section>

      <footer id="footer">
        <h2>ShopSphere</h2>
        <p>Your everyday shopping destination.</p>
        <p>© 2026 ShopSphere. Built with React.</p>
      </footer>
    </div>
  )
}

export default App
