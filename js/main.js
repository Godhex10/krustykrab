/* =========================================================
   KRUSTY KRAB — interactions & animations
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menu data ---------- */
  const MENU = [
    {
      id: "jelly-patty", name: "JELLY PATTY", price: 11.99, img: "assets/jelly-patty.svg",
      ingredients: ["1 Krabby Patty, grilled.", "3 scoops of fresh jellyfish jelly.", "1 toasted sesame bun.", "Sea lettuce and tomato.", "A splash of sticky happiness."]
    },
    {
      id: "krabby-patty", name: "KRABBY PATTY", price: 8.99, img: "assets/krabby-patty.webp",
      ingredients: ["1 secret-formula patty.", "Sea lettuce, tomato, onion.", "1 slice of cheese.", "Pickles (exactly 3).", "Ketchup and mustard.", "1 toasted sesame bun."]
    },
    {
      id: "kelp-shake", name: "KELP SHAKE", price: 4.99, img: "assets/kelp-shake.svg",
      ingredients: ["2 1/2 peaches, whole or 1 1/2 cups of sliced frozen peaches.", "1/2 cup cashews.", "3/4 cup rice milk.", "2 tablespoons kelp or 1 cube of kelp.", "1/2 teaspoon cinnamon."]
    },
    {
      id: "coral-bits", name: "CORAL BITS", price: 1.95, img: "assets/coral-bits.svg",
      ingredients: ["Crunchy reef coral, hand cut.", "Fried golden in sea oil.", "Pinch of sea salt.", "Served in a red box."]
    },
    {
      id: "kelp-rings", name: "KELP RINGS", price: 1.50, img: "assets/kelp-rings.svg",
      ingredients: ["Fresh kelp, sliced in rings.", "Crispy batter.", "Salty sauce on the side.", "Basket included."]
    },
    {
      id: "seafoam-soda", name: "SEAFOAM SODA", price: 1.00, img: "assets/seafoam-soda.svg",
      ingredients: ["Sparkling sea water.", "A cloud of sea foam.", "Bubbles (lots).", "1 striped straw."]
    }
  ];
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));
  const fmt = n => n.toFixed(2) + "$";
  const fmtComma = n => n.toFixed(2).replace(".", ",") + "$";

  /* ---------- preloader ---------- */
  const loader = $("#loader");
  const bar = $("#loaderBar");
  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 92);
    bar.style.width = progress + "%";
  }, 120);
  const finishLoading = () => {
    clearInterval(tick);
    bar.style.width = "100%";
    setTimeout(() => loader.classList.add("done"), 300);
  };
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading);
  setTimeout(finishLoading, 4000); // safety net

  /* ---------- bubbles ---------- */
  const bubbleBox = $("#bubbles");
  function spawnBubble() {
    const b = document.createElement("span");
    const size = 8 + Math.random() * 26;
    b.className = "bubble";
    b.style.width = b.style.height = size + "px";
    b.style.left = Math.random() * 100 + "vw";
    b.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
    b.style.animationDuration = 7 + Math.random() * 8 + "s";
    bubbleBox.appendChild(b);
    b.addEventListener("animationend", () => b.remove());
  }
  if (!reduceMotion) {
    for (let i = 0; i < 6; i++) setTimeout(spawnBubble, i * 400);
    setInterval(() => { if (!document.hidden) spawnBubble(); }, 900);
  }

  // click anywhere → a little bubble burst
  document.addEventListener("click", e => {
    if (reduceMotion) return;
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("span");
      const size = 6 + Math.random() * 14;
      b.className = "bubble";
      Object.assign(b.style, {
        position: "fixed", left: e.clientX - size / 2 + "px", top: e.clientY + "px", bottom: "auto",
        width: size + "px", height: size + "px", zIndex: 170, animationDuration: 1.2 + Math.random() + "s"
      });
      b.style.setProperty("--drift", (Math.random() * 40 - 20) + "px");
      document.body.appendChild(b);
      b.addEventListener("animationend", () => b.remove());
    }
  });

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  const observeReveals = () => $$(".reveal:not(.in)").forEach(el => io.observe(el));

  /* ---------- hero parallax ---------- */
  const scene = $("[data-parallax]");
  if (scene && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const layers = $$("[data-depth]", scene);
    window.addEventListener("mousemove", e => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.translate = `${x * d * 30}px ${y * d * 20}px`;
      });
    });
  }

  /* ---------- money rain around Mr Krabs ---------- */
  const rain = $("#moneyRain");
  function dropBill(burst = false) {
    const b = document.createElement("span");
    b.className = "bill";
    b.textContent = "$";
    b.style.left = (burst ? 30 + Math.random() * 60 : Math.random() * 100) + "%";
    b.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    b.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    b.style.animationDuration = 2.2 + Math.random() * 1.8 + "s";
    rain.appendChild(b);
    b.addEventListener("animationend", () => b.remove());
  }
  if (!reduceMotion) setInterval(() => { if (!document.hidden) dropBill(); }, 1100);
  $(".hero__mrkrabs").addEventListener("click", () => {
    for (let i = 0; i < 14; i++) setTimeout(() => dropBill(true), i * 60);
    toast("ARGH ARGH ARGH! Money money money!");
  });

  /* ---------- mobile menu ---------- */
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  function setMenu(open) {
    menuToggle.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("locked", open);
    menuToggle.setAttribute("aria-expanded", open);
    mobileMenu.setAttribute("aria-hidden", !open);
  }
  menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
  $$("a", mobileMenu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  $("#menuClose").addEventListener("click", () => setMenu(false));

  /* ---------- menu grid ---------- */
  const grid = $("#menuGrid");
  grid.innerHTML = MENU.map(m => `
    <div class="menu-item reveal" data-id="${m.id}" tabindex="0" role="button" aria-label="${m.name}, ${fmt(m.price)}">
      <s class="price">${fmt(m.price)}</s>
      <img src="${m.img}" alt="${m.name}" loading="lazy" />
      <h4>${m.name}</h4>
      <span class="menu-item__added">ADDED</span>
    </div>`).join("");
  observeReveals();

  const detailName = $("#detailName");
  const detailPrice = $("#detailPrice");
  const detailList = $("#detailList");
  const featureImg = $("#featureImg");
  const featureCorner = $(".feature__corner");
  const qtyVal = $("#qtyVal");
  let current = "kelp-shake";
  let qty = 1;

  function selectItem(id, scroll = false) {
    const item = byId[id];
    if (!item) return;
    current = id;
    qty = 1;
    qtyVal.textContent = qty;
    $$(".menu-item", grid).forEach(el => el.classList.toggle("active", el.dataset.id === id));
    detailName.textContent = item.name;
    detailPrice.textContent = fmtComma(item.price);
    detailList.innerHTML = item.ingredients.map((t, i) => `<li style="animation-delay:${i * 70}ms">${t}</li>`).join("");

    featureImg.classList.add("swap");
    setTimeout(() => {
      featureImg.src = item.img;
      featureImg.alt = item.name;
      featureImg.classList.remove("swap");
    }, 280);
    featureCorner.innerHTML = Array(3).fill(`<span>${Array(3).fill(fmtComma(item.price)).join(" ")}</span>`).join("");

    if (scroll) $("#menu").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  grid.addEventListener("click", e => {
    const card = e.target.closest(".menu-item");
    if (card) selectItem(card.dataset.id);
  });
  grid.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".menu-item")) {
      e.preventDefault();
      selectItem(e.target.dataset.id);
    }
  });
  $$(".mini-item").forEach(b => b.addEventListener("click", () => selectItem(b.dataset.goto, true)));

  $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); qtyVal.textContent = qty; });
  $("#qtyPlus").addEventListener("click", () => { qty = Math.min(20, qty + 1); qtyVal.textContent = qty; });

  /* ---------- cart ---------- */
  const cart = {}; // id -> qty
  try {
    const saved = JSON.parse(localStorage.getItem("kk-cart") || "{}");
    Object.entries(saved).forEach(([id, q]) => { if (byId[id] && q > 0) cart[id] = q; });
  } catch (_) { /* storage unavailable */ }

  const cartEl = $("#cart");
  const overlay = $("#overlay");
  const cartItems = $("#cartItems");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const cartBtn = $("#cartOpen");

  function saveCart() {
    try { localStorage.setItem("kk-cart", JSON.stringify(cart)); } catch (_) { /* ignore */ }
  }

  function renderCart() {
    const ids = Object.keys(cart);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + cart[id] * byId[id].price, 0);
    cartCount.textContent = count;
    cartTotal.textContent = fmt(total);
    $$(".menu-item", grid).forEach(el => el.classList.toggle("in-cart", !!cart[el.dataset.id]));

    if (!ids.length) {
      cartItems.innerHTML = `<li class="cart__empty"><img src="assets/plankton.webp" alt="" />Your tray is empty.<br/>Even Plankton has more food.</li>`;
      return;
    }
    cartItems.innerHTML = ids.map(id => {
      const m = byId[id];
      return `<li class="cart-row">
        <img src="${m.img}" alt="" />
        <div><h4>${m.name}</h4><small>${fmt(m.price)} each</small></div>
        <div class="cart-row__ctrl">
          <button data-act="dec" data-id="${id}" aria-label="Remove one">−</button>
          <span>${cart[id]}</span>
          <button data-act="inc" data-id="${id}" aria-label="Add one">+</button>
        </div>
      </li>`;
    }).join("");
  }

  cartItems.addEventListener("click", e => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const id = btn.dataset.id;
    cart[id] += btn.dataset.act === "inc" ? 1 : -1;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  });

  function flyToCart(fromEl, src) {
    if (reduceMotion) return;
    const from = fromEl.getBoundingClientRect();
    const to = cartBtn.getBoundingClientRect();
    const img = document.createElement("img");
    img.src = src;
    img.className = "fly";
    img.style.left = from.left + from.width / 2 - 35 + "px";
    img.style.top = from.top + from.height / 2 - 35 + "px";
    document.body.appendChild(img);
    requestAnimationFrame(() => {
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      img.style.transform = `translate(${dx}px, ${dy}px) scale(.2) rotate(540deg)`;
      img.style.opacity = ".3";
    });
    setTimeout(() => img.remove(), 850);
  }

  $("#addToCart").addEventListener("click", e => {
    const item = byId[current];
    cart[current] = (cart[current] || 0) + qty;
    saveCart();
    flyToCart(featureImg, item.img);
    setTimeout(() => {
      renderCart();
      cartBtn.classList.remove("bump");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("bump");
    }, 650);
    toast(`${qty} × ${item.name} added. Order up!`);
    qty = 1;
    qtyVal.textContent = qty;
    e.stopPropagation();
  });

  function setCart(open) {
    cartEl.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    document.body.classList.toggle("locked", open);
    cartEl.setAttribute("aria-hidden", !open);
  }
  cartBtn.addEventListener("click", () => setCart(true));
  $("#cartClose").addEventListener("click", () => setCart(false));
  overlay.addEventListener("click", () => setCart(false));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { setCart(false); setMenu(false); }
  });

  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(cart).length) { toast("Add something first, matey!"); return; }
    const total = cartTotal.textContent;
    Object.keys(cart).forEach(k => delete cart[k]);
    saveCart();
    renderCart();
    setCart(false);
    toast(`Order up! SpongeBob is on it. Mr. Krabs thanks you for ${total}`);
  });

  /* ---------- toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ---------- money matrix ---------- */
  const matrix = $("#matrix");
  const prices = ["0.99$", "5.99$", "8.99$", "4.99$", "11.99$", "1.00$"];
  matrix.innerHTML = Array.from({ length: 220 }, () => `<span>${prices[Math.floor(Math.random() * prices.length)]} </span>`).join("");
  const cells = $$("span", matrix);
  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return;
      for (let i = 0; i < 8; i++) {
        const c = cells[Math.floor(Math.random() * cells.length)];
        c.classList.add("hot");
        c.textContent = prices[Math.floor(Math.random() * prices.length)] + " ";
        setTimeout(() => c.classList.remove("hot"), 600);
      }
    }, 160);
  }

  /* ---------- "SECRET." scramble on hover ---------- */
  const secretWord = $("#secretWord");
  const glyphs = "$#%&@!?*+=<>";
  let scrambling = false;
  secretWord.addEventListener("mouseenter", () => {
    if (scrambling) return;
    scrambling = true;
    secretWord.classList.add("scramble");
    const target = "SECRET";
    let frame = 0;
    const iv = setInterval(() => {
      const out = target.split("").map((ch, i) => (i < frame / 3 ? ch : glyphs[Math.floor(Math.random() * glyphs.length)])).join("");
      secretWord.innerHTML = out + "<b>.</b>";
      if (++frame > target.length * 3) {
        clearInterval(iv);
        secretWord.classList.remove("scramble");
        scrambling = false;
      }
    }, 45);
  });

  /* ---------- big burger chomp ---------- */
  const bigBurger = $("#bigBurger");
  bigBurger.addEventListener("click", () => {
    bigBurger.classList.remove("chomp");
    void bigBurger.offsetWidth;
    bigBurger.classList.add("chomp");
    setTimeout(() => bigBurger.classList.remove("chomp"), 520);
    selectItem("krabby-patty", true);
  });

  /* ---------- "it is me" Plankton ---------- */
  const itsMe = $("#itsMe");
  $("#itsMeBtn").addEventListener("click", () => itsMe.classList.toggle("open"));

  /* ---------- Plankton steals the formula ---------- */
  const formulaImg = $("#formulaImg");
  function steal() {
    if (formulaImg.classList.contains("stolen")) return;
    itsMe.classList.add("open");
    formulaImg.classList.add("stolen");
    toast("PLANKTON! He's after the secret formula!");
    setTimeout(() => {
      formulaImg.classList.remove("stolen");
      toast("Phew. Mr. Krabs got it back.");
    }, 1900);
  }
  $("#watchIt").addEventListener("click", steal);
  formulaImg.addEventListener("click", steal);

  /* ---------- crew cards: tilt + quotes ---------- */
  $$(".crew-card").forEach(card => {
    const quote = $(".crew-card__quote", card);
    quote.textContent = card.dataset.quote;
    card.addEventListener("click", () => {
      $$(".crew-card.talk").forEach(c => c !== card && c.classList.remove("talk"));
      card.classList.toggle("talk");
    });
    if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    }
  });

  /* ---------- open now ---------- */
  const openNow = $("#openNow");
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const open = day === 0 || (day === 6 ? h >= 10 && h < 22 : h >= 9 && h < 21);
  openNow.textContent = open ? "● OPEN NOW. COME HUNGRY!" : "● CLOSED. SPONGEBOB IS JELLYFISHING.";
  openNow.classList.add(open ? "is-open" : "is-closed");

  /* ---------- init ---------- */
  selectItem("kelp-shake");
  renderCart();
  observeReveals();
})();
