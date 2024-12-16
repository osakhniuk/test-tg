document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");

  // Ініціалізація Telegram Web App
  const tg = window.Telegram.WebApp;
  tg.ready();

  // Обробка кліку по кнопці START
  startButton.addEventListener("click", async () => {
    alert("Requesting gyroscope access...");

    // Запит дозволу для iOS
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          alert("Gyroscope access granted!");
          initGyroscope();
        } else {
          alert("Gyroscope access denied.");
        }
      } catch (e) {
        console.error("Error requesting gyroscope permission:", e);
        alert("Error: Could not access gyroscope.");
      }
    } else {
      // Для Android або платформ без обмежень
      initGyroscope();
    }
  });

  // Ініціалізація гіроскопа
  function initGyroscope() {
    alert("Gyroscope initialized. Start shaking!");

    window.addEventListener("devicemotion", (event) => {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration) {
        const totalForce = Math.sqrt(
          acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
        );

        console.log(`Total Force: ${totalForce}`);

        // Показуємо поточне значення сили руху
        alert(`Total Force: ${totalForce}`);

        // Вібрація через Telegram API при сильному русі
        if (totalForce > 10) { // Порог сили тряски
          let intensity = "light";
          if (totalForce >= 20 && totalForce < 30) intensity = "medium";
          if (totalForce >= 30) intensity = "heavy";

          tg.HapticFeedback.impactOccurred(intensity);
          alert(`Vibration triggered with intensity: ${intensity}`);
        }
      } else {
        console.warn("No acceleration data available.");
      }
    });
  }
});
