// Ініціалізація скрипта після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");

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
    window.addEventListener("devicemotion", (event) => {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration) {
        const totalForce = Math.sqrt(
          acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
        );

        console.log(`Total Force: ${totalForce}`);

        // Вібрація при сильному русі
        if (totalForce > 15) {
          if (window.navigator.vibrate) {
            window.navigator.vibrate(200); // Тривалість вібрації 200 мс
            console.log("Vibration triggered!");
          }
        }
      }
    });
  }
});
