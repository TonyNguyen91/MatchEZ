# MathEZ – Học Toán bằng cách khám phá

Web app thuần HTML/CSS/JS giúp học sinh học Toán theo phương pháp kiểu **Brilliant**:
**thử trước – hiểu sau**, bài ngắn, phản hồi tức thì, câu hỏi sinh ngẫu nhiên, ôn tập ngắt quãng.

Bản hiện tại – **Toán 6, SGK Kết nối tri thức** (23 bài):
- **Chương I – Tập hợp các số tự nhiên** (Bài 1–7 + ôn tập): tập hợp, ghi số & số La Mã, thứ tự, cộng trừ, nhân chia, lũy thừa, thứ tự phép tính.
- **Chương II – Tính chia hết** (Bài 8–12 + ôn tập): ước & bội, dấu hiệu chia hết, số nguyên tố, ƯCLN, BCNN.
- **Chương III – Số nguyên** (Bài 13–17 + thử thách): số âm, trục số, so sánh, cộng, trừ, quy tắc dấu ngoặc, nhân, chia hết – ước và bội.

## Chạy thử
- **Cách nhanh nhất:** nhấp đúp `index.html` (không cần cài gì, không cần server).
- **Đưa lên mạng:** GitHub → Settings → Pages → Source: `main` / `root`. Sau 1–2 phút có link dạng
  `https://<tên>.github.io/MatchEZ/` để mở trên máy tính bảng / điện thoại.

Tiến độ (sao, XP, chuỗi ngày, câu cần ôn) lưu trong trình duyệt (localStorage) của từng máy.

## Phương pháp trong mỗi bài
| Bước | Mục đích |
|---|---|
| 🔍 Khám phá | Một câu đố tương tác trước khi có lý thuyết – bé tự “đụng” vào khái niệm |
| 💡 Khái niệm | Thẻ giải thích ngắn, có hình minh hoạ |
| ✏️ Luyện tập | Câu hỏi sinh ngẫu nhiên – mỗi lần học là một bộ câu mới |
| 🏆 Thử thách | Bài toán thực tế, khó hơn |

- Sai → gợi ý cụ thể, làm lại; sai 2 lần → được xem lời giải.
- Câu sai lần đầu sẽ vào **Ôn tập thông minh** (quay lại sau 1 → 3 → 7 → 14 ngày).
- Sao: 3★ (sai ≤ 1 lần), 2★ (sai ≤ 3), 1★.

## Cấu trúc
```
index.html
css/style.css
js/core.js              lưu tiến độ, tiện ích, âm thanh, bàn phím số
js/player.js            trình chạy bài học
js/app.js               bản đồ con đường học + điều hướng
js/widgets/basic.js     choice (chọn đáp án), input (nhập số), sort (sắp xếp)
js/widgets/numberline.js  numberline (trục số kéo thả), thermo (nhiệt kế)
js/widgets/chips.js     mô hình chip +1 / −1
js/widgets/sets.js      multi (chọn tất cả), bins (phân loại vào nhóm), rect (xếp gạch hình chữ nhật)
lessons/lop6/chuong1.js      Chương I – Tập hợp các số tự nhiên
lessons/lop6/chuong2.js      Chương II – Tính chia hết
lessons/lop6/so-nguyen.js    Chương III – Số nguyên
lessons/lop6/chuong-lop6.js  các chương IV–IX (đang “sắp có”)
```

## Thêm bài học
Mỗi bước là một object trong mảng `steps`:
```js
{ kind: 'practice', widget: 'choice', prompt: 'Câu hỏi…',
  options: ['A', 'B', 'C'], answer: 'B', hint: 'Gợi ý khi sai', explain: 'Giải thích khi đúng' }
```
Câu hỏi ngẫu nhiên: thay các trường cố định bằng `gen: () => ({ widget, prompt, answer, … })`.
Thêm chương mới: tạo file trong `lessons/…`, gọi `MathEZ.addWorld({...})`, rồi thêm thẻ `<script>` vào `index.html`.

> Lưu ý: mục Ôn tập ghi nhớ câu theo vị trí bước trong bài. Nếu chèn/xoá bước ở giữa bài, các câu đang chờ ôn của bài đó có thể lệch – nên thêm bước mới vào cuối bài.
