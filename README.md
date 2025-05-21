

// ============================================================
// Code được tạo bởi Tool Việt Nam (Tool.vn). Cảm ơn bạn vì đã nhớ đến tác giả <3
// ============================================================

// --- Hướng dẫn sử dụng và Cài đặt Trigger ---
/*
HƯỚNG DẪN SỬ DỤNG GOOGLE APPS SCRIPT KIỂM TRA BẢO MẬT WEBSITE 
Phù hợp cho việc kiểm tra các website WordPress, HTML thuần, và các trang có nội dung render phía server (SSR).
Lưu ý quan trọng: Script này không phải là một trình duyệt đầy đủ và không thực thi JavaScript trên trang được quét. Do đó, với các ứng dụng web phức tạp sử dụng nhiều JavaScript để render nội dung động phía client (ví dụ: React, Angular, Vue), khả năng phát hiện các mối đe dọa được chèn bởi JavaScript sau khi tải trang sẽ bị hạn chế. Script sẽ chủ yếu phân tích mã HTML tĩnh ban đầu mà server trả về.
Code có thể hoạt động khôg chính xác nếu nhà cung cấp hosting/vps/server của bạn hạn chế hoặc chặn các truy cập từ google/địa chỉ ip của google


1. MỞ GOOGLE APPS SCRIPT:
   - Vào Google Drive, tạo một Google Sheet mới (hoặc mở sheet có sẵn).
   - Click "Tiện ích mở rộng" (Extensions) > "Apps Script".
   - Xóa code mẫu trong file `Code.gs` và DÁN TOÀN BỘ CODE NÀY vào.
   - Lưu lại dự án (File > Save hoặc Ctrl+S), đặt tên cho dự án (ví dụ: "WebsiteSecurityChecker").

2. CẤU HÌNH SCRIPT:
   - Tìm đến đầu file code, phần `const CONFIG = { ... };`
   - **BẮT BUỘC:**
     - `TELEGRAM_BOT_TOKEN`: Thay thế bằng token của bot Telegram bạn đã tạo.
       (Cách tạo bot: Tìm "BotFather" trên Telegram, gõ /newbot, làm theo hướng dẫn).
     - `TELEGRAM_CHAT_ID`: Thay thế bằng ID chat của bạn (hoặc group) để nhận thông báo.
       (Cách lấy Chat ID: Tìm bot "userinfobot" hoặc "getidsbot" trên Telegram, gửi tin nhắn bất kỳ cho nó, nó sẽ trả về Chat ID).
     - `TARGET_URL`: Thay thế bằng URL trang web bạn muốn kiểm tra. Có thể là trang chủ, trang phụ,... ví dụ: Https://tool.vn
   - **TÙY CHỈNH (NÊN XEM QUA):**
     - `CHECKS_ENABLED`: Bật (`true`) hoặc tắt (`false`) từng loại kiểm tra. Mặc định bật nhiều thứ.
       Ví dụ, nếu website của bạn có nhiều nội dung ẩn hợp lệ gây báo động sai, bạn có thể tắt `HIDDEN_CONTENT_CSS: false`.
     - `MAX_RESPONSE_TIME_SECONDS`: Ngưỡng thời gian phản hồi (giây) để cảnh báo trang chậm.
     - `SPAM_KEYWORDS_LIST`: Danh sách các từ khóa nhạy cảm. Bổ sung thêm cho phù hợp với website của bạn và các loại spam thường gặp.
     - `SUSPICIOUS_TLDS`: Danh sách các TLD (đuôi tên miền) thường bị lạm dụng. Ở đây Tool.vn đã liệt kê khá đầy đủ các đuôi tên miền, nếu trang web của bạn sử dụng cùng đuôi tên miền có thể gây báo nhầm lẫn, lúc này bạn chỉ cần xóa TLD đó đi. 
     - `SUSPICIOUS_DISALLOW_PATHS_ROBOTS`: Danh sách các đường dẫn trong robots.txt mà nếu bị Disallow có thể đáng ngờ.
     - `OUTBOUND_LINK_WHITELIST`: Danh sách các domain mà website của bạn được phép link ra ngoài (ví dụ: CDN, mạng xã hội, các trang của bạn).
     - `IFRAME_SOURCE_WHITELIST`: Danh sách các domain được phép nhúng iframe vào website của bạn (ví dụ: YouTube, Google Maps, Google Tag Manager).
     - `REPORT_ALL_NON_WHITELISTED_OUTBOUND`: Nếu `true`, sẽ báo cáo (mức INFO) tất cả các link ra ngoài không nằm trong whitelist, ngay cả khi chúng không có dấu hiệu spam rõ ràng.
     - `NOTIFY_ON_WARNING`: Nếu `true`, các cảnh báo mức "WARNING" cũng sẽ gửi qua Telegram. Nếu `false`, chỉ "CRITICAL" mới gửi, "WARNING" sẽ chỉ ghi log.

3. CẤP QUYỀN CHO SCRIPT:
   - Sau khi lưu, chọn hàm `checkWebsiteSecurity` từ menu thả xuống bên cạnh nút "Debug" (Gỡ Lỗi).
   - Nhấn nút "Run" (▶️).
   - Lần đầu chạy, Google sẽ yêu cầu bạn cấp quyền cho script.
     - Click "Review permissions" (Xem lại quyền).
     - Chọn tài khoản Google của bạn.
     - Click "Advanced" (Nâng cao) > "Go to [Tên dự án của bạn] (unsafe)" (Đi tới [Tên dự án] (không an toàn)).
     - Click "Allow" (Cho phép).

4. CHẠY THỬ NGHIỆM:
   - Sau khi cấp quyền, hàm `checkWebsiteSecurity` sẽ chạy.
   - Mở Log (Biểu tượng trông giống như danh sách có dấu kiểm hoặc Ctrl+Enter) để xem quá trình thực thi và các thông báo lỗi/cảnh báo. Thông thường sẽ được tự động mở.
   - Kiểm tra Telegram xem có nhận được tin nhắn không (nếu có lỗi hoặc cảnh báo được cấu hình để gửi).
   - **QUAN TRỌNG:** Chạy thử nhiều lần với các URL khác nhau (nếu có thể) để đảm bảo script hoạt động đúng và tinh chỉnh `CONFIG` (đặc biệt là `SPAM_KEYWORDS_LIST`, `OUTBOUND_LINK_WHITELIST`, `IFRAME_SOURCE_WHITELIST`, và xem xét các TLD trong `SUSPICIOUS_TLDS` gây báo động sai) để giảm báo động sai. Hoặc bạn cũng có thể cập nhật thêm để bổ sung danh sách từ khóa.

5. CÀI ĐẶT TRIGGER (CHẠY TỰ ĐỘNG):
   - Trong trình soạn thảo Apps Script, click vào biểu tượng "Triggers" (Đồng hồ báo thức/kích hoạt) ở menu bên trái.
   - Click "Add Trigger" (Thêm trình kích hoạt) ở góc dưới bên phải.
   - Cấu hình trigger:
     - `Choose which function to run` (Chọn hàm để chạy): Chọn `checkWebsiteSecurity`.
     - `Choose which deployment should run` (Chọn bản triển khai để chạy): Để `HEAD`.
     - `Select event source` (Chọn nguồn sự kiện): Chọn `Time-driven` (Theo thời gian).
     - `Select type of time based trigger` (Chọn loại trình kích hoạt dựa trên thời gian):
       - `Minutes timer` (Hẹn giờ theo phút): Chạy sau mỗi X phút (ví dụ: `Every 30 minutes`).
       - `Hour timer` (Hẹn giờ theo giờ): Chạy sau mỗi X giờ (ví dụ: `Every hour`, `Every 2 hours`).
       - `Day timer` (Hẹn giờ theo ngày): Chạy vào một thời điểm cụ thể hàng ngày.
       - `Week timer` (Hẹn giờ theo tuần): Chạy vào một ngày/giờ cụ thể hàng tuần.
     - `Select minute/hour/day/time` (Chọn phút/giờ/ngày/thời gian): Chọn tần suất mong muốn. Ví dụ, `Every 6 hours` hoặc `1am to 2am` hàng ngày.
     - `Failure notification settings` (Cài đặt thông báo lỗi): Chọn `Notify me daily` (Thông báo cho tôi hàng ngày) hoặc `Notify me immediately` (Thông báo cho tôi ngay lập tức) để Google thông báo nếu trigger bị lỗi.
   - Click "Save" (Lưu).

LƯU Ý VỀ TẦN SUẤT CHẠY:
- Không nên đặt trigger chạy quá thường xuyên (ví dụ: mỗi phút) vì có thể vượt quá giới hạn của Google Apps Script hoặc gây áp lực không cần thiết lên server của bạn.
- Tần suất hợp lý có thể là mỗi 30 phút, 1 giờ, hoặc vài giờ một lần, tùy thuộc vào mức độ quan trọng của website.

XỬ LÝ SỰ CỐ:
- **Xem Log:** Luôn kiểm tra log để tìm lỗi chi tiết.
- **Kiểm tra CONFIG:** Đảm bảo token, chat ID, URL đã đúng.
- **Kiểm tra quyền:** Script có thể cần cấp lại quyền sau khi có các thay đổi.
- **Giới hạn GAS:** Nếu script báo lỗi "Exceeded maximum execution time" (Vượt quá thời gian thực thi tối đa), bạn cần tối ưu code, giảm số lượng kiểm tra (tắt bớt trong `CHECKS_ENABLED`), hoặc tăng khoảng thời gian giữa các lần chạy.
- **Báo động sai (False Positives):** Tinh chỉnh các danh sách trong `CONFIG` để phù hợp hơn với website của bạn. Đây là một quá trình liên tục.

CHIA SẺ VÀ BẢO MẬT:
- Không chia sẻ file Google Sheet hoặc script này với người không đáng tin cậy nếu nó chứa token Telegram của bạn.
*/

