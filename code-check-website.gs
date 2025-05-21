

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




/**
 * Đây là cấu hình tùy chỉnh bạn có thể sửa để phù hợp với trang web của bạn
 */
const CONFIG = {
  // === Cài đặt Telegram ===
  TELEGRAM_BOT_TOKEN: 'token_bot', // THAY THẾ bằng Token của Bot Telegram của bạn
  TELEGRAM_CHAT_ID: '12345678910111214',    // THAY THẾ bằng Chat ID của bạn

  // === Website của bạn ===
  TARGET_URL: 'https://tool.vn', // THAY THẾ bằng URL bạn muốn theo dõi

  // === Phần này để giả lập truy cập từ người dùng, giả lập truy cập từ google, phát hiện các mã độc chỉ xuất hiện khi tìm kiếm trên google ===

USER_AGENTS: {
    NORMAL_USER: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    GOOGLE_BOT: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    GOOGLE_REFERER: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36" 
  },
  GOOGLE_REFERER_URL: "https://www.google.com/",

  // === Bật/Tắt các loại kiểm tra (true để bật, false để tắt) ===
  CHECKS_ENABLED: {
    HTTP_STATUS_AND_HOST: true,      // Kiểm tra mã trạng thái khác 200, host die, chuyển hướng bất thường
    META_REFRESH_REDIRECTS: true,  // Kiểm tra thẻ <meta http-equiv="refresh">
    HIDDEN_CONTENT_CSS: true,      // Kiểm tra các kỹ thuật CSS phổ biến để ẩn nội dung
    SPAM_KEYWORDS: true,             // Kiểm tra từ khóa spam trong văn bản, liên kết
    UNUSUAL_OUTBOUND_LINKS: true,  // Kiểm tra liên kết đến tên miền/TLD đáng ngờ (không nhất thiết phải ẩn)
    SUSPICIOUS_IFRAMES: true,        // Kiểm tra iframe đáng ngờ (nguồn, bị ẩn)
    BASE64_ENCODED_STRINGS: true,  // Kiểm tra chuỗi base64 dài/đáng ngờ
    CLOAKING_CONTENT_DIFF: true,   // So sánh nội dung lấy được với các user agent khác nhau, ví dụ có một số loại mã độc không xuất hiện khi truy cập trực tiếp mà chỉ xuất hiện ở 
    RESPONSE_HEADERS: true,          // Kiểm tra Content-Type, X-Robots-Tag
    RESPONSE_TIME: true,             // Kiểm tra thời gian phản hồi có quá lâu không
    ROBOTS_TXT: true,                // Kiểm tra file robots.txt xem có quy tắc đáng ngờ không
  },

  // === Ngưỡng và Danh sách ===
  MAX_RESPONSE_TIME_SECONDS: 15,     // Cảnh báo nếu thời gian phản hồi vượt quá (giây)
  MIN_BASE64_LENGTH_TO_CHECK: 50,    // Độ dài tối thiểu của chuỗi base64 để coi là đáng ngờ

  SPAM_KEYWORDS_LIST: [             // Không phân biệt chữ hoa/thường. Bổ sung nếu cần.
    'casino', 'sòng bạc', 'cá cược', 'cá độ', 'poker', 'betting', 'gambling', 'nhà cái', 'game bài',
    'vay tiền', 'tín dụng đen', 'vay online', 'vay nhanh', 'app vay tiền',
    'thuốc cường dương', 'viagra', 'cialis', 'sex', 'adult', 'porn', 'xxx', 'gái gọi',
    'slot', 'blackjack', 'roulette', 'baccarat', 'tài xỉu', 'lô đề', 'xổ số',
    // Thêm từ khóa spam phổ biến ở các ngôn ngữ khác nếu có liên quan
    '온라인카지노', 'バカラ', 'порно', 'ставки на спорт'
  ],

  // DANH SÁCH TLD ĐÁNG NGỜ MỞ RỘNG
  // CẢNH BÁO: Danh sách này dài và có thể tăng báo cáo sai.
  // Cần tinh chỉnh whitelist của bạn để phù hợp.
  SUSPICIOUS_TLDS: [
    // Các TLD "kinh điển" hay bị lạm dụng (Freenom và các TLD giá rẻ/dễ đăng ký)
    '.tk', '.ml', '.ga', '.cf', '.gq', // Freenom TLDs
    '.xyz', '.top', '.loan', '.work', '.click', '.link', '.live', '.stream', '.online',
    '.site', '.website', '.space', '.pw', '.icu', '.date', '.faith', '.review',
    '.accountant', '.accountants', '.bid', '.racing', '.win', '.rest', '.buzz',
    '.download', '.study', '.party', '.science', '.trade', '.mom', '.lol',
    '.club', '.vip', '.men', '.kim', '.ninja', '.rocks', '.social', '.fyi', '.ooo',
    '.casa', '.cam', '.capital', '.cash', '.cheap', '.cool', '.country', '.credit', '.creditcard',
    '.cricket', '.delivery', '.diet', '.email', '.express', '.family', '.fashion',
    '.finance', '.fit', '.flowers', '.fun', '.games', '.garden', '.gift', '.gold',
    '.gdn', '.gripe', '.group', '.help', '.hiphop', '.host', '.hosting',
    '.irish', '.kitchen', '.limited', '.llc', '.ltd', '.lotto', '.luxury',
    '.market', '.marketing', '.mba', '.media', '.money', '.movie', '.network', '.news',
    '.one', '.organic', '.pics', '.pictures', '.plus', '.press', '.pro', '.promo',
    '.property', '.protection', '.quest', '.recipes', '.red', '.ren', '.rent', '.rentals',
    '.report', '.reviews', '.rich', '.run', '.sale', '.services', '.sexy', '.shopping',
    '.show', '.singles', '.software', '.solar', '.solutions', '.srl', '.store',
    '.studio', '.style', '.sucks', '.support', '.surf', '.systems', '.tattoo',
    '.tax', '.taxi', '.team', '.tech', '.technology', '.tennis', '.theater', '.tips',
    '.today', '.trading', '.training', '.tube', '.uno', '.vegas', '.ventures',
    '.video', '.vin', '.vision', '.watch', '.wedding', '.wiki', '.wine', '.world',
    '.wtf', '.xin', '.zone',
    // Một số ccTLD đôi khi bị lạm dụng rộng rãi do chính sách lỏng lẻo hoặc được quảng bá toàn cầu
    '.ws', // (Western Samoa) quảng bá là "website"
    '.biz', // Mặc dù là gTLD cũ nhưng vẫn có tỷ lệ spam cao
    '.info', // Tương tự .biz
    '.asia', // Dành cho châu Á nhưng có thể bị lạm dụng
    '.ag', // (Antigua and Barbuda)
    '.bz', // (Belize)
    '.cc', // (Cocos Islands)
    '.la', // (Laos) - thường được dùng cho Los Angeles
    '.lc', // (Saint Lucia)
    '.me', // (Montenegro) - phổ biến cho trang cá nhân, nhưng cũng có thể bị lạm dụng
    '.nu', // (Niue) - "now" trong tiếng Thụy Điển/Đan Mạch/Hà Lan
    '.pe', // (Peru)
    '.ph', // (Philippines)
    '.sc', // (Seychelles)
    '.sh', // (Saint Helena)
    '.st', // (São Tomé and Príncipe)
    '.sg', // (Singapore) - Cẩn thận nếu có đối tác/khách hàng hợp pháp ở đây
    '.vc', // (Saint Vincent and the Grenadines)
    '.ae', // (UAE) - Cẩn thận
    '.cn', // (Trung Quốc) - Rất nhiều website, có thể gây nhiều false positives
    '.ru', // (Nga) - Tương tự .cn
    '.in', // (Ấn Độ)
    '.br', // (Brazil)
    '.id', // (Indonesia)
    '.pl', // (Ba Lan)
    '.ir', // (Iran) - Cẩn thận với các lệnh trừng phạt/chặn IP
    '.pk', // (Pakistan)
    '.za', // (Nam Phi)
    '.tr', // (Thổ Nhĩ Kỳ)

    // '.vn' - KHÔNG NÊN đưa vào nếu TARGET_URL của bạn là .vn hoặc bạn có nhiều liên kết .vn hợp lệ.
  ],

  // Danh sách các đường dẫn Disallow trong robots.txt cần theo dõi (có thể là regex string)
  SUSPICIOUS_DISALLOW_PATHS_ROBOTS: [
      // '/wp-content/plugins/this-is-a-fake-plugin-path/',
      // '/wp-content/uploads/very-hidden-folder/',
      // '/some-secret-admin-path/',
  ],

  OUTBOUND_LINK_WHITELIST: [
    'facebook.com', 'twitter.com', 'youtube.com', 'linkedin.com', 'instagram.com', 'pinterest.com', 'm.me', 'zalo.me', 
    'google.com', 'googletagmanager.com', 'google-analytics.com', 'googleapis.com', 'gstatic.com',
    'jsdelivr.net', 'cloudflare.com', 'bootstrapcdn.com', 'cdnjs.cloudflare.com',
    'vgm.vn', 'vmstatic.com', 'doubleclick.net', 'amazon-adsystem.com',
    'wordpress.org', 'w.org', 'gravatar.com',
  ],
  IFRAME_SOURCE_WHITELIST: [
    'youtube.com', 'vimeo.com', 'dailymotion.com',
    'google.com', 'googletagmanager.com',
    'facebook.com',
    'googleads.g.doubleclick.net',
    'googlesyndication.com',
  ],
  REPORT_ALL_NON_WHITELISTED_OUTBOUND: false,
  NOTIFY_ON_WARNING: true,
  MAX_TELEGRAM_MESSAGE_LENGTH: 4000,
  TIMEZONE: 'Asia/Ho_Chi_Minh',
};

// === PHẦN CÒN LẠI CỦA SCRIPT GIỮ NGUYÊN KHÔNG THAY ĐỔI BẤT KỲ PHẦN NÀO NẾU BẠN KHÔNG PHẢI LÀ DEV===

let issuesFound = [];

/**
 * Hàm chính được kích hoạt.
 * Hàm này điều phối tất cả các kiểm tra.
 */
function checkWebsiteSecurity() {
  issuesFound = []; 
  const url = CONFIG.TARGET_URL;
  if (!url || !url.startsWith('http')) {
    Logger.log('LỖI: TARGET_URL không hợp lệ trong CONFIG.');
    sendTelegramMessageWrapper("🚨 Lỗi Cấu Hình: TARGET_URL không hợp lệ. Vui lòng kiểm tra lại.", "CRITICAL");
    return;
  }
  const siteDomain = getDomainFromUrl(url);
  if (!siteDomain) {
     Logger.log(`LỖI: Không thể trích xuất tên miền từ TARGET_URL: ${url}`);
     sendTelegramMessageWrapper(`🚨 Lỗi Cấu Hình: Không thể trích xuất tên miền từ TARGET_URL: ${url}. Vui lòng kiểm tra lại.`, "CRITICAL");
     return;
  }
  Logger.log(`--- Ξ Bắt đầu kiểm tra website: ${url} lúc ${getVietnameseTimestamp()} Ξ ---`);

  let normalUserResponse, googleBotResponse, googleRefererResponse;
  let normalUserContent = '', googleBotContent = '', googleRefererContent = ''; 

  Logger.log("1. Truy cập website nhuw người dùng thật...");
  normalUserResponse = fetchPage(url, {
    method: 'get',
    headers: { 'User-Agent': CONFIG.USER_AGENTS.NORMAL_USER },
    muteHttpExceptions: true,
    followRedirects: false 
  });
  if (normalUserResponse) {
    normalUserContent = normalUserResponse.getContentText();
    analyzeHttpResponse(normalUserResponse, normalUserContent, url, 'NormalUser', siteDomain);
  } else {
    addIssue("CRITICAL", `Không thể truy cập ${url} với User-Agent người dùng. Host có thể die hoặc bị chặn.`, `URL: ${url}`);
  }

  if (CONFIG.CHECKS_ENABLED.CLOAKING_CONTENT_DIFF || CONFIG.CHECKS_ENABLED.HTTP_STATUS_AND_HOST) {
    Utilities.sleep(2000); 
    Logger.log("2. Yêu cầu với User-Agent Googlebot...");
    googleBotResponse = fetchPage(url, {
      method: 'get',
      headers: { 'User-Agent': CONFIG.USER_AGENTS.GOOGLE_BOT },
      muteHttpExceptions: true,
      followRedirects: false
    });
    if (googleBotResponse) {
      googleBotContent = googleBotResponse.getContentText();
      analyzeHttpResponse(googleBotResponse, googleBotContent, url, 'Googlebot', siteDomain);
    } else {
      addIssue("WARNING", `Không thể truy cập ${url} với User-Agent Googlebot. Kiểm tra cấu hình chặn bot.`, `URL: ${url}`);
    }

    Utilities.sleep(2000); // Tạm dừng một chút
    Logger.log("3. Yêu cầu với Referer từ Google Search...");
    googleRefererResponse = fetchPage(url, {
      method: 'get',
      headers: {
        'User-Agent': CONFIG.USER_AGENTS.GOOGLE_REFERER,
        'Referer': CONFIG.GOOGLE_REFERER_URL
      },
      muteHttpExceptions: true,
      followRedirects: false // Quan trọng để phát hiện chuyển hướng dựa trên referer
    });
    if (googleRefererResponse) {
      googleRefererContent = googleRefererResponse.getContentText();
      analyzeHttpResponse(googleRefererResponse, googleRefererContent, url, 'GoogleReferer', siteDomain);
    } else {
      addIssue("WARNING", `Không thể truy cập ${url} với Referer từ Google.`, `URL: ${url}`);
    }
  }

  // --- Phân tích nội dung HTML (chủ yếu từ góc độ người dùng thường, nhưng có thể mở rộng) ---
  if (normalUserContent) {
    Logger.log("--- Phân tích nội dung HTML (Normal User) ---");
    if (CONFIG.CHECKS_ENABLED.META_REFRESH_REDIRECTS) {
      checkForMetaRefresh(normalUserContent, url, siteDomain);
    }
    if (CONFIG.CHECKS_ENABLED.HIDDEN_CONTENT_CSS) {
      checkForHiddenContentCSS(normalUserContent, url, siteDomain);
    }
    if (CONFIG.CHECKS_ENABLED.SPAM_KEYWORDS) {
      checkForSpamKeywords(normalUserContent, url, siteDomain);
    }
    if (CONFIG.CHECKS_ENABLED.UNUSUAL_OUTBOUND_LINKS) {
      checkForOutboundLinks(normalUserContent, url, siteDomain);
    }
    if (CONFIG.CHECKS_ENABLED.SUSPICIOUS_IFRAMES) {
      checkForIframes(normalUserContent, url, siteDomain);
    }
    if (CONFIG.CHECKS_ENABLED.BASE64_ENCODED_STRINGS) {
      checkForBase64(normalUserContent, url);
    }
  } else {
    Logger.log("Không có nội dung từ Normal User để phân tích sâu.");
  }

  // --- Phát hiện Cloaking (So sánh các phản hồi) ---
  if (CONFIG.CHECKS_ENABLED.CLOAKING_CONTENT_DIFF && normalUserResponse && googleBotResponse) {
    Logger.log("--- So sánh phản hồi (Cloaking Detection) ---");
    compareResponses(normalUserResponse, googleBotResponse, normalUserContent, googleBotContent, url, siteDomain, 'NormalUser', 'Googlebot');
  }
  // So sánh Normal User với Google Referer Response
  if (CONFIG.CHECKS_ENABLED.CLOAKING_CONTENT_DIFF && normalUserResponse && googleRefererResponse) {
      // Kiểm tra chuyển hướng dựa trên referer đã được xử lý trong analyzeHttpResponse
      // Ở đây, ta so sánh nội dung nếu không có chuyển hướng
      if (normalUserResponse.getResponseCode() === googleRefererResponse.getResponseCode() &&
          !(googleRefererResponse.getHeaders()['Location'] || googleRefererResponse.getHeaders()['location'])) {
          compareResponses(normalUserResponse, googleRefererResponse, normalUserContent, googleRefererContent, url, siteDomain, 'NormalUser', 'GoogleReferer');
      } else if (googleRefererResponse.getHeaders()['Location'] || googleRefererResponse.getHeaders()['location']) {
            Logger.log(`[CLOAKING_INFO] Phát hiện chuyển hướng khi có Referer Google. Chi tiết đã được ghi nhận bởi analyzeHttpResponse.`);
      }
  }


  // --- Kiểm tra robots.txt ---
  if (CONFIG.CHECKS_ENABLED.ROBOTS_TXT) {
    Logger.log("--- Kiểm tra robots.txt ---");
    checkRobotsTxt(siteDomain);
  }

  // --- Gửi báo cáo tổng hợp ---
  Logger.log(`--- Ξ Kết thúc kiểm tra website: ${url} lúc ${getVietnameseTimestamp()} Ξ ---`);
  sendConsolidatedReport();
}

/**
 * Hàm tiện ích để thêm một vấn đề vào danh sách toàn cục.
 * @param {string} severity "CRITICAL", "WARNING", "INFO"
 * @param {string} title Mô tả ngắn về vấn đề.
 * @param {string} details Thông tin chi tiết về vấn đề.
 */
function addIssue(severity, title, details) {
  const timestamp = getVietnameseTimestamp();
  const existingIssue = issuesFound.find(issue => issue.title === title && issue.details === details);
  if (existingIssue) {
    // Logger.log(`[DUPLICATE_ISSUE_SKIPPED] ${title} - ${details}`);
    return;
  }

  const issue = {
    severity: severity,
    title: title,
    details: details,
    timestamp: timestamp
  };
  issuesFound.push(issue);
  Logger.log(`[${severity}] ${title} - ${details.substring(0, 200)}... (lúc ${timestamp})`);
}

/**
 * Lấy trang với các tùy chọn được chỉ định và xử lý lỗi cơ bản.
 * Bao gồm đo thời gian phản hồi.
 * @param {string} url URL để lấy.
 * @param {object} options Các tùy chọn cho UrlFetchApp.fetch().
 * @return {HTTPResponse|null} Đối tượng HTTPResponse hoặc null nếu thất bại.
 */
function fetchPage(url, options) {
  let response;
  const startTime = new Date().getTime();
  try {
    const uaString = options.headers ? options.headers['User-Agent'] || 'Mặc định' : 'Mặc định';
    const refererString = options.headers && options.headers['Referer'] ? ` và Referer: ${options.headers['Referer']}` : '';
    Logger.log(`Đang lấy: ${url} với User-Agent: ${uaString}${refererString}`);

    response = UrlFetchApp.fetch(url, options);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    Logger.log(`Status: ${response.getResponseCode()}, Thời gian: ${duration.toFixed(2)}s`);

    if (CONFIG.CHECKS_ENABLED.RESPONSE_TIME && duration > CONFIG.MAX_RESPONSE_TIME_SECONDS) {
      addIssue("WARNING", `Thời gian phản hồi chậm (${duration.toFixed(2)}s).`,
        `URL: ${url}\nUser-Agent: ${uaString}\nNgưỡng: ${CONFIG.MAX_RESPONSE_TIME_SECONDS}s`);
    }
    return response;
  } catch (e) {
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    Logger.log(`Lỗi khi fetch ${url}: ${e.message}. Thời gian: ${duration.toFixed(2)}s`);
    if (!options.muteHttpExceptions) {
        addIssue("CRITICAL", `Lỗi nghiêm trọng khi truy cập URL.`, `URL: ${url}\nLỗi: ${e.message}\nUser-Agent: ${options.headers ? options.headers['User-Agent'] : 'N/A'}`);
    }
    return null;
  }
}


/**
 * Phân tích phản hồi HTTP (trạng thái, header, chuyển hướng cơ bản).
 * @param {HTTPResponse} response Đối tượng HTTPResponse.
 * @param {string} content Nội dung văn bản của phản hồi.
 * @param {string} url URL đã được fetch.
 * @param {string} requestType Định danh cho request (ví dụ: "NormalUser", "Googlebot").
 * @param {string} siteDomain Tên miền gốc của trang web.
 */
function analyzeHttpResponse(response, content, url, requestType, siteDomain) {
  if (!response) {
    if (!issuesFound.some(iss => iss.details.includes(url) && iss.title.includes("Không thể truy cập"))) {
        addIssue("CRITICAL", `[${requestType}] Không nhận được phản hồi từ server.`, `URL: ${url}. Host có thể die hoặc URL không thể truy cập.`);
    }
    return;
  }

  const statusCode = response.getResponseCode();
  const headers = response.getHeaders();

  Logger.log(`[${requestType}] Phân tích phản hồi từ: ${url} - Status: ${statusCode}`);

  // 1. Kiểm tra Mã Trạng thái HTTP
  if (CONFIG.CHECKS_ENABLED.HTTP_STATUS_AND_HOST) {
    if (statusCode !== 200 && !(statusCode >= 300 && statusCode < 400)) {
      let severity = "WARNING";
      if (statusCode === 403) severity = "CRITICAL";
      if (statusCode >= 500) severity = "CRITICAL";
      if (statusCode === 404 && url === CONFIG.TARGET_URL) severity = "CRITICAL";
      else if (statusCode === 404) severity = "WARNING";

      addIssue(severity, `[${requestType}] Mã trạng thái HTTP bất thường: ${statusCode}.`,
        `URL: ${url}\nNội dung một phần (nếu có):\n${content ? content.substring(0, 200) + '...' : 'Không có nội dung'}`);
    }
  }

  // 2. Kiểm tra Chuyển hướng (header Location)
  if (CONFIG.CHECKS_ENABLED.HTTP_STATUS_AND_HOST) {
    const location = headers['Location'] || headers['location'];
    if (location) {
      const targetDomain = getDomainFromUrl(location);
      const isExternalRedirect = targetDomain && targetDomain !== siteDomain;

      if (isExternalRedirect) {
        addIssue("CRITICAL", `[${requestType}] Phát hiện CHUYỂN HƯỚNG RA NGOÀI bất thường.`,
          `URL gốc: ${url} (Status: ${statusCode})\nChuyển hướng tới: ${location}\nĐây có thể là dấu hiệu website bị hack.`);
      } else if (requestType === 'GoogleReferer' && url !== location) {
        addIssue("WARNING", `[${requestType}] Chuyển hướng NỘI BỘ ĐÁNG NGỜ khi truy cập từ Google Search.`,
          `URL gốc: ${url} (Status: ${statusCode})\nChuyển hướng nội bộ tới: ${location}\nCó thể là cloaking hoặc tracking.`);
      } else if (url !== location) {
        Logger.log(`[${requestType}] Chuyển hướng nội bộ từ ${url} (Status: ${statusCode}) đến ${location}.`);
      }
    }
  }

  // 3. Kiểm tra Headers Phản hồi
  if (CONFIG.CHECKS_ENABLED.RESPONSE_HEADERS && content) {
    const contentTypeHeader = headers['Content-Type'] || headers['content-type'];
    if (contentTypeHeader && !contentTypeHeader.includes('text/html') && !contentTypeHeader.includes('application/xhtml+xml') && !contentTypeHeader.includes('application/xml')) {
      const commonAllowedTypes = ['.css', '.js', 'image/', 'application/json', 'font/', 'application/pdf', 'text/plain', 'text/xml'];
      let isAllowedType = false;
      for (const type of commonAllowedTypes) {
        if (url.endsWith(type) || contentTypeHeader.includes(type)) {
          isAllowedType = true;
          break;
        }
      }
      if (!isAllowedType) {
        addIssue("WARNING", `[${requestType}] Content-Type không mong đợi: ${contentTypeHeader}.`,
          `URL: ${url}\nTrang có thể đang trả về file không phải HTML (ví dụ: file độc hại).`);
      }
    }

    const xRobotsTagHeader = headers['X-Robots-Tag'] || headers['x-robots-tag'];
    if (xRobotsTagHeader) {
      const xRobotsTag = xRobotsTagHeader.toLowerCase();
      if ((xRobotsTag.includes('noindex') || xRobotsTag.includes('nofollow'))) {
        const context = (requestType === 'Googlebot') ? "cho Googlebot" : `cho ${requestType}`;
        addIssue("WARNING", `[${requestType}] Phát hiện X-Robots-Tag: ${xRobotsTagHeader} ${context}.`,
          `URL: ${url}\nĐiều này có thể ngăn máy tìm kiếm index trang. Kiểm tra nếu đây là chủ đích.`);
      }
    }
  }
}

/**
 * Kiểm tra thẻ <meta http-equiv="refresh"> để phát hiện chuyển hướng.
 * @param {string} htmlContent Nội dung HTML của trang.
 * @param {string} url URL của trang.
 * @param {string} siteDomain Tên miền gốc của trang.
 */
function checkForMetaRefresh(htmlContent, url, siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.META_REFRESH_REDIRECTS) return;
  const metaRefreshRegex = /<meta\s+http-equiv=["']refresh["']\s+content=["']\s*\d+\s*;\s*url=([^"']+?)["']/gi;
  let match;
  while ((match = metaRefreshRegex.exec(htmlContent)) !== null) {
    const redirectUrl = match[1].trim();
    if (!redirectUrl) continue;

    const targetDomain = getDomainFromUrl(redirectUrl);
    const isExternalRedirect = targetDomain && targetDomain !== siteDomain;

    let severity = "WARNING";
    let messageTitle = `Phát hiện thẻ Meta Refresh chuyển hướng tới: ${redirectUrl}.`;
    if (isExternalRedirect) {
        severity = "CRITICAL";
        messageTitle = `Phát hiện thẻ Meta Refresh CHUYỂN HƯỚNG RA NGOÀI NGUY HIỂM tới: ${redirectUrl}.`;
    }
    addIssue(severity, messageTitle, `URL gốc: ${url}\nThẻ Meta: ${match[0]}`);
  }
}

/**
 * Giải mã URI một cách an toàn, trả về chuỗi gốc nếu có lỗi.
 * @param {string} uri Chuỗi URI cần giải mã.
 * @return {string} Chuỗi đã giải mã hoặc chuỗi gốc.
 */
function decodeURIComponentSafe(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    return uri;
  }
}

/**
 * Kiểm tra các kỹ thuật CSS phổ biến dùng để ẩn nội dung/link.
 * Tập trung vào inline styles và các thuộc tính phổ biến.
 * @param {string} htmlContent Nội dung HTML.
 * @param {string} url URL của trang.
 * @param {string} siteDomain Tên miền gốc của trang.
 */
function checkForHiddenContentCSS(htmlContent, url, siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.HIDDEN_CONTENT_CSS) return;

  const hidingStylesPatterns = [
    { pattern: /position\s*:\s*absolute\s*;\s*left\s*:\s*-\d{3,}px/i, desc: "position: absolute; left: giá trị âm lớn" },
    { pattern: /position\s*:\s*absolute\s*;\s*top\s*:\s*-\d{3,}px/i, desc: "position: absolute; top: giá trị âm lớn" },
    { pattern: /position\s*:\s*fixed\s*;\s*left\s*:\s*-\d{3,}px/i, desc: "position: fixed; left: giá trị âm lớn" },
    { pattern: /position\s*:\s*fixed\s*;\s*top\s*:\s*-\d{3,}px/i, desc: "position: fixed; top: giá trị âm lớn" },
    { pattern: /display\s*:\s*none/i, desc: "display: none" },
    { pattern: /visibility\s*:\s*hidden/i, desc: "visibility: hidden" },
    { pattern: /opacity\s*:\s*0(\.0+)?/i, desc: "opacity: 0" },
    { pattern: /(?:width\s*:\s*(0|1)(px|%|em|rem)?\s*;?\s*height\s*:\s*(0|1)(px|%|em|rem)?)|(?:height\s*:\s*(0|1)(px|%|em|rem)?\s*;?\s*width\s*:\s*(0|1)(px|%|em|rem)?)/i, desc: "width/height: 0px hoặc 1px" },
    { pattern: /font-size\s*:\s*(0|1)(px|%|em|rem)?/i, desc: "font-size: 0px hoặc 1px" },
    { pattern: /text-indent\s*:\s*-\d{3,}px/i, desc: "text-indent: giá trị âm lớn" },
    { pattern: /z-index\s*:\s*-\d+/i, desc: "z-index: giá trị âm" },
    { pattern: /clip\s*:\s*rect\(\s*(0|1)(px)?\s*,\s*(0|1)(px)?\s*,\s*(0|1)(px)?\s*,\s*(0|1)(px)?\s*\)/i, desc: "CSS clip (0x0 hoặc 1x1)"},
    { pattern: /clip-path\s*:\s*(?:inset\s*\(100%\)|polygon\s*\(0%? 0%?,0%? 0%?,0%? 0%?\)|circle\s*\(0%?\s*at\s*\d+%\s*\d+%\))/i, desc: "CSS clip-path ẩn (inset 100%, polygon 0, circle 0)" }
  ];

  const elementRegex = /<([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let elementMatch;

  while ((elementMatch = elementRegex.exec(htmlContent)) !== null) {
    const tagName = elementMatch[1].toLowerCase();
    const attributes = elementMatch[2];
    let innerElementContent = elementMatch[3];

    let styleAttr = '';
    const styleMatch = attributes.match(/style=["']([^"']+)["']/i);
    if (styleMatch) {
      styleAttr = styleMatch[1].toLowerCase();
    }

    let isElementHidden = false;
    let hidingTechnique = "";

    for (const p of hidingStylesPatterns) {
      if (p.pattern.test(styleAttr)) {
        isElementHidden = true;
        hidingTechnique = p.desc;
        break;
      }
    }

    const colorMatchInStyle = styleAttr.match(/color\s*:\s*([^;]+)/i);
    const backgroundMatchInStyle = styleAttr.match(/(?:background\s*:\s*([^;]+)|background-color\s*:\s*([^;]+))/i);
    if (colorMatchInStyle && backgroundMatchInStyle) {
      const color = (colorMatchInStyle[1] || "").trim().toLowerCase().replace(/\s+/g, '');
      const bgColorRaw = (backgroundMatchInStyle[1] || backgroundMatchInStyle[2] || "").trim().toLowerCase();
      const bgColor = bgColorRaw.split(' ')[0].replace(/\s+/g, '');
      if (color && bgColor && color === bgColor && color !== 'transparent' && color !== 'inherit' && innerElementContent.trim().length > 0) {
        isElementHidden = true;
        hidingTechnique = (hidingTechnique ? hidingTechnique + " và " : "") + "màu chữ trùng màu nền";
      }
    }

    if (isElementHidden) {
      const linkRegexForHidden = /<a\s+[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
      let linkMatchInHidden;
      let hasFoundSuspiciousLinkInHiddenElement = false;
      const processedHrefsInThisHiddenElement = new Set();
      
      let currentRegexInstance = new RegExp(linkRegexForHidden.source, 'gi');

      while ((linkMatchInHidden = currentRegexInstance.exec(innerElementContent)) !== null) {
        const href = linkMatchInHidden[2].trim();
        const anchorTextHTML = linkMatchInHidden[3];
        const anchorText = anchorTextHTML.replace(/<[^>]+>/g, '').trim();

        if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
        if (processedHrefsInThisHiddenElement.has(href + "||" + anchorText.substring(0,20))) continue;

        let linkSeverity = "WARNING";
        let issueTitle = `LINK trong NỘI DUNG BỊ ẨN.`;
        let isTrulySuspicious = false;
        let reasonForSuspicion = "";

        const linkDomain = getDomainFromUrl(href);
        const isExternalNonWhitelisted = linkDomain && linkDomain !== siteDomain && !isWhitelistedDomain(linkDomain, CONFIG.OUTBOUND_LINK_WHITELIST);

        for (const keyword of CONFIG.SPAM_KEYWORDS_LIST) {
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
          if (keywordRegex.test(anchorText) || keywordRegex.test(decodeURIComponentSafe(href))) {
            linkSeverity = "CRITICAL";
            issueTitle = `LINK SPAM (từ khóa "${keyword}") trong NỘI DUNG BỊ ẨN.`;
            reasonForSuspicion = `chứa từ khóa spam "${keyword}"`;
            isTrulySuspicious = true;
            break;
          }
        }

        if (!isTrulySuspicious && isExternalNonWhitelisted) {
          const tld = linkDomain.substring(linkDomain.lastIndexOf('.')).toLowerCase();
          if (CONFIG.SUSPICIOUS_TLDS.includes(tld)) {
            linkSeverity = "CRITICAL";
            issueTitle = `LINK SPAM (TLD đáng ngờ ${tld}) trong NỘI DUNG BỊ ẨN.`;
            reasonForSuspicion = `TLD đáng ngờ (${tld})`;
            isTrulySuspicious = true;
          }
        }
        
        if (!isTrulySuspicious && isExternalNonWhitelisted) {
            issueTitle = `LINK RA NGOÀI (không whitelist) trong NỘI DUNG BỊ ẨN.`;
            reasonForSuspicion = `không có trong whitelist và là link ngoài`;
            linkSeverity = "WARNING";
            isTrulySuspicious = true;
        }


        if (isTrulySuspicious) {
          hasFoundSuspiciousLinkInHiddenElement = true;
          addIssue(linkSeverity, issueTitle,
            `URL trang: ${url}\nKỹ thuật ẩn của thẻ cha (<${tagName}>): ${hidingTechnique}\nStyle thẻ cha (nếu có): "${styleAttr.substring(0,100)}..."\nLink đáng ngờ: ${href}\nAnchor text: "${anchorText.substring(0,100)}..."\nLý do: ${reasonForSuspicion}`);
          processedHrefsInThisHiddenElement.add(href + "||" + anchorText.substring(0,20));
        }
      }

      if (!hasFoundSuspiciousLinkInHiddenElement &&
          tagName !== 'script' && tagName !== 'style' &&
          innerElementContent.replace(/<[^>]+>/g, '').trim().length > 10 &&
          !isWhitelistedContent(innerElementContent) ) {
        addIssue("WARNING", `NỘI DUNG TEXT bị ẩn (không chứa link spam rõ ràng).`,
          `URL trang: ${url}\nKỹ thuật ẩn: ${hidingTechnique}\nThẻ: <${tagName}>\nStyle (nếu có): "${styleAttr.substring(0,100)}..."\nNội dung text (100 chars): ${innerElementContent.replace(/<[^>]+>/g, ' ').trim().substring(0,100)}...`);
      }
    }
  }
}

/**
 * Placeholder cho nội dung được whitelist có thể bị ẩn một cách hợp lệ
 * (ví dụ: văn bản cho trình đọc màn hình, một số phần tử framework)
 * @param {string} content Nội dung cần kiểm tra.
 * @return {boolean} True nếu được whitelist.
 */
function isWhitelistedContent(content) {
    if (/\bsr-only\b|\bvisually-hidden\b|\bscreen-reader-text\b/i.test(content)) return true;
    if (content.trim().length < 10 && !content.includes('<a')) return true;
    return false;
}


/**
 * Kiểm tra từ khóa spam trong văn bản hiển thị, anchor text, và href của link.
 * @param {string} htmlContent Nội dung HTML.
 * @param {string} url URL của trang.
 * @param {string} siteDomain Tên miền gốc của trang.
 */
function checkForSpamKeywords(htmlContent, url, siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.SPAM_KEYWORDS) return;

  const linkRegex = /<a\s+[^>]*?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
  let linkMatch;
  const foundSpamLinkDetails = new Set();

  while ((linkMatch = linkRegex.exec(htmlContent)) !== null) {
    const href = linkMatch[2].trim();
    const anchorTextHTML = linkMatch[3];
    const anchorText = anchorTextHTML.replace(/<[^>]+>/g, '').trim();

    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;

    for (const keyword of CONFIG.SPAM_KEYWORDS_LIST) {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
      let isSpam = false;
      let spamLocation = "";

      if (keywordRegex.test(anchorText)) {
        isSpam = true;
        spamLocation = "trong anchor text";
      }
      if (!isSpam && (keywordRegex.test(href) || keywordRegex.test(decodeURIComponentSafe(href)))) {
        isSpam = true;
        spamLocation = "trong URL (href)";
      }

      if (isSpam) {
        const detailKey = `LinkSpam:${keyword}|${href}|${anchorText.substring(0,30)}`;
        if (!foundSpamLinkDetails.has(detailKey)) {
          addIssue("CRITICAL", `Phát hiện TỪ KHÓA SPAM ("${keyword}") ${spamLocation} của link.`,
            `URL trang: ${url}\nTừ khóa: "${keyword}"\nAnchor text: "${anchorText.substring(0,100)}..."\nLink: ${href}`);
          foundSpamLinkDetails.add(detailKey);
        }
      }
    }
  }

  let textContent = htmlContent.replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '');
  textContent = textContent.replace(/<style[^>]*>([\S\s]*?)<\/style>/gi, '');
  textContent = textContent.replace(/<[^>]+>/g, ' ');
  textContent = textContent.replace(/\s+/g, ' ').trim();

  for (const keyword of CONFIG.SPAM_KEYWORDS_LIST) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
    let foundTextMatch;
    const searchContextRegex = new RegExp(`.{0,50}${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.{0,50}`, 'gi');

    while((foundTextMatch = searchContextRegex.exec(textContent)) !== null) {
        let alreadyAlertedInLink = issuesFound.some(issue =>
            (issue.title.includes("TỪ KHÓA SPAM") && issue.title.includes("của link")) &&
            issue.details.includes(`Từ khóa: "${keyword}"`) &&
            issue.details.includes(foundTextMatch[0].trim().substring(0,50))
        );

        if (!alreadyAlertedInLink) {
            const detailKey = `TextSpam:${keyword}|${foundTextMatch[0].trim().substring(0,30)}`;
            if (!foundSpamLinkDetails.has(detailKey)) {
                 addIssue("WARNING", `Phát hiện TỪ KHÓA SPAM ("${keyword}") trong nội dung text của trang.`,
                    `URL trang: ${url}\nTừ khóa: "${keyword}"\nNgữ cảnh: "...${foundTextMatch[0].trim()}..."\n(Cần kiểm tra xem có phải là "từ khóa bị cấm" không)`);
                foundSpamLinkDetails.add(detailKey);
            }
        }
    }
  }

  for (const keyword of CONFIG.SPAM_KEYWORDS_LIST) {
    if (keyword.length < 3) continue;
    const encodedHex = keyword.split('').map(char => `&#x${char.charCodeAt(0).toString(16)};`).join('');
    const encodedDec = keyword.split('').map(char => `&#${char.charCodeAt(0)};`).join('');
    if (htmlContent.toLowerCase().includes(encodedHex.toLowerCase())) {
       addIssue("CRITICAL", `Phát hiện TỪ KHÓA SPAM được mã hóa (HTML Entities Hex).`,
          `URL trang: ${url}\nTừ khóa gốc: "${keyword}"\nDạng mã hóa (một phần): ${encodedHex.substring(0,50)}...`);
    }
    if (htmlContent.toLowerCase().includes(encodedDec.toLowerCase())) {
       addIssue("CRITICAL", `Phát hiện TỪ KHÓA SPAM được mã hóa (HTML Entities Dec).`,
          `URL trang: ${url}\nTừ khóa gốc: "${keyword}"\nDạng mã hóa (một phần): ${encodedDec.substring(0,50)}...`);
    }
  }
}

/**
 * Kiểm tra các liên kết ra ngoài bất thường (không nhất thiết phải ẩn).
 * @param {string} htmlContent Nội dung HTML.
 * @param {string} url URL của trang.
 * @param {string} siteDomain Tên miền gốc của trang.
 */
function checkForOutboundLinks(htmlContent, url, siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.UNUSUAL_OUTBOUND_LINKS) return;

  const linkRegex = /<a\s+[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
  let match;
  const reportedOutboundLinks = new Set();

  while ((match = linkRegex.exec(htmlContent)) !== null) {
    let href = match[2].trim();
    const anchorTextHTML = match[3];
    const anchorText = anchorTextHTML.replace(/<[^>]+>/g, '').trim();

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    if (reportedOutboundLinks.has(href)) continue;

    const linkDomain = getDomainFromUrl(href);

    if (linkDomain && linkDomain !== siteDomain) {
      if (isWhitelistedDomain(linkDomain, CONFIG.OUTBOUND_LINK_WHITELIST)) {
        continue;
      }

      let alreadyReportedAsSpam = issuesFound.some(issue =>
          issue.details.includes(href) &&
          (issue.title.includes("LINK SPAM") || issue.title.includes("NỘI DUNG BỊ ẨN"))
      );
      if (alreadyReportedAsSpam) {
          reportedOutboundLinks.add(href);
          continue;
      }


      let isSuspicious = false;
      let reason = "";
      let severity = "WARNING";

      const tld = '.' + linkDomain.substring(linkDomain.lastIndexOf('.') + 1);
      if (CONFIG.SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
        isSuspicious = true;
        reason = `TLD đáng ngờ (${tld})`;
        severity = "CRITICAL";
      }

      if (!isSuspicious && CONFIG.REPORT_ALL_NON_WHITELISTED_OUTBOUND) {
          isSuspicious = true;
          reason = "không có trong whitelist và không bị gắn cờ spam khác";
          severity = "INFO";
      }


      if (isSuspicious) {
        addIssue(severity, `Link ra ngoài ĐÁNG NGỜ (${reason}).`,
          `URL trang: ${url}\nLink: ${href}\nAnchor text: "${anchorText.substring(0,100)}..."\nDomain: ${linkDomain}`);
        reportedOutboundLinks.add(href);
      }
    }
  }
}


/**
 * Kiểm tra các iframe đáng ngờ.
 * @param {string} htmlContent Nội dung HTML.
 * @param {string} url URL của trang.
 * @param {string} siteDomain Tên miền gốc của trang.
 */
function checkForIframes(htmlContent, url, siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.SUSPICIOUS_IFRAMES) return;

  const iframeRegex = /<iframe([^>]+)>/gi;
  let iframeMatch;
  while ((iframeMatch = iframeRegex.exec(htmlContent)) !== null) {
    const attributes = iframeMatch[1];
    let src = '';
    const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      src = srcMatch[1].trim();
    } else {
      const dataSrcMatch = attributes.match(/data-src=["']([^"']+)["']/i);
      if (dataSrcMatch) src = dataSrcMatch[1].trim();
    }

    if (!src || src === 'about:blank') continue;

    const iframeDomain = getDomainFromUrl(src);
    const isIframeWhitelisted = iframeDomain ? isWhitelistedDomain(iframeDomain, CONFIG.IFRAME_SOURCE_WHITELIST) : false;

    // Mục 1: Cảnh báo nếu iframe từ nguồn lạ (không whitelist VÀ không phải domain của trang)
    if (iframeDomain && iframeDomain !== siteDomain && !isIframeWhitelisted) {
      addIssue("CRITICAL", `Phát hiện IFRAME từ nguồn LẠ (không có trong whitelist).`,
        `URL trang: ${url}\nNguồn iFrame: ${src}\nDomain iFrame: ${iframeDomain}`);
    }

    // Mục 2: Kiểm tra xem iframe có bị ẩn không
    let widthMatch = attributes.match(/width=["']?(\d+)["']?/i);
    let heightMatch = attributes.match(/height=["']?(\d+)["']?/i);
    let styleMatch = attributes.match(/style=["']([^"']+)["']/i);

    let isHiddenByAttribute = (widthMatch && (widthMatch[1] === '0' || widthMatch[1] === '1')) &&
                              (heightMatch && (heightMatch[1] === '0' || heightMatch[1] === '1'));
    let isHiddenByCss = false;
    let cssHidingDetails = "";
    if (styleMatch) {
      const styleValue = styleMatch[1].toLowerCase();
      if (styleValue.includes('display:none')) { isHiddenByCss = true; cssHidingDetails = 'display:none'; }
      else if (styleValue.includes('visibility:hidden')) { isHiddenByCss = true; cssHidingDetails = 'visibility:hidden'; }
      else if (styleValue.includes('opacity:0')) { isHiddenByCss = true; cssHidingDetails = 'opacity:0'; }
      if (/\bwidth\s*:\s*(0|1)(px|%|em|rem)?\b/.test(styleValue) && /\bheight\s*:\s*(0|1)(px|%|em|rem)?\b/.test(styleValue) ) {
          isHiddenByCss = true; cssHidingDetails = (cssHidingDetails ? cssHidingDetails + ", " : "") + 'width/height 0/1px in style';
      }
    }
    const isEffectivelyHidden = isHiddenByAttribute || isHiddenByCss;

    // Mục 3: Xử lý iframe bị ẩn
    if (isEffectivelyHidden) {
      const hiddenDetail = isHiddenByAttribute ? `width/height 0/1` : `CSS (${cssHidingDetails})`;

      // Nếu iframe bị ẩn VÀ từ nguồn được whitelist -> chỉ ghi log, không addIssue
      if (isIframeWhitelisted) {
          Logger.log(`[INFO_SKIPPED_FOR_REPORT] IFRAME BỊ ẨN (${hiddenDetail}) từ nguồn được whitelist: ${src} (Domain: ${iframeDomain}). Coi như hành vi kỹ thuật bình thường, không đưa vào báo cáo Telegram.`);
      }
      // Chỉ addIssue (để đưa vào báo cáo) nếu iframe ẩn VÀ KHÔNG được whitelist hoặc từ cùng domain
      else if (!isIframeWhitelisted && iframeDomain !== siteDomain) { // Nguồn lạ và bị ẩn
        addIssue("CRITICAL", `Phát hiện IFRAME BỊ ẨN (${hiddenDetail}) từ nguồn LẠ.`,
          `URL trang: ${url}\nNguồn iFrame: ${src}\nThuộc tính (150 chars): ${attributes.substring(0, 150)}...`);
      } else if (iframeDomain === siteDomain) { // Cùng domain và bị ẩn
         addIssue("WARNING", `Phát hiện IFRAME BỊ ẨN (${hiddenDetail}) từ cùng domain.`,
          `URL trang: ${url}\nNguồn iFrame: ${src}\nThuộc tính (150 chars): ${attributes.substring(0, 150)}...\nCần kiểm tra mục đích.`);
      }
    }
  }
}
/**
 * Kiểm tra các chuỗi Base64 dài hoặc đáng ngờ.
 * @param {string} htmlContent Nội dung HTML.
 * @param {string} url URL của trang.
 */
function checkForBase64(htmlContent, url) {
  if (!CONFIG.CHECKS_ENABLED.BASE64_ENCODED_STRINGS) return;

  const base64PatternGeneral = /(?:[A-Za-z0-9+/]{4}){10,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})?/g;
  const contextRegex = /(href|src|data-src|value|data)\s*=\s*["'](?:data:[^;]*;base64,)?([A-Za-z0-9+/]{50,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)["']/gi;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const suspiciousBase64Strings = new Set();

  let match;
  while ((match = contextRegex.exec(htmlContent)) !== null) {
    const b64string = match[2];
    if (b64string && b64string.length >= CONFIG.MIN_BASE64_LENGTH_TO_CHECK && !suspiciousBase64Strings.has(b64string.substring(0,100))) {
      try {
        const decodedBytes = Utilities.base64Decode(b64string, Utilities.Charset.UTF_8);
        const decodedString = Utilities.newBlob(decodedBytes).getDataAsString();
        if (isDecodedBase64Suspicious(decodedString)) {
          addIssue("CRITICAL", `Phát hiện chuỗi BASE64 đáng ngờ (có thể chứa mã độc/link).`,
              `URL: ${url}\nThuộc tính: ${match[1]}\nBase64 (100 chars): ${b64string.substring(0, 100)}...\nNội dung giải mã (100 chars): ${decodedString.substring(0,100)}...`);
          suspiciousBase64Strings.add(b64string.substring(0,100));
        }
      } catch (e) {
         try {
            const decodedBytesLatin1 = Utilities.base64Decode(b64string);
            const decodedStringLatin1 = Utilities.newBlob(decodedBytesLatin1).getDataAsString("ISO-8859-1");
            if (isDecodedBase64Suspicious(decodedStringLatin1)) {
                 addIssue("CRITICAL", `Phát hiện chuỗi BASE64 đáng ngờ (giải mã Latin-1).`,
                    `URL: ${url}\nThuộc tính: ${match[1]}\nBase64 (100 chars): ${b64string.substring(0, 100)}...\nNội dung giải mã (100 chars): ${decodedStringLatin1.substring(0,100)}...`);
                suspiciousBase64Strings.add(b64string.substring(0,100));
            }
         } catch (e2) {
            if(b64string.length > 200) {
                addIssue("WARNING", `Phát hiện chuỗi BASE64 rất DÀI, không giải mã được (UTF-8/Latin-1).`,
                    `URL: ${url}\nThuộc tính: ${match[1]}\nBase64 (100 chars): ${b64string.substring(0, 100)}...`);
                suspiciousBase64Strings.add(b64string.substring(0,100));
            }
         }
      }
    }
  }

  let scriptContentMatch;
  while((scriptContentMatch = scriptRegex.exec(htmlContent)) !== null) {
      const scriptCode = scriptContentMatch[1];
      let b64matchInScript;
      let currentRegexBase64 = new RegExp(base64PatternGeneral.source, 'g');
      while((b64matchInScript = currentRegexBase64.exec(scriptCode)) !== null) {
          const b64string = b64matchInScript[0];
          if (b64string && b64string.length >= CONFIG.MIN_BASE64_LENGTH_TO_CHECK && !suspiciousBase64Strings.has(b64string.substring(0,100))) {
            try {
                const decoded = Utilities.base64Decode(b64string, Utilities.Charset.UTF_8);
                const decodedString = Utilities.newBlob(decoded).getDataAsString();
                if (isDecodedBase64Suspicious(decodedString)) {
                    addIssue("CRITICAL", `Phát hiện chuỗi BASE64 đáng ngờ trong SCRIPT INLINE.`,
                        `URL: ${url}\nBase64 (100 chars): ${b64string.substring(0, 100)}...\nNội dung giải mã (100 chars): ${decodedString.substring(0,100)}...`);
                    suspiciousBase64Strings.add(b64string.substring(0,100));
                }
            } catch (e) {
                 try {
                    const decodedBytesLatin1 = Utilities.base64Decode(b64string);
                    const decodedStringLatin1 = Utilities.newBlob(decodedBytesLatin1).getDataAsString("ISO-8859-1");
                     if (isDecodedBase64Suspicious(decodedStringLatin1)) {
                        addIssue("CRITICAL", `Phát hiện chuỗi BASE64 đáng ngờ trong SCRIPT INLINE (Latin-1).`,
                            `URL: ${url}\nBase64 (100 chars): ${b64string.substring(0, 100)}...\nNội dung giải mã (100 chars): ${decodedStringLatin1.substring(0,100)}...`);
                        suspiciousBase64Strings.add(b64string.substring(0,100));
                     }
                 } catch (e2) {
                    if(b64string.length > 200) {
                        addIssue("WARNING", `Phát hiện chuỗi BASE64 rất DÀI trong SCRIPT, không giải mã được.`,
                            `URL: ${url}\nBase64 (100 chars): ${b64string.substring(0, 100)}...`);
                        suspiciousBase64Strings.add(b64string.substring(0,100));
                    }
                 }
            }
          }
      }
  }
}

/**
 * Kiểm tra xem nội dung giải mã từ base64 có đáng ngờ không.
 * @param {string} decodedString Chuỗi đã giải mã.
 * @return {boolean} True nếu đáng ngờ.
 */
function isDecodedBase64Suspicious(decodedString) {
    if (!decodedString) return false;
    const lowerDecoded = decodedString.toLowerCase();
    if (lowerDecoded.includes('<script') || lowerDecoded.includes('eval(') ||
        lowerDecoded.includes('document.write') || lowerDecoded.includes('iframe') ||
        lowerDecoded.includes('unescape(') || lowerDecoded.includes('fromCharCode(') ||
        lowerDecoded.includes('window.location') || lowerDecoded.includes('setAttribute') ||
        CONFIG.SPAM_KEYWORDS_LIST.some(k => lowerDecoded.includes(k.toLowerCase())) ||
        /https?:\/\//i.test(decodedString)) {
        return true;
    }
    if (/(\\x[0-9a-f]{2}){5,}/i.test(decodedString)) return true;
    return false;
}


/**
 * So sánh các phản hồi từ các user agent khác nhau để phát hiện cloaking.
 * @param {HTTPResponse} response1
 * @param {HTTPResponse} response2
 * @param {string} content1
 * @param {string} content2
 * @param {string} url
 * @param {string} siteDomain

 */
function compareResponses(response1, response2, content1, content2, url, siteDomain, type1Name, type2Name) {
  if (!CONFIG.CHECKS_ENABLED.CLOAKING_CONTENT_DIFF || !response1 || !response2 || !content1 || !content2) return;

  if (response1.getResponseCode() !== response2.getResponseCode()) {
    addIssue("CRITICAL", `Phát hiện CLOAKING (Mã Trạng thái khác nhau).`,
      `URL: ${url}\n${type1Name} Status: ${response1.getResponseCode()}\n${type2Name} Status: ${response2.getResponseCode()}\nĐây là dấu hiệu mạnh của việc che giấu nội dung.`);
  }

  const len1 = content1.length;
  const len2 = content2.length;
  const diff = Math.abs(len1 - len2);
  const maxLen = Math.max(len1, len2);
  if (maxLen === 0 && diff > 0) {
      addIssue("WARNING", `Phát hiện CLOAKING (Một phiên bản rỗng, một phiên bản có nội dung).`,
        `URL: ${url}\n${type1Name} Length: ${len1} chars\n${type2Name} Length: ${len2} chars`);
  } else if (maxLen > 0) {
    const percentageDiff = (diff / maxLen) * 100;
    if (percentageDiff > 30) {
      addIssue("WARNING", `Phát hiện CLOAKING (Độ dài nội dung khác biệt > 30%).`,
        `URL: ${url}\n${type1Name} Length: ${len1} chars\n${type2Name} Length: ${len2} chars\nSự khác biệt: ${percentageDiff.toFixed(1)}%`);
    }
  }


  const links1 = extractLinksFromHtml(content1, siteDomain);
  const links2 = extractLinksFromHtml(content2, siteDomain);

  if (Math.abs(links1.all.length - links2.all.length) > 5 ||
      Math.abs(links1.external.length - links2.external.length) > 2) {
      addIssue("WARNING", `Phát hiện CLOAKING (Số lượng link khác biệt).`,
          `URL: ${url}\n${type1Name}: ${links1.all.length} links (${links1.external.length} external)\n${type2Name}: ${links2.all.length} links (${links2.external.length} external)`);
  }

  let spamKeywordsCount1 = countSpamKeywordsInText(content1);
  let spamKeywordsCount2 = countSpamKeywordsInText(content2);

  if (spamKeywordsCount1 > 0 || spamKeywordsCount2 > 0) {
      if ((spamKeywordsCount2 > spamKeywordsCount1 + 2) || (spamKeywordsCount2 > 0 && spamKeywordsCount1 === 0 && type2Name.includes("Googlebot"))) {
           addIssue("CRITICAL", `Phát hiện CLOAKING (${type2Name} thấy nhiều từ khóa spam hơn).`,
              `URL: ${url}\n${type1Name} có: ${spamKeywordsCount1} từ khóa spam.\n${type2Name} có: ${spamKeywordsCount2} từ khóa spam.`);
      } else if ((spamKeywordsCount1 > spamKeywordsCount2 + 2) || (spamKeywordsCount1 > 0 && spamKeywordsCount2 === 0 && type1Name.includes("Googlebot"))) {
           addIssue("WARNING", `Phát hiện CLOAKING (${type1Name} thấy nhiều từ khóa spam hơn).`,
              `URL: ${url}\n${type1Name} có: ${spamKeywordsCount1} từ khóa spam.\n${type2Name} có: ${spamKeywordsCount2} từ khóa spam.`);
      }
  }
}

/**
 * Trích xuất link từ nội dung HTML.
 * @param {string} htmlContent HTML.
 * @param {string} siteDomain Tên miền của trang.
 * @return {{all: Array<string>, internal: Array<string>, external: Array<string>}}
 */
function extractLinksFromHtml(htmlContent, siteDomain) {
  const links = { all: [], internal: [], external: [] };
  if (!htmlContent) return links;

  const linkRegex = /<a\s+[^>]*?href=(["'])(.*?)\1/gi;
  let match;
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const href = match[2].trim();
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
      links.all.push(href);
      const linkDomain = getDomainFromUrl(href);
      if (linkDomain && linkDomain !== siteDomain) {
        links.external.push(href);
      } else {
        links.internal.push(href);
      }
    }
  }
  return links;
}

/**
 * Đếm số lượng từ khóa spam trong nội dung text (đã loại bỏ HTML).
 * @param {string} htmlContent Nội dung HTML.
 * @return {number} Số lượng từ khóa spam.
 */
function countSpamKeywordsInText(htmlContent) {
    if (!htmlContent) return 0;
    let textContent = htmlContent.replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '');
    textContent = textContent.replace(/<style[^>]*>([\S\s]*?)<\/style>/gi, '');
    textContent = textContent.replace(/<[^>]+>/g, ' ');
    textContent = textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    let count = 0;
    CONFIG.SPAM_KEYWORDS_LIST.forEach(keyword => {
        if (new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i').test(textContent)) {
            count++;
        }
    });
    return count;
}


/**
 * Kiểm tra file robots.txt xem có quy tắc đáng ngờ không.
 * @param {string} siteDomain Tên miền của trang (ví dụ: example.com).
 */
function checkRobotsTxt(siteDomain) {
  if (!CONFIG.CHECKS_ENABLED.ROBOTS_TXT) return;
  let response;
  let finalRobotsUrl = `http://${siteDomain}/robots.txt`;

  try {
    response = UrlFetchApp.fetch(finalRobotsUrl, { muteHttpExceptions: true, validateHttpsCertificates: false });
    if (response.getResponseCode() !== 200) {
      finalRobotsUrl = `https://${siteDomain}/robots.txt`;
      response = UrlFetchApp.fetch(finalRobotsUrl, { muteHttpExceptions: true, validateHttpsCertificates: false });
      if (response.getResponseCode() !== 200) {
        addIssue("INFO", `Không tìm thấy file robots.txt (thử cả HTTP và HTTPS).`, `URL đã thử: http://${siteDomain}/robots.txt và ${finalRobotsUrl}`);
        return;
      }
    }

    const content = response.getContentText();
    if (!content) {
      addIssue("INFO", `File robots.txt rỗng.`, `URL: ${finalRobotsUrl}`);
      return;
    }

    const uaStarBlockRegex = /User-agent:\s*\*\s*([\s\S]*?)(?:User-agent:|$)/i;
    const uaStarMatch = content.match(uaStarBlockRegex);
    if (uaStarMatch && uaStarMatch[1]) {
      const rulesForStar = uaStarMatch[1];
      const strictDisallowAllPattern = /^\s*Disallow:\s*\/(\s*#.*)?$/im;
      if (strictDisallowAllPattern.test(rulesForStar)) {
        const hasAnyAllowInStarBlock = /^\s*Allow:/im.test(rulesForStar);
        if (!hasAnyAllowInStarBlock) {
          addIssue("WARNING", `robots.txt có rule "Disallow: /" cho User-agent (*) và KHÔNG có rule Allow nào trong block đó.`,
            `URL: ${finalRobotsUrl}\nĐiều này có thể chặn toàn bộ site với User-agent (*).`);
        } else {
          Logger.log(`[INFO] robots.txt cho User-agent: * có "Disallow: /" nhưng cũng có các rule "Allow". Cần xem xét thủ công: ${finalRobotsUrl}`);
        }
      }
    } else {
        if (/^\s*Disallow:\s*\/(\s*#.*)?$/im.test(content) && !/^\s*User-agent:\s*\*/im.test(content)) {
             addIssue("WARNING", `robots.txt có rule "Disallow: /" mà không rõ ràng thuộc về User-agent: *.`,
                `URL: ${finalRobotsUrl}\nCần kiểm tra thủ công file robots.txt.`);
        }
    }

    const commonGoodBots = ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "YandexBot", "Baiduspider", "Applebot"];
    commonGoodBots.forEach(bot => {
      const disallowBotPattern = new RegExp(`User-agent:\\s*${bot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*([\\s\\S]*?)(?:User-agent:|$)`, "i");
      const botBlockMatch = content.match(disallowBotPattern);
      if (botBlockMatch && botBlockMatch[1]) {
        if (/^\s*Disallow:\s*\/(\s*#.*)?$/im.test(botBlockMatch[1])) {
          if (!/^\s*Allow:/im.test(botBlockMatch[1])) {
            addIssue("WARNING", `robots.txt có thể đang chặn ${bot} truy cập toàn bộ site (Disallow: /).`,
                       `URL: ${finalRobotsUrl}`);
          }
        }
      }
    });

    (CONFIG.SUSPICIOUS_DISALLOW_PATHS_ROBOTS || []).forEach(pathPatternStr => {
      try {
        const escapedPathForRegex = pathPatternStr.startsWith('/') ? pathPatternStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : pathPatternStr;
        const disallowPathRegex = new RegExp(`Disallow:\\s*${escapedPathForRegex}`, "i");

        if (disallowPathRegex.test(content)) {
          addIssue("WARNING", `robots.txt chặn một đường dẫn/pattern có khả năng đáng ngờ: ${pathPatternStr}.`,
            `URL: ${finalRobotsUrl}\nKẻ xấu có thể chặn Google index các trang chứa mã độc hoặc trang nhạy cảm.`);
        }
      } catch (e) {
        Logger.log(`Lỗi regex cho SUSPICIOUS_DISALLOW_PATHS_ROBOTS: "${pathPatternStr}" - ${e.message}`);
      }
    });

  } catch (e) {
    addIssue("INFO", `Không thể truy cập hoặc phân tích robots.txt.`, `URL đã thử: ${finalRobotsUrl}\nLỗi: ${e.message}`);
  }
}


/**
 * Hàm tiện ích để lấy tên miền từ URL.
 * @param {string} urlString URL đầy đủ.
 * @return {string|null} Tên miền hoặc null.
 */
function getDomainFromUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return null;
  try {
    let fullUrl = urlString.trim();
    if (fullUrl.startsWith("//")) {
      fullUrl = "http:" + fullUrl;
    } else if (!fullUrl.match(/^[^:]+:\/\//) && fullUrl.includes(".")) {
      if (!fullUrl.includes('/') && (fullUrl.match(/\./g) || []).length >= 1) {
         fullUrl = "http://" + fullUrl;
      } else if (fullUrl.includes('/')) {
         const potentialHost = fullUrl.substring(0, fullUrl.indexOf('/'));
         if ((potentialHost.match(/\./g) || []).length >= 1) {
            fullUrl = "http://" + fullUrl;
         } else {
            return null;
         }
      } else {
          return null;
      }
    } else if (!fullUrl.match(/^[^:]+:\/\//)) {
        return null;
    }

    const url = new URL(fullUrl);
    let hostname = url.hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    const match = urlString.match(/^(?:https?:)?\/\/([^\/]+)/i);
    return match ? match[1].replace(/^www\./, '') : null;
  }
}

/**
 * Kiểm tra xem một tên miền có trong danh sách trắng không.
 * @param {string} domain Tên miền cần kiểm tra.
 * @param {Array<string>} whitelist Danh sách các tên miền gốc được whitelist.
 * @return {boolean} True nếu được whitelist.
 */
function isWhitelistedDomain(domain, whitelist) {
  if (!domain) return false;
  const rootDomainToCheck = domain.replace(/^www\./, '').toLowerCase();
  return whitelist.some(whitelistedItem => {
    const rootWhitelisted = whitelistedItem.replace(/^www\./, '').toLowerCase();
    return rootDomainToCheck === rootWhitelisted || rootDomainToCheck.endsWith('.' + rootWhitelisted);
  });
}



function getVietnameseTimestamp() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss z");
}

/**
 * Gửi tin nhắn đến Telegram. Tách tin nhắn nếu quá dài.
 * @param {string} message Nội dung tin nhắn.
 * @param {string} severity "CRITICAL", "WARNING", "INFO". Dùng để log, việc gửi thực tế dựa trên config.
 */
function sendTelegramMessageWrapper(message, severity) {
  if (severity === "CRITICAL" || (severity === "WARNING" && CONFIG.NOTIFY_ON_WARNING)) {
    const maxLen = CONFIG.MAX_TELEGRAM_MESSAGE_LENGTH;
    if (message.length <= maxLen) {
      telegramApiSend(message);
    } else {
      Logger.log(`Tin nhắn quá dài (${message.length} ký tự), đang tách để gửi Telegram...`);
      const numMessages = Math.ceil(message.length / maxLen);
      for (let i = 0; i < numMessages; i++) {
        const chunk = message.substring(i * maxLen, (i + 1) * maxLen);
        const partMessage = `(Phần ${i+1}/${numMessages}) ${chunk}`;
        telegramApiSend(partMessage);
        if (i < numMessages - 1) Utilities.sleep(1000);
      }
    }
  } else {
    Logger.log(`Bỏ qua thông báo Telegram cho tin nhắn [${severity}] (chỉ ghi log): ${message.substring(0,100)}...`);
  }
}


function telegramApiSend(text) {
  const token = CONFIG.TELEGRAM_BOT_TOKEN;
  const chatId = CONFIG.TELEGRAM_CHAT_ID;
  if (!token || !chatId || token === 'YOUR_TELEGRAM_BOT_TOKEN' || token.includes("YOUR_TELEGRAM_BOT_TOKEN") ||
      chatId === 'YOUR_CHAT_ID' || chatId.includes("YOUR_CHAT_ID")) {
    Logger.log("Lỗi: Telegram Token hoặc Chat ID chưa được cấu hình trong CONFIG.");
    return;
  }
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    // parse_mode: 'HTML', 
    disable_web_page_preview: true
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    validateHttpsCertificates: false
  };

  try {
    const response = UrlFetchApp.fetch(telegramUrl, options);
    if (response.getResponseCode() !== 200) {
      Logger.log(`Lỗi gửi tin nhắn Telegram: ${response.getResponseCode()} - ${response.getContentText()}`);
    } else {
      Logger.log("Tin nhắn Telegram đã được gửi thành công.");
    }
  } catch (e) {
    Logger.log(`Lỗi nghiêm trọng khi gửi tin nhắn Telegram: ${e.message}`);
  }
}

/**
 * Tổng hợp tất cả các vấn đề và gửi báo cáo.
 */
function sendConsolidatedReport() {
  if (issuesFound.length === 0) {
    Logger.log("Không tìm thấy vấn đề nào.");
    // sendTelegramMessageWrapper(`✅ Kiểm tra ${CONFIG.TARGET_URL} hoàn tất lúc ${getVietnameseTimestamp()}. Không phát hiện vấn đề nghiêm trọng.`, "INFO");
    return;
  }

  const cleanText = (inputText) => {
    if (typeof inputText !== 'string') return '';
    return inputText
      .replace(/<b>|<\/b>/gi, '')
      .replace(/<i>|<\/i>/gi, '')
      .replace(/<code>|<\/code>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&/g, '&');
  };


  let reportMessage = `🚨 CẢNH BÁO BẢO MẬT WEBSITE 🚨\nWebsite: ${CONFIG.TARGET_URL}\nThời điểm kiểm tra: ${getVietnameseTimestamp()}\n\n`;
  let criticalCount = 0;
  let warningCount = 0;

  issuesFound.sort((a, b) => {
    const severities = { "CRITICAL": 0, "WARNING": 1, "INFO": 2 };
    return severities[a.severity] - severities[b.severity];
  });

  issuesFound.forEach(issue => {
    if (issue.severity === "CRITICAL") criticalCount++;
    if (issue.severity === "WARNING") warningCount++;

    let severityEmoji = "";
    if (issue.severity === "CRITICAL") severityEmoji = "🔴";
    else if (issue.severity === "WARNING") severityEmoji = "🟡";
    else severityEmoji = "ℹ️";

    reportMessage += `${severityEmoji} [${issue.severity}] ${cleanText(issue.title)}\n`;
    reportMessage += `Chi tiết: ${cleanText(issue.details)}\n`;
    reportMessage += `Thời điểm phát hiện: ${issue.timestamp}\n\n`;
  });

  if (criticalCount > 0 || (warningCount > 0 && CONFIG.NOTIFY_ON_WARNING)) {
    sendTelegramMessageWrapper(reportMessage, "CRITICAL");
  } else {
    Logger.log("Các vấn đề INFO/WARNING (không thông báo) đã được ghi lại:\n" + reportMessage);
  }
}
