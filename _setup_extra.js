(function () {
  var path = decodeURIComponent(window.location.pathname || "");
  var isSetupPage = true;

  var EXTRA_KEY = "pinkhouseExtraSetup";
  var DRAFT_KEY = "pinkhouseSetupDraft";

  var defaults = {
    peopleCount: 1,
    roomSize: "15-25",
    roomHeat: "normal",
    cookingFrequency: "sometimes",
    monthlyDays: 30,
    lastKwh: 0,
    lastBillCost: 0,
    billStayRatio: "full"
  };

  var options = {
    peopleCount: [
      { value: 1, icon: "person", label: "1 người" },
      { value: 2, icon: "group", label: "2 người" },
      { value: 3, icon: "groups", label: "3 người" },
      { value: 4, icon: "diversity_3", label: "4+ người" }
    ],
    roomSize: [
      { value: "under-15", icon: "crop_square", label: "Dưới 15m²" },
      { value: "15-25", icon: "select_all", label: "15 - 25m²" },
      { value: "25-40", icon: "dashboard", label: "25 - 40m²" },
      { value: "over-40", icon: "open_in_full", label: "Trên 40m²" }
    ],
    roomHeat: [
      { value: "cool", icon: "ac_unit", label: "Mát mẻ" },
      { value: "normal", icon: "wb_cloudy", label: "Bình thường" },
      { value: "hot", icon: "sunny", label: "Khá nóng" },
      { value: "very_hot", icon: "local_fire_department", label: "Rất nóng" }
    ],
    cookingFrequency: [
      { value: "none", icon: "no_meals", label: "Không nấu" },
      { value: "sometimes", icon: "skillet", label: "Thỉnh thoảng" },
      { value: "daily", icon: "restaurant", label: "Mỗi ngày" }
    ]
  };

  function readExtra() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(EXTRA_KEY) || "{}"));
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function saveExtra(next) {
    var data = Object.assign({}, readExtra(), next);
    localStorage.setItem(EXTRA_KEY, JSON.stringify(data));
    syncDraft(data);
    return data;
  }

  function syncDraft(extraData) {
    try {
      var draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(DRAFT_KEY, JSON.stringify(Object.assign({}, draft, extraData)));
    } catch (error) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(extraData));
    }
  }

  function createStyle() {
    if (document.getElementById("pinkhouseExtraStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseExtraStyle";
    style.textContent = [
      ".pinkhouse-extra-box{margin-top:22px;border-top:1px dashed rgba(198,0,99,.22);padding-top:22px;}",
      ".pinkhouse-extra-title{display:flex;align-items:center;gap:8px;color:#2b1020;font-weight:800;font-size:18px;margin-bottom:6px;}",
      ".pinkhouse-extra-sub{color:#6f5060;font-size:14px;margin-bottom:18px;line-height:1.5;}",
      ".pinkhouse-extra-group{margin-bottom:20px;}",
      ".pinkhouse-extra-label{display:flex;align-items:center;gap:8px;color:#351827;font-weight:700;font-size:15px;margin-bottom:10px;}",
      ".pinkhouse-chip-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;}",
      ".pinkhouse-chip{border:1px solid #efb3cb;background:rgba(255,255,255,.58);border-radius:16px;min-height:78px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#4d2638;cursor:pointer;transition:all .2s ease;user-select:none;font-family:inherit;}",
      ".pinkhouse-chip:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(198,0,99,.08);border-color:#db6c9e;background:#fff7fb;}",
      ".pinkhouse-chip.is-active{background:#ffd8e6;border-color:#d6006d;color:#870043;box-shadow:0 8px 20px rgba(214,0,109,.12);}",
      ".pinkhouse-chip .material-symbols-outlined{font-size:25px;}",
      ".pinkhouse-chip span:last-child{font-size:13px;font-weight:700;text-align:center;}",
      ".pinkhouse-day-box{display:flex;align-items:center;justify-content:center;gap:10px;background:#fff7fb;border:1px solid #efb3cb;border-radius:16px;padding:14px 16px;}",
      ".pinkhouse-day-box:focus-within{border-color:#d6006d;box-shadow:0 0 0 3px rgba(214,0,109,.1);}",
      ".pinkhouse-day-box input{width:78px;text-align:center;border:none;background:transparent;outline:none;font-size:20px;font-weight:800;color:#3c1728;font-family:inherit;}",
      ".pinkhouse-day-box span{font-size:18px;font-weight:800;color:#3c1728;}",
      ".pinkhouse-bill-box{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:12px;}",
      ".pinkhouse-bill-field label{display:block;font-size:13px;font-weight:800;color:#5c3147;margin-bottom:8px;}",
      ".pinkhouse-bill-input-wrap{display:flex;align-items:center;gap:8px;background:#fff7fb;border:1px solid #efb3cb;border-radius:16px;padding:12px 14px;}",
      ".pinkhouse-bill-input-wrap:focus-within{border-color:#d6006d;box-shadow:0 0 0 3px rgba(214,0,109,.1);}",
      ".pinkhouse-bill-input-wrap input{width:100%;border:none;background:transparent;outline:none;font-size:18px;font-weight:850;color:#3c1728;font-family:inherit;}",
      ".pinkhouse-bill-input-wrap span{font-size:13px;font-weight:900;color:#785567;white-space:nowrap;}",
      "@media(max-width:720px){.pinkhouse-bill-box{grid-template-columns:1fr;}}",
      ".pinkhouse-day-note{font-size:13px;color:#785567;margin-top:8px;line-height:1.5;}",
      "@media(max-width:720px){.pinkhouse-chip-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}"
    ].join("");

    document.head.appendChild(style);
  }

  function createChipGroup(field, title, iconName, list) {
    var state = readExtra();

    var wrapper = document.createElement("div");
    wrapper.className = "pinkhouse-extra-group";

    var html = "";
    html += '<div class="pinkhouse-extra-label">';
    html += '<span class="material-symbols-outlined">' + iconName + "</span>";
    html += "<span>" + title + "</span>";
    html += "</div>";
    html += '<div class="pinkhouse-chip-grid">';

    list.forEach(function (item) {
      var active = String(state[field]) === String(item.value) ? " is-active" : "";

      html += '<button type="button" class="pinkhouse-chip' + active + '" data-extra-field="' + field + '" data-extra-value="' + item.value + '">';
      html += '<span class="material-symbols-outlined">' + item.icon + "</span>";
      html += "<span>" + item.label + "</span>";
      html += "</button>";
    });

    html += "</div>";
    wrapper.innerHTML = html;

    return wrapper;
  }
function createBillCalibration() {
  var state = readExtra();

  var wrapper = document.createElement("div");
  wrapper.className = "pinkhouse-extra-group";

  wrapper.innerHTML = [
    '<div class="pinkhouse-extra-label">',
    '<span class="material-symbols-outlined">receipt_long</span>',
    '<span>Dữ liệu bill điện gần nhất</span>',
    "</div>",

    '<div class="pinkhouse-bill-box">',
    '<div class="pinkhouse-bill-field">',
    '<label>Số kWh tháng gần nhất</label>',
    '<div class="pinkhouse-bill-input-wrap">',
    '<input id="pinkhouseLastKwhInput" type="number" min="0" step="1" value="' + (state.lastKwh || "") + '" placeholder="Ví dụ: 190">',
    '<span>kWh</span>',
    "</div>",
    "</div>",

    '<div class="pinkhouse-bill-field">',
    '<label>Tiền điện tháng gần nhất</label>',
    '<div class="pinkhouse-bill-input-wrap">',
    '<input id="pinkhouseLastBillInput" type="number" min="0" step="1000" value="' + (state.lastBillCost || "") + '" placeholder="Ví dụ: 836000">',
    '<span>đ</span>',
    "</div>",
    "</div>",
    "</div>",

    '<div class="pinkhouse-extra-label" style="margin-top:14px;">',
    '<span class="material-symbols-outlined">event_available</span>',
    '<span>Tháng đó bạn ở phòng khoảng bao lâu?</span>',
    "</div>",

    '<div class="pinkhouse-chip-grid">',
    '<button type="button" class="pinkhouse-chip' + (state.billStayRatio === "full" ? " is-active" : "") + '" data-extra-field="billStayRatio" data-extra-value="full"><span class="material-symbols-outlined">calendar_month</span><span>Đủ tháng</span></button>',
    '<button type="button" class="pinkhouse-chip' + (state.billStayRatio === "three_weeks" ? " is-active" : "") + '" data-extra-field="billStayRatio" data-extra-value="three_weeks"><span class="material-symbols-outlined">date_range</span><span>Khoảng 3 tuần</span></button>',
    '<button type="button" class="pinkhouse-chip' + (state.billStayRatio === "two_weeks" ? " is-active" : "") + '" data-extra-field="billStayRatio" data-extra-value="two_weeks"><span class="material-symbols-outlined">view_week</span><span>Khoảng 2 tuần</span></button>',
    '<button type="button" class="pinkhouse-chip' + (state.billStayRatio === "one_week" ? " is-active" : "") + '" data-extra-field="billStayRatio" data-extra-value="one_week"><span class="material-symbols-outlined">today</span><span>Khoảng 1 tuần</span></button>',
    "</div>",

    '<div class="pinkhouse-day-note">Nếu có số kWh từ bill thật, app sẽ dùng nó làm mốc chính để dự đoán sát hơn.</div>'
  ].join("");

  return wrapper;
}
  function createMonthlyDays() {
    var state = readExtra();
    var days = Math.max(1, Math.min(31, Number(state.monthlyDays || 30)));

    var wrapper = document.createElement("div");
    wrapper.className = "pinkhouse-extra-group";

    wrapper.innerHTML = [
      '<div class="pinkhouse-extra-label">',
      '<span class="material-symbols-outlined">calendar_month</span>',
      '<span>Số ngày sử dụng điện trong tháng</span>',
      "</div>",
      '<div class="pinkhouse-day-box">',
      '<input id="pinkhouseMonthlyDaysInput" type="number" min="1" max="31" value="' + days + '" placeholder="30">',
      "<span>ngày</span>",
      "</div>",
      '<div class="pinkhouse-day-note">Mặc định là 30 ngày. Nếu tháng đó bạn về quê hoặc mới dọn vào thì chỉnh lại cho sát hơn nha.</div>'
    ].join("");

    return wrapper;
  }

  function findFirstSection() {
    var sections = document.querySelectorAll("main section");
    return sections[0] || null;
  }

  function renderExtraUI() {
    if (document.getElementById("pinkhouseExtraBox")) {
      return;
    }

    var firstSection = findFirstSection();

    if (!firstSection) {
      return;
    }

    createStyle();

    var box = document.createElement("div");
    box.id = "pinkhouseExtraBox";
    box.className = "pinkhouse-extra-box";

    var intro = document.createElement("div");
    intro.innerHTML = [
      '<div class="pinkhouse-extra-title">',
      '<span class="material-symbols-outlined">auto_awesome</span>',
      "<span>Thông tin thêm để dự đoán xịn hơn</span>",
      "</div>",
      '<div class="pinkhouse-extra-sub">Chọn vài thông tin nhỏ thôi, PINKHOUSE sẽ ước tính tiền điện dễ thương mà sát thực tế hơn.</div>'
    ].join("");

    box.appendChild(intro);
    box.appendChild(createChipGroup("peopleCount", "Nhà mình có mấy người?", "group", options.peopleCount));
    box.appendChild(createChipGroup("roomSize", "Diện tích phòng / căn hộ", "square_foot", options.roomSize));
    box.appendChild(createChipGroup("roomHeat", "Phòng của bạn có nóng không?", "device_thermostat", options.roomHeat));
    box.appendChild(createChipGroup("cookingFrequency", "Bạn có hay nấu ăn không?", "cooking", options.cookingFrequency));
    box.appendChild(createBillCalibration());
    box.appendChild(createMonthlyDays());

    firstSection.appendChild(box);
    bindActions();
  }

  function bindActions() {
    document.querySelectorAll("[data-extra-field]").forEach(function (button) {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";

      button.addEventListener("click", function () {
        var field = button.getAttribute("data-extra-field");
        var value = button.getAttribute("data-extra-value");

        if (field === "peopleCount") {
          value = Number(value);
        }

        var next = {};
        next[field] = value;
        saveExtra(next);

        document.querySelectorAll('[data-extra-field="' + field + '"]').forEach(function (item) {
          item.classList.remove("is-active");
        });

        button.classList.add("is-active");
      });
    });

    var dayInput = document.getElementById("pinkhouseMonthlyDaysInput");

    if (dayInput && dayInput.dataset.bound !== "true") {
      dayInput.dataset.bound = "true";

      dayInput.addEventListener("input", function () {
        var value = Number(dayInput.value);

        if (!value) {
          return;
        }

        value = Math.max(1, Math.min(31, value));

        saveExtra({
          monthlyDays: value
        });
      });

      dayInput.addEventListener("blur", function () {
        var value = Number(dayInput.value || 30);

        value = Math.max(1, Math.min(31, value));
        dayInput.value = value;

        saveExtra({
          monthlyDays: value
        });
      });
    }
    var lastKwhInput = document.getElementById("pinkhouseLastKwhInput");
var lastBillInput = document.getElementById("pinkhouseLastBillInput");

if (lastKwhInput && lastKwhInput.dataset.bound !== "true") {
  lastKwhInput.dataset.bound = "true";

  lastKwhInput.addEventListener("input", function () {
    saveExtra({
      lastKwh: Math.max(0, Number(lastKwhInput.value || 0))
    });
  });

  lastKwhInput.addEventListener("blur", function () {
    var value = Math.max(0, Number(lastKwhInput.value || 0));
    lastKwhInput.value = value || "";
    saveExtra({
      lastKwh: value
    });
  });
}

if (lastBillInput && lastBillInput.dataset.bound !== "true") {
  lastBillInput.dataset.bound = "true";

  lastBillInput.addEventListener("input", function () {
    saveExtra({
      lastBillCost: Math.max(0, Number(lastBillInput.value || 0))
    });
  });

  lastBillInput.addEventListener("blur", function () {
    var value = Math.max(0, Number(lastBillInput.value || 0));
    lastBillInput.value = value || "";
    saveExtra({
      lastBillCost: value
    });
  });
}
  }

  function patchFetch() {
    if (window.__pinkhouseExtraFetchPatched) {
      return;
    }

    window.__pinkhouseExtraFetchPatched = true;

    var originalFetch = window.fetch;

    window.fetch = function (input, init) {
      var url = typeof input === "string" ? input : input && input.url;
      var method = init && init.method ? String(init.method).toUpperCase() : "GET";

      if (url && url.indexOf("/api/setup") !== -1 && method === "POST" && init && init.body) {
        try {
          var body = JSON.parse(init.body);
          var extra = readExtra();

          init = Object.assign({}, init, {
            body: JSON.stringify(Object.assign({}, body, extra))
          });
        } catch (error) {}
      }

      return originalFetch.call(this, input, init);
    };
  }

  function boot() {
    saveExtra(readExtra());
    patchFetch();
    renderExtraUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  setTimeout(renderExtraUI, 300);
  setTimeout(renderExtraUI, 800);
  setTimeout(renderExtraUI, 1500);
  function patchDeviceNumberInputs() {
  var deviceRows = document.querySelectorAll("section:nth-of-type(2) .rounded-lg.overflow-hidden > div");

  deviceRows.forEach(function (row) {
    if (row.dataset.numberInputPatched === "true") {
      return;
    }

    row.dataset.numberInputPatched = "true";

    var counters = row.querySelectorAll(".bg-surface-container-low, .bg-surface-container, .bg-primary-container");

    counters.forEach(function (counter) {
      var buttons = counter.querySelectorAll("button");
      var valueNode = null;

      Array.prototype.slice.call(counter.children).forEach(function (child) {
        var text = (child.textContent || "").trim();
        if (/^\d+(\.\d+)?$/.test(text)) {
          valueNode = child;
        }
      });

      if (!valueNode || counter.querySelector("input.pinkhouse-device-input")) {
        return;
      }

      var currentValue = Number((valueNode.textContent || "0").trim()) || 0;
      var input = document.createElement("input");

      input.className = "pinkhouse-device-input";
      input.type = "number";
      input.min = "0";
      input.max = "24";
      input.step = "0.5";
      input.value = currentValue;

      valueNode.textContent = "";
      valueNode.appendChild(input);

      input.addEventListener("change", function () {
        var value = Number(input.value || 0);
        value = Math.max(0, Math.min(24, value));
        input.value = value;

        var plusButton = buttons[1];
        var minusButton = buttons[0];

        if (!plusButton || !minusButton) {
          return;
        }
      });
    });
  });
}

function addDeviceInputStyle() {
  if (document.getElementById("pinkhouseDeviceInputStyle")) {
    return;
  }

  var style = document.createElement("style");
  style.id = "pinkhouseDeviceInputStyle";
  style.textContent = [
    ".pinkhouse-device-input{width:42px;text-align:center;border:none;background:transparent;outline:none;font-size:16px;font-weight:800;color:#1f1630;font-family:inherit;}",
    ".pinkhouse-device-input::-webkit-outer-spin-button,.pinkhouse-device-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}",
    ".pinkhouse-device-input[type=number]{-moz-appearance:textfield;}"
  ].join("");

  document.head.appendChild(style);
}

addDeviceInputStyle();
setTimeout(patchDeviceNumberInputs, 300);
setTimeout(patchDeviceNumberInputs, 900);
setTimeout(patchDeviceNumberInputs, 1500);
function enhanceRateSection() {
  var sections = document.querySelectorAll("main section");
  var rateSection = sections[2];

  if (!rateSection || document.getElementById("pinkhouseRateExtra")) {
    return;
  }

  var rateInput = document.getElementById("rateInput") || rateSection.querySelector("input");

  var style = document.createElement("style");
  style.textContent = [
    ".pinkhouse-rate-extra{margin-top:20px;border-top:1px dashed rgba(198,0,99,.22);padding-top:18px;}",
    ".pinkhouse-rate-title{display:flex;align-items:center;gap:8px;font-weight:800;color:#351827;font-size:15px;margin-bottom:10px;}",
    ".pinkhouse-rate-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:10px;}",
    ".pinkhouse-rate-card{border:1px solid #efb3cb;background:rgba(255,255,255,.58);border-radius:16px;min-height:70px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:#4d2638;transition:all .2s ease;font-family:inherit;}",
    ".pinkhouse-rate-card:hover{transform:translateY(-2px);background:#fff7fb;border-color:#db6c9e;box-shadow:0 8px 18px rgba(198,0,99,.08);}",
    ".pinkhouse-rate-card.is-active{background:#ffd8e6;border-color:#d6006d;color:#870043;box-shadow:0 8px 20px rgba(214,0,109,.12);}",
    ".pinkhouse-rate-card .material-symbols-outlined{font-size:24px;}",
    ".pinkhouse-rate-card span:last-child{font-size:13px;font-weight:700;text-align:center;}",
    ".pinkhouse-rate-note{font-size:13px;color:#785567;line-height:1.5;margin-top:8px;}",
    "@media(max-width:720px){.pinkhouse-rate-grid{grid-template-columns:1fr;}}"
  ].join("");
  document.head.appendChild(style);

  var box = document.createElement("div");
  box.id = "pinkhouseRateExtra";
  box.className = "pinkhouse-rate-extra";

  box.innerHTML = [
    '<div class="pinkhouse-rate-title">',
    '<span class="material-symbols-outlined">payments</span>',
    "<span>Bạn trả tiền điện theo kiểu nào?</span>",
    "</div>",

    '<div class="pinkhouse-rate-grid">',
    '<button type="button" class="pinkhouse-rate-card is-active" data-rate-method="fixed">',
    '<span class="material-symbols-outlined">home_work</span>',
    "<span>Chủ trọ tính giá cố định</span>",
    "</button>",

    '<button type="button" class="pinkhouse-rate-card" data-rate-method="state">',
    '<span class="material-symbols-outlined">receipt_long</span>',
    "<span>Theo giá nhà nước</span>",
    "</button>",

    '<button type="button" class="pinkhouse-rate-card" data-rate-method="unknown">',
    '<span class="material-symbols-outlined">help</span>',
    "<span>Không biết / dùng mặc định</span>",
    "</button>",
    "</div>",

    '<div class="pinkhouse-rate-note">',
    "Bạn có thể chọn nhanh 3.500đ hoặc 4.000đ ở phía trên, hoặc nhập giá chủ trọ đang thu vào ô giá tùy chỉnh.",
    "</div>"
  ].join("");

  rateSection.appendChild(box);

  box.querySelectorAll("[data-rate-method]").forEach(function (button) {
    button.addEventListener("click", function () {
      box.querySelectorAll("[data-rate-method]").forEach(function (item) {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");

      var method = button.getAttribute("data-rate-method");

      if (method === "unknown" && rateInput) {
        rateInput.value = 4000;
        rateInput.dispatchEvent(new Event("input", { bubbles: true }));
        rateInput.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (method === "state" && rateInput) {
        rateInput.value = 3500;
        rateInput.dispatchEvent(new Event("input", { bubbles: true }));
        rateInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
}


setTimeout(enhanceRateSection, 300);
setTimeout(enhanceRateSection, 800);
setTimeout(enhanceRateSection, 1500);
})();