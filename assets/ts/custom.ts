// 等待 DOM 加载完成
document.addEventListener("DOMContentLoaded", function() {

    // 获取所有包含 .popup-details 类的 <details> 元素
    const detailsElements = document.querySelectorAll(".popup-details");
  
    detailsElements.forEach((details) => {
      // 获取 <details> 内的浮窗内容
      const popupContent = details.querySelector(".popup-content");
  
      // 处理点击关闭按钮
      const closeButton = popupContent?.querySelector(".close-btn");
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          details.removeAttribute("open"); // 关闭浮窗
        });
      }
  
      // 点击浮窗外部关闭浮窗
      document.addEventListener("click", (event) => {
        if (details.open && !details.contains(event.target)) {
          details.removeAttribute("open"); // 点击浮窗外关闭
        }
      });
    });
  });
  