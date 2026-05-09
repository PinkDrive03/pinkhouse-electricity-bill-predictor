(function () {
  const tokenMap = [
    ['CÃ´ng', 'Công'], ['Dá»±', 'Dự'], ['Ä‘oán', 'đoán'], ['Ä‘oÃ¡n', 'đoán'],
    ['Bảng Ä‘iá»u khiá»ƒn', 'Bảng điều khiển'], ['Mẹo tiáº¿t kiá»‡m', 'Mẹo tiết kiệm'],
    ['Lá»‹ch sá»­', 'Lịch sử'], ['Trung tÃ¢m', 'Trung tâm'], ['Dá»± Ä‘oán', 'Dự đoán'],
    ['Quản lý Ä‘iá»‡n nÄƒng', 'Quản lý điện năng'], ['Tá»•ng quan', 'Tổng quan'],
    ['Nháº­p dá»¯ liá»‡u', 'Nhập dữ liệu'], ['Dá»± báo', 'Dự báo'], ['Dá»± báº£o', 'Dự báo'],
    ['Dá»± Ä‘oán chi phí', 'Dự đoán chi phí'], ['Mẹo nÄƒng lÆ°á»£ng', 'Mẹo năng lượng'],
    ['Nhà của tÃ´i', 'Nhà của tôi'], ['Há»— trá»£', 'Hỗ trợ'], ['ÄÄƒng xuáº¥t', 'Đăng xuất'],
    ['Báº£ng Ä‘iá»u khiá»ƒn Äiá»‡n nÄƒng', 'Bảng điều khiển Điện năng'],
    ['Chi phí hàng tháng dá»± kiáº¿n', 'Chi phí hàng tháng dự kiến'],
    ['so vá»›i tháng trÆ°á»›c', 'so với tháng trước'], ['Æ¯á»›c tính', 'Ước tính'],
    ['dá»±a trÃªn', 'dựa trên'], ['TiÃªu thụ theo thiáº¿t bá»‹', 'Tiêu thụ theo thiết bị'],
    ['ThÃ¡ng này', 'Tháng này'], ['Máy Ä‘iá»u hòa', 'Điều hòa'], ['Tá»§ lạnh', 'Tủ lạnh'],
    ['Mẹo tiáº¿t kiá»‡m Ä‘iá»‡n', 'Mẹo tiết kiệm điện'],
    ['Dá»±a trÃªn dá»¯ liá»‡u của bạn', 'Dựa trên dữ liệu của bạn'],
    ['Äiá»u khoản dá»‹ch vụ', 'Điều khoản dịch vụ'], ['Chính sách bảo máº­t', 'Chính sách bảo mật'],
    ['LiÃªn há»‡ há»— trá»£', 'Liên hệ hỗ trợ'], ['Bảo lÆ°u mọi quyá»n', 'Bảo lưu mọi quyền'],
    ['Â©', '©'], ['Ã¢\'Â«', '₫'], ['Ã„\'', '₫'],
    ['Há»§y', 'Hủy'], ['Thiáº¿t láº­p dá»¯ liá»‡u', 'Thiết lập dữ liệu'],
    ['ThÃ´ng tin khÃ´ng gian sá»‘ng', 'Thông tin không gian sống'], ['Loại hình nhà á»Ÿ', 'Loại hình nhà ở'],
    ['Chung cÆ°', 'Chung cư'], ['CÄƒn há»™ mini', 'Căn hộ mini'], ['Nhà nguyÃªn cÄƒn', 'Nhà nguyên căn'],
    ['á»Ÿ nhà khÃ´ng', 'ở nhà không'], ['ThÆ°á»ng xuyÃªn', 'Thường xuyên'], ['Äi làm ban ngày', 'Đi làm ban ngày'],
    ['Thiáº¿t bá»‹ tiÃªu thụ Ä‘iá»‡n', 'Thiết bị tiêu thụ điện'], ['Giá» sá»­ dụng', 'Giờ sử dụng'],
    ['CÃ´ng suáº¥t lá»›n', 'Công suất lớn'], ['Quạt Ä‘iá»‡n', 'Quạt điện'], ['Làm viá»‡c/Giải trí', 'Làm việc/Giải trí'],
    ['ThÃªm thiáº¿t bá»‹ khác', 'Thêm thiết bị khác'], ['ÄÆ¡n giá Ä‘iá»‡n nÄƒng', 'Đơn giá điện năng'],
    ['Nháº­p giá Ä‘iá»‡n', 'Nhập giá điện'], ['Giá nhà nÆ°á»›c', 'Giá nhà nước'], ['Báº­c thang', 'Bậc thang'],
    ['Giá tuỳ chá»‰nh', 'Giá tùy chỉnh'], ['Hoàn táº¥t thiáº¿t láº­p', 'Hoàn tất thiết lập'], ['Quay láº¡i', 'Quay lại'],
    ['BÆ¯á»šC', 'BƯỚC'], ['Dá»± kiáº¿n tiết kiệm', 'Dự kiến tiết kiệm'], ['Báº¯t Ä‘áº§u ngay', 'Bắt đầu ngay'],
    ['TÃ¬m hiá»ƒu thÃªm', 'Tìm hiểu thêm'], ['Tiá»‡n ích minh bạch', 'Tiện ích minh bạch'], ['dá»… dàng', 'dễ dàng'],
    ['??c t?nh d?a tr?n', 'Ước tính dựa trên'], ['Gi?m nhi?t ?? ?i?u h?a h?p l?', 'Giảm nhiệt độ điều hòa hợp lý'],
    ['T?t thi?t b? ch?', 'Tắt thiết bị chờ'], ['T?i ?u th?i gian d?ng', 'Tối ưu thời gian dùng'],
    ['??t ?i?u h?a 26-27?C ?? gi?m hao ?i?n.', 'Đặt điều hòa 26-27°C để giảm hao điện.'],
    ['R?t ngu?n khi kh?ng s? d?ng ?? ti?t ki?m.', 'Rút nguồn khi không sử dụng để tiết kiệm.'],
    ['Gi?m s? gi? thi?t b? c?ng su?t l?n trong ng?y.', 'Giảm số giờ thiết bị công suất lớn trong ngày.']
  ];

  function fixTextNode(node) {
    let t = node.nodeValue;
    if (!t || !t.trim()) return;
    for (const [bad, good] of tokenMap) {
      if (t.includes(bad)) t = t.split(bad).join(good);
    }
    node.nodeValue = t;
  }

  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(fixTextNode);
})();
