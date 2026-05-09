(function () {
  var path = decodeURIComponent(window.location.pathname || "");
  var isDashboard =
    path.indexOf("/dashboard 1/") !== -1 ||
    path.indexOf("/b_ng_i_u_khi_n_d_o_n_1/") !== -1;

  if (!isDashboard) {
    return;
  }

  function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(Math.round(Number(value) || 0)) + "đ";
  }

  function formatKwh(value) {
    var number = Number(value || 0);
    return new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1
    }).format(number) + " kWh";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getPlanPageUrl() {
    var decodedPath = decodeURIComponent(window.location.pathname || "");

    if (decodedPath.indexOf("/dashboard 1/") !== -1) {
      return encodeURI(decodedPath.replace("/dashboard 1/", "/dashboard 2/"));
    }

    if (decodedPath.indexOf("/b_ng_i_u_khi_n_d_o_n_1/") !== -1) {
      return encodeURI(decodedPath.replace("/b_ng_i_u_khi_n_d_o_n_1/", "/b_ng_i_u_khi_n_d_o_n_2/"));
    }

    return "#";
  }

  function createStyle() {
    if (document.getElementById("pinkhouseDashboardDetailStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseDashboardDetailStyle";
    style.textContent = [
      ".pinkhouse-detail-overlay{position:fixed;inset:0;background:rgba(36,18,30,.38);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;}",
      ".pinkhouse-detail-overlay.show{display:flex;}",
      ".pinkhouse-detail-modal{width:min(920px,100%);max-height:90vh;overflow:auto;background:#fffafb;border:1px solid #f0b6cf;border-radius:28px;box-shadow:0 28px 80px rgba(92,0,48,.24);padding:26px;animation:pinkhouseDetailIn .22s ease;}",
      "@keyframes pinkhouseDetailIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}",

      ".pinkhouse-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px;}",
      ".pinkhouse-detail-title{display:flex;align-items:center;gap:10px;font-size:26px;font-weight:950;color:#210d1a;line-height:1.2;}",
      ".pinkhouse-detail-title .material-symbols-outlined{color:#c60063;font-size:32px;}",
      ".pinkhouse-detail-sub{color:#725060;margin-top:7px;font-size:14px;line-height:1.55;max-width:670px;}",
      ".pinkhouse-detail-close{width:40px;height:40px;border-radius:999px;border:1px solid #efb3cb;background:#fff;color:#c60063;cursor:pointer;font-size:24px;font-weight:900;}",
      ".pinkhouse-detail-close:hover{background:#fff0f6;}",

      ".pinkhouse-detail-mode{display:flex;align-items:flex-start;gap:12px;background:linear-gradient(135deg,#fff0f7,#f5f7ff);border:1px solid #f0c4d6;border-radius:20px;padding:15px 16px;margin-bottom:16px;}",
      ".pinkhouse-detail-mode-icon{width:40px;height:40px;border-radius:999px;background:#ffd8e6;color:#c60063;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}",
      ".pinkhouse-detail-mode-title{font-size:15px;font-weight:950;color:#2b1020;margin-bottom:3px;}",
      ".pinkhouse-detail-mode-desc{font-size:13px;color:#6b4b5a;line-height:1.5;}",

      ".pinkhouse-detail-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px;}",
      ".pinkhouse-detail-card{background:#fff;border:1px solid #f1c5d8;border-radius:18px;padding:15px;}",
      ".pinkhouse-detail-card-label{font-size:12px;color:#785567;margin-bottom:8px;font-weight:850;}",
      ".pinkhouse-detail-card-value{font-size:22px;color:#c60063;font-weight:950;line-height:1.15;}",
      ".pinkhouse-detail-card-note{font-size:12px;color:#7b5a6a;margin-top:7px;line-height:1.35;}",

      ".pinkhouse-detail-section{background:#fff;border:1px solid #f1c5d8;border-radius:20px;padding:17px;margin-top:13px;}",
      ".pinkhouse-detail-section h3{font-size:18px;color:#2b1020;font-weight:950;margin:0 0 13px 0;display:flex;align-items:center;gap:8px;}",
      ".pinkhouse-detail-section h3 .material-symbols-outlined{color:#c60063;}",

      ".pinkhouse-detail-device{display:grid;grid-template-columns:150px 1fr 145px;align-items:center;gap:12px;padding:10px 0;border-top:1px dashed #f3c7d9;}",
      ".pinkhouse-detail-device:first-of-type{border-top:none;padding-top:0;}",
      ".pinkhouse-detail-device-name{font-size:14px;font-weight:900;color:#351827;line-height:1.35;}",
      ".pinkhouse-detail-device-meta{font-size:12px;color:#7a5868;margin-top:3px;}",
      ".pinkhouse-detail-bar{height:11px;background:#f4e7ee;border-radius:999px;overflow:hidden;}",
      ".pinkhouse-detail-fill{height:100%;background:#c60063;border-radius:999px;}",
      ".pinkhouse-detail-device-number{text-align:right;font-size:13px;color:#422233;line-height:1.45;}",
      ".pinkhouse-detail-device-number b{color:#c60063;font-size:14px;}",

      ".pinkhouse-detail-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}",
      ".pinkhouse-action-card{background:#fff7fb;border:1px solid #f0c4d6;border-radius:17px;padding:14px;}",
      ".pinkhouse-action-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;}",
      ".pinkhouse-action-title{font-size:15px;font-weight:950;color:#2b1020;line-height:1.35;}",
      ".pinkhouse-action-save{background:#ffd8e6;color:#870043;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:950;white-space:nowrap;}",
      ".pinkhouse-action-desc{font-size:13px;color:#563646;line-height:1.55;margin-bottom:10px;}",
      ".pinkhouse-action-product{background:#fff;border:1px dashed #efb3cb;border-radius:13px;padding:10px;font-size:12.5px;color:#5f3d4e;line-height:1.5;}",
      ".pinkhouse-action-product b{color:#c60063;}",

      ".pinkhouse-detail-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;background:#fff7fb;border:1px solid #f0c4d6;border-radius:18px;padding:14px 16px;}",
      ".pinkhouse-detail-footer-text{font-size:13px;color:#6b4b5a;line-height:1.5;}",
      ".pinkhouse-detail-plan-btn{border:none;border-radius:999px;background:#c60063;color:#fff;font-size:13px;font-weight:950;padding:11px 15px;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;}",
      ".pinkhouse-detail-plan-btn:hover{filter:brightness(.98);transform:translateY(-1px);}",

      ".pinkhouse-detail-empty{background:#fff7fb;border:1px dashed #efb3cb;border-radius:15px;padding:13px;color:#6b4b5a;font-size:13px;line-height:1.5;}",
      "@media(max-width:840px){.pinkhouse-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.pinkhouse-detail-device{grid-template-columns:1fr;}.pinkhouse-detail-device-number{text-align:left}.pinkhouse-detail-actions{grid-template-columns:1fr}.pinkhouse-detail-footer{flex-direction:column;align-items:flex-start;}}",
      "@media(max-width:520px){.pinkhouse-detail-grid{grid-template-columns:1fr}.pinkhouse-detail-modal{padding:20px;border-radius:22px;}}"
    ].join("");

    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById("pinkhouseDashboardDetailOverlay")) {
      return document.getElementById("pinkhouseDashboardDetailOverlay");
    }

    createStyle();

    var overlay = document.createElement("div");
    overlay.id = "pinkhouseDashboardDetailOverlay";
    overlay.className = "pinkhouse-detail-overlay";

    overlay.innerHTML = [
      '<div class="pinkhouse-detail-modal" role="dialog" aria-modal="true" aria-label="Chi tiết tiền điện">',
      '<div class="pinkhouse-detail-head">',
      "<div>",
      '<div class="pinkhouse-detail-title">',
      '<span class="material-symbols-outlined">monitoring</span>',
      "<span>Chi tiết dự đoán tiền điện</span>",
      "</div>",
      '<div class="pinkhouse-detail-sub">Phân tích tiền điện dự kiến, lượng kWh, thiết bị dùng nhiều nhất và kế hoạch tiết kiệm cá nhân hóa theo dữ liệu của bạn.</div>',
      "</div>",
      '<button type="button" class="pinkhouse-detail-close" id="pinkhouseDetailClose" aria-label="Đóng">×</button>',
      "</div>",
      '<div id="pinkhouseDetailContent">',
      '<div class="pinkhouse-detail-empty">Đang tải dữ liệu chi tiết...</div>',
      "</div>",
      "</div>"
    ].join("");

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.classList.remove("show");
      }
    });

    document.getElementById("pinkhouseDetailClose").addEventListener("click", function () {
      overlay.classList.remove("show");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        overlay.classList.remove("show");
      }
    });

    return overlay;
  }

  function createModeText(setup) {
    var hasKwh = Number(setup.lastKwh || 0) > 0;
    var hasBill = Number(setup.lastBillCost || 0) > 0;

    if (hasKwh) {
      return {
        icon: "receipt_long",
        title: "Đang hiệu chỉnh theo số kWh bill gần nhất",
        desc: "App đang lấy " + formatKwh(setup.lastKwh) + " làm mốc chính. Thiết bị được dùng để chia tỷ lệ và tạo gợi ý tiết kiệm."
      };
    }

    if (hasBill) {
      return {
        icon: "receipt_long",
        title: "Đang hiệu chỉnh theo tiền điện bill gần nhất",
        desc: "App đang quy đổi tiền điện gần nhất sang kWh dựa trên đơn giá hiện tại, rồi dùng thiết bị để chia tỷ lệ tiêu thụ."
      };
    }

    return {
      icon: "memory",
      title: "Đang dự đoán theo thiết bị",
      desc: "Bạn chưa nhập bill gần nhất, nên app ước tính từ công suất, số lượng, giờ dùng mỗi ngày, số ngày trong tháng và đặc điểm phòng."
    };
  }

  function renderMode(setup) {
    var mode = createModeText(setup || {});

    return [
      '<div class="pinkhouse-detail-mode">',
      '<div class="pinkhouse-detail-mode-icon"><span class="material-symbols-outlined">' + mode.icon + "</span></div>",
      "<div>",
      '<div class="pinkhouse-detail-mode-title">' + escapeHtml(mode.title) + "</div>",
      '<div class="pinkhouse-detail-mode-desc">' + escapeHtml(mode.desc) + "</div>",
      "</div>",
      "</div>"
    ].join("");
  }

  function renderSummary(dashboard, setup) {
    var totalCost = Number(dashboard.totalCost || 0);
    var totalKwh = Number(dashboard.totalKwh || 0);
    var rate = Number(setup.rate || 0);
    var averageRate = totalKwh > 0 ? Math.round(totalCost / totalKwh) : rate;
    var monthlyDays = Number(dashboard.monthlyDays || setup.monthlyDays || 30);

    return [
      '<div class="pinkhouse-detail-grid">',
      '<div class="pinkhouse-detail-card">',
      '<div class="pinkhouse-detail-card-label">Tiền điện dự kiến</div>',
      '<div class="pinkhouse-detail-card-value">' + formatVnd(totalCost) + "</div>",
      '<div class="pinkhouse-detail-card-note">Tổng tiền điện trong kỳ hiện tại</div>',
      "</div>",

      '<div class="pinkhouse-detail-card">',
      '<div class="pinkhouse-detail-card-label">Điện năng tiêu thụ</div>',
      '<div class="pinkhouse-detail-card-value">' + formatKwh(totalKwh) + "</div>",
      '<div class="pinkhouse-detail-card-note">Ước tính trong ' + monthlyDays + " ngày</div>",
      "</div>",

      '<div class="pinkhouse-detail-card">',
      '<div class="pinkhouse-detail-card-label">Đơn giá đang dùng</div>',
      '<div class="pinkhouse-detail-card-value">' + formatVnd(rate) + "/kWh</div>",
      '<div class="pinkhouse-detail-card-note">Theo dữ liệu nhập ở bước thiết lập</div>',
      "</div>",

      '<div class="pinkhouse-detail-card">',
      '<div class="pinkhouse-detail-card-label">Đơn giá trung bình</div>',
      '<div class="pinkhouse-detail-card-value">' + formatVnd(averageRate) + "/kWh</div>",
      '<div class="pinkhouse-detail-card-note">Tiền điện chia cho tổng kWh</div>',
      "</div>",
      "</div>"
    ].join("");
  }

  function renderBreakdown(dashboard) {
    var breakdown = Array.isArray(dashboard.breakdown) ? dashboard.breakdown : [];

    var html = "";

    html += '<div class="pinkhouse-detail-section">';
    html += '<h3><span class="material-symbols-outlined">bolt</span>Thiết bị tiêu thụ nhiều nhất</h3>';

    if (!breakdown.length) {
      html += '<div class="pinkhouse-detail-empty">Chưa có dữ liệu thiết bị. Quay lại bước nhập dữ liệu để thêm số lượng và giờ dùng mỗi ngày.</div>';
      html += "</div>";
      return html;
    }

    breakdown.slice(0, 6).forEach(function (item) {
      var percent = Math.max(0, Math.min(100, Number(item.percent || 0)));
      var monthlyKwh = Number(item.monthlyKwh || 0);
      var monthlyCost = Number(item.monthlyCost || 0);
      var hours = Number(item.hours || 0);
      var quantity = Number(item.quantity || 0);
      var watt = Number(item.watt || 0);

      html += '<div class="pinkhouse-detail-device">';
      html += "<div>";
      html += '<div class="pinkhouse-detail-device-name">' + escapeHtml(item.name || "Thiết bị") + "</div>";

      if (item.id === "other") {
        html += '<div class="pinkhouse-detail-device-meta">Điện nền / thiết bị nhỏ</div>';
      } else {
        html += '<div class="pinkhouse-detail-device-meta">' + quantity + " thiết bị · " + hours + " giờ/ngày · " + watt + "W</div>";
      }

      html += "</div>";
      html += '<div class="pinkhouse-detail-bar"><div class="pinkhouse-detail-fill" style="width:' + percent + '%"></div></div>';
      html += '<div class="pinkhouse-detail-device-number">';
      html += "<b>" + percent + "%</b><br>";
      html += formatKwh(monthlyKwh) + "<br>";
      html += formatVnd(monthlyCost);
      html += "</div>";
      html += "</div>";
    });

    html += "</div>";

    return html;
  }

  function renderActions(plan) {
    var actions = plan && Array.isArray(plan.actions) ? plan.actions : [];
    var html = "";

    html += '<div class="pinkhouse-detail-section">';
    html += '<h3><span class="material-symbols-outlined">tips_and_updates</span>Gợi ý tiết kiệm cá nhân hóa</h3>';

    if (!actions.length) {
      html += '<div class="pinkhouse-detail-empty">Chưa tạo được gợi ý tiết kiệm. Hãy kiểm tra lại dữ liệu thiết bị hoặc nhập mục tiêu tiết kiệm ở trang Kế hoạch tiết kiệm.</div>';
      html += "</div>";
      return html;
    }

    html += '<div class="pinkhouse-detail-actions">';

    actions.slice(0, 4).forEach(function (action) {
      html += '<div class="pinkhouse-action-card">';
      html += '<div class="pinkhouse-action-top">';
      html += '<div class="pinkhouse-action-title">' + escapeHtml(action.title || "Gợi ý tiết kiệm") + "</div>";
      html += '<div class="pinkhouse-action-save">-' + formatVnd(action.estimatedSaving || 0) + "</div>";
      html += "</div>";
      html += '<div class="pinkhouse-action-desc">' + escapeHtml(action.description || "") + "</div>";
      html += '<div class="pinkhouse-action-product"><b>Gợi ý:</b> ' + escapeHtml(action.productSuggestion || "Ưu tiên thiết bị tiết kiệm điện và giảm thời gian dùng không cần thiết.") + "</div>";
      html += "</div>";
    });

    html += "</div>";
    html += "</div>";

    return html;
  }

  function renderFooter(plan) {
    var planPageUrl = getPlanPageUrl();
    var currentCost = plan ? Number(plan.currentCost || 0) : 0;
    var targetCost = plan ? Number(plan.targetCost || 0) : 0;
    var needSave = plan ? Number(plan.needSave || 0) : 0;

    return [
      '<div class="pinkhouse-detail-footer">',
      '<div class="pinkhouse-detail-footer-text">',
      "<b>Kế hoạch mặc định:</b> app đang thử mục tiêu khoảng " + formatVnd(targetCost) + " từ mức hiện tại " + formatVnd(currentCost) + ". ",
      needSave > 0 ? "Cần giảm khoảng " + formatVnd(needSave) + " để đạt mục tiêu." : "Hiện tại đã nằm trong mức mục tiêu.",
      "</div>",
      '<a class="pinkhouse-detail-plan-btn" href="' + planPageUrl + '">',
      '<span class="material-symbols-outlined">savings</span>',
      "<span>Mở kế hoạch riêng</span>",
      "</a>",
      "</div>"
    ].join("");
  }

  function renderContent(payload) {
    var content = document.getElementById("pinkhouseDetailContent");

    if (!content) {
      return;
    }

    var dashboard = payload.dashboard || {};
    var setup = payload.setup || {};
    var plan = payload.plan || null;

    var html = "";

    html += renderMode(setup);
    html += renderSummary(dashboard, setup);
    html += renderBreakdown(dashboard);
    html += renderActions(plan);
    html += renderFooter(plan);

    content.innerHTML = html;
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error("Request failed: " + url);
      }

      return res.json();
    });
  }

  function openDetail() {
    var overlay = createModal();
    var content = document.getElementById("pinkhouseDetailContent");

    overlay.classList.add("show");

    if (content) {
      content.innerHTML = '<div class="pinkhouse-detail-empty">Đang phân tích dữ liệu tiền điện của bạn...</div>';
    }

    Promise.all([
      fetchJson("/api/dashboard"),
      fetchJson("/api/setup"),
      fetchJson("/api/savings-plan")
    ])
      .then(function (results) {
        renderContent({
          dashboard: results[0] || {},
          setup: results[1] || {},
          plan: results[2] || {}
        });
      })
      .catch(function () {
        if (content) {
          content.innerHTML = '<div class="pinkhouse-detail-empty">Không tải được dữ liệu chi tiết. Kiểm tra server hoặc thử reload lại trang nha.</div>';
        }
      });
  }

  function bindDetailLink() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("a, button"));

    nodes.forEach(function (node) {
      var text = (node.textContent || "").trim().toLowerCase();

      if (text.indexOf("xem chi tiết") === -1) {
        return;
      }

      if (node.dataset.dashboardDetailBound === "true") {
        return;
      }

      node.dataset.dashboardDetailBound = "true";

      if (node.tagName === "A") {
        node.setAttribute("href", "#");
      }

      node.addEventListener("click", function (event) {
        event.preventDefault();
        openDetail();
      });
    });
  }

  setTimeout(bindDetailLink, 300);
  setTimeout(bindDetailLink, 800);
  setTimeout(bindDetailLink, 1500);
})();