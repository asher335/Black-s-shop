const whatsappNumber = "261322175031";

const products = [
  {
    id: "social-kit",
    name: "Social Media Starter Pack",
    category: "Marketing",
    price: 120000,
    emoji: "📱",
    badge: "Popular",
    description:
      "Pack complet pour lancer votre présence digitale : visuels, légendes, idées de contenu et calendrier pour 30 jours.",
    features: [
      "30 posts préparés",
      "Captions prêtes à publier",
      "Palette visuelle cohérente",
      "Canva et images modifiables"
    ]
  },
  {
    id: "brand-kit",
    name: "Mini Brand Kit",
    category: "Branding",
    price: 150000,
    emoji: "🖤",
    badge: "Nouveau",
    description:
      "Système de marque minimaliste et premium pour créer une identité forte, moderne et mémorable.",
    features: [
      "Logo et palette de couleurs",
      "Carte de visite numérique",
      "Modèle de présentation",
      "Guidelines visuelles"
    ]
  },
  {
    id: "store-template",
    name: "Boutique E-commerce Template",
    category: "Web",
    price: 180000,
    emoji: "🛒",
    badge: "Top",
    description:
      "Template prêt à vendre avec sections de produits, panier, contact et page de détail optimisée pour mobile.",
    features: [
      "Design entièrement responsive",
      "Panier fonctionnel",
      "Pages produit dynamiques",
      "Compatible GitHub Pages"
    ]
  },
  {
    id: "notion-system",
    name: "Notion Business System",
    category: "Productivité",
    price: 95000,
    emoji: "📊",
    badge: "Essentiel",
    description:
      "Un système complet pour organiser vos ventes, suivis clients, tâches, contenus et objectifs sur Notion.",
    features: [
      "Dashboard de suivi",
      "Gestion des clients",
      "Planification de contenu",
      "Cadrage de ventes"
    ]
  },
  {
    id: "sales-script",
    name: "Scripts de Vente",
    category: "Vente",
    price: 110000,
    emoji: "💬",
    badge: "Conversion",
    description:
      "Pack de scripts pour améliorer les réponses clients, convaincre et finaliser les ventes sur WhatsApp et réseaux sociaux.",
    features: [
      "Messages de prospection",
      "Scripts de clôture",
      "Réponses automatiques",
      "Formules de propositions"
    ]
  },
  {
    id: "launch-plan",
    name: "Launch Plan Digital",
    category: "Stratégie",
    price: 130000,
    emoji: "🚀",
    badge: "Prêt",
    description:
      "Plan de lancement digital complet pour présenter un produit ou service sans stress, avec étapes claires et actions rapides.",
    features: [
      "Calendrier de lancement",
      "Checklist de publication",
      "Plan de communication",
      "Suivi d'objectif de vente"
    ]
  }
];

const formatMoney = (value) =>
  new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0
  }).format(value);

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("blackshop-cart") || "[]");
  } catch (error) {
    return [];
  }
};

const setCart = (cart) => localStorage.setItem("blackshop-cart", JSON.stringify(cart));

const cartCountElement = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const productGrid = document.getElementById("productGrid");

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = String(count);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  setCart(cart);
  renderCart();
  updateCartBadge();
  openCart();
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const found = cart.find((item) => item.id === productId);

  if (!found) return;

  found.quantity += change;

  if (found.quantity <= 0) {
    const updated = cart.filter((item) => item.id !== productId);
    setCart(updated);
  } else {
    setCart(cart);
  }

  renderCart();
  updateCartBadge();
}

function removeFromCart(productId) {
  const updated = getCart().filter((item) => item.id !== productId);
  setCart(updated);
  renderCart();
  updateCartBadge();
}

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Votre panier est vide.<br />Ajoutez un produit pour commencer.</div>';
    cartTotalElement.textContent = "0 Ar";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;

    total += product.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-visual">${product.emoji}</div>
      <div>
        <h4>${product.name}</h4>
        <div class="cart-item-price">${formatMoney(product.price)} / unité</div>
        <div class="quantity">Quantité: ${item.quantity}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="quantity-button" data-action="minus" data-id="${product.id}" aria-label="Retirer une quantité">−</button>
          <span>${item.quantity}</span>
          <button class="quantity-button" data-action="plus" data-id="${product.id}" aria-label="Ajouter une quantité">+</button>
        </div>
        <button class="item-remove" data-remove-id="${product.id}">Supprimer</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = `${formatMoney(total)}`;

  document.querySelectorAll(".quantity-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      const action = button.dataset.action;
      updateQuantity(productId, action === "plus" ? 1 : -1);
    });
  });

  document.querySelectorAll(".item-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
    });
  });
}

function buildWhatsAppMessage() {
  const cart = getCart();

  if (cart.length === 0) {
    return "Bonjour Black's Shop, je souhaite passer une commande.";
  }

  const lines = cart.map((item) => {
    const product = getProductById(item.id);
    return product ? `${product.name} x${item.quantity}` : "Produit";
  });

  const total = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return "Bonjour Black's Shop, je souhaite commander :\n" + lines.join("\n") + `\n\nTotal estimé : ${formatMoney(total)}\nMerci de me confirmer la commande.`;
}

function checkoutCart() {
  const message = encodeURIComponent(buildWhatsAppMessage());
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
}

function renderProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual">
            <span class="product-badge">${product.badge}</span>
            <span aria-hidden="true">${product.emoji}</span>
          </div>
          <div class="product-content">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <span class="product-price">${formatMoney(product.price)}</span>
              <span>${product.category}</span>
            </div>
            <div class="product-actions">
              <button class="ghost-button" data-view="${product.id}">Voir</button>
              <button data-add="${product.id}">Ajouter</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = `product.html?id=${button.dataset.view}`;
    });
  });
}

function renderProductDetail() {
  const detailContainer = document.getElementById("productDetail");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || products[0].id;
  const product = getProductById(productId) || products[0];

  detailContainer.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-visual" aria-hidden="true">${product.emoji}</div>
      <div class="product-detail-copy">
        <span class="eyebrow">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="description">${product.description}</p>

        <div class="detail-row">
          <span>Prix</span>
          <span class="detail-price">${formatMoney(product.price)}</span>
        </div>

        <div class="product-details">
          <button class="cta-button" data-add="${product.id}">Ajouter au panier</button>
          <a class="secondary-action" href="index.html">Retour</a>
        </div>

        <ul class="feature-list">
          ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  document.querySelector('[data-add]').addEventListener("click", () => addToCart(product.id));
}

function setupCartControls() {
  document.getElementById("cartButton")?.addEventListener("click", openCart);
  document.getElementById("closeCart")?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);
  document.getElementById("checkoutButton")?.addEventListener("click", checkoutCart);
}

window.addEventListener("DOMContentLoaded", () => {
  setupCartControls();
  renderCart();
  updateCartBadge();
  renderProducts();
  renderProductDetail();
});

if (window.location.pathname.endsWith("/product.html") || window.location.pathname.endsWith("product.html")) {
  renderProductDetail();
}
