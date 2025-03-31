
# TanStream Project

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

## Giới thiệu
TanStream là một nền tảng streaming cho phép người dùng phát trực tiếp, tương tác với khán giả, quản lý thông báo, thanh toán và đăng ký gói tài trợ.

## Cấu trúc Database
Dưới đây là sơ đồ cấu trúc database của dự án:

![database-diagram](https://github.com/user-attachments/assets/f273f5b3-115d-4ba7-8ba1-c804d0430abf)

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
Để chạy backend và frontend của dự án, pull các Docker images từ Dockerhub:

```sh
# Pull backend image
docker pull maitanchan/tanstream-backend:latest

# Pull frontend image
docker pull maitanchan/tanstream-frontend:latest
```

Sau khi pull xong, chạy container từ image này bằng lệnh:

```sh
# Chạy backend
docker run -d -p 8000:8000 --name tanstream-backend maitanchan/tanstream-backend:latest

# Chạy frontend
docker run -d -p 3000:3000 --name tanstream-frontend maitanchan/tanstream-frontend:latest
```

## Hướng dẫn khởi chạy dự án
Dự án sử dụng **PostgreSQL** làm database chính và **Redis** để lưu trữ cache. Bạn có thể sử dụng Docker Compose để chạy toàn bộ hệ thống:

### 1. Khởi chạy database và Redis
```sh
docker-compose up -d postgres redis
```
Điều này sẽ tạo hai container:
- **PostgreSQL** chạy trên cổng `5432`
- **Redis** chạy trên cổng `6379`

### 2. Cấu hình biến môi trường
Tạo file `.env` và cấu hình các biến môi trường như sau:
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=tanstream
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Khởi chạy backend và frontend
```sh
docker-compose up -d backend frontend
```

Hệ thống sẽ khởi chạy toàn bộ dịch vụ backend, frontend, database và Redis.

---
**Ghi chú:**
- Nếu có bất kỳ vấn đề gì khi chạy dự án, vui lòng kiểm tra logs của container bằng:
```sh
docker logs tanstream-backend
docker logs tanstream-frontend
```
- Backend sử dụng Telegram API, tuy nhiên, Telegram API hiện bị chặn IP tại Việt Nam. Nếu bạn đang triển khai dự án ở Việt Nam, hãy sử dụng VPN hoặc proxy để tránh gián đoạn.


