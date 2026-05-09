(function () {
  var path = decodeURIComponent(window.location.pathname || "");
  var isPlanPage =
    path.indexOf("/dashboard 2/") !== -1 ||
    path.indexOf("/b_ng_i_u_khi_n_d_o_n_2/") !== -1;

  if (!isPlanPage) {
    return;
  }

  function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(Math.round(Number(value) || 0)) + "đ";
  }

  function onlyNumber(value) {
    return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
  }

  function renameMenu() {
  var links = document.querySelectorAll("aside nav a");

  links.forEach(function (link, index) {
    if (index === 2) {
      link.textContent = "Kế hoạch tiết kiệm";
    }
  });

  var currentPath = decodeURIComponent(window.location.pathname || "");

  if (currentPath.indexOf("/dashboard 2/") !== -1 || currentPath.indexOf("/b_ng_i_u_khi_n_d_o_n_2/") !== -1) {
    document.title = "PINKHOUSE - Kế hoạch tiết kiệm";
  }
}

  function createStyle() {
    if (document.getElementById("pinkhousePlanPageStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhousePlanPageStyle";
    style.textContent = [
      ".ph-plan-page{padding:8px 0 44px 0;}",
      ".ph-plan-hero{border:1px solid #efb3cb;background:linear-gradient(135deg,#fff7fb,#f5f7ff);border-radius:26px;padding:28px;margin-bottom:22px;}",
      ".ph-plan-kicker{display:inline-flex;align-items:center;gap:8px;background:#ffd8e6;color:#9b004d;border-radius:999px;padding:8px 13px;font-size:13px;font-weight:900;margin-bottom:14px;}",
      ".ph-plan-title{font-size:34px;font-weight:950;color:#160818;line-height:1.15;margin-bottom:10px;}",
      ".ph-plan-sub{font-size:16px;line-height:1.6;color:#6b4b5a;max-width:790px;}",
      ".ph-target-card{background:white;border:1px solid #f0c4d6;border-radius:22px;padding:20px;margin-top:22px;display:grid;grid-template-columns:1fr auto;gap:14px;align-items:end;}",
      ".ph-target-label{display:block;font-size:14px;font-weight:900;color:#351827;margin-bottom:9px;}",
      ".ph-target-input-box{display:flex;align-items:center;gap:10px;background:#f4f6ff;border:1px solid #e5eaff;border-radius:16px;padding:13px 15px;}",
      ".ph-target-input-box .material-symbols-outlined{color:#8b5b70;}",
      ".ph-target-input{width:100%;border:none;background:transparent;outline:none;font-size:22px;font-weight:950;color:#251122;font-family:inherit;}",
      ".ph-target-unit{font-size:13px;font-weight:900;color:#785567;white-space:nowrap;}",
      ".ph-target-btn{height:54px;border:none;border-radius:16px;background:#c60063;color:white;font-size:15px;font-weight:950;padding:0 24px;cursor:pointer;box-shadow:0 10px 22px rgba(198,0,99,.18);font-family:inherit;}",
      ".ph-target-btn:hover{transform:translateY(-1px);filter:brightness(.98);}",
      ".ph-result{margin-top:22px;}",
      ".ph-empty{background:white;border:1px solid #f0c4d6;border-radius:18px;padding:18px;color:#6b4b5a;line-height:1.55;}",
      ".ph-summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-bottom:16px;}",
      ".ph-summary-card{background:white;border:1px solid #f0c4d6;border-radius:18px;padding:16px;}",
      ".ph-summary-label{font-size:12px;font-weight:900;color:#785567;margin-bottom:8px;}",
      ".ph-summary-value{font-size:22px;font-weight:950;color:#c60063;line-height:1.2;}",
      ".ph-progress-card{background:white;border:1px solid #f0c4d6;border-radius:18px;padding:18px;margin-bottom:18px;}",
      ".ph-progress-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:11px;font-size:14px;font-weight:900;color:#351827;}",
      ".ph-progress-track{height:13px;background:#f5ddea;border-radius:999px;overflow:hidden;}",
      ".ph-progress-fill{height:100%;background:#c60063;border-radius:999px;transition:width .25s ease;}",
      ".ph-progress-note{font-size:14px;color:#6b4b5a;line-height:1.55;margin-top:11px;}",
      ".ph-actions-title{font-size:22px;font-weight:950;color:#170818;margin:24px 0 14px 0;}",
      ".ph-action-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}",
      ".ph-action-card{background:white;border:1px solid #f0c4d6;border-radius:20px;padding:18px;}",
      ".ph-action-top{display:flex;justify-content:space-between;gap:10px;margin-bottom:10px;}",
      ".ph-action-title{font-size:17px;font-weight:950;color:#2b1020;line-height:1.35;}",
      ".ph-action-save{background:#ffd8e6;color:#870043;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:950;white-space:nowrap;height:max-content;}",
      ".ph-action-desc{font-size:14px;color:#563646;line-height:1.6;margin-bottom:12px;}",
      ".ph-product-box{background:#fff7fb;border:1px dashed #efb3cb;border-radius:15px;padding:12px;font-size:13px;line-height:1.55;color:#5f3d4e;}",
      ".ph-product-box b{color:#c60063;}",
      ".ph-mini-note{margin-top:18px;background:#fff;border:1px solid #f0c4d6;border-radius:18px;padding:16px;color:#6b4b5a;line-height:1.55;font-size:14px;}",
      "@media(max-width:900px){.ph-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.ph-action-list{grid-template-columns:1fr;}.ph-target-card{grid-template-columns:1fr;}.ph-plan-title{font-size:28px;}}"
    ].join("");

    document.head.appendChild(style);
  }

  function renderShell() {
    var main = document.querySelector("main");

    if (!main || main.dataset.planPageReady === "true") {
      return;
    }

    main.dataset.planPageReady = "true";
    createStyle();
    renameMenu();

    main.innerHTML = [
      '<div class="ph-plan-page">',
      '<div class="ph-plan-hero">',
      '<div class="ph-plan-kicker">',
      '<span class="material-symbols-outlined">auto_awesome</span>',
      "<span>Gợi ý cá nhân hóa</span>",
      "</div>",
      '<div class="ph-plan-title">Kế hoạch tiết kiệm điện theo mục tiêu</div>',
      '<div class="ph-plan-sub">Nhập mức tiền điện bạn muốn đạt trong tháng này. PINKHOUSE sẽ phân tích thiết bị nào đang tốn nhiều nhất, cần giảm bao nhiêu kWh và gợi ý cách dùng thiết bị hợp lý hơn.</div>',

      '<div class="ph-target-card">',
      "<div>",
      '<label class="ph-target-label" for="phTargetCost">Bạn muốn hóa đơn tháng này khoảng bao nhiêu?</label>',
      '<div class="ph-target-input-box">',
      '<span class="material-symbols-outlined">payments</span>',
      '<input class="ph-target-input" id="phTargetCost" type="text" inputmode="numeric" placeholder="Ví dụ: 1200000">',
      '<span class="ph-target-unit">VND</span>',
      "</div>",
      "</div>",
      '<button type="button" class="ph-target-btn" id="phCreatePlanBtn">Tạo kế hoạch</button>',
      "</div>",
      "</div>",

      '<div id="phResult" class="ph-result">',
      '<div class="ph-empty">Nhập mục tiêu tiền điện rồi bấm <b>Tạo kế hoạch</b>. App sẽ tự gợi ý nên giảm thiết bị nào trước, thay vì chỉ đưa mẹo chung chung.</div>',
      "</div>",
      "</div>"
    ].join("");

    bindEvents();
    loadDefaultPlan();
  }

  function renderPlan(plan) {
    var result = document.getElementById("phResult");

    if (!result) {
      return;
    }

    var actions = Array.isArray(plan.actions) ? plan.actions : [];
    var progress = Math.max(0, Math.min(100, Number(plan.progress || 0)));

    var html = "";

    html += '<div class="ph-summary-grid">';
    html += '<div class="ph-summary-card"><div class="ph-summary-label">Dự kiến hiện tại</div><div class="ph-summary-value">' + formatVnd(plan.currentCost) + "</div></div>";
    html += '<div class="ph-summary-card"><div class="ph-summary-label">Mục tiêu của bạn</div><div class="ph-summary-value">' + formatVnd(plan.targetCost) + "</div></div>";
    html += '<div class="ph-summary-card"><div class="ph-summary-label">Cần tiết kiệm</div><div class="ph-summary-value">' + formatVnd(plan.needSave) + "</div></div>";
    html += '<div class="ph-summary-card"><div class="ph-summary-label">Cần giảm khoảng</div><div class="ph-summary-value">' + Math.round(Number(plan.needKwh || 0)) + " kWh</div></div>";
    html += "</div>";

    html += '<div class="ph-progress-card">';
    html += '<div class="ph-progress-top">';
    html += "<span>" + (plan.status || "Đang tạo kế hoạch") + "</span>";
    html += "<span>" + progress + "% mục tiêu</span>";
    html += "</div>";
    html += '<div class="ph-progress-track"><div class="ph-progress-fill" style="width:' + progress + '%"></div></div>';
    html += '<div class="ph-progress-note">Nếu làm theo kế hoạch này, hóa đơn có thể còn khoảng <b>' + formatVnd(plan.expectedCost) + "</b>.</div>";
    html += "</div>";

    html += '<div class="ph-actions-title">Gợi ý ưu tiên theo thói quen sử dụng</div>';

    if (!actions.length) {
      html += '<div class="ph-empty">Chưa có đủ dữ liệu thiết bị để tạo kế hoạch. Quay lại mục nhập dữ liệu và kiểm tra số lượng, giờ dùng mỗi ngày nha.</div>';
      result.innerHTML = html;
      return;
    }

    html += '<div class="ph-action-list">';

    actions.forEach(function (action) {
      html += '<div class="ph-action-card">';
      html += '<div class="ph-action-top">';
      html += '<div class="ph-action-title">' + action.title + "</div>";
      html += '<div class="ph-action-save">-' + formatVnd(action.estimatedSaving) + "</div>";
      html += "</div>";
      html += '<div class="ph-action-desc">' + action.description + "</div>";
      html += '<div class="ph-product-box"><b>Gợi ý thiết bị/thói quen:</b> ' + action.productSuggestion + "</div>";
      html += "</div>";
    });

    html += "</div>";
    html += '<div class="ph-mini-note">Các gợi ý này được tạo dựa trên thiết bị, số lượng, giờ dùng mỗi ngày, đơn giá điện và mục tiêu chi phí bạn nhập. Sau này có thể nâng cấp thêm phần học từ lịch sử từng tháng.</div>';

    result.innerHTML = html;
  }

  function loadPlan(targetCost) {
    var result = document.getElementById("phResult");

    if (result) {
      result.innerHTML = '<div class="ph-empty">Đang phân tích dữ liệu sử dụng điện của bạn...</div>';
    }

    fetch("/api/savings-plan?targetCost=" + encodeURIComponent(targetCost))
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then(renderPlan)
      .catch(function () {
        if (result) {
          result.innerHTML = '<div class="ph-empty">Không tải được kế hoạch tiết kiệm. Kiểm tra API <b>/api/savings-plan</b> hoặc server nha.</div>';
        }
      });
  }

  function loadDefaultPlan() {
    fetch("/api/savings-plan")
      .then(function (response) {
        return response.json();
      })
      .then(function (plan) {
        var input = document.getElementById("phTargetCost");

        if (input) {
          input.value = new Intl.NumberFormat("vi-VN").format(plan.targetCost || 0);
        }

        renderPlan(plan);
      })
      .catch(function () {});
  }

  function bindEvents() {
    var input = document.getElementById("phTargetCost");
    var button = document.getElementById("phCreatePlanBtn");

    if (!input || !button) {
      return;
    }

    input.addEventListener("input", function () {
      var raw = onlyNumber(input.value);

      if (!raw) {
        input.value = "";
        return;
      }

      input.value = new Intl.NumberFormat("vi-VN").format(raw);
    });

    button.addEventListener("click", function () {
      var value = onlyNumber(input.value);

      if (!value) {
        alert("Nhập mức tiền điện mong muốn trước nha.");
        input.focus();
        return;
      }

      loadPlan(value);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderShell, { once: true });
  } else {
    renderShell();
  }

  setTimeout(renderShell, 300);
  setTimeout(renderShell, 900);
  setTimeout(renderShell, 1500);
  setInterval(renameMenu, 500);
})();