document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");

  startButton.addEventListener("click", async () => {
    console.log("START button clicked!");

    // Запит дозволу на використання гіроскопа (для iOS)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          console.log("Gyroscope access granted!");
          initGyroscope();
        } else {
          alert("Access to gyroscope denied.");
        }
      } catch (error) {
        console.error("Error requesting gyroscope permission:", error);
      }
    } else {
      // Для платформ, де дозволи не потрібні (Android)
      console.log("Gyroscope permission not required.");
      initGyroscope();
    }
        // Видаляємо затемнення і кнопку
        startButton.classList.add("fade-out");
        document.body.classList.add("no-overlay");
  });

  // Ініціалізація гіроскопа
  function initGyroscope() {
    console.log("Gyroscope initialized. Shake phone left and right!");

    let lastY = null; // Останнє значення осі Y для фільтрації "тряски"

    window.addEventListener("devicemotion", (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      const threshold = 15; // Порогове значення для трясіння

      if (y !== null) {
        // Визначаємо зміну осі Y
        const deltaY = lastY !== null ? Math.abs(y - lastY) : 0;

        // Логіка для трясіння вліво-вправо
        if (deltaY > threshold) {
          console.log(`Shake detected! DeltaY: ${deltaY}`);
          window.navigator.vibrate(200); // Вібрація на 200 мс
        }

        // Зберігаємо останнє значення осі Y
        lastY = y;
      }
    });
  }
});
