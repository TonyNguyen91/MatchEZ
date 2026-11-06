/* Các chương Toán 6 (SGK Kết nối tri thức) chưa soạn – hiển thị "Sắp có" */
(function () {
  const soon = [
    [4, 'Chương IV', 'Hình phẳng trong thực tiễn', '🔷'],
    [5, 'Chương V', 'Tính đối xứng của hình', '🦋'],
    [6, 'Chương VI', 'Phân số', '🍕'],
    [7, 'Chương VII', 'Số thập phân', '💯'],
    [8, 'Chương VIII', 'Hình học cơ bản', '📐'],
    [9, 'Chương IX', 'Dữ liệu & xác suất', '🎲'],
  ];
  soon.forEach(([order, chapter, title, icon]) =>
    MathEZ.addWorld({ id: 'soon-' + order, order, grade: 6, chapter, title, icon, soon: true, lessons: [] }));
})();
