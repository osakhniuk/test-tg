document.addEventListener("DOMContentLoaded", () => {
  // Ініціалізація Telegram Web App API
  const tg = window.Telegram.WebApp;

  if (tg) {
    tg.ready();
    console.log("Telegram API initialized successfully!");
  } else {
    console.error("Telegram API is not available!");
  }

  const startButton = document.getElementById("startButton");
  const overlay = document.getElementById("overlay");


  // Обробка кліку по кнопці START
  startButton.addEventListener("click", async () => {

    // Запит дозволу для iOS
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        console.log("Requesting gyroscope permission...");
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          console.log("Gyroscope access granted!");
          initGyroscope();
        } else {
          alert("Access to gyroscope denied.");
          console.error("Gyroscope permission denied.");
        }
      } catch (e) {
        console.error("Error requesting gyroscope permission:", e);
        alert("Error: Could not access gyroscope.");
      }
    } else {
      // Для Android або платформ без обмежень
      console.log("Gyroscope permission not required.");
      initGyroscope();
    }
    document.body.classList.add("no-overlay");
    startButton.classList.add("fade-out");
  });

  // Ініціалізація гіроскопа
  function initGyroscope() {
    console.log("Gyroscope initialized. Start shaking!");

    window.addEventListener("devicemotion", (event) => {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration) {
        const totalForce = Math.sqrt(
          acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
        );

        console.log(`Total Force: ${totalForce}`);

        // Вібрація через Telegram API при сильному русі
        if (totalForce > 10) { // Порог сили тряски
          let intensity = "light";
          if (totalForce >= 20 && totalForce < 30) intensity = "medium";
          if (totalForce >= 30) intensity = "heavy";

          tg.HapticFeedback.impactOccurred(intensity);
          console.log(`Vibration triggered with intensity: ${intensity}`);
        }
      } else {
        console.warn("No acceleration data available.");
      }
    });
  }
});
