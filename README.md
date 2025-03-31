![database-diagram](https://github.com/user-attachments/assets/f273f5b3-115d-4ba7-8ba1-c804d0430abf)
# TanStream Project

## Giới thiệu
TanStream là một nền tảng streaming cho phép người dùng phát trực tiếp, tương tác với khán giả, quản lý thông báo, thanh toán và đăng ký gói tài trợ.

## Cấu trúc Database
Dưới đây là sơ đồ cấu trúc database của dự án:

![Database Diagram](database-diagram.png)

### Các bảng chính:
- **User**: Quản lý thông tin người dùng.
- **Stream**: Lưu trữ thông tin về các buổi phát trực tiếp.
- **ChatMessage**: Chứa tin nhắn được gửi trong các buổi stream.
- **Notification**: Quản lý thông báo gửi đến người dùng.
- **Transaction**: Lưu thông tin thanh toán và giao dịch.
- **Token**: Quản lý token xác thực.
- **Category**: Phân loại nội dung stream.
- **SponsorshipPlan**: Các gói tài trợ có sẵn cho kênh.
- **SponsorshipSubscription**: Đăng ký tài trợ của người dùng.
- **SocialLink**: Liên kết mạng xã hội của người dùng.
- **Follow**: Quản lý quan hệ theo dõi giữa người dùng.
- **NotificationSettings**: Cài đặt thông báo cho từng người dùng.

## Cách pull Docker images
Để chạy backend và frontend của dự án, bạn cần pull các Docker images từ Docker Hub:

```sh
# Pull backend image
docker pull maitanchan/tanstream-backend:latest

# Pull frontend image
docker pull maitanchan/tanstream-frontend:latest
```

Sau khi pull xong, bạn có thể chạy container từ image này bằng lệnh:

```sh
# Chạy backend
docker run -d -p 8000:8000 --name tanstream-backend maitanchan/tanstream-backend:latest

# Chạy frontend
docker run -d -p 3000:3000 --name tanstream-frontend maitanchan/tanstream-frontend:latest
```

## Hướng dẫn khởi chạy dự án
(Phần này có thể bổ sung thêm hướng dẫn về môi trường phát triển, cách chạy bằng Docker Compose, cài đặt database, v.v.)

---
**Ghi chú:**
- Nếu có bất kỳ vấn đề gì khi chạy dự án, vui lòng kiểm tra logs của container bằng:
```sh
docker logs tanstream-backend
docker logs tanstream-frontend
```
- Backend sử dụng Telegram API, tuy nhiên, Telegram API hiện bị chặn IP tại Việt Nam. Nếu bạn đang triển khai dự án ở Việt Nam, hãy cân nhắc sử dụng VPN hoặc proxy để tránh gián đoạn.


```

