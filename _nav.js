(function () {
  function createRoutes() {
    if (window.PinkhouseAuth && window.PinkhouseAuth.routes) {
      return window.PinkhouseAuth.routes;
    }

    var pathname = decodeURIComponent(window.location.pathname || "");
    var marker = "/stitch_pinkhouse_bill_predictor/";
    var index = pathname.lastIndexOf(marker);
    var basePath = index === -1 ? "" : pathname.slice(0, index + marker.length - 1);

    function toPage(folder) {
      return encodeURI(basePath + "/" + folder + "/code.html");
    }

    return {
      login: toPage("dang nhap"),
      home: toPage("trang chủ pinkhouse"),
      setup: toPage("trang nhập thông tin"),
      dashboard: toPage("dashboard 1"),
      dashboard2: toPage("dashboard 2"),
      tips: toPage("lstk 1"),
      history: toPage("lstk 2")
    };
  }

  var routes = createRoutes();
  var decodedPath = decodeURIComponent(window.location.pathname || "");

  function goTo(href) {
    window.location.href = href;
  }

  function setHref(anchor, href) {
    if (!anchor) {
      return;
    }

    anchor.setAttribute("href", href);
  }

  function isInside(pathText) {
    return decodedPath.indexOf(pathText) !== -1;
  }

  function wireBrandClicks() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll("header *, nav *"));

    candidates.forEach(function (node) {
      var text = (node.textContent || "").trim();

      if (text !== "PINKHOUSE" || node.dataset.brandBound === "true") {
        return;
      }

      node.dataset.brandBound = "true";
      node.style.cursor = "pointer";
      node.addEventListener("click", function () {
        goTo(routes.home);
      });
    });
  }

  function wireNavigation() {
    var topNav = document.querySelector("header nav, nav .hidden.md\\:flex, nav.hidden.md\\:flex");

    if (topNav) {
      var topLinks = topNav.querySelectorAll("a");
      setHref(topLinks[0], routes.setup + "?mode=profile");
      setHref(topLinks[1], routes.dashboard);
      setHref(topLinks[2], routes.tips);
      setHref(topLinks[3], routes.history);
    }

    var sideNav = document.querySelector("aside nav");

    if (sideNav) {
      var sideLinks = sideNav.querySelectorAll("a");
      setHref(sideLinks[0], routes.dashboard);
      setHref(sideLinks[1], routes.setup + "?mode=profile");
      setHref(sideLinks[2], routes.dashboard2);
      setHref(sideLinks[3], routes.tips);
      setHref(sideLinks[4], routes.home);
    }

    var createPredictionButton = document.querySelector("aside button");

    if (createPredictionButton && createPredictionButton.dataset.createPredictionBound !== "true") {
      createPredictionButton.dataset.createPredictionBound = "true";

      createPredictionButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          goTo(routes.setup + "?mode=new");
        },
        true
      );
    }

    document.querySelectorAll("footer a").forEach(function (anchor, index) {
      if (index === 0) {
        anchor.href = routes.home;
      }

      if (index === 1) {
        anchor.href = routes.tips;
      }

      if (index === 2) {
        anchor.href = routes.setup + "?mode=profile";
      }
    });
  }

  function wireHomeButtons() {
    if (!isInside("/trang chủ pinkhouse/")) {
      return;
    }

    var heroButtons = Array.prototype.slice.call(document.querySelectorAll("main section button"));

    if (heroButtons[0] && heroButtons[0].dataset.homePrimaryBound !== "true") {
      heroButtons[0].dataset.homePrimaryBound = "true";
      heroButtons[0].addEventListener("click", function () {
        goTo(routes.setup + "?mode=new");
      });
    }

    if (heroButtons[1] && heroButtons[1].dataset.homeSecondaryBound !== "true") {
      heroButtons[1].dataset.homeSecondaryBound = "true";
      heroButtons[1].addEventListener("click", function () {
        goTo(routes.dashboard);
      });
    }
  }

  function wireDashboardDetailLink() {
    if (!isInside("/dashboard 1/") && !isInside("/bảng điều khiển dự đoán 1/") && !isInside("/b_ng_i_u_khi_n_d_o_n_1/")) {
      return;
    }

    var detailLinks = Array.prototype.slice.call(document.querySelectorAll("a, button"));

    detailLinks.forEach(function (node) {
      var text = (node.textContent || "").trim().toLowerCase();

      if (text.indexOf("xem chi tiết") === -1 || node.dataset.detailBound === "true") {
        return;
      }

      node.dataset.detailBound = "true";

      if (node.tagName === "A") {
        node.setAttribute("href", routes.dashboard2);
      }

      node.addEventListener("click", function (event) {
        event.preventDefault();
        goTo(routes.dashboard2);
      });
    });
  }

  function wireLogoutLinks() {
    Array.prototype.slice.call(document.querySelectorAll("a, button")).forEach(function (node) {
      if (node.dataset.authAction === "logout") {
        return;
      }

      var logoutIcon = node.querySelector("[data-icon='logout']");
      var text = (node.textContent || "").toLowerCase();
      var isLogout = !!logoutIcon || text.indexOf("dang xuat") !== -1 || text.indexOf("đăng xuất") !== -1;

      if (!isLogout) {
        return;
      }

      node.dataset.authAction = "logout";

      if (node.tagName === "A") {
        node.setAttribute("href", routes.login);
      }

      node.addEventListener("click", function (event) {
        event.preventDefault();
        goTo(routes.login);
      });
    });
  }

  function getTheme() {
    return localStorage.getItem("pinkhouse-theme") || "light";
  }

  function applyTheme(theme) {
    var finalTheme = theme;

    if (theme === "auto") {
      finalTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-pinkhouse-theme", finalTheme);
    localStorage.setItem("pinkhouse-theme", theme);
  }

  function createHeaderStyle() {
    if (document.getElementById("pinkhouseHeaderFixedStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseHeaderFixedStyle";
    style.textContent = [
      ".ph-header-action-bar{position:fixed;z-index:999999;display:flex;gap:8px;align-items:center;}",
      ".ph-header-action-btn{width:40px;height:40px;border-radius:999px;border:1px solid #f1bdd3;background:#fff7fb;color:#c60063;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(198,0,99,.08);font-family:inherit;}",
      ".ph-header-action-btn:hover{background:#ffe4f0;transform:translateY(-1px);}",
      ".ph-header-action-btn .material-symbols-outlined{font-size:21px;line-height:1;}",
      ".ph-header-avatar-mini{width:24px;height:24px;border-radius:999px;background:linear-gradient(135deg,#c60063,#ff8dbc);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:950;}",
      ".ph-pop{position:fixed;z-index:1000000;width:300px;background:#fff;border:1px solid #efb3cb;border-radius:18px;box-shadow:0 18px 45px rgba(70,20,45,.2);padding:14px;color:#2a1020;font-family:inherit;}",
      ".ph-pop-title{font-size:15px;font-weight:950;color:#c60063;margin-bottom:10px;padding-right:24px;}",
      ".ph-pop-item{padding:11px 10px;border-radius:13px;background:#fff7fb;border:1px solid #f6d2e0;margin-bottom:9px;font-size:13px;line-height:1.45;color:#4b2639;}",
      ".ph-pop-item b{color:#2a1020;}",
      ".ph-pop-btn{width:100%;height:40px;border:none;border-radius:12px;background:#c60063;color:white;font-weight:900;cursor:pointer;font-family:inherit;margin-top:4px;}",
      ".ph-close{position:absolute;right:12px;top:10px;border:none;background:transparent;color:#8b5b70;font-size:20px;cursor:pointer;}",
      ".ph-theme-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;}",
      ".ph-theme-btn{height:40px;border:1px solid #efb3cb;border-radius:12px;background:#fff7fb;color:#8a315e;font-weight:900;cursor:pointer;font-family:inherit;}",
      ".ph-theme-btn.active{background:#c60063;color:white;border-color:#c60063;}",
      ".ph-mini-danger{background:#fff3f3!important;border-color:#ffc3c3!important;color:#8a1e1e!important;}",
      "html[data-pinkhouse-theme='dark'] body{background:#130914!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] main{background:#130914!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] header{background:#1d1020!important;border-color:#3b1d2f!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] aside{background:#201124!important;border-color:#4a2038!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] nav{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] a{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] h1,html[data-pinkhouse-theme='dark'] h2,html[data-pinkhouse-theme='dark'] h3,html[data-pinkhouse-theme='dark'] p{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] section,html[data-pinkhouse-theme='dark'] article,html[data-pinkhouse-theme='dark'] .card,html[data-pinkhouse-theme='dark'] [class*='border']{background:#211226!important;border-color:#5a2943!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] input,html[data-pinkhouse-theme='dark'] select,html[data-pinkhouse-theme='dark'] textarea{background:#160b19!important;color:#fff!important;border-color:#733052!important;}",
      "html[data-pinkhouse-theme='dark'] input::placeholder,html[data-pinkhouse-theme='dark'] textarea::placeholder{color:#b98ba3!important;}",
      "html[data-pinkhouse-theme='dark'] .bg-white{background:#211226!important;}",
      "html[data-pinkhouse-theme='dark'] .bg-slate-50,html[data-pinkhouse-theme='dark'] .bg-gray-50{background:#130914!important;}",
      "html[data-pinkhouse-theme='dark'] .text-slate-900,html[data-pinkhouse-theme='dark'] .text-gray-900,html[data-pinkhouse-theme='dark'] .text-black{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .text-slate-500,html[data-pinkhouse-theme='dark'] .text-gray-500,html[data-pinkhouse-theme='dark'] .text-slate-600,html[data-pinkhouse-theme='dark'] .text-gray-600{color:#d8b9c8!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-header-action-btn{background:#211226;color:#ff7ab4;border-color:#733052;}",
      "html[data-pinkhouse-theme='dark'] .ph-pop{background:#211226!important;border-color:#733052!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-pop-title{color:#ff7ab4!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-pop-item{background:#160b19!important;border-color:#733052!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-pop-item b{color:#fff!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-theme-btn{background:#160b19;color:#f8e9f1;border-color:#733052;}",
      "html[data-pinkhouse-theme='dark'] .ph-theme-btn.active{background:#ff5fa2;color:white;border-color:#ff5fa2;}"
    ].join("");

    document.head.appendChild(style);
  }

  function closePop() {
    var old = document.getElementById("phHeaderPop");

    if (old) {
      old.remove();
    }
  }

  function placePop(pop, anchor) {
    var rect = anchor.getBoundingClientRect();
    var left = rect.right - 300;
    var top = rect.bottom + 12;

    if (left < 12) {
      left = 12;
    }

    if (left + 300 > window.innerWidth - 12) {
      left = window.innerWidth - 312;
    }

    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  function showPop(anchor, title, content, buttonText, action) {
    closePop();

    var pop = document.createElement("div");
    pop.id = "phHeaderPop";
    pop.className = "ph-pop";

    var html = "";
    html += '<button class="ph-close" type="button">×</button>';
    html += '<div class="ph-pop-title">' + title + "</div>";
    html += content;

    if (buttonText) {
      html += '<button class="ph-pop-btn" type="button">' + buttonText + "</button>";
    }

    pop.innerHTML = html;
    document.body.appendChild(pop);
    placePop(pop, anchor);

    pop.querySelector(".ph-close").addEventListener("click", closePop);

    var btn = pop.querySelector(".ph-pop-btn");

    if (btn && typeof action === "function") {
      btn.addEventListener("click", action);
    }
  }

  function showTheme(anchor) {
    var current = getTheme();

    showPop(
      anchor,
      "Cài đặt giao diện",
      [
        '<div class="ph-pop-item"><b>Chọn chế độ hiển thị</b><br>Đổi nhanh giữa giao diện sáng, tối hoặc tự động theo máy.</div>',
        '<div class="ph-theme-row">',
        '<button type="button" class="ph-theme-btn" data-theme="light">Sáng</button>',
        '<button type="button" class="ph-theme-btn" data-theme="dark">Tối</button>',
        '<button type="button" class="ph-theme-btn" data-theme="auto">Tự động</button>',
        "</div>",
        '<div class="ph-pop-item ph-mini-danger" style="margin-top:10px;"><b>Reset dữ liệu</b><br>Dùng khi app bị kẹt số tiền cũ.</div>'
      ].join(""),
      "Reset dữ liệu",
      function () {
        if (confirm("Reset toàn bộ dữ liệu về mặc định nha?")) {
          fetch("/api/reset-all-data?t=" + Date.now(), { cache: "no-store" })
            .then(function () {
              window.location.reload();
            })
            .catch(function () {
              alert("Không reset được dữ liệu.");
            });
        }
      }
    );

    document.querySelectorAll(".ph-theme-btn").forEach(function (btn) {
      if (btn.dataset.theme === current) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", function () {
        applyTheme(btn.dataset.theme);
        closePop();
      });
    });
  }

  function createHeaderActionBar() {
    createHeaderStyle();
    applyTheme(getTheme());

    var old = document.getElementById("phHeaderActionBar");

    if (old) {
      old.remove();
    }

    var header = document.querySelector("header");

    if (!header) {
      return;
    }

    var rect = header.getBoundingClientRect();
    var bar = document.createElement("div");

    bar.id = "phHeaderActionBar";
    bar.className = "ph-header-action-bar";
    bar.innerHTML = [
      '<button type="button" class="ph-header-action-btn" id="phBellAction" aria-label="Thông báo"><span class="material-symbols-outlined">notifications</span></button>',
      '<button type="button" class="ph-header-action-btn" id="phSettingAction" aria-label="Cài đặt"><span class="material-symbols-outlined">settings</span></button>',
      '<button type="button" class="ph-header-action-btn" id="phAvatarAction" aria-label="Tài khoản"><span class="ph-header-avatar-mini">PH</span></button>'
    ].join("");

    document.body.appendChild(bar);

    bar.style.top = Math.max(12, rect.top + 14) + "px";
    bar.style.right = "26px";

    var bell = document.getElementById("phBellAction");
    var setting = document.getElementById("phSettingAction");
    var avatar = document.getElementById("phAvatarAction");

    bell.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      showPop(
        bell,
        "Thông báo",
        '<div class="ph-pop-item"><b>Chưa có thông báo mới.</b><br>App sẽ báo khi hóa đơn dự kiến tăng bất thường.</div><div class="ph-pop-item"><b>Gợi ý:</b><br>Cập nhật hóa đơn thực tế để biểu đồ chính xác hơn.</div>',
        "Xem lịch sử",
        function () {
          goTo(routes.history);
        }
      );
    });

    setting.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showTheme(setting);
    });

    avatar.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      showPop(
        avatar,
        "Tài khoản",
        '<div class="ph-pop-item"><b>PINKHOUSE User</b><br>Đang sử dụng app quản lý điện năng.</div><div class="ph-pop-item"><b>Trang hiện tại:</b><br>' + decodeURIComponent(window.location.pathname || "") + "</div>",
        "Đăng xuất",
        function () {
          goTo(routes.login);
        }
      );
    });
  }

  function boot() {
    wireNavigation();
    wireBrandClicks();
    wireHomeButtons();
    wireDashboardDetailLink();
    wireLogoutLinks();
    createHeaderActionBar();
  }

  document.addEventListener("click", function (event) {
    var pop = document.getElementById("phHeaderPop");

    if (!pop) {
      return;
    }

    var bar = document.getElementById("phHeaderActionBar");

    if (!pop.contains(event.target) && (!bar || !bar.contains(event.target))) {
      closePop();
    }
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (getTheme() === "auto") {
        applyTheme("auto");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("resize", createHeaderActionBar);
  setTimeout(boot, 300);
  setTimeout(boot, 900);
  setTimeout(boot, 1500);
})();