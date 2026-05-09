(function () {
  var path = decodeURIComponent(window.location.pathname || "");

  function setText(node, value) {
    if (node && node.textContent !== value) {
      node.textContent = value;
    }
  }

  function setHtml(node, value) {
    if (node && node.innerHTML !== value) {
      node.innerHTML = value;
    }
  }

  function setAttr(node, attr, value) {
    if (node && node.getAttribute(attr) !== value) {
      node.setAttribute(attr, value);
    }
  }

  function setList(selector, values) {
    var nodes = document.querySelectorAll(selector);

    values.forEach(function (value, index) {
      if (nodes[index] && nodes[index].textContent !== value) {
        nodes[index].textContent = value;
      }
    });
  }

  function setButtonHtml(node, value) {
    if (node && node.innerHTML !== value) {
      node.innerHTML = value;
    }
  }

  function scoreText(value) {
    if (!value) {
      return 0;
    }

    var matches = value.match(/[ÃÂÄÆÐáº»â‚¬â„¢â€œâ€�]|\uFFFD|\?oÃ|\?iá»|\?iệ|Dự \?|dự \?|so v\?|d\?a|d\? ki|s\? d|m\?i|v\?i/g);
    return matches ? matches.length : 0;
  }

  function decodeLatin1AsUtf8(value) {
    if (!value || typeof TextDecoder === "undefined") {
      return value;
    }

    try {
      var bytes = new Uint8Array(value.length);

      for (var i = 0; i < value.length; i += 1) {
        bytes[i] = value.charCodeAt(i) & 255;
      }

      return new TextDecoder("utf-8").decode(bytes);
    } catch (error) {
      return value;
    }
  }

  function repairText(value) {
    if (!value) {
      return value;
    }

    var best = value;
    var current = value;

    for (var i = 0; i < 3; i += 1) {
      var next = decodeLatin1AsUtf8(current);

      if (scoreText(next) < scoreText(best)) {
        best = next;
      }

      if (next === current) {
        break;
      }

      current = next;
    }

    var pairs = [
      [/Ã„'/g, "đ"],
      [/Ã¢'Â«|Ã¢â€šÂ«|â‚«/g, "đ"],
      [/Â©/g, "©"],
      [/Dự \?oán/g, "Dự đoán"],
      [/dự \?oán/gi, "dự đoán"],
      [/\?iện/g, "điện"],
      [/\?iều/g, "điều"],
      [/\?iểm/g, "điểm"],
      [/\?iện năng/g, "điện năng"],
      [/d\? kiến/gi, "dự kiến"],
      [/d\?a trên/gi, "dựa trên"],
      [/so v\?i/gi, "so với"],
      [/Ước tính d\?a trên/gi, "Ước tính dựa trên"],
      [/s\? dụng/gi, "sử dụng"],
      [/k\? thanh toán/gi, "kỳ thanh toán"],
      [/m\?i ng[àa]y/gi, "mỗi ngày"],
      [/m\?i/g, "mới"],
      [/v\?i/gi, "với"],
      [/kh\?ng/gi, "không"],
      [/th\?ng/gi, "tháng"],
      [/c\?a/gi, "của"],
      [/\?ớc tính/gi, "Ước tính"],
      [/\?ã xác minh/gi, "Đã xác minh"],
      [/\?ặt điều hòa/gi, "Đặt điều hòa"],
      [/r\?t nguồn/gi, "Rút nguồn"],
      [/t\?i ưu/gi, "tối ưu"],
      [/s\? giờ/gi, "số giờ"],
      [/c\?ng suất/gi, "công suất"]
    ];

    pairs.forEach(function (pair) {
      best = best.replace(pair[0], pair[1]);
    });

    return best.replace(/\s{2,}/g, " ");
  }

  function repairTextNodes(root) {
    var target = root || document.body;

    if (!target) {
      return;
    }

    var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    var nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      var parent = node.parentElement;

      if (!parent) {
        return;
      }

      if (parent.closest("script, style, noscript")) {
        return;
      }

      if (parent.closest(".material-symbols-outlined")) {
        return;
      }

      var current = node.nodeValue || "";
      var next = repairText(current);

      if (next !== current) {
        node.nodeValue = next;
      }
    });
  }

  function repairAttributes(root) {
    var target = root || document;
    var attrs = ["title", "placeholder", "aria-label", "alt", "data-device-name"];

    target.querySelectorAll("*").forEach(function (node) {
      attrs.forEach(function (attr) {
        if (!node.hasAttribute(attr)) {
          return;
        }

        var current = node.getAttribute(attr) || "";
        var next = repairText(current);

        if (next !== current) {
          node.setAttribute(attr, next);
        }
      });
    });
  }

  function formatVndFromText(value) {
    var digits = (String(value || "").match(/\d+/g) || []).join("");
    var amount = digits ? Number(digits) : 0;
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }

  function setSharedCopy() {
    setAttr(document.documentElement, "lang", "vi");

    setList("header nav a, nav .hidden.md\\:flex a, nav.hidden.md\\:flex a", [
      "Công cụ dự đoán",
      "Bảng điều khiển",
      "Mẹo tiết kiệm",
      "Lịch sử"
    ]);

    setList("aside nav a", [
      "Tổng quan",
      "Hồ sơ sử dụng điện",
      "Kế hoạch tiết kiệm",
      "Mẹo năng lượng",
      "Nhà của tôi"
    ]);

    setList("aside .mt-auto a", ["Hỗ trợ", "Đăng xuất"]);

    var footerLinks = document.querySelectorAll("footer a");

    if (footerLinks.length >= 3) {
      setText(footerLinks[0], "Điều khoản dịch vụ");
      setText(footerLinks[1], "Chính sách bảo mật");
      setText(footerLinks[2], "Liên hệ hỗ trợ");
    }

    var footerCopy = document.querySelector("footer .text-label-sm, footer span.font-plus-jakarta-sans");

    if (footerCopy && footerLinks.length >= 3) {
      setText(footerCopy, "© 2026 PINKHOUSE");
    }
  }

  function applyHome() {
    document.title = "PINKHOUSE - Dự đoán tiền điện dễ dàng";

    var sections = document.querySelectorAll("main section");
    var hero = sections[0];
    var features = sections[1];

    if (!hero || !features) {
      return;
    }

    setText(hero.querySelector(".text-label-md"), "Tiện ích minh bạch cho mọi nhà");
    setHtml(hero.querySelector("h1"), 'Dự đoán tiền điện <br><span class="text-primary">dễ dàng</span> cùng PINKHOUSE');

    setText(
      hero.querySelector("p.text-body-lg"),
      "Giải pháp hoàn hảo giúp người thuê nhà kiểm soát chi phí năng lượng. Nhập thông tin thiết bị, dự đoán hóa đơn tháng tới và nhận các mẹo tối ưu chi tiêu để không bao giờ bị bất ngờ bởi hóa đơn tiền điện."
    );

    var heroButtons = hero.querySelectorAll("button");
    setButtonHtml(heroButtons[0], 'Bắt đầu ngay <span class="material-symbols-outlined">arrow_forward</span>');
    setText(heroButtons[1], "Tìm hiểu thêm");

    var floatingTexts = hero.querySelectorAll(".absolute.bottom-lg p");
    setText(floatingTexts[0], "Dự kiến tiết kiệm");
    setText(floatingTexts[1], "150.000đ");

    setText(features.querySelector("h2"), "Mọi tính năng bạn cần");

    setText(
      features.querySelector("h2 + p"),
      "PINKHOUSE cung cấp các công cụ trực quan để bạn hiểu rõ và kiểm soát lượng điện năng tiêu thụ trong nhà."
    );

    var titles = features.querySelectorAll("h3.text-headline-sm");
    setText(titles[0], "Tính toán chính xác");
    setText(titles[1], "Mẹo tiết kiệm điện");
    setText(titles[2], "Theo dõi lịch sử");

    var bodies = features.querySelectorAll("p.text-body-md");

    setText(
      bodies[0],
      "Nhập công suất và thời gian sử dụng của từng thiết bị. Hệ thống sẽ ước tính mức tiêu thụ điện năng với độ chính xác cao dựa trên giá điện hiện hành."
    );

    setText(
      bodies[1],
      "Nhận các đề xuất được cá nhân hóa để cắt giảm lãng phí năng lượng. Những thay đổi nhỏ trong thói quen có thể mang lại hiệu quả lớn cho hóa đơn của bạn."
    );

    setText(
      bodies[2],
      "Lưu trữ và so sánh các dự đoán qua từng tháng. Biểu đồ trực quan giúp bạn nhận ra xu hướng sử dụng và điều chỉnh kịp thời trước khi nhận hóa đơn."
    );

    var featureCards = features.querySelectorAll(".bg-surface, .rounded-xl, .rounded-lg");

    featureCards.forEach(function (card) {
      var title = card.querySelector("h3");
      var body = card.querySelector("p");

      if (!title || !body) {
        return;
      }

      if ((title.textContent || "").trim() === "Theo dõi lịch sử") {
        setText(
          body,
          "Lưu trữ và so sánh các dự đoán qua từng tháng. Biểu đồ trực quan giúp bạn nhận ra xu hướng sử dụng và điều chỉnh kịp thời trước khi nhận hóa đơn."
        );
      }
    });
  }

  function applySetup() {
    document.title = "PINKHOUSE - Thiết lập dữ liệu";

    var sections = document.querySelectorAll("main section");
    var topButtons = document.querySelectorAll("header button, main > div > div:last-child button");

    setText(document.querySelector("header button .font-label-lg"), "Hủy");
    setText(document.querySelector("main h1"), "Thiết lập dữ liệu");

    setText(
      document.querySelector("main h1 + p"),
      "Cung cấp thông tin về không gian và thói quen sử dụng điện để nhận dự báo chính xác nhất."
    );

    var badges = document.querySelectorAll("section .absolute.top-0.left-0");
    setText(badges[0], "BƯỚC 1");
    setText(badges[1], "BƯỚC 2");
    setText(badges[2], "BƯỚC 3");

    if (sections[0]) {
      var labels = sections[0].querySelectorAll("label");

      setText(sections[0].querySelector("h2"), "Thông tin không gian sống");
      setText(sections[0].querySelector("h2 + p"), "Chọn loại hình nhà ở phù hợp với bạn.");
      setText(labels[0], "Loại hình nhà ở");

      setList("section:nth-of-type(1) .grid .font-label-md", [
        "Phòng trọ",
        "Chung cư",
        "Căn hộ mini",
        "Ký túc xá",
        "Nhà nguyên căn"
      ]);

      setText(labels[1], "Bạn có hay ở nhà không?");

      setList("section:nth-of-type(1) .sm\\:flex-row .font-label-md", [
        "Thường xuyên",
        "Đi làm ban ngày",
        "Ít khi"
      ]);
    }

    if (sections[1]) {
      setText(sections[1].querySelector("h2"), "Thiết bị tiêu thụ điện");

      setText(
        sections[1].querySelector("h2 + p"),
        "Ước tính số giờ sử dụng trung bình mỗi ngày cho các thiết bị chính."
      );

      var names = [
        "Điều hòa",
        "Tủ lạnh",
        "Quạt điện",
        "Máy tính/Laptop",
        "Đèn",
        "Máy giặt",
        "Máy sấy",
        "Bếp điện",
        "Lò vi sóng"
      ];

      var subtitles = [
        "Công suất lớn",
        "Cắm 24/24",
        "Quạt bàn/đứng",
        "Làm việc/Giải trí",
        "Bóng LED/CFL",
        "Giặt hằng ngày",
        "Sấy quần áo",
        "Nấu ăn",
        "Hâm nóng nhanh"
      ];

      var rows = sections[1].querySelectorAll(".rounded-lg.overflow-hidden > div");

      rows.forEach(function (row, index) {
        var title = row.querySelector(".font-label-lg.text-label-lg.text-on-surface");
        var subtitle = row.querySelector(".font-label-sm.text-label-sm.text-on-surface-variant");

        if (names[index]) {
          setText(title, names[index]);
          setText(subtitle, subtitles[index]);
        }
      });
    }

    if (sections[2]) {
      setText(sections[2].querySelector("h2"), "Đơn giá điện năng");

      setText(
        sections[2].querySelector("h2 + p"),
        "Nhập giá điện bạn đang phải trả để tính toán chi phí."
      );

      var chips = sections[2].querySelectorAll(".rounded-full.font-label-sm");

      if (chips.length >= 3) {
        setText(chips[0], "Giá tham khảo");
        setText(chips[1], "3.500đ / kWh");
        setText(chips[2], "4.000đ / kWh");
      }

      setText(sections[2].querySelector("label"), "Giá tùy chỉnh");
      setAttr(sections[2].querySelector("#rateInput"), "placeholder", "Nhập giá điện");
    }

    if (topButtons[1]) {
      setButtonHtml(topButtons[1], '<span class="material-symbols-outlined text-lg">arrow_back</span> Quay lại');
    }

    if (topButtons[2]) {
      setButtonHtml(topButtons[2], 'Hoàn tất thiết lập <span class="material-symbols-outlined text-lg">check_circle</span>');
    }
  }

  function applyDashboard() {
    document.title = "PINKHOUSE - Bảng điều khiển";

    setText(document.querySelector("aside h2"), "Trung tâm Dự đoán");
    setText(document.querySelector("aside p"), "Quản lý điện năng");
    setButtonHtml(document.querySelector("aside button"), '<span class="material-symbols-outlined text-[20px]">add</span> Tạo dự đoán mới');

    setText(document.querySelector("main h1"), "Bảng điều khiển Điện năng");

    setText(
      document.querySelector("main h1 + p"),
      "Tổng quan về mức tiêu thụ và chi phí dự kiến cho kỳ thanh toán hiện tại."
    );

    var titles = document.querySelectorAll("main h3");
    setText(titles[0], "Chi phí hàng tháng dự kiến");
    setText(titles[1], "Tiêu thụ theo thiết bị");
    setText(titles[2], "Mẹo tiết kiệm điện");

    var totalCost = document.querySelector("#totalCost, .font-headline-lg.text-headline-lg.text-primary.block");

    if (totalCost) {
      setText(totalCost, formatVndFromText(totalCost.textContent));
    }

    var totalKwhLabel = document.querySelector("#totalKwhLabel, .mt-lg .font-body-sm.text-body-sm.text-on-surface-variant");

    if (totalKwhLabel) {
      var kwh = ((totalKwhLabel.textContent || "").match(/\d+/g) || ["0"]).join("");
      setText(totalKwhLabel, "Ước tính dựa trên " + kwh + " kWh");
    }

    var deltaWrap = document.querySelector("#deltaPercent");

    if (deltaWrap && deltaWrap.parentElement) {
      var prefix = ((deltaWrap.textContent || "").match(/[+\-]?\d+(?:[.,]\d+)?%/) || ["+0%"]).shift();

      deltaWrap.parentElement.innerHTML =
        '<span class="material-symbols-outlined text-[14px] text-tertiary">arrow_upward</span> <span id="deltaPercent">' +
        prefix +
        "</span> so với tháng trước";
    }

    var detailLink = document.querySelector("a.font-label-md.text-label-md.text-primary");
    setText(detailLink, "Xem chi tiết");

    var monthButton = document.querySelector("button.font-label-sm.text-label-sm.text-on-surface-variant");

    if (monthButton && monthButton.querySelector(".material-symbols-outlined")) {
      monthButton.childNodes[0].nodeValue = "Tháng này ";
    }

    var breakdownNames = document.querySelectorAll("#breakdownList .w-32, .col-span-1.md\\:col-span-6.lg\\:col-span-8 .w-32.font-body-sm");

    breakdownNames.forEach(function (node) {
      var current = repairText(node.textContent || "");

      if (/máy.*điều hòa/i.test(current)) {
        current = "Điều hòa";
      }

      if (/chiếu sáng/i.test(current)) {
        current = "Đèn";
      }

      if (/tủ lạnh/i.test(current)) {
        current = "Tủ lạnh";
      }

      if (/quạt/i.test(current)) {
        current = "Quạt điện";
      }

      if (/laptop|máy tính/i.test(current)) {
        current = "Máy tính/Laptop";
      }

      setText(node, current);
    });

    var tipsList = document.querySelector("#tipsList");
    var tipsIntro = tipsList && tipsList.parentElement ? tipsList.parentElement.querySelector("p") : null;

    setText(
      tipsIntro,
      "Dựa trên dữ liệu của bạn, đây là các chiến lược cá nhân hóa để giảm hóa đơn của bạn."
    );

    var tipTitles = document.querySelectorAll("#tipsList h4, .col-span-1.md\\:col-span-12 h4.font-label-md");
    var tipBodies = document.querySelectorAll("#tipsList p, .col-span-1.md\\:col-span-12 .grid p.font-body-sm");

    var titleMap = [
      "Giảm nhiệt độ điều hòa hợp lý",
      "Bảo dưỡng tủ lạnh định kỳ",
      "Rút thiết bị khi không dùng"
    ];

    var bodyMap = [
      "Đặt điều hòa 26-27°C và dùng kèm quạt để giảm công suất tiêu thụ.",
      "Vệ sinh dàn lạnh, kiểm tra gioăng cửa giúp tủ chạy ổn định và ít hao điện hơn.",
      "Ngắt nguồn các thiết bị chờ giúp giảm điện năng nền mỗi tháng."
    ];

    tipTitles.forEach(function (node, index) {
      if (titleMap[index]) {
        setText(node, titleMap[index]);
      }
    });

    tipBodies.forEach(function (node, index) {
      if (bodyMap[index]) {
        setText(node, bodyMap[index]);
      }
    });
  }

  function applyHistory() {
    document.title = "PINKHOUSE - Lịch sử & Tiết kiệm";

    setText(document.querySelector("aside h2"), "Trung tâm Dự đoán");
    setText(document.querySelector("aside p"), "Quản lý điện năng");
    setButtonHtml(document.querySelector("aside button"), '<span class="material-symbols-outlined text-[18px]">add</span> Tạo dự đoán mới');

    setText(document.querySelector("main h1"), "Lịch sử & Tiết kiệm");

    setText(
      document.querySelector("main h1 + p"),
      "Xem lại các dự đoán năng lượng trước đây và theo dõi hiệu quả của bạn."
    );

    var topAction = document.querySelector("main section button");

    if (topAction) {
      setButtonHtml(topAction, '<span class="material-symbols-outlined text-[18px]">add_circle</span> Tạo dự đoán mới');
    }

    var summaryLabels = document.querySelectorAll(".font-label-md.text-label-md.text-on-surface-variant, .font-label-sm.text-label-sm.text-on-surface-variant.uppercase");

    summaryLabels.forEach(function (node) {
      var current = repairText(node.textContent || "");

      if (/ước tính tháng/i.test(current)) {
        setText(node, "Ước tính tháng này");
      }

      if (/tiết kiệm.*ước tính/i.test(current)) {
        setText(node, "Tiết kiệm ước tính");
      }

      if (/xu hướng 6 tháng/i.test(current)) {
        setText(node, "Xu hướng 6 tháng");
      }

      if (/dự báo/i.test(current)) {
        setText(node, "Dự báo");
      }

      if (/thực tế/i.test(current)) {
        setText(node, "Thực tế");
      }
    });

    var historyTitles = document.querySelectorAll("main h3.font-headline-sm");
    setText(historyTitles[0], "Dự đoán gần đây");
    setText(historyTitles[1], "Mẹo tiết kiệm thông minh");

    document.querySelectorAll(".font-label-sm.text-label-sm.text-on-surface-variant.block").forEach(function (node) {
      var current = repairText(node.textContent || "");

      if (/điện năng/i.test(current) || /s\? dụng/i.test(current)) {
        setText(node, "Điện năng sử dụng");
      }

      if (/chênh/i.test(current)) {
        setText(node, "Chênh lệch");
      }
    });

    document.querySelectorAll(".rounded-full.font-label-sm").forEach(function (node) {
      var current = repairText(node.textContent || "");

      if (/xác minh/i.test(current)) {
        setText(node, "Đã xác minh");
      }

      if (/hóa đơn/i.test(current)) {
        setText(node, "Chờ hóa đơn");
      }
    });

    var tipTitles = document.querySelectorAll("main h4.font-label-lg");
    setText(tipTitles[0], "Tối ưu hóa làm mát");
    setText(tipTitles[1], "Sử dụng ngoài giờ cao điểm");

    var tipBodies = document.querySelectorAll("main h4.font-label-lg + p");

    setText(
      tipBodies[0],
      "Đặt nhiệt độ cao hơn 2 độ vào ban ngày có thể tiết kiệm đến 10% chi phí làm mát trong tháng này."
    );

    setText(
      tipBodies[1],
      "Sử dụng các thiết bị nặng như máy rửa bát và máy sấy sau 8 giờ tối để tận dụng giá điện thấp ngoài giờ cao điểm."
    );
  }

  function applyLogin() {
    document.title = "PINKHOUSE - Đăng nhập";

    var footerLinks = document.querySelectorAll("footer a");

    if (footerLinks.length >= 2) {
      setText(footerLinks[0], "Quyền riêng tư");
      setText(footerLinks[1], "Điều khoản");
    }

    var footerCopy = document.querySelector("footer span");

    if (footerCopy) {
      setText(footerCopy, "© 2026 PINKHOUSE");
    }
  }

  function applyPage() {
    repairAttributes(document);
    repairTextNodes(document.body);
    setSharedCopy();

    if (path.indexOf("/dang nhap/") !== -1) {
      applyLogin();
    }

    if (path.indexOf("/trang chủ pinkhouse/") !== -1 || path.indexOf("/trang_ch_pinkhouse/") !== -1) {
      applyHome();
    }

    if (path.indexOf("/trang nhập thông tin/") !== -1 || path.indexOf("/nh_p_th_ng_tin_thi_t_b/") !== -1) {
      applySetup();
    }

    if (
      path.indexOf("/dashboard 1/") !== -1 ||
      path.indexOf("/dashboard 2/") !== -1 ||
      path.indexOf("/b_ng_i_u_khi_n_d_o_n_1/") !== -1 ||
      path.indexOf("/b_ng_i_u_khi_n_d_o_n_2/") !== -1
    ) {
      applyDashboard();
    }

    if (
      path.indexOf("/lstk 1/") !== -1 ||
      path.indexOf("/lstk 2/") !== -1 ||
      path.indexOf("/l_ch_s_ti_t_ki_m_1/") !== -1 ||
      path.indexOf("/l_ch_s_ti_t_ki_m_2/") !== -1
    ) {
      applyHistory();
    }

    repairAttributes(document);
    repairTextNodes(document.body);
  }

  var scheduled = false;

  function scheduleApply() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(function () {
      scheduled = false;
      applyPage();
    });
  }

  function boot() {
    applyPage();

    [80, 250, 600, 1200, 2000].forEach(function (delay) {
      window.setTimeout(applyPage, delay);
    });

    if (document.body) {
      var observer = new MutationObserver(function () {
        scheduleApply();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["placeholder", "title", "aria-label", "alt", "data-device-name"]
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

(function () {
  function isHistoryPage() {
    var path = decodeURIComponent(window.location.pathname || "");
    return path.indexOf("/lstk") !== -1 || path.indexOf("/l_ch_s_ti_t_ki_m") !== -1;
  }

  function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(Math.round(Number(value) || 0)) + "đ";
  }

  function createHistoryChartStyle() {
    if (document.getElementById("pinkhouseHistoryChartFixStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseHistoryChartFixStyle";
    style.textContent = [
      ".ph-history-chart-card{padding:24px!important;}",
      ".ph-history-chart-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;}",
      ".ph-history-chart-title{font-size:14px;font-weight:900;color:#4b2036;}",
      ".ph-history-chart-legend{display:flex;gap:12px;align-items:center;font-size:12px;color:#7b6170;}",
      ".ph-history-dot{width:10px;height:10px;border-radius:999px;display:inline-block;margin-right:5px;vertical-align:middle;}",
      ".ph-history-dot.forecast{background:#c60063;}",
      ".ph-history-dot.actual{background:#f6bdd5;border:1px solid #ef8fba;}",
      ".ph-history-chart-area{height:170px;border-top:1px solid #d9dcef;border-bottom:1px solid #d9dcef;background:linear-gradient(to bottom,transparent 49%,#eef0ff 50%,transparent 51%);display:flex;align-items:flex-end;justify-content:space-around;gap:12px;padding:18px 8px 0 8px;}",
      ".ph-history-bar-group{height:100%;display:flex;align-items:flex-end;justify-content:center;gap:5px;flex:1;min-width:36px;position:relative;}",
      ".ph-history-bar{width:13px;border-radius:999px 999px 0 0;transition:.2s ease;}",
      ".ph-history-bar.forecast{background:#c60063;}",
      ".ph-history-bar.actual{background:#f6bdd5;border:1px solid #ef8fba;box-sizing:border-box;}",
      ".ph-history-label-row{display:flex;justify-content:space-around;gap:12px;padding:10px 8px 0 8px;font-size:12px;color:#6f5665;}",
      ".ph-history-label{flex:1;text-align:center;min-width:36px;}",
      ".ph-history-tooltip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#21101b;color:white;border-radius:10px;padding:7px 9px;font-size:11px;line-height:1.4;white-space:nowrap;opacity:0;pointer-events:none;margin-bottom:8px;z-index:5;}",
      ".ph-history-bar-group:hover .ph-history-tooltip{opacity:1;}",
      ".ph-history-empty{height:170px;display:flex;align-items:center;justify-content:center;color:#7b6170;font-size:14px;border-top:1px solid #d9dcef;border-bottom:1px solid #d9dcef;}"
    ].join("");

    document.head.appendChild(style);
  }

  function findTrendCard() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll("main section, main div"));

    var matched = candidates.filter(function (node) {
      var text = node.textContent || "";
      var box = node.getBoundingClientRect();
      return text.indexOf("Xu hướng 6 tháng") !== -1 && box.width > 250 && box.height > 80;
    });

    matched.sort(function (a, b) {
      return (a.textContent || "").length - (b.textContent || "").length;
    });

    return matched[0] || null;
  }

  function renderFixedHistoryChart() {
    if (!isHistoryPage()) {
      return;
    }

    createHistoryChartStyle();

    fetch("/api/history?t=" + Date.now(), {
      method: "GET",
      cache: "no-store"
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var trend = Array.isArray(data.trend) ? data.trend : [];
        var card = findTrendCard();

        if (!card) {
          return;
        }

        var maxValue = Math.max.apply(
          null,
          [1].concat(
            trend.map(function (item) {
              return Math.max(Number(item.totalCost || 0), Number(item.actualCost || 0));
            })
          )
        );

        card.classList.add("ph-history-chart-card");

        if (!trend.length || maxValue <= 1) {
          card.innerHTML = [
            '<div class="ph-history-chart-head">',
            '<div class="ph-history-chart-title">Xu hướng 6 tháng</div>',
            '<div class="ph-history-chart-legend">',
            '<span><i class="ph-history-dot forecast"></i>Dự báo</span>',
            '<span><i class="ph-history-dot actual"></i>Thực tế</span>',
            "</div>",
            "</div>",
            '<div class="ph-history-empty">Chưa có đủ dữ liệu để vẽ biểu đồ.</div>'
          ].join("");
          return;
        }

        var barsHtml = "";
        var labelsHtml = "";

        trend.forEach(function (item) {
          var forecast = Number(item.totalCost || 0);
          var actual = Number(item.actualCost || 0);
          var forecastHeight = forecast > 0 ? Math.max(8, Math.round((forecast / maxValue) * 100)) : 0;
          var actualHeight = actual > 0 ? Math.max(8, Math.round((actual / maxValue) * 100)) : 0;
          var label = item.shortLabel || "T" + item.month;

          barsHtml += '<div class="ph-history-bar-group">';
          barsHtml += '<div class="ph-history-tooltip">';
          barsHtml += "<b>" + label + "</b><br>";
          barsHtml += "Dự báo: " + formatVnd(forecast) + "<br>";
          barsHtml += "Thực tế: " + (actual ? formatVnd(actual) : "Chưa có");
          barsHtml += "</div>";
          barsHtml += '<div class="ph-history-bar forecast" style="height:' + forecastHeight + '%"></div>';

          if (actual > 0) {
            barsHtml += '<div class="ph-history-bar actual" style="height:' + actualHeight + '%"></div>';
          }

          barsHtml += "</div>";
          labelsHtml += '<div class="ph-history-label">' + label + "</div>";
        });

        card.innerHTML = [
          '<div class="ph-history-chart-head">',
          '<div class="ph-history-chart-title">Xu hướng 6 tháng</div>',
          '<div class="ph-history-chart-legend">',
          '<span><i class="ph-history-dot forecast"></i>Dự báo</span>',
          '<span><i class="ph-history-dot actual"></i>Thực tế</span>',
          "</div>",
          "</div>",
          '<div class="ph-history-chart-area">',
          barsHtml,
          "</div>",
          '<div class="ph-history-label-row">',
          labelsHtml,
          "</div>"
        ].join("");
      })
      .catch(function () {});
  }

  setTimeout(renderFixedHistoryChart, 300);
  setTimeout(renderFixedHistoryChart, 900);
  setTimeout(renderFixedHistoryChart, 1600);
})();

(function () {
  function isHistoryPage() {
    var path = decodeURIComponent(window.location.pathname || "");
    return path.indexOf("/lstk") !== -1 || path.indexOf("/l_ch_s_ti_t_ki_m") !== -1;
  }

  function onlyNumber(value) {
    return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
  }

  function formatInput(input) {
    var raw = String(input.value || "").replace(/[^\d]/g, "");

    if (!raw) {
      input.value = "";
      return;
    }

    input.value = new Intl.NumberFormat("vi-VN").format(Number(raw));
  }

  function createActualBillStyle() {
    if (document.getElementById("pinkhouseActualBillStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseActualBillStyle";
    style.textContent = [
      ".ph-actual-card{border:1px solid #efb3cb;background:#fff;border-radius:20px;padding:20px;margin:22px 0 28px 0;box-shadow:0 10px 30px rgba(174,68,119,.05);}",
      ".ph-actual-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px;}",
      ".ph-actual-title{font-size:18px;font-weight:950;color:#170818;margin-bottom:5px;}",
      ".ph-actual-sub{font-size:13px;color:#6b4b5a;line-height:1.5;}",
      ".ph-actual-form{display:grid;grid-template-columns:1.1fr 1fr 1fr auto;gap:12px;align-items:end;}",
      ".ph-actual-field label{display:block;font-size:12px;font-weight:900;color:#6f4058;margin-bottom:7px;}",
      ".ph-actual-field select,.ph-actual-field input{width:100%;height:46px;border:1px solid #efb3cb;border-radius:14px;padding:0 13px;background:#fff7fb;color:#2d1020;font-weight:850;font-family:inherit;outline:none;}",
      ".ph-actual-btn{height:46px;border:none;border-radius:14px;background:#c60063;color:white;font-weight:950;padding:0 18px;cursor:pointer;font-family:inherit;box-shadow:0 10px 22px rgba(198,0,99,.16);white-space:nowrap;}",
      ".ph-actual-btn:hover{filter:brightness(.97);transform:translateY(-1px);}",
      ".ph-actual-note{margin-top:12px;font-size:13px;color:#6b4b5a;line-height:1.5;}",
      ".ph-actual-success{margin-top:12px;background:#f0fff7;border:1px solid #b7f0cf;color:#14633a;border-radius:14px;padding:11px 13px;font-size:13px;font-weight:850;display:none;}",
      ".ph-actual-error{margin-top:12px;background:#fff3f3;border:1px solid #ffc3c3;color:#8a1e1e;border-radius:14px;padding:11px 13px;font-size:13px;font-weight:850;display:none;}",
      "@media(max-width:1000px){.ph-actual-form{grid-template-columns:1fr 1fr;}.ph-actual-btn{width:100%;}}",
      "@media(max-width:650px){.ph-actual-form{grid-template-columns:1fr;}}"
    ].join("");

    document.head.appendChild(style);
  }

  function findInsertPoint() {
    var headings = Array.prototype.slice.call(document.querySelectorAll("main h2, main h3, main div"));

    for (var i = 0; i < headings.length; i += 1) {
      var text = (headings[i].textContent || "").trim();

      if (text.indexOf("Dự đoán gần đây") !== -1) {
        return headings[i];
      }
    }

    return document.querySelector("main");
  }

  function renderActualBillForm(historyData) {
    if (!isHistoryPage()) {
      return;
    }

    if (document.getElementById("phActualBillCard")) {
      return;
    }

    createActualBillStyle();

    var recent = Array.isArray(historyData.recent) ? historyData.recent : [];
    var trend = Array.isArray(historyData.trend) ? historyData.trend : [];

    var months = recent.length
      ? recent
      : trend.filter(function (item) {
          return !item.isEmpty;
        });

    if (!months.length) {
      return;
    }

    var options = months
      .map(function (item) {
        return '<option value="' + item.month + "-" + item.year + '">' + item.label + "</option>";
      })
      .join("");

    var card = document.createElement("div");
    card.id = "phActualBillCard";
    card.className = "ph-actual-card";
    card.innerHTML = [
      '<div class="ph-actual-head">',
      "<div>",
      '<div class="ph-actual-title">Cập nhật hóa đơn thực tế</div>',
      '<div class="ph-actual-sub">Nhập bill thật sau khi có hóa đơn để biểu đồ so sánh giữa dự báo và thực tế chính xác hơn.</div>',
      "</div>",
      "</div>",
      '<div class="ph-actual-form">',
      '<div class="ph-actual-field">',
      "<label>Tháng cần cập nhật</label>",
      '<select id="phActualMonth">' + options + "</select>",
      "</div>",
      '<div class="ph-actual-field">',
      "<label>Số kWh thực tế</label>",
      '<input id="phActualKwh" type="text" inputmode="numeric" placeholder="Ví dụ: 185">',
      "</div>",
      '<div class="ph-actual-field">',
      "<label>Tiền điện thực tế</label>",
      '<input id="phActualCost" type="text" inputmode="numeric" placeholder="Ví dụ: 820000">',
      "</div>",
      '<button type="button" class="ph-actual-btn" id="phSaveActualBill">Lưu hóa đơn</button>',
      "</div>",
      '<div class="ph-actual-note">Sau khi lưu, cột <b>Thực tế</b> trong biểu đồ sẽ hiện đúng theo hóa đơn bà nhập.</div>',
      '<div class="ph-actual-success" id="phActualSuccess">Đã lưu hóa đơn thực tế. Đang tải lại dữ liệu...</div>',
      '<div class="ph-actual-error" id="phActualError">Không lưu được hóa đơn. Kiểm tra server rồi thử lại nha.</div>'
    ].join("");

    var insertPoint = findInsertPoint();

    if (insertPoint && insertPoint.parentNode) {
      insertPoint.parentNode.insertBefore(card, insertPoint);
    } else if (document.querySelector("main")) {
      document.querySelector("main").appendChild(card);
    }

    bindActualBillForm();
  }

  function bindActualBillForm() {
    var monthSelect = document.getElementById("phActualMonth");
    var kwhInput = document.getElementById("phActualKwh");
    var costInput = document.getElementById("phActualCost");
    var saveButton = document.getElementById("phSaveActualBill");
    var success = document.getElementById("phActualSuccess");
    var error = document.getElementById("phActualError");

    if (!monthSelect || !kwhInput || !costInput || !saveButton) {
      return;
    }

    kwhInput.addEventListener("blur", function () {
      formatInput(kwhInput);
    });

    costInput.addEventListener("blur", function () {
      formatInput(costInput);
    });

    saveButton.addEventListener("click", function () {
      var selected = String(monthSelect.value || "").split("-");
      var month = Number(selected[0] || 0);
      var year = Number(selected[1] || 0);
      var actualKwh = onlyNumber(kwhInput.value);
      var actualCost = onlyNumber(costInput.value);

      if (!month || !year) {
        alert("Chọn tháng cần cập nhật nha.");
        return;
      }

      if (!actualKwh && !actualCost) {
        alert("Nhập ít nhất số kWh thực tế hoặc tiền điện thực tế nha.");
        return;
      }

      if (success) {
        success.style.display = "none";
      }

      if (error) {
        error.style.display = "none";
      }

      saveButton.disabled = true;
      saveButton.textContent = "Đang lưu...";

      fetch("/api/actual-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          month: month,
          year: year,
          actualKwh: actualKwh,
          actualCost: actualCost
        })
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Request failed");
          }

          return response.json();
        })
        .then(function () {
          if (success) {
            success.style.display = "block";
          }

          setTimeout(function () {
            window.location.reload();
          }, 700);
        })
        .catch(function () {
          saveButton.disabled = false;
          saveButton.textContent = "Lưu hóa đơn";

          if (error) {
            error.style.display = "block";
          }
        });
    });
  }

  function loadActualBillForm() {
    if (!isHistoryPage()) {
      return;
    }

    fetch("/api/history?t=" + Date.now(), {
      method: "GET",
      cache: "no-store"
    })
      .then(function (response) {
        return response.json();
      })
      .then(renderActualBillForm)
      .catch(function () {});
  }

  setTimeout(loadActualBillForm, 400);
  setTimeout(loadActualBillForm, 1000);
  setTimeout(loadActualBillForm, 1800);
})();

(function () {
  var LOGOUT_LOCK_KEY = "pinkhouse-force-logout-until";
  var THEME_KEY = "pinkhouse-theme";

  function getBasePath() {
    var pathname = decodeURIComponent(window.location.pathname || "");
    var marker = "/stitch_pinkhouse_bill_predictor/";
    var index = pathname.lastIndexOf(marker);
    return index === -1 ? "" : pathname.slice(0, index + marker.length - 1);
  }

  function getLoginUrl() {
    return encodeURI(getBasePath() + "/dang nhap/code.html?logout=1");
  }

  function isLoginPage() {
    var path = decodeURIComponent(window.location.pathname || "");
    return path.indexOf("/dang nhap/") !== -1;
  }

  function keepThemeOnlyWithLock() {
    var theme = "";
    var until = "";

    try {
      theme = localStorage.getItem(THEME_KEY) || "";
      until = localStorage.getItem(LOGOUT_LOCK_KEY) || "";
    } catch (error) {}

    try {
      Object.keys(localStorage).forEach(function (key) {
        var lower = key.toLowerCase();

        if (
          key !== THEME_KEY &&
          key !== LOGOUT_LOCK_KEY &&
          (lower.indexOf("auth") !== -1 ||
            lower.indexOf("login") !== -1 ||
            lower.indexOf("logged") !== -1 ||
            lower.indexOf("user") !== -1 ||
            lower.indexOf("token") !== -1 ||
            lower.indexOf("session") !== -1)
        ) {
          localStorage.removeItem(key);
        }
      });

      sessionStorage.clear();
    } catch (error) {}

    try {
      if (theme) {
        localStorage.setItem(THEME_KEY, theme);
      }

      if (until) {
        localStorage.setItem(LOGOUT_LOCK_KEY, until);
      }
    } catch (error) {}
  }

  function setLogoutLock() {
    try {
      localStorage.setItem(LOGOUT_LOCK_KEY, String(Date.now() + 18000));
    } catch (error) {}
  }

  function clearLogoutLock() {
    try {
      localStorage.removeItem(LOGOUT_LOCK_KEY);
    } catch (error) {}
  }

  function hasLogoutLock() {
    try {
      return Date.now() < Number(localStorage.getItem(LOGOUT_LOCK_KEY) || 0);
    } catch (error) {
      return false;
    }
  }

  function hardLogout() {
    setLogoutLock();
    keepThemeOnlyWithLock();
    setLogoutLock();
    window.location.replace(getLoginUrl());
  }

  window.PinkhouseHardLogout = hardLogout;

  function isLoginText(node) {
    var text = String((node && node.textContent) || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    return text.indexOf("đăng nhập") !== -1 || text.indexOf("dang nhap") !== -1 || text.indexOf("login") !== -1;
  }

  function enforceLogoutLock() {
    var query = window.location.search || "";

    if (query.indexOf("logout=1") !== -1) {
      setLogoutLock();
    }

    if (!hasLogoutLock()) {
      return;
    }

    keepThemeOnlyWithLock();
    setLogoutLock();

    if (!isLoginPage()) {
      window.location.replace(getLoginUrl());
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      var loginTarget = event.target.closest("button, a, [role='button'], input[type='submit']");

      if (isLoginPage() && loginTarget && isLoginText(loginTarget)) {
        clearLogoutLock();
        return;
      }

      var logoutTarget = event.target.closest(
        "aside a, aside button, #phCleanPopup button, #phCleanPopup a, .ph-clean-popup button, .ph-clean-popup a"
      );

      if (!logoutTarget) {
        return;
      }

      var text = String(logoutTarget.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (text === "đăng xuất" || text === "dang xuat") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        hardLogout();
      }
    },
    true
  );

  document.addEventListener(
    "submit",
    function () {
      if (isLoginPage()) {
        clearLogoutLock();
      }
    },
    true
  );

  enforceLogoutLock();
  setInterval(enforceLogoutLock, 300);
})();

(function () {
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

  function removeOldHeaderStuff() {
    [
      "pinkhouseHideOnlyBellSetting",
      "pinkhouseKeepOnlyAvatarStyle",
      "pinkhouseTopButtonStyle",
      "pinkhouseHeaderFixedStyle",
      "pinkhouseHeaderHotspotStyle",
      "pinkhouseForceHeaderStyle",
      "pinkhouseCleanHeaderStyle",
      "pinkhouseHideOriginalHeaderIconsOnly"
    ].forEach(function (id) {
      var node = document.getElementById(id);

      if (node) {
        node.remove();
      }
    });

    [
      "phTopButtons",
      "phHeaderActionBar",
      "phBellHotspot",
      "phSettingHotspot",
      "phAvatarHotspot",
      "phForceHeaderPopover",
      "phHeaderPopover",
      "phThemePopover",
      "phHeaderPop",
      "phPopup",
      "phCleanHeader",
      "phCleanPopup"
    ].forEach(function (id) {
      var node = document.getElementById(id);

      if (node) {
        node.remove();
      }
    });
  }

  function makeStyle() {
    if (document.getElementById("pinkhouseCleanHeaderStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "pinkhouseCleanHeaderStyle";
    style.textContent = [
      ".ph-clean-header{position:fixed;top:24px;right:74px;z-index:2147483647;display:flex!important;gap:10px;align-items:center;}",
      ".ph-clean-btn{width:38px;height:38px;border-radius:999px;border:1px solid #f3bdd4;background:#fff7fb;color:#c60063;display:flex!important;align-items:center;justify-content:center;cursor:pointer;font-size:18px;font-weight:900;box-shadow:0 8px 24px rgba(198,0,99,.12);pointer-events:auto!important;}",
      ".ph-clean-btn:hover{background:#ffe0ee;transform:translateY(-1px);}",
      ".ph-clean-avatar{background:linear-gradient(135deg,#c60063,#ff8dbc);color:#fff;border:none;font-size:12px;}",
      ".ph-clean-popup{position:fixed;top:72px;right:72px;z-index:2147483647;width:310px;background:#fff;border:1px solid #efb3cb;border-radius:18px;box-shadow:0 18px 45px rgba(70,20,45,.2);padding:16px;color:#2a1020;font-family:inherit;}",
      ".ph-clean-title{font-size:16px;font-weight:950;color:#c60063;margin-bottom:10px;}",
      ".ph-clean-box{padding:12px;border-radius:14px;background:#fff7fb;border:1px solid #f6d2e0;margin-bottom:10px;font-size:13px;line-height:1.5;color:#4b2639;}",
      ".ph-clean-box b{color:#2a1020;}",
      ".ph-clean-close{position:absolute;right:12px;top:10px;border:none;background:transparent;color:#8b5b70;font-size:22px;cursor:pointer;}",
      ".ph-clean-main-btn{width:100%;height:42px;border:none;border-radius:13px;background:#c60063;color:white;font-weight:950;cursor:pointer;font-family:inherit;margin-top:4px;}",
      ".ph-theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;}",
      ".ph-theme-choice{height:40px;border:1px solid #efb3cb;border-radius:12px;background:#fff7fb;color:#8a315e;font-weight:900;cursor:pointer;font-family:inherit;}",
      ".ph-theme-choice.active{background:#c60063;color:#fff;border-color:#c60063;}",
      "header [data-pinkhouse-original-hidden='true']{display:none!important;visibility:hidden!important;pointer-events:none!important;}",
      "html[data-pinkhouse-theme='dark'] body{background:#130914!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] main{background:#130914!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] header{background:#1d1020!important;border-color:#3b1d2f!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] aside{background:#201124!important;border-color:#4a2038!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] section,html[data-pinkhouse-theme='dark'] article,html[data-pinkhouse-theme='dark'] .card,html[data-pinkhouse-theme='dark'] [class*='border']{background:#211226!important;border-color:#5a2943!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] h1,html[data-pinkhouse-theme='dark'] h2,html[data-pinkhouse-theme='dark'] h3,html[data-pinkhouse-theme='dark'] p,html[data-pinkhouse-theme='dark'] a{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] input,html[data-pinkhouse-theme='dark'] select,html[data-pinkhouse-theme='dark'] textarea{background:#160b19!important;color:#fff!important;border-color:#733052!important;}",
      "html[data-pinkhouse-theme='dark'] .bg-white{background:#211226!important;}",
      "html[data-pinkhouse-theme='dark'] .text-slate-900,html[data-pinkhouse-theme='dark'] .text-gray-900,html[data-pinkhouse-theme='dark'] .text-black{color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .text-slate-500,html[data-pinkhouse-theme='dark'] .text-gray-500,html[data-pinkhouse-theme='dark'] .text-slate-600,html[data-pinkhouse-theme='dark'] .text-gray-600{color:#d8b9c8!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-clean-btn{background:#211226!important;color:#ff7ab4!important;border-color:#733052!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-clean-popup{background:#211226!important;border-color:#733052!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-clean-title{color:#ff7ab4!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-clean-box{background:#160b19!important;border-color:#733052!important;color:#f8e9f1!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-clean-box b{color:#fff!important;}",
      "html[data-pinkhouse-theme='dark'] .ph-theme-choice{background:#160b19;color:#f8e9f1;border-color:#733052;}",
      "html[data-pinkhouse-theme='dark'] .ph-theme-choice.active{background:#ff5fa2;color:white;border-color:#ff5fa2;}"
    ].join("");

    document.head.appendChild(style);
  }

  function closePopup() {
    var old = document.getElementById("phCleanPopup");

    if (old) {
      old.remove();
    }
  }

  function showPopup(title, content, buttonText, action) {
    closePopup();

    var popup = document.createElement("div");
    popup.id = "phCleanPopup";
    popup.className = "ph-clean-popup";
    popup.innerHTML = [
      '<button type="button" class="ph-clean-close">×</button>',
      '<div class="ph-clean-title">' + title + "</div>",
      content,
      buttonText ? '<button type="button" class="ph-clean-main-btn">' + buttonText + "</button>" : ""
    ].join("");

    document.body.appendChild(popup);

    popup.querySelector(".ph-clean-close").addEventListener("click", closePopup);

    var button = popup.querySelector(".ph-clean-main-btn");

    if (button && typeof action === "function") {
      button.addEventListener("click", action);
    }
  }

  function showThemePopup() {
    var current = getTheme();

    showPopup(
      "Cài đặt giao diện",
      [
        '<div class="ph-clean-box"><b>Chọn chế độ hiển thị</b><br>Đổi nhanh giữa giao diện sáng, tối hoặc tự động theo máy.</div>',
        '<div class="ph-theme-grid">',
        '<button type="button" class="ph-theme-choice" data-theme="light">Sáng</button>',
        '<button type="button" class="ph-theme-choice" data-theme="dark">Tối</button>',
        '<button type="button" class="ph-theme-choice" data-theme="auto">Tự động</button>',
        "</div>",
        '<div class="ph-clean-box" style="margin-top:10px;"><b>Reset dữ liệu</b><br>Dùng khi app bị kẹt số tiền cũ.</div>'
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

    document.querySelectorAll(".ph-theme-choice").forEach(function (button) {
      if (button.dataset.theme === current) {
        button.classList.add("active");
      }

      button.addEventListener("click", function () {
        applyTheme(button.dataset.theme);
        closePopup();
      });
    });
  }

  function hideOriginalBellSettingOnly() {
    var header = document.querySelector("header");

    if (!header) {
      return;
    }

    Array.prototype.slice.call(header.querySelectorAll("*")).forEach(function (node) {
      var text = (node.textContent || "").trim().toLowerCase();
      var isBell = text === "notifications" || text === "notifications_none" || text === "notification_important";
      var isSetting = text === "settings" || text === "settings_suggest";

      if (!isBell && !isSetting) {
        return;
      }

      var target = node.closest("button, a, [role='button']") || node;

      if (target.id === "phCleanNotify" || target.id === "phCleanSetting" || target.closest("#phCleanHeader")) {
        return;
      }

      target.setAttribute("data-pinkhouse-original-hidden", "true");
    });
  }

  function buildHeader() {
    removeOldHeaderStuff();
    makeStyle();
    applyTheme(getTheme());

    var bar = document.createElement("div");
    bar.id = "phCleanHeader";
    bar.className = "ph-clean-header";
    bar.innerHTML = [
      '<button type="button" class="ph-clean-btn" id="phCleanNotify">🔔</button>',
      '<button type="button" class="ph-clean-btn" id="phCleanSetting">⚙</button>',
      '<button type="button" class="ph-clean-btn ph-clean-avatar" id="phCleanUser">PH</button>'
    ].join("");

    document.body.appendChild(bar);

    document.getElementById("phCleanNotify").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      showPopup(
        "Thông báo",
        '<div class="ph-clean-box"><b>Chưa có thông báo mới.</b><br>App sẽ báo khi hóa đơn dự kiến tăng bất thường.</div><div class="ph-clean-box"><b>Gợi ý:</b><br>Cập nhật hóa đơn thực tế để biểu đồ chính xác hơn.</div>',
        "Xem lịch sử",
        function () {
          window.location.href = "/lstk%202/code.html";
        }
      );
    });

    document.getElementById("phCleanSetting").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showThemePopup();
    });

    document.getElementById("phCleanUser").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      showPopup(
        "Tài khoản",
        '<div class="ph-clean-box"><b>PINKHOUSE User</b><br>Đang sử dụng app quản lý điện năng.</div><div class="ph-clean-box"><b>Trang hiện tại:</b><br>' + decodeURIComponent(window.location.pathname || "") + "</div>",
        "Đăng xuất",
        function () {
          if (window.PinkhouseHardLogout) {
            window.PinkhouseHardLogout();
          }
        }
      );
    });

    hideOriginalBellSettingOnly();
  }

  document.addEventListener("click", function (event) {
    var popup = document.getElementById("phCleanPopup");
    var bar = document.getElementById("phCleanHeader");

    if (!popup) {
      return;
    }

    if (!popup.contains(event.target) && (!bar || !bar.contains(event.target))) {
      closePopup();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildHeader);
  } else {
    buildHeader();
  }

  setTimeout(buildHeader, 300);
  setTimeout(buildHeader, 900);
  setTimeout(buildHeader, 1500);
})();

(function () {
  var pickedMap = {};

  var groups = {
    housing: ["Phòng trọ", "Chung cư", "Căn hộ mini", "Ký túc xá", "Nhà nguyên căn"],
    presence: ["Thường xuyên", "Đi làm ban ngày", "Ít khi"],
    people: ["1 người", "2 người", "3 người", "4+ người"],
    area: ["Dưới 15m²", "Dưới 15m2", "15 - 25m²", "15-25m²", "15 - 25m2", "15-25m2", "25 - 40m²", "25-40m²", "25 - 40m2", "25-40m2", "Trên 40m²", "Trên 40m2"],
    heat: ["Mát mẻ", "Bình thường", "Khá nóng", "Rất nóng"],
    cooking: ["Không nấu", "Thỉnh thoảng", "Mỗi ngày"]
  };

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function normalize(value) {
    return clean(value).replace(/\s-\s/g, "-").replace(/m2/g, "m²");
  }

  function getInfo(text) {
    text = clean(text);

    var names = Object.keys(groups);

    for (var i = 0; i < names.length; i += 1) {
      var group = names[i];

      for (var j = 0; j < groups[group].length; j += 1) {
        var label = groups[group][j];

        if (text.indexOf(label) !== -1) {
          return {
            group: group,
            label: normalize(label)
          };
        }
      }
    }

    return null;
  }

  function addStyle() {
    var old = document.getElementById("pinkhouseRealPickedStyle");

    if (old) {
      old.remove();
    }

    var style = document.createElement("style");
    style.id = "pinkhouseRealPickedStyle";
    style.textContent = [
      "html[data-pinkhouse-theme='dark'] main .ph-real-picked{background:rgba(255,95,162,.30)!important;border-color:#ff8fbd!important;box-shadow:0 0 0 2px rgba(255,143,189,.50),0 0 28px rgba(255,95,162,.50)!important;filter:brightness(1.25)!important;transform:translateY(-1px)!important;}",
      "html[data-pinkhouse-theme='dark'] main .ph-real-picked *{color:#ffffff!important;fill:#ffffff!important;stroke:#ffffff!important;font-weight:900!important;}"
    ].join("");

    document.head.appendChild(style);
  }

  function looksLikeOption(node) {
    if (!node || !node.closest || !node.getBoundingClientRect) {
      return false;
    }

    if (!node.closest("main") || node.closest("#phCleanHeader, #phCleanPopup, #phActualBillCard")) {
      return false;
    }

    if (!getInfo(node.textContent || "")) {
      return false;
    }

    var rect = node.getBoundingClientRect();
    var className = String(node.className || "");

    if (rect.width < 70 || rect.height < 34 || rect.height > 130) {
      return false;
    }

    return (
      node.tagName === "BUTTON" ||
      node.tagName === "LABEL" ||
      node.getAttribute("role") === "button" ||
      node.getAttribute("role") === "radio" ||
      className.indexOf("rounded") !== -1 ||
      className.indexOf("border") !== -1 ||
      className.indexOf("cursor") !== -1
    );
  }

  function findCard(target) {
    var current = target;
    var best = null;
    var bestArea = Infinity;

    while (current && current !== document.body) {
      if (looksLikeOption(current)) {
        var rect = current.getBoundingClientRect();
        var area = rect.width * rect.height;

        if (area < bestArea) {
          best = current;
          bestArea = area;
        }
      }

      current = current.parentElement;
    }

    return best;
  }

  function clearCard(card) {
    if (!card) {
      return;
    }

    card.classList.remove("ph-real-picked");
    card.style.removeProperty("background");
    card.style.removeProperty("border-color");
    card.style.removeProperty("box-shadow");
    card.style.removeProperty("filter");
    card.style.removeProperty("transform");

    card.querySelectorAll("*").forEach(function (child) {
      child.style.removeProperty("color");
      child.style.removeProperty("fill");
      child.style.removeProperty("stroke");
      child.style.removeProperty("font-weight");
    });
  }

  function markCard(card) {
    var info = getInfo(card.textContent || "");

    if (!info) {
      return;
    }

    pickedMap[info.group] = info.label;

    document.querySelectorAll("main *").forEach(function (node) {
      var nodeInfo = getInfo(node.textContent || "");

      if (nodeInfo && nodeInfo.group === info.group && looksLikeOption(node)) {
        clearCard(node);
      }
    });

    card.classList.add("ph-real-picked");
  }

  function syncPicked() {
    document.querySelectorAll("main *").forEach(function (node) {
      if (!looksLikeOption(node)) {
        return;
      }

      var info = getInfo(node.textContent || "");

      if (info && pickedMap[info.group] === info.label) {
        node.classList.add("ph-real-picked");
      }
    });
  }

  function syncExistingSelection() {
    document.querySelectorAll("main *").forEach(function (node) {
      if (!looksLikeOption(node)) {
        return;
      }

      var cls = String(node.className || "").toLowerCase();
      var ariaPressed = node.getAttribute("aria-pressed") === "true";
      var ariaChecked = node.getAttribute("aria-checked") === "true";
      var dataSelected = node.getAttribute("data-selected") === "true";

      if (
        cls.indexOf("bg-pink") !== -1 ||
        cls.indexOf("border-pink") !== -1 ||
        cls.indexOf("bg-primary") !== -1 ||
        cls.indexOf("selected") !== -1 ||
        cls.indexOf("active") !== -1 ||
        ariaPressed ||
        ariaChecked ||
        dataSelected
      ) {
        markCard(node);
      }
    });
  }

  function bindPicked() {
    addStyle();
    syncExistingSelection();

    document.addEventListener(
      "click",
      function (event) {
        var card = findCard(event.target);

        if (!card) {
          return;
        }

        markCard(card);

        setTimeout(function () {
          markCard(card);
        }, 50);

        setTimeout(function () {
          markCard(card);
        }, 180);
      },
      true
    );

    setInterval(syncPicked, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindPicked);
  } else {
    bindPicked();
  }
})();