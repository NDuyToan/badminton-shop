# BADMINTON SHOP — PROJECT SPECIFICATION & PROGRESS TRACKER
> **Dự án**: Badminton Shop (E-Commerce Web Clone [Li-Ning Badminton Việt Nam](https://liningbadminton.vn/))  
> **Kiến trúc**: Monorepo gồm 3 ứng dụng: `apps/api` (NestJS), `apps/admin` (Next.js), `apps/client` (Next.js)  
> **Mục đích tài liệu**: Tài liệu đặc tả kỹ thuật chuẩn và bảng theo dõi tiến độ sống (Living Progress Tracker). **Mọi AI Agent khi nhận task đều phải đọc file này trước tiên để nắm trạng thái dự án và cập nhật sau khi hoàn thành.**

---

## 📌 QUY TẮC CẬP NHẬT TIẾN ĐỘ CHO AI AGENTS & DEVELOPER
1. **Trước khi bắt đầu task**: Đọc file này để kiểm tra xem tính năng nào đã làm (`[x]`), tính năng nào đang dang dở, và dependency cần thiết.
2. **Khi hoàn thành một tính năng**: Đánh dấu tick `[x]` vào mục tương ứng, cập nhật cột **Status** thành `DONE`.
3. **Ghi log vào mục [5. Lịch sử cập nhật & Ghi chú tiến độ]**: Ghi rõ ngày, module đã hoàn thành, file đã thay đổi, và việc tiếp theo cần làm.

---

## 📊 BẢNG TỔNG QUAN TIẾN ĐỘ TRIỂN KHAI (OVERVIEW STATUS)

| Hạng mục lớn | Tổng số tính năng | Đã hoàn thành | Tiến độ | Trạng thái hiện tại |
| :--- | :---: | :---: | :---: | :--- |
| **1. Backend Core & Database** | 12 modules | 3 / 12 | 25% | Đã có Auth cơ bản, User, Category. Cần bổ sung Product, Variant, Order, Cart, Prisma migration |
| **2. Admin Portal** | 8 modules | 1 / 8 | 12.5% | Đã có Auth login cơ bản, CRUD Category. Cần Product CRUD, Variants, Orders |
| **3. Client Storefront** | 10 modules | 0 / 10 | 0% | Đang ở template mặc định ban đầu. Cần làm Header Mega Menu, Homepage, Catalog, Detail, Checkout |
| **4. DevOps & Deployment** | 4 tasks | 1 / 4 | 25% | Đã có Docker Compose & PM2 ecosystem cơ bản |

---

## 1. BACKEND API (`apps/api` - NestJS + Prisma + PostgreSQL + Redis)

### 1.1. Database Schema & Prisma ORM
- [x] **Category Model**: Quản lý danh mục cơ bản (id, name, slug, description, status). *(Status: DONE)*
- [x] **User Model & Role Enum**: Quản lý tài khoản, Role (`ADMIN`, `CUSTOMER`), UserStatus. *(Status: DONE)*
- [ ] **Category Hierarchy Expansion**: Mở rộng Category thành đa cấp (`parentId`, `imageUrl`, `displayOrder`, `isFeatured`). *(Status: PENDING)*
- [ ] **Brand Model**: Quản lý thương hiệu (Li-Ning, Victor, Yonex...). *(Status: PENDING)*
- [ ] **Product Model**: `name`, `slug`, `description`, `originalPrice`, `salePrice`, `categoryId`, `brandId`, `isFeatured`, `isActive`, `tags`. *(Status: PENDING)*
- [ ] **ProductSpecification Model**: Thông số kỹ thuật đặc thù cầu lông:
  - Vợt: Cân nặng (`3U`, `4U`, `5U`), Chu vi cán (`G5`, `G6`), Điểm cân bằng (mm), Độ dẻo đũa vợt, Sức căng tối đa (`lbs`/`kg`).
  - Giày: Form giày, chất liệu đế, công nghệ đệm.
  *(Status: PENDING)*
- [ ] **ProductVariant & Attribute Model**:
  - `sku`, `title` (vd: "4U/G5 - Xanh Chuối", "Size 42 - Đen Cam").
  - `price`, `stockQuantity`, `color`, `size`, `imageUrl`.
  *(Status: PENDING)*
- [ ] **ProductImage Model**: Nhiều ảnh cho 1 sản phẩm, sắp xếp thứ tự hiển thị, ảnh đại diện thumbnail. *(Status: PENDING)*
- [ ] **Cart & CartItem Model**: Giỏ hàng lưu database cho User đăng nhập. *(Status: PENDING)*
- [ ] **Order & OrderItem Model**:
  - `Order`: `orderCode`, `userId?`, `shippingName`, `shippingPhone`, `shippingAddress`, `province`, `district`, `ward`, `paymentMethod`, `paymentStatus`, `orderStatus`, `totalAmount`, `shippingFee`, `note`.
  - `OrderItem`: Snapshot thông tin sản phẩm và biến thể tại thời điểm đặt hàng.
  *(Status: PENDING)*
- [ ] **Coupon / Voucher Model**: Mã giảm giá, % hoặc số tiền cố định, điều kiện đơn tối thiểu, hạn sử dụng. *(Status: PENDING)*
- [ ] **Post / News Model**: Tin tức cẩm nang, bài viết sự kiện giải đấu. *(Status: PENDING)*
- [ ] **Banner Model**: Quản lý Slider trang chủ & Banner chiến dịch. *(Status: PENDING)*

### 1.2. API Modules & Nghiệp vụ (NestJS)
- [x] **Auth Module**:
  - [x] `POST /auth/register` (Đăng ký tài khoản). *(Status: DONE)*
  - [x] `POST /auth/login` (Đăng nhập JWT Access & Refresh Token). *(Status: DONE)*
  - [x] `POST /auth/refresh` (Cấp mới token). *(Status: DONE)*
  - [ ] `POST /auth/forgot-password` & `POST /auth/reset-password`. *(Status: PENDING)*
- [x] **Users Module**:
  - [x] `GET /users/me` (Xem profile). *(Status: DONE)*
  - [ ] `PATCH /users/me` (Cập nhật thông tin & sổ địa chỉ nhận hàng). *(Status: PENDING)*
  - [ ] `GET /admin/users` (Quản trị danh sách người dùng cho Admin). *(Status: PENDING)*
- [x] **Categories Module**:
  - [x] `GET /categories` (Lấy danh sách danh mục). *(Status: DONE)*
  - [x] `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`. *(Status: DONE)*
  - [ ] `GET /categories/tree` (Lấy cây phân cấp đa cấp phục vụ Mega Menu). *(Status: PENDING)*
- [ ] **Products Module**:
  - [ ] `GET /products` (Hỗ trợ lọc đa điều kiện: category, minPrice, maxPrice, brand, sort, paginate). *(Status: PENDING)*
  - [ ] `GET /products/:slug` (Chi tiết sản phẩm đầy đủ kèm biến thể, ảnh, specs). *(Status: PENDING)*
  - [ ] `GET /products/featured` (Sản phẩm nổi bật / khuyến mãi hot cho homepage). *(Status: PENDING)*
  - [ ] `POST /admin/products` (Tạo sản phẩm + biến thể + specs). *(Status: PENDING)*
  - [ ] `PATCH /admin/products/:id`, `DELETE /admin/products/:id`. *(Status: PENDING)*
- [ ] **Inventory / Stock Module**:
  - [ ] `PATCH /admin/variants/:id/stock` (Cập nhật tồn kho). *(Status: PENDING)*
  - [ ] Cảnh báo tồn kho thấp. *(Status: PENDING)*
- [ ] **Cart Module**:
  - [ ] `GET /cart` (Lấy giỏ hàng hiện tại). *(Status: PENDING)*
  - [ ] `POST /cart/items` (Thêm sản phẩm + variant vào giỏ). *(Status: PENDING)*
  - [ ] `PATCH /cart/items/:id` (Tăng/giảm số lượng). *(Status: PENDING)*
  - [ ] `DELETE /cart/items/:id` (Xóa item khỏi giỏ). *(Status: PENDING)*
  - [ ] `POST /cart/merge` (Đồng bộ giỏ hàng từ Guest sang User khi Login). *(Status: PENDING)*
- [ ] **Order & Checkout Module**:
  - [ ] `POST /orders` (Đặt hàng: Kiểm tra tồn kho, khóa giá server-side, tạo mã đơn, trừ kho). *(Status: PENDING)*
  - [ ] `GET /orders/my-orders` (Lịch sử đơn hàng của khách). *(Status: PENDING)*
  - [ ] `GET /orders/track/:orderCode` (Khách tra cứu đơn hàng công khai không cần login). *(Status: PENDING)*
  - [ ] `GET /admin/orders` (Quản lý danh sách đơn hàng cho admin có lọc status). *(Status: PENDING)*
  - [ ] `PATCH /admin/orders/:id/status` (Chuyển trạng thái đơn: PENDING -> CONFIRMED -> PROCESSING -> SHIPPING -> DELIVERED / CANCELLED). *(Status: PENDING)*
- [ ] **Payment & VietQR Module**:
  - [ ] Sinh mã VietQR chuyển khoản ngân hàng tự động kèm nội dung `[Mã đơn hàng]`. *(Status: PENDING)*
  - [ ] Xử lý luồng COD (Cash On Delivery). *(Status: PENDING)*
- [ ] **Coupon / Discount Module**:
  - [ ] `POST /coupons/apply` (Kiểm tra và tính số tiền giảm giá hợp lệ). *(Status: PENDING)*
  - [ ] `CRUD /admin/coupons` (Quản lý mã khuyến mãi). *(Status: PENDING)*
- [ ] **Banners & Content Module**:
  - [ ] `GET /banners` & `CRUD /admin/banners`. *(Status: PENDING)*
  - [ ] `GET /posts`, `GET /posts/:slug` & `CRUD /admin/posts`. *(Status: PENDING)*
- [ ] **Media Upload Module**:
  - [ ] `POST /uploads/image` (Upload ảnh sản phẩm/banner). *(Status: PENDING)*
- [ ] **Dashboard / Analytics Module**:
  - [ ] `GET /admin/analytics/overview` (Thống kê doanh thu, số đơn, người dùng, cảnh báo kho). *(Status: PENDING)*

---

## 2. ADMIN PORTAL (`apps/admin` - Next.js + Tailwind + Shadcn UI)

### 2.1. Authentication & Layout
- [x] Đăng nhập Admin (`/login`). *(Status: DONE)*
- [x] Sidebar navigation & Header dashboard cơ bản. *(Status: DONE)*
- [ ] Protected route middleware (chỉ cho phép `Role.ADMIN` hoặc `Role.STAFF`). *(Status: PENDING)*

### 2.2. Các màn hình quản trị nghiệp vụ
- [ ] **Dashboard Overview**:
  - [ ] Thẻ thống kê: Doanh thu ngày/tháng, Tổng số đơn hàng mới, Khách hàng mới, Số mặt hàng sắp hết kho. *(Status: PENDING)*
  - [ ] Biểu đồ doanh thu theo thời gian. *(Status: PENDING)*
  - [ ] Bảng danh sách đơn hàng mới cần duyệt gấp. *(Status: PENDING)*
- [x] **Quản lý Danh mục (Categories)**:
  - [x] Bảng danh sách danh mục & trạng thái. *(Status: DONE)*
  - [x] Modal thêm/sửa danh mục. *(Status: DONE)*
  - [ ] Hỗ trợ chọn danh mục cha (Parent Category) và upload ảnh danh mục. *(Status: PENDING)*
- [ ] **Quản lý Sản phẩm (Products & Variants)**:
  - [ ] Bảng danh sách sản phẩm: Lọc theo danh mục, tìm kiếm theo tên, cột hiển thị ảnh, giá, tồn kho tổng. *(Status: PENDING)*
  - [ ] Trang Thêm/Sửa sản phẩm:
    - [ ] Thông tin cơ bản: Tên, Slug tự động, Danh mục, Thương hiệu, Mô tả Rich Text.
    - [ ] Quản lý Bộ sưu tập ảnh (Upload nhiều ảnh, kéo thả sắp xếp, chọn ảnh đại diện).
    - [ ] Bảng thông số kỹ thuật cầu lông (Trọng lượng, Điểm cân bằng, Thân vợt, Sức căng...).
    - [ ] Trình tạo biến thể sản phẩm: Chọn Màu sắc, Size/Trọng lượng (3U/4U), nhập SKU, giá bán riêng và tồn kho cho từng biến thể.
    *(Status: PENDING)*
- [ ] **Quản lý Đơn hàng (Orders Management)**:
  - [ ] Bảng danh sách đơn hàng: Tab phân loại trạng thái (*Chờ xác nhận, Đang xử lý, Đang giao, Hoàn thành, Đã hủy*). *(Status: PENDING)*
  - [ ] Trang chi tiết đơn hàng: Thông tin người nhận, địa chỉ giao hàng, danh sách sản phẩm và biến thể kèm ảnh, phương thức thanh toán. *(Status: PENDING)*
  - [ ] Modal cập nhật trạng thái đơn hàng & ghi chú nội bộ. *(Status: PENDING)*
  - [ ] In phiếu đóng gói đơn hàng. *(Status: PENDING)*
- [ ] **Quản lý Khuyến mãi (Vouchers / Coupons)**:
  - [ ] Bảng danh sách mã giảm giá. *(Status: PENDING)*
  - [ ] Form tạo mã: Giảm theo %, giảm theo số tiền, điều kiện đơn tối thiểu, giới hạn lượt dùng, thời gian bắt đầu - kết thúc. *(Status: PENDING)*
- [ ] **Quản lý Banner Slider & Tin tức**:
  - [ ] Quản lý Banner trang chủ: Tải ảnh desktop + mobile, link đích khi click, thứ tự hiển thị slider. *(Status: PENDING)*
  - [ ] Quản lý Bài viết tin tức: Viết bài Cẩm nang Li-Ning, sự kiện thi đấu, khuyến mãi. *(Status: PENDING)*
- [ ] **Quản lý Khách hàng**:
  - [ ] Danh sách tài khoản khách hàng, lịch sử các đơn hàng đã mua, tổng tiền đã chi tiêu. *(Status: PENDING)*

---

## 3. CLIENT STOREFRONT (`apps/client` - Next.js App Router + Tailwind)

### 3.1. Header & Navigation (Chuẩn Li-Ning Badminton)
- [ ] **Topbar**: Hotline CSKH `1900633083`, link Đăng nhập / Đăng ký, thông báo khuyến mãi. *(Status: PENDING)*
- [ ] **Mainbar**:
  - [ ] Logo Li-Ning Badminton.
  - [ ] Searchbar: Ô tìm kiếm sản phẩm nhanh (Instant search / gợi ý kết quả).
  - [ ] Mini-Cart Popover / Drawer: Icon giỏ hàng có số lượng badge, hover/click mở popup danh sách sản phẩm đã chọn, tạm tính, nút "Giỏ hàng" và "Thanh toán".
  *(Status: PENDING)*
- [ ] **Mega Menu Đa cấp**:
  - [ ] *DANH MỤC SẢN PHẨM* (Pickleball, Trang phục, Giày, Máy căng cước, Phụ kiện, Trẻ em).
  - [ ] *VỢT CẦU LÔNG* (Các dòng: Aeronaut, Axforce, Bladex, Calibar, Carbon, Halbertec, Nano Blade, Tectonic, Turbo Charging, Windstorm).
  - [ ] *GIÀY CẦU LÔNG* (Almighty, Blade, Halberd ZJ, Invincible, JF Lite, Pounce, Saga, Secure Pro, Sortie, Sound Wave, Thunder).
  - [ ] *NAM / NỮ* (Áo, Quần, Bộ quần áo, Giày, Phụ kiện, Unisex).
  - [ ] *LỐI CHƠI* (Giày thiên công, Giày tập luyện, Giày phản tạt tì đè, Giày công thủ toàn diện).
  - [ ] *TIN TỨC* (Cẩm nang Li-Ning, Tin tức - Sự kiện, Tin khuyến mại).
  - [ ] Mobile Menu (Drawer responsive trên điện thoại).
  *(Status: PENDING)*

### 3.2. Trang chủ (Home Page)
- [ ] **Hero Banner Carousel**: Slider trượt banner chương trình lớn (autoplay, dots điều hướng). *(Status: PENDING)*
- [ ] **Large Promo Banner**: Banner quảng bá bộ sưu tập nổi bật (ví dụ: Chiharu Shida, Vợt Halbertec). *(Status: PENDING)*
- [ ] **Product Carousel Sections**:
  - [ ] Carousel Vợt cầu lông bán chạy.
  - [ ] Carousel Quần áo cầu lông mới về.
  - [ ] Carousel Giày cầu lông chính hãng.
  - [ ] Carousel Túi & Balo đựng vợt.
  *(Status: PENDING)*
- [ ] **Product Card Component**:
  - [ ] Ảnh thumbnail có hiệu ứng hover đổi ảnh góc khác.
  - [ ] Badge % giảm giá đỏ nổi bật.
  - [ ] Tên sản phẩm, giá bán khuyến mãi, giá niêm yết gạch ngang.
  - [ ] Nút xem nhanh (Quick view) / Thêm vào giỏ hàng.
  *(Status: PENDING)*
- [ ] **News & Events Section**: Khối 3-4 bài viết tin tức mới nhất về giải đấu và cẩm nang cầu lông. *(Status: PENDING)*
- [ ] **Footer chuẩn E-commerce Việt Nam**:
  - [ ] Thông tin công ty chủ quản, địa chỉ showroom, mã số thuế, hotline.
  - [ ] Logo chứng nhận Bộ Công Thương.
  - [ ] Cột chính sách: Giới thiệu, Hướng dẫn đặt hàng online, Chính sách bảo mật, Chính sách đổi trả - bảo hành, Chính sách vận chuyển.
  - [ ] Phương thức thanh toán chấp nhận (COD, VietQR/Chuyển khoản).
  *(Status: PENDING)*

### 3.3. Trang Danh mục / Tìm kiếm (Collection & Catalog)
- [ ] **Layout Danh mục 2 cột**: Cột trái Bộ lọc (Sidebar Filter), Cột phải Lưới sản phẩm (Product Grid). *(Status: PENDING)*
- [ ] **Bộ lọc đa tiêu chí (Smart Filter)**:
  - [ ] Lọc theo khoảng giá (Dưới 1tr, 1-2tr, 2-3tr, 3-5tr, 5-10tr, Trên 10tr).
  - [ ] Lọc theo Dòng sản phẩm / Series vợt.
  - [ ] Lọc theo Lối chơi (Công, Thủ, Toàn diện).
  - [ ] Lọc theo Màu sắc & Kích cỡ.
  - [ ] Khối "Sản phẩm bán chạy" gợi ý ngay tại sidebar.
  *(Status: PENDING)*
- [ ] **Sắp xếp & Phân trang**: Sort theo giá tăng/giảm, hàng mới nhất, tên A-Z; Phân trang Pagination chuẩn SEO. *(Status: PENDING)*

### 3.4. Trang Chi tiết sản phẩm (Product Detail Page)
- [ ] **Image Gallery**: Ảnh lớn zoom nét cao + danh sách thumbnail chọn ảnh bên dưới/bên cạnh. *(Status: PENDING)*
- [ ] **Khu vực đặt hàng & Swatches**:
  - [ ] Tên sản phẩm, Mã sản phẩm (SKU chính), Tình trạng Còn hàng / Hết hàng.
  - [ ] Khối giá: Giá bán hiện tại + Giá niêm yết + % tiết kiệm.
  - [ ] Swatch chọn Lối đánh / Phiên bản.
  - [ ] Swatch chọn Màu sắc (kèm thumbnail màu).
  - [ ] Swatch chọn Trọng lượng & Chu vi cán vợt (`3U/G5`, `4U/G5`) hoặc Size giày (`39-44`).
  - [ ] Bộ chọn số lượng `+` `-`.
  - [ ] Nút **"Thêm vào giỏ"** & Nút **"Mua ngay"** (chuyển thẳng đến trang checkout).
  *(Status: PENDING)*
- [ ] **Bảng thông số kỹ thuật (Badminton Specs Table)**:
  - [ ] Khung vợt: Carbon Fiber.
  - [ ] Trọng lượng: `4U (83±3g)` hoặc `3U (88±3g)`.
  - [ ] Điểm cân bằng: `296±2mm`.
  - [ ] Thân vợt: Dẻo / Trung bình / Cứng.
  - [ ] Tay cầm: S2/G5.
  - [ ] Mức căng dây tối ưu: `11.5kg - 13kg`.
  *(Status: PENDING)*
- [ ] **Tabs thông tin accordion**: Mô tả chi tiết, Công nghệ khung vợt Li-Ning, Hướng dẫn bảo quản, Chính sách đổi trả & bảo hành. *(Status: PENDING)*
- [ ] **Related Products Slider**: Carousel các sản phẩm liên quan cùng series. *(Status: PENDING)*

### 3.5. Giỏ hàng & Thanh toán (Cart & Checkout Flow)
- [ ] **Trang Giỏ hàng (`/cart`)**: Danh sách sản phẩm, biến thể đã chọn, tăng giảm số lượng, xóa item, tổng tiền tạm tính. *(Status: PENDING)*
- [ ] **Trang Thanh toán (`/checkout`)**:
  - [ ] Form thông tin người nhận: Họ tên, Số điện thoại, Email.
  - [ ] Địa chỉ nhận hàng 3 cấp: Tỉnh/Thành phố -> Quận/Huyện -> Phường/Xã (sử dụng dữ liệu hành chính Việt Nam).
  - [ ] Chọn phương thức giao hàng (Tính phí ship hoặc Free ship nếu đơn > 500.000đ).
  - [ ] Chọn hình thức thanh toán:
    - [ ] **COD (Thanh toán tiền mặt khi nhận hàng)**.
    - [ ] **Chuyển khoản VietQR**: Sinh mã QR ngân hàng tự động điền sẵn STK, tên chủ TK, số tiền và mã đơn hàng.
  - [ ] Ô nhập mã Voucher giảm giá và hiển thị số tiền được chiết khấu.
  - [ ] Nút xác nhận "Đặt hàng".
  *(Status: PENDING)*
- [ ] **Trang Đặt hàng thành công (`/order-success/:orderCode`)**: Hiển thị tóm tắt đơn, hướng dẫn chuyển khoản (nếu chọn QR), thông báo kiểm tra email xác nhận. *(Status: PENDING)*
- [ ] **Trang Tra cứu đơn hàng (`/tra-cuu-don-hang`)**: Nhập Mã đơn + SĐT để kiểm tra hành trình vận chuyển. *(Status: PENDING)*

### 3.6. Tài khoản khách hàng (`/account`)
- [ ] Trang Đăng nhập & Đăng ký tài khoản khách hàng. *(Status: PENDING)*
- [ ] Trang Thông tin cá nhân & Quản lý địa chỉ giao hàng. *(Status: PENDING)*
- [ ] Trang Lịch sử đơn hàng: Danh sách các đơn đã đặt và trạng thái xử lý. *(Status: PENDING)*

### 3.7. Trang Tin tức & Bài viết (`/blogs/:slug`)
- [ ] Danh sách bài viết theo danh mục (Cẩm nang Li-Ning, Tin tức sự kiện, Khuyến mại). *(Status: PENDING)*
- [ ] Chi tiết bài viết chuẩn SEO, bài viết liên quan. *(Status: PENDING)*

---

## 4. KẾ HOẠCH BƯỚC TIẾP THEO (NEXT ACTIONS)

1. **Bước 1: Mở rộng Prisma Schema (`apps/api/prisma/schema.prisma`)**:
   - Thêm các models: `Product`, `ProductVariant`, `ProductImage`, `ProductSpecification`, `Brand`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Coupon`, `Banner`, `Post`.
   - Chạy migration PostgreSQL an toàn.
2. **Bước 2: Xây dựng Products API & Variants API (`apps/api/src/products`)**:
   - DTO validation cho sản phẩm & thông số kỹ thuật cầu lông.
   - Endpoint lấy danh sách lọc theo danh mục, giá, thương hiệu, lối chơi; endpoint lấy chi tiết theo slug.
3. **Bước 3: Xây dựng Admin Product Management (`apps/admin`)**:
   - Form tạo sản phẩm có upload ảnh, nhập thông số đặc thù và sinh biến thể.
4. **Bước 4: Dựng Client Layout & Mega Menu (`apps/client`)**:
   - Header, Topbar, Mega Menu chuẩn phong cách Li-Ning Badminton.
   - Trang chủ hoàn thiện với Hero Slider và Carousels sản phẩm.

---

## 5. LỊCH SỬ CẬP NHẬT & GHI CHÚ TIẾN ĐỘ (CHANGELOG & NOTES)

### [2026-09-04] — Khởi tạo Master Spec & Phân tích cấu trúc clone Li-Ning Badminton
- **Người thực hiện**: Antigravity AI
- **Hành động**:
  - Đã crawl và phân tích toàn diện website `https://liningbadminton.vn/` (cấu trúc danh mục series vợt, phân loại giày theo lối chơi, thông số kỹ thuật 3U/4U, swatches, luồng giỏ hàng và thanh toán).
  - So sánh hiện trạng codebase (`apps/api` đã có User/Auth/Category cơ bản; `apps/admin` đã có Category CRUD; `apps/client` chưa triển khai UI).
  - Tạo file đặc tả `docs/PROJECT-SPEC-TRACKER.md` làm kim chỉ nam theo dõi tiến độ chi tiết cho API, Admin và Client.
- **Tiếp theo**: Cập nhật `apps/api/prisma/schema.prisma` để hỗ trợ Product, Variants, Orders và triển khai migration.
