document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
  
    // Ініціалізація Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.ready();
  
    // Обробник кліку по кнопці START
    startButton.addEventListener("click", async () => {
      // Анімація зникнення кнопки
      startButton.style.opacity = "0";
  
      // Очікуємо закінчення анімації
      setTimeout(() => {
        startButton.style.display = "none";
        overlay.style.display = "none";
      }, 500);
  
      // Запит дозволу на доступ до гіроскопа (для iOS)
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === "granted") {
            initGyroscope();
          } else {
            alert("Access to gyroscope was denied.");
          }
        } catch (e) {
          console.error("Error requesting gyroscope permission:", e);
        }
      } else {
        // Для Android
        initGyroscope();
      }
    });
  
    // Функція для обробки гіроскопа
    function initGyroscope() {
      window.addEventListener("devicemotion", (event) => {
        const acceleration = event.accelerationIncludingGravity;
  
        if (acceleration) {
          const totalForce = Math.sqrt(
            acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
          );
  
          // Викликаємо вібрацію в залежності від сили трясіння
          if (totalForce > 15) {
            let intensity;
            if (totalForce < 20) {
              intensity = "light";
            } else if (totalForce < 30) {
              intensity = "medium";
            } else {
              intensity = "heavy";
            }
  
            // Вібрація через Telegram API
            tg.HapticFeedback.impactOccurred(intensity);
            console.log(`Vibration: ${intensity}`);
          }
        }
      });
    }
  });
  