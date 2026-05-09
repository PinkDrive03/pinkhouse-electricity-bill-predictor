# PINKHOUSE - Ứng dụng dự đoán tiền điện

PINKHOUSE là một ứng dụng web hỗ trợ người dùng dự đoán tiền điện hằng tháng, theo dõi mức tiêu thụ điện và lập kế hoạch tiết kiệm dựa trên thói quen sinh hoạt cũng như cách sử dụng thiết bị điện trong nhà.

Ứng dụng đặc biệt phù hợp với sinh viên, người thuê trọ và các hộ gia đình nhỏ muốn chủ động kiểm soát chi phí điện thay vì chỉ biết số tiền sau khi nhận hóa đơn cuối tháng.

## Mục tiêu của dự án

Trong thực tế, nhiều người dùng điện hằng ngày nhưng không biết thiết bị nào đang tiêu tốn nhiều điện nhất hoặc hóa đơn cuối tháng có thể tăng do đâu. Vì vậy, PINKHOUSE được xây dựng nhằm giúp người dùng:

- Ước tính trước tiền điện hằng tháng
- Theo dõi mức tiêu thụ điện theo từng thiết bị
- Hiểu rõ thói quen sử dụng điện của bản thân
- Lập kế hoạch tiết kiệm điện theo mục tiêu chi phí
- So sánh hóa đơn dự đoán với hóa đơn thực tế

## Tính năng chính

- Đăng nhập và đăng ký tài khoản người dùng
- Nhập thông tin không gian sống như loại hình nhà ở, số người sử dụng, diện tích phòng, mức độ nóng của phòng và thói quen nấu ăn
- Nhập danh sách thiết bị điện trong nhà
- Điều chỉnh số lượng và thời gian sử dụng trung bình mỗi ngày của từng thiết bị
- Tính toán lượng điện tiêu thụ dự kiến theo kWh
- Dự đoán chi phí tiền điện hằng tháng
- Cho phép nhập đơn giá điện tùy chỉnh
- Hiển thị bảng điều khiển tổng quan về chi phí và điện năng tiêu thụ
- Phân tích thiết bị nào đang chiếm nhiều điện nhất
- Tạo kế hoạch tiết kiệm điện theo mục tiêu mong muốn
- Hiển thị lịch sử dự đoán qua các tháng
- Cập nhật hóa đơn thực tế để so sánh với dự báo
- Hỗ trợ giao diện sáng và tối

## Công nghệ sử dụng

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- JSON để lưu trữ dữ liệu cục bộ

## Cách hoạt động của ứng dụng

1. Người dùng đăng nhập hoặc tạo tài khoản mới.
2. Người dùng nhập thông tin về không gian sống và thói quen sinh hoạt.
3. Người dùng chọn các thiết bị điện đang sử dụng trong nhà.
4. Người dùng nhập số lượng thiết bị và thời gian sử dụng trung bình mỗi ngày.
5. Hệ thống tính toán tổng điện năng tiêu thụ dự kiến.
6. Ứng dụng dự đoán tiền điện hằng tháng dựa trên số kWh và đơn giá điện.
7. Bảng điều khiển hiển thị tổng chi phí, mức tiêu thụ và phân bổ theo thiết bị.
8. Trang kế hoạch tiết kiệm đưa ra gợi ý tối ưu chi phí.
9. Trang lịch sử cho phép theo dõi các dự đoán trước đây và cập nhật hóa đơn thực tế.

## Các màn hình chính

- Trang đăng nhập / đăng ký
- Trang chủ giới thiệu ứng dụng
- Trang thiết lập dữ liệu sử dụng điện
- Bảng điều khiển tổng quan
- Trang kế hoạch tiết kiệm
- Trang mẹo năng lượng
- Trang lịch sử và cập nhật hóa đơn thực tế
- Giao diện sáng / tối

## Đối tượng sử dụng

PINKHOUSE phù hợp với:

- Sinh viên ở trọ
- Người thuê phòng hoặc căn hộ nhỏ
- Hộ gia đình nhỏ
- Người muốn theo dõi và kiểm soát tiền điện hằng tháng
- Người muốn xây dựng thói quen sử dụng điện tiết kiệm hơn

## Cài đặt và chạy dự án

Clone repository về máy:

## Run

```bash
npm install
npm start
```

Server: `http://localhost:3000`

## Main pages

- Setup: `http://localhost:3000/nh_p_th_ng_tin_thi_t_b/code.html`
- Dashboard: `http://localhost:3000/b_ng_i_u_khi_n_d_o_n_1/code.html`

## APIs

- `GET /api/health`
- `GET /api/setup`
- `POST /api/setup`
- `GET /api/dashboard`
