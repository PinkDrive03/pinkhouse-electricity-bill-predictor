(function () {
  const path = window.location.pathname;

  // Force readable Vietnamese-capable font immediately.
  const style = document.createElement('style');
  style.textContent = `body, button, input, select, textarea, a, p, h1, h2, h3, h4, h5, h6, span, div { font-family: "Times New Roman", Times, serif !important; }`;
  document.head.appendChild(style);

  function setTexts(items) {
    items.forEach(([selector, text]) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = text;
    });
  }

  // Common top nav (desktop)
  setTexts([
    ['a:nth-of-type(1)', 'Công cụ dự đoán'],
    ['a:nth-of-type(2)', 'Bảng điều khiển'],
    ['a:nth-of-type(3)', 'Mẹo tiết kiệm'],
    ['a:nth-of-type(4)', 'Lịch sử']
  ]);

  if (path.includes('/trang_ch_pinkhouse/')) {
    setTexts([
      ['title', 'PINKHOUSE - Dự đoán tiền điện dễ dàng'],
      ['main h1', 'Dự đoán tiền điện dễ dàng cùng PINKHOUSE'],
      ['main p.text-body-lg', 'Giải pháp hoàn hảo giúp người thuê nhà kiểm soát chi phí năng lượng. Nhập thông tin thiết bị, dự đoán hóa đơn tháng tới và nhận các mẹo tối ưu chi tiêu để không bao giờ bị bất ngờ bởi hóa đơn tiền điện.'],
      ['main button', 'Bắt đầu ngay']
    ]);
    const btns = document.querySelectorAll('main button');
    if (btns[1]) btns[1].textContent = 'Tìm hiểu thêm';
    const badge = document.querySelector('main .text-label-md');
    if (badge) badge.textContent = 'Tiện ích minh bạch cho mọi nhà';
  }

  if (path.includes('/nh_p_th_ng_tin_thi_t_b/')) {
    setTexts([
      ['main h1', 'Thiết lập dữ liệu'],
      ['main p.text-body-md', 'Cung cấp thông tin về không gian và thói quen sử dụng điện để nhận dự báo chính xác nhất.'],
      ['section:nth-of-type(1) h2', 'Thông tin không gian sống'],
      ['section:nth-of-type(2) h2', 'Thiết bị tiêu thụ điện'],
      ['section:nth-of-type(3) h2', 'Đơn giá điện năng'],
      ['#saveSetupBtn', 'Hoàn tất thiết lập']
    ]);
  }

  if (path.includes('/b_ng_i_u_khi_n_d_o_n_1/') || path.includes('/b_ng_i_u_khi_n_d_o_n_2/')) {
    setTexts([
      ['main h1', 'Bảng điều khiển Điện năng'],
      ['main header p', 'Tổng quan về mức tiêu thụ và chi phí dự kiến cho kỳ thanh toán hiện tại.']
    ]);
  }

  if (path.includes('/l_ch_s_ti_t_ki_m_1/') || path.includes('/l_ch_s_ti_t_ki_m_2/')) {
    setTexts([
      ['main h1', 'Lịch sử & Tiết kiệm'],
      ['main section p', 'Xem lại các dự đoán năng lượng trước đây và theo dõi hiệu quả của bạn.']
    ]);
  }

  // Currency cleanup
  document.querySelectorAll('*').forEach((el) => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      let t = el.textContent;
      if (!t) return;
      t = t.replace(/Ã„'|Ã¢'Â«|â‚«/g, '₫');
      t = t.replace(/Â©/g, '©');
      el.textContent = t;
    }
  });
})();
