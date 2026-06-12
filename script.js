/* =========================================================
   PrimeLar Imóveis - Interações e carregamento dinâmico
   Arquivo: script.js
   - Configuração via config.json
   - Fallback interno para funcionar abrindo apenas o index.html
   - Filtro de imóveis
   - WhatsApp personalizado
   - Menu mobile
   - Animações com IntersectionObserver
   - Slider de depoimentos
   ========================================================= */

const DEFAULT_CONFIG = {
  site: {
    nomeImobiliaria: "PrimeLar Imóveis",
    slogan: "Imóveis selecionados para viver e investir melhor",
    logo: "assets/logo.png",
    whatsapp: "5594999999999",
    telefone: "(94) 99999-9999",
    email: "contato@primelarimoveis.com.br",
    endereco: "Av. Principal, 1200 - Centro, Parauapebas - PA",
    desenvolvidoPor: "Desenvolvido por NSNexus",
    redesSociais: {
      instagram: "https://instagram.com/primelarimoveis",
      facebook: "https://facebook.com/primelarimoveis",
      linkedin: "https://linkedin.com/company/primelarimoveis"
    }
  },
  hero: {
    titulo: "Encontre o imóvel ideal para viver ou investir",
    subtitulo: "Casas, apartamentos e terrenos selecionados com atendimento rápido, seguro e personalizado.",
    imagem: "assets/hero.jpg"
  },
  sobre: {
    imagem: "assets/equipe.jpg",
    titulo: "Atendimento premium do primeiro contato à assinatura",
    texto: "A PrimeLar Imóveis conecta pessoas aos melhores imóveis com curadoria, transparência e acompanhamento consultivo. Nossa equipe entende seu perfil, negocia com segurança e facilita cada etapa da compra, venda ou locação.",
    numeros: [
      { valor: "+500", label: "imóveis anunciados" },
      { valor: "+10", label: "anos de mercado" },
      { valor: "+1.000", label: "clientes atendidos" },
      { valor: "24h", label: "resposta via WhatsApp" }
    ]
  },
  imoveis: [
    { id: 1, nome: "Casa Alto Padrão no Jardim Europa", tipo: "Venda", cidade: "Parauapebas", bairro: "Jardim Europa", precoCategoria: "alto", valor: "R$ 1.250.000", area: 286, quartos: 4, banheiros: 4, vagas: 3, imagem: "assets/imovel-1.jpg", destaque: "Piscina e área gourmet" },
    { id: 2, nome: "Apartamento Premium Vista Parque", tipo: "Venda", cidade: "Canaã dos Carajás", bairro: "Novo Horizonte", precoCategoria: "medio", valor: "R$ 680.000", area: 124, quartos: 3, banheiros: 2, vagas: 2, imagem: "assets/imovel-2.jpg", destaque: "Condomínio completo" },
    { id: 3, nome: "Residencial Jardins - Lançamento", tipo: "Lançamento", cidade: "Parauapebas", bairro: "Cidade Jardim", precoCategoria: "medio", valor: "A partir de R$ 420.000", area: 92, quartos: 2, banheiros: 2, vagas: 1, imagem: "assets/imovel-3.jpg", destaque: "Entrada facilitada" },
    { id: 4, nome: "Cobertura Duplex Vista Livre", tipo: "Venda", cidade: "Marabá", bairro: "Nova Marabá", precoCategoria: "alto", valor: "R$ 980.000", area: 210, quartos: 3, banheiros: 3, vagas: 2, imagem: "assets/imovel-4.jpg", destaque: "Varanda panorâmica" },
    { id: 5, nome: "Casa em Condomínio Reserva Verde", tipo: "Aluguel", cidade: "Parauapebas", bairro: "Beira Rio", precoCategoria: "medio", valor: "R$ 4.500/mês", area: 180, quartos: 3, banheiros: 3, vagas: 2, imagem: "assets/imovel-5.jpg", destaque: "Segurança 24h" },
    { id: 6, nome: "Studio Executivo Mobiliado", tipo: "Aluguel", cidade: "Canaã dos Carajás", bairro: "Centro", precoCategoria: "baixo", valor: "R$ 2.200/mês", area: 48, quartos: 1, banheiros: 1, vagas: 1, imagem: "assets/imovel-6.jpg", destaque: "Pronto para morar" }
  ],
  depoimentos: [
    { nome: "Mariana Oliveira", cargo: "Compradora", avatar: "MO", comentario: "Fui atendida com muita agilidade e encontrei um apartamento exatamente dentro do que eu procurava.", estrelas: 5 },
    { nome: "Carlos Mendes", cargo: "Investidor", avatar: "CM", comentario: "A equipe apresentou oportunidades muito boas e conduziu toda a negociação com segurança.", estrelas: 5 },
    { nome: "Renata Dias", cargo: "Proprietária", avatar: "RD", comentario: "Anunciei meu imóvel e recebi contatos qualificados rapidamente. Recomendo o atendimento.", estrelas: 5 }
  ],
  textos: {
    ctaTitulo: "Quer vender ou alugar seu imóvel mais rápido?",
    ctaTexto: "Anuncie conosco e conte com uma equipe especializada para encontrar o comprador ou inquilino ideal.",
    mensagemWhatsappGeral: "Olá! Vim pelo site da imobiliária e gostaria de falar com um consultor.",
    mensagemImovel: "Olá! Vim pelo site e tenho interesse no imóvel: [NOME DO IMÓVEL].\nGostaria de receber mais informações."
  }
};

let appConfig = DEFAULT_CONFIG;
let currentTestimonial = 0;
let testimonialTimer;

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function createWhatsAppLink(message) {
  const phone = onlyDigits(appConfig.site.whatsapp);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function setWhatsAppLinks() {
  const generalMessage = appConfig.textos.mensagemWhatsappGeral;
  const announceMessage = "Olá! Vim pelo site e quero anunciar meu imóvel para venda ou locação. Poderia me ajudar?";

  $$(".js-whatsapp-general").forEach((link) => {
    link.href = createWhatsAppLink(generalMessage);
    link.target = "_blank";
    link.rel = "noopener";
  });

  $$(".js-whatsapp-announce").forEach((link) => {
    link.href = createWhatsAppLink(announceMessage);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

async function loadConfig() {
  try {
    const response = await fetch("config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar o config.json");
    appConfig = await response.json();
  } catch (error) {
    // Fallback necessário para abrir o index.html diretamente pelo navegador.
    appConfig = DEFAULT_CONFIG;
    console.info("Usando configuração interna. Para ler o config.json via fetch, rode em um servidor local.");
  }
}

function applyContentFromConfig() {
  const { site, hero, sobre, textos } = appConfig;

  document.title = `${site.nomeImobiliaria} | Encontre seu imóvel ideal`;
  document.documentElement.style.setProperty("--hero-image", `url("${hero.imagem}")`);

  $("#logoImage").src = site.logo;
  $("#footerLogo").src = site.logo;
  $("#heroTitle").textContent = hero.titulo;
  $("#heroSubtitle").textContent = hero.subtitulo;
  $("#aboutImage").src = sobre.imagem;
  $("#aboutTitle").textContent = sobre.titulo;
  $("#aboutText").textContent = sobre.texto;
  $("#ctaTitle").textContent = textos.ctaTitulo;
  $("#ctaText").textContent = textos.ctaTexto;
  $("#contactCompany").textContent = site.nomeImobiliaria;
  $("#contactAddress").textContent = site.endereco;
  $("#contactPhone").textContent = site.telefone;
  $("#contactEmail").textContent = site.email;
  $("#footerSlogan").textContent = site.slogan;
  $("#footerPhone").textContent = site.telefone;
  $("#footerEmail").textContent = site.email;
  $("#footerCompany").textContent = site.nomeImobiliaria;
  $("#developedBy").textContent = site.desenvolvidoPor;
  $("#currentYear").textContent = new Date().getFullYear();

  $("#instagramLink").href = site.redesSociais.instagram;
  $("#facebookLink").href = site.redesSociais.facebook;
  $("#linkedinLink").href = site.redesSociais.linkedin;

  const statsGrid = $("#statsGrid");
  statsGrid.innerHTML = sobre.numeros.map((item) => `
    <div class="stat-card">
      <strong>${escapeHTML(item.valor)}</strong>
      <span>${escapeHTML(item.label)}</span>
    </div>
  `).join("");
}

function fillCityOptions() {
  const cities = [...new Set(appConfig.imoveis.map((property) => property.cidade))].sort();
  const select = $("#filterCity");
  select.innerHTML = '<option value="todos">Todas</option>' + cities
    .map((city) => `<option value="${escapeHTML(city)}">${escapeHTML(city)}</option>`)
    .join("");
}

function getFilteredProperties() {
  const type = $("#filterType").value;
  const city = $("#filterCity").value;
  const price = $("#filterPrice").value;

  return appConfig.imoveis.filter((property) => {
    const matchType = type === "todos" || property.tipo === type;
    const matchCity = city === "todos" || property.cidade === city;
    const matchPrice = price === "todos" || property.precoCategoria === price;
    return matchType && matchCity && matchPrice;
  });
}

function getPropertyWhatsAppMessage(propertyName) {
  return appConfig.textos.mensagemImovel.replace("[NOME DO IMÓVEL]", propertyName);
}

function whatsappSvg() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0 11.9 11.9 0 0 0 .2 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.7a12 12 0 0 0 5.8 1.5h.1A11.9 11.9 0 0 0 24 11.9a11.8 11.8 0 0 0-3.5-8.4ZM12.2 21.8h-.1a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.4 4.6Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>';
}

function renderProperties() {
  const grid = $("#propertyGrid");
  const properties = getFilteredProperties();
  const countText = properties.length === 1 ? "1 imóvel encontrado" : `${properties.length} imóveis encontrados`;

  $("#propertyCount").textContent = countText;

  if (!properties.length) {
    grid.innerHTML = `
      <div class="empty-state reveal visible">
        <h3>Nenhum imóvel encontrado com esses filtros.</h3>
        <p>Tente alterar a cidade, o tipo ou a faixa de preço.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = properties.map((property, index) => {
    const propertyMessage = getPropertyWhatsAppMessage(property.nome);
    const whatsLink = createWhatsAppLink(propertyMessage);

    return `
      <article class="property-card reveal" style="--delay:${index * 80}ms">
        <div class="property-media">
          <img src="${escapeHTML(property.imagem)}" alt="${escapeHTML(property.nome)}" loading="lazy" />
          <span class="property-tag">${escapeHTML(property.tipo)}</span>
          <span class="property-favorite" title="${escapeHTML(property.destaque)}">★</span>
        </div>
        <div class="property-body">
          <h3>${escapeHTML(property.nome)}</h3>
          <p class="property-location">${escapeHTML(property.cidade)} • ${escapeHTML(property.bairro)}</p>
          <p class="property-price">${escapeHTML(property.valor)}</p>
          <div class="property-features" aria-label="Características do imóvel">
            <span><strong>${escapeHTML(property.area)}m²</strong>Área</span>
            <span><strong>${escapeHTML(property.quartos)}</strong>Quartos</span>
            <span><strong>${escapeHTML(property.banheiros)}</strong>Banheiros</span>
            <span><strong>${escapeHTML(property.vagas)}</strong>Vagas</span>
          </div>
          <div class="property-actions">
            <a class="btn btn-primary" href="${whatsLink}" target="_blank" rel="noopener">Tenho interesse</a>
            <a class="whatsapp-icon-button" href="${whatsLink}" target="_blank" rel="noopener" aria-label="Chamar no WhatsApp sobre ${escapeHTML(property.nome)}">${whatsappSvg()}</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  setupRevealAnimations();
}

function renderTestimonials() {
  const track = $("#testimonialTrack");
  const dots = $("#testimonialDots");

  track.innerHTML = appConfig.depoimentos.map((testimonial, index) => `
    <article class="testimonial-card" data-index="${index}">
      <div class="avatar">${escapeHTML(testimonial.avatar)}</div>
      <div>
        <div class="stars" aria-label="Avaliação ${testimonial.estrelas} de 5 estrelas">${"★".repeat(testimonial.estrelas)}</div>
        <blockquote>“${escapeHTML(testimonial.comentario)}”</blockquote>
        <h3>${escapeHTML(testimonial.nome)}</h3>
        <span>${escapeHTML(testimonial.cargo)}</span>
      </div>
    </article>
  `).join("");

  dots.innerHTML = appConfig.depoimentos.map((_, index) => `
    <button type="button" aria-label="Ir para depoimento ${index + 1}" data-index="${index}"></button>
  `).join("");

  dots.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      showTestimonial(Number(button.dataset.index));
      restartTestimonialTimer();
    });
  });

  showTestimonial(0);
  restartTestimonialTimer();
}

function showTestimonial(index) {
  const total = appConfig.depoimentos.length;
  currentTestimonial = (index + total) % total;

  $$(".testimonial-card").forEach((card, cardIndex) => {
    card.style.display = cardIndex === currentTestimonial ? "grid" : "none";
  });

  $$("#testimonialDots button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentTestimonial);
  });
}

function restartTestimonialTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 5500);
}

function renderGallery() {
  const gallery = $("#galleryGrid");
  const properties = appConfig.imoveis.slice(0, 6);

  gallery.innerHTML = properties.map((property, index) => `
    <a href="#imoveis" class="gallery-item reveal" data-title="${escapeHTML(property.nome)}" style="--delay:${index * 70}ms">
      <img src="${escapeHTML(property.imagem)}" alt="${escapeHTML(property.nome)}" loading="lazy" />
    </a>
  `).join("");
}

function setupHeaderBehavior() {
  const header = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const menu = $("#mainMenu");
  const navLinks = $$(".main-nav a");

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const highlightNav = () => {
    let current = sections[0]?.id;
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= 130) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();
}

function setupSearch() {
  $("#propertySearch").addEventListener("submit", (event) => {
    event.preventDefault();
    renderProperties();
    document.querySelector("#imoveis").scrollIntoView({ behavior: "smooth" });
  });

  $("#clearFilters").addEventListener("click", () => {
    $("#filterType").value = "todos";
    $("#filterCity").value = "todos";
    $("#filterPrice").value = "todos";
    renderProperties();
  });
}

function setupContactForm() {
  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const phone = data.get("phone");
    const interest = data.get("interest");
    const message = data.get("message") || "Não informado";

    const whatsappMessage = [
      "Olá! Vim pelo site da imobiliária e gostaria de atendimento.",
      "",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Interesse: ${interest}`,
      `Mensagem: ${message}`
    ].join("\n");

    window.open(createWhatsAppLink(whatsappMessage), "_blank", "noopener");
  });
}

function setupSliderButtons() {
  $("#prevTestimonial").addEventListener("click", () => {
    showTestimonial(currentTestimonial - 1);
    restartTestimonialTimer();
  });

  $("#nextTestimonial").addEventListener("click", () => {
    showTestimonial(currentTestimonial + 1);
    restartTestimonialTimer();
  });
}

function setupRevealAnimations() {
  const revealItems = $$(".reveal:not(.observed)");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
  });

  revealItems.forEach((item) => {
    item.classList.add("observed");
    observer.observe(item);
  });
}

function setupImageFallbacks() {
  $$('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.src = 'assets/hero.jpg';
    }, { once: true });
  });
}

async function init() {
  await loadConfig();
  applyContentFromConfig();
  fillCityOptions();
  renderProperties();
  renderTestimonials();
  renderGallery();
  setWhatsAppLinks();
  setupHeaderBehavior();
  setupSearch();
  setupContactForm();
  setupSliderButtons();
  setupRevealAnimations();
  setupImageFallbacks();
}

document.addEventListener("DOMContentLoaded", init);
