document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
  
    // Обробник кліку по кнопці START
    startButton.addEventListener("click", async () => {
      // Анімація зникнення кнопки
      startButton.style.opacity = "0";
  
      // Очікуємо закінчення анімації
      setTimeout(() => {
        startButton.style.display = "none";
        overlay.style.backgroundColor = "transparent"; // Прибираємо затемнення
      }, 500);
  
      // Запит дозволу на доступ до гіроскопу (для iOS)
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
          // Логіка для подальшої обробки даних гіроскопа
          console.log("Acceleration:", acceleration);
        }
      });
    }
  });
  