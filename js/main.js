/* Captured by Naima — site behaviour (no libraries) */
(function () {
  "use strict";

  // ---- Edit these if your contact details change ----
  var EMAIL = "naimanjidda@gmail.com";
  var WHATSAPP_NUMBER = "2348135855566"; // 0813 585 5566 in international format

  // ---- Mobile menu ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.textContent = open ? "Menu" : "Close";
    });
  }

  // ---- Footer year ----
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- Lightbox ----
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lb]"));
  if (items.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Close photo viewer">\u00d7</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">\u2039</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next photo">\u203a</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<p class="lb-caption" aria-live="polite"></p>';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var cap = box.querySelector(".lb-caption");
    var closeBtn = box.querySelector(".lb-close");
    var index = 0;
    var lastFocus = null;

    var show = function (i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      img.src = el.getAttribute("data-full");
      img.alt = el.getAttribute("data-alt") || "";
      cap.textContent = el.getAttribute("data-caption") || "";
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      box.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    var close = function () {
      box.removeAttribute("data-open");
      document.body.style.overflow = "";
      img.removeAttribute("src");
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (el, i) {
      el.addEventListener("click", function () { open(i); });
    });
    closeBtn.addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lb-stage")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (box.getAttribute("data-open") !== "true") return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") {
        // keep keyboard focus inside the viewer
        var f = box.querySelectorAll("button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // swipe on touch screens
    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  // ---- Enquiry form: opens WhatsApp or email with the message already written ----
  var form = document.getElementById("enquiry");
  if (form) {
    var build = function () {
      var v = function (id) { return (form.elements[id].value || "").trim(); };
      var lines = [
        "Hello Naima, I'd like to enquire about a shoot.",
        "",
        "Name: " + v("name"),
        "Type of shoot: " + v("type"),
        "Date: " + (v("date") || "Not decided yet"),
        "Location: " + (v("place") || "Not decided yet"),
        "",
        v("message")
      ];
      return lines.join("\n");
    };
    form.querySelector("[data-send=whatsapp]").addEventListener("click", function () {
      if (!form.reportValidity()) return;
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(build()), "_blank", "noopener");
    });
    form.querySelector("[data-send=email]").addEventListener("click", function () {
      if (!form.reportValidity()) return;
      var subject = "Shoot enquiry: " + form.elements.type.value;
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(build());
    });
  }
})();
