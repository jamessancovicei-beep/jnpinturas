/* ============================================================
   JN PINTURAS — scripts da landing page
   - menu mobile (drawer)
   - link ativo por seção (scrollspy)
   - revelação de elementos no scroll
   - montagem da mensagem do WhatsApp por origem do clique
   - formulário de orçamento -> WhatsApp
   ============================================================ */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5519995750193";
  var WHATSAPP_BASE = "https://wa.me/" + WHATSAPP_NUMBER;

  function waUrl(text) {
    return WHATSAPP_BASE + "?text=" + encodeURIComponent(text);
  }

  /* ---------------------------------------------------------
     1. Links de WhatsApp com mensagem por origem
     --------------------------------------------------------- */
  function initWhatsAppLinks() {
    var links = document.querySelectorAll(".wa-link");

    Array.prototype.forEach.call(links, function (link) {
      var text = link.getAttribute("data-text");
      if (!text) {
        text = "Olá! Gostaria de solicitar um orçamento para pintura residencial.";
      }
      link.setAttribute("href", waUrl(text));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------------------------------------------------------
     2. Menu mobile
     --------------------------------------------------------- */
  function initMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("nav");
    var backdrop = document.getElementById("navBackdrop");
    if (!toggle || !nav) return;

    var lastFocused = null;

    function openMenu() {
      lastFocused = document.activeElement;
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("is-locked");
      if (backdrop) {
        backdrop.hidden = false;
        // força o navegador a aplicar o estado inicial antes da transição
        requestAnimationFrame(function () {
          backdrop.classList.add("is-visible");
        });
      }
    }

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("is-locked");
      if (backdrop) {
        backdrop.classList.remove("is-visible");
        window.setTimeout(function () {
          backdrop.hidden = true;
        }, 300);
      }
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function isOpen() {
      return nav.classList.contains("is-open");
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }

    // fechar ao clicar num link interno
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        if (isOpen()) closeMenu();
      });
    });

    // fechar com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeMenu();
    });

    // fechar ao voltar para desktop
    var mq = window.matchMedia("(min-width: 901px)");
    var onChange = function (e) {
      if (e.matches && isOpen()) closeMenu();
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
    }
  }

  /* ---------------------------------------------------------
     3. Cabeçalho com sombra + link ativo
     --------------------------------------------------------- */
  function initScrollUI() {
    var header = document.querySelector(".site-header");
    var links = document.querySelectorAll(".nav-link");
    var sections = [];

    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute("href");
      if (id && id.charAt(0) === "#") {
        var el = document.querySelector(id);
        if (el) sections.push({ link: link, el: el });
      }
    });

    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset || document.documentElement.scrollTop;

        if (header) {
          header.classList.toggle("is-scrolled", y > 8);
        }

        var current = null;
        var probe = y + 140;
        sections.forEach(function (item) {
          if (item.el.offsetTop <= probe) current = item.link;
        });

        Array.prototype.forEach.call(links, function (link) {
          link.classList.toggle("is-active", link === current);
        });

        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     4. Revelação no scroll
     --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     5. Formulário -> WhatsApp
     --------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById("quoteForm");
    if (!form) return;

    var feedback = document.getElementById("formFeedback");
    var telInput = document.getElementById("telefone");

    // máscara simples de telefone: (00) 00000-0000
    if (telInput) {
      telInput.addEventListener("input", function () {
        var digits = telInput.value.replace(/\D/g, "").slice(0, 11);
        var out = "";
        if (digits.length > 0) {
          out = "(" + digits.slice(0, 2);
        }
        if (digits.length >= 3) {
          out += ") " + digits.slice(2, digits.length > 10 ? 7 : 6);
        }
        if (digits.length > (digits.length > 10 ? 7 : 6) && digits.length > 2) {
          out += "-" + digits.slice(digits.length > 10 ? 7 : 6, 11);
        }
        telInput.value = out;
      });
    }

    function setError(fieldName, message) {
      var input = form.elements[fieldName];
      if (!input) return;
      var wrapper = input.closest(".field");
      var errNode = document.getElementById(fieldName + "-err");
      if (message) {
        if (wrapper) wrapper.classList.add("has-error");
        input.setAttribute("aria-invalid", "true");
        if (errNode) errNode.textContent = message;
      } else {
        if (wrapper) wrapper.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
        if (errNode) errNode.textContent = "";
      }
    }

    // limpa o erro ao digitar
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (el) {
      var handler = function () { setError(el.name, ""); };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = (form.elements.nome.value || "").trim();
      var telefone = (form.elements.telefone.value || "").trim();
      var imovel = form.elements.imovel.value || "";
      var servico = (form.elements.servico.value || "").trim();
      var primeiroErro = null;

      if (nome.length < 2) {
        setError("nome", "Informe seu nome.");
        primeiroErro = primeiroErro || form.elements.nome;
      }
      var telDigits = telefone.replace(/\D/g, "");
      if (telDigits.length < 10) {
        setError("telefone", "Informe um telefone com DDD.");
        primeiroErro = primeiroErro || form.elements.telefone;
      }
      if (!imovel) {
        setError("imovel", "Selecione o tipo de imóvel.");
        primeiroErro = primeiroErro || form.elements.imovel;
      }
      if (servico.length < 5) {
        setError("servico", "Descreva brevemente o serviço desejado.");
        primeiroErro = primeiroErro || form.elements.servico;
      }

      if (primeiroErro) {
        primeiroErro.focus();
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("is-visible");
        }
        return;
      }

      var mensagem =
        "Olá! Gostaria de solicitar um orçamento para pintura residencial.\n\n" +
        "Nome: " + nome + "\n" +
        "Telefone: " + telefone + "\n" +
        "Tipo de imóvel: " + imovel + "\n" +
        "Serviço desejado: " + servico;

      if (feedback) {
        feedback.textContent = "Mensagem pronta! Abrindo o WhatsApp...";
        feedback.classList.add("is-visible");
      }

      window.open(waUrl(mensagem), "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------
     6. Ano atual no rodapé
     --------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById("anoAtual");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     Inicialização
     --------------------------------------------------------- */
  function init() {
    initWhatsAppLinks();
    initMenu();
    initScrollUI();
    initReveal();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
