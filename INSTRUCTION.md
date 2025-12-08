# Hướng dẫn Cài đặt và Chạy Dự án TicketML Frontend

## Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [Yarn](https://yarnpkg.com/)

## Cài đặt dependencies

Chạy lệnh sau để cài đặt tất cả các package cần thiết cho dự án:

```bash
yarn install
```

## Thiết lập biến môi trường

Trong dự án này, chúng tôi đã chuẩn bị sẵn file `.env` ở thư mục gốc. Vui lòng **giữ nguyên và sử dụng** các biến sau:

```
VITE_APP_PRODUCTION = false
VITE_APP_BE_URL = https://api.ticketml.dpdns.org
```

Không cần thêm hoặc sửa đổi các biến khác để chạy dự án.

## Chạy dự án ở chế độ development

Sau khi cài đặt xong, chạy lệnh sau để khởi động server development:

```bash
yarn dev
```

Dự án sẽ chạy trên `http://localhost:3000`.

## ⚠️ Lưu ý quan trọng về Đăng nhập trên Local

Do backend sử dụng Google OAuth2, tính năng đăng nhập bằng Google sẽ **không hoạt động** khi chạy trên `localhost`. Google chỉ cho phép redirect về các domain đã được đăng ký.

### Cách đăng nhập trên môi trường local

Để đăng nhập và sử dụng các tính năng cần xác thực trên local, thực hiện các bước sau:

1.  Truy cập trang production: [https://ticketml.dpdns.org](https://ticketml.dpdns.org)
2.  Đăng nhập bằng Google trên trang đó.
3.  Mở Developer Tools (nhấn `F12` hoặc `Ctrl+Shift+I`).
4.  Vào tab **Application** (hoặc **Storage** trên Firefox).
5.  Trong **Local Storage** của `https://ticketml.dpdns.org`, sao chép giá trị `access_token`.
6.  Mở `http://localhost:3000`, vào **Local Storage** và thêm item:
    - **Key**: `access_token`
    - **Value**: dán giá trị vừa sao chép
7.  Tải lại trang. Bạn sẽ đăng nhập thành công trên local.
