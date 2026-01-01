
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="next-tools-logo-dark.png" />
  <img src="next-tools-logo-light.png" alt="Next-Tools Logo" width="500"/>
</picture>

**Bộ sưu tập các công cụ trực tuyến thực tế được thiết kế cho các nhà phát triển và chuyên gia IT**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/willjayyyy/next-tools)](https://github.com/willjayyyy/next-tools/issues)

**🗣️ Ngôn ngữ:** [English](../README.md) • [中文](README.zh.md) • [Français](README.fr.md) • [Deutsch](README.de.md) • [Español](README.es.md) • [Português](README.pt.md) • [Русский](README.ru.md) • [Українська](README.uk.md) • [Norsk](README.no.md) • Tiếng Việt

[🌐 Thử trực tuyến!](https://next-tools.dev) •
[📖 Về dự án](https://next-tools.dev/about) •
[🐛 Báo cáo lỗi](https://github.com/willjayyyy/next-tools/issues) •
[💡 Yêu cầu tính năng](https://github.com/willjayyyy/next-tools/issues/new/choose)

</div>

---

> **Lưu ý:** Đây là một fork của dự án [it-tools](https://github.com/CorentinTh/it-tools) gốc, được refactor và duy trì bởi [Will Jay](https://github.com/willjayyyy). Dự án này được cấp phép theo GNU GPLv3.

## ✨ Tính năng

- 🔧 **120+ Công cụ dành cho nhà phát triển** - Từ chuyển đổi dữ liệu đến phân tích mạng
- 🎨 **Giao diện hiện đại** - Giao diện sạch và trực quan được xây dựng với Vue.js 3
- 🔒 **Quyền riêng tư trên hết** - Tất cả các công cụ chạy cục bộ trong trình duyệt của bạn
- 🌍 **10 ngôn ngữ** - Hỗ trợ đầy đủ quốc tế hóa
- 📱 **Thiết kế đáp ứng** - Hoạt động hoàn hảo trên tất cả các thiết bị
- ⚡ **Nhanh và nhẹ** - Được xây dựng với Vite để có hiệu suất tối ưu
- 🆓 **Miễn phí và mã nguồn mở** - Được cấp phép theo GPL-3.0, miễn phí mãi mãi

## 🚀 Bắt đầu nhanh

### Sử dụng trực tuyến
Truy cập [next-tools.dev](https://next-tools.dev) để sử dụng tất cả các công cụ trực tiếp trong trình duyệt của bạn.

### Tự lưu trữ

#### Từ Docker Hub:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  willjayyyy/next-tools:latest
```

#### Từ GitHub Packages:
```bash
docker run -d --name next-tools \
  --restart unless-stopped \
  -p 8080:80 \
  ghcr.io/willjayyyy/next-tools:latest
```

#### Phát triển cục bộ:
```bash
# Sao chép kho lưu trữ
git clone https://github.com/willjayyyy/next-tools.git
cd next-tools

# Cài đặt các phụ thuộc
pnpm install

# Khởi động máy chủ phát triển
pnpm dev
```

## 🛠️ Danh mục công cụ

- **Công cụ chuyển đổi** - JSON, XML, YAML, CSV, Base64, mã hóa URL
- **Công cụ tạo** - UUID, mật khẩu, mã QR, hash, JWT
- **Công cụ định dạng** - SQL, XML, JSON, CSS, JavaScript
- **Công cụ xác thực** - Email, URL, JSON, XML, biểu thức cron
- **Công cụ mã hóa/Giải mã** - Base64, URL, thực thể HTML, mã Morse
- **Công cụ tính toán** - Phần trăm, mạng con, quyền chmod
- **Công cụ văn bản** - Chuyển đổi chữ hoa/thường, lorem ipsum, đếm từ
- **Công cụ mạng** - Máy tính IP, tra cứu MAC, công cụ DNS
- **Phát triển** - Bộ kiểm tra biểu thức chính quy, bộ chọn màu, mã trạng thái HTTP

## 🤝 Đóng góp

Chúng tôi hoan nghênh sự đóng góp! Đây là cách bạn có thể giúp đỡ:

### Cài đặt IDE được đề xuất

**Cài đặt IDE được đề xuất:**
- [VSCode](https://code.visualstudio.com/) với các tiện ích mở rộng:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

**Cài đặt VSCode:**
```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Cài đặt dự án
```bash
# Cài đặt các phụ thuộc
pnpm install

# Khởi động máy chủ phát triển
pnpm dev

# Xây dựng cho sản xuất
pnpm build

# Chạy thử nghiệm
pnpm test

# Kiểm tra mã
pnpm lint
```

### Thêm công cụ mới

Tạo công cụ mới với bộ tạo của chúng tôi:
```bash
pnpm run script:create:tool my-tool-name
```

Điều này sẽ tạo ra các tệp cơ bản trong `src/tools/my-tool-name/`. Nó sẽ tạo một thư mục trong `src/tools` với các tệp chính xác và thêm import vào `src/tools/index.ts`. Bạn chỉ cần thêm công cụ đã import vào danh mục thích hợp và phát triển công cụ.

### Hỗ trợ kiểu cho import `.vue` trong TS

TypeScript không thể xử lý thông tin kiểu cho import `.vue` theo mặc định, vì vậy chúng tôi thay thế CLI `tsc` bằng `vue-tsc` để kiểm tra kiểu. Trong các trình soạn thảo, chúng ta cần [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) để dịch vụ ngôn ngữ TypeScript nhận biết các kiểu `.vue`.

Nếu plugin TypeScript độc lập không đủ nhanh đối với bạn, Volar cũng đã triển khai [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) hiệu suất cao hơn. Bạn có thể kích hoạt nó bằng các bước sau:

1. Vô hiệu hóa Extension TypeScript tích hợp
   1. Chạy `Extensions: Show Built-in Extensions` từ bảng lệnh của VSCode
   2. Tìm `TypeScript and JavaScript Language Features`, nhấp chuột phải và chọn `Disable (Workspace)`
2. Tải lại cửa sổ VSCode bằng cách chạy `Developer: Reload Window` từ bảng lệnh.

## 🌍 Quốc tế hóa

Next-Tools hỗ trợ 10 ngôn ngữ:
- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇪🇸 Español (es)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇺🇦 Українська (uk)
- 🇳🇴 Norsk (no)
- 🇻🇳 Tiếng Việt (vi)

Để đóng góp bản dịch, chỉnh sửa các tệp JSON trong thư mục `locales/`.

## 📊 Tích hợp Analytics

Next-Tools hỗ trợ tích hợp analytics tùy chọn để theo dõi việc sử dụng. Cấu hình các biến môi trường này để bật analytics:

### Vercel Analytics
```bash
VITE_ENABLE_VERCEL_ANALYTICS=true
VITE_DEBUG_VERCEL_ANALYTICS=false  # Chế độ debug tùy chọn
```

### Google Analytics 4
```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics
```bash
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js  # URL tùy chỉnh tùy chọn
```

Analytics chỉ chạy trong bản build production và hoàn toàn tùy chọn.

## 🍪 Quản lý Đồng ý

Next-Tools bao gồm hệ thống quản lý đồng ý tích hợp tuân thủ GDPR, CCPA và các quy định về quyền riêng tư khác.

### Tính năng
- **Tự động phát hiện khu vực** - Tự động phát hiện khu vực của người dùng và hiển thị hộp thoại đồng ý cho các khu vực GDPR/CCPA
- **Tùy chọn có thể tùy chỉnh** - Người dùng có thể chấp nhận tất cả, từ chối tất cả hoặc tùy chỉnh tùy chọn của họ
- **Lưu trữ liên tục** - Tùy chọn của người dùng được lưu cục bộ và được tôn trọng qua các phiên
- **Chế độ nghiêm ngặt** - Chế độ tùy chọn để yêu cầu sự đồng ý từ tất cả người dùng bất kể khu vực

### Cấu hình
```bash
# Bật quản lý đồng ý
VITE_CONSENT_ENABLE=true

# Bật chế độ nghiêm ngặt - yêu cầu sự đồng ý từ tất cả người dùng bất kể khu vực
VITE_CONSENT_STRICT=false
```

## 🗺️ Lộ trình và yêu cầu tính năng

Kiểm tra [issues](https://github.com/willjayyyy/next-tools/issues) để xem các tính năng đã lên kế hoạch và công cụ sắp tới.

Có ý tưởng về một công cụ? [Gửi yêu cầu tính năng](https://github.com/willjayyyy/next-tools/issues/new/choose)!

## 📄 Giấy phép

Dự án này được cấp phép theo [GNU General Public License v3.0](LICENSE).

## 🙏 Lời cảm ơn

- Dự án gốc [it-tools](https://github.com/CorentinTh/it-tools) của Corentin Thomasset
- [Vue.js](https://vuejs.org/) - Khung JavaScript tiến bộ
- [shadcn-vue](https://www.shadcn-vue.com/) - Thư viện thành phần Vue 3
- [Vite](https://vitejs.dev/) - Công cụ xây dựng nhanh
- Tất cả những người đóng góp tuyệt vời của chúng tôi [cộng tác viên](https://github.com/willjayyyy/next-tools/graphs/contributors)!

---

<div align="center">
Được tạo với ❤️ bởi <a href="https://github.com/willjayyyy">Will Jay</a>

</div>
