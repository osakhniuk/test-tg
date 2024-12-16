document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
  
    // Ініціалізація Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.ready();
  
    // Обробник кліку по кнопці START
    startButton.addEventListener("click", async () => {
      console.log("START button clicked");
  
      // Анімація зникнення кнопки
      startButton.style.transition = "opacity 0.5s ease";
      startButton.style.opacity = "0";
  
      // Запит доступу до гіроскопа
      try {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === "granted") {
            console.log("Gyroscope access granted");
            initGyroscope();
            hideOverlay();
          } else {
            alert("Access to gyroscope denied.");
          }
        } else {
          console.log("DeviceMotionEvent does not require permission.");
          initGyroscope();
          hideOverlay();
        }
      } catch (e) {
        console.error("Error requesting gyroscope permission:", e);
      }
    });
  
    // Прибираємо затемнення
    function hideOverlay() {
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
    }
  
    // Обробка даних гіроскопа
    function initGyroscope() {
      window.addEventListener("devicemotion", (event) => {
        const acceleration = event.accelerationIncludingGravity;
  
        if (acceleration) {
          const totalForce = Math.sqrt(
            acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
          );
  
          console.log(`Total Force: ${totalForce}`);
  
          // Вібрація в залежності від сили руху
          if (totalForce > 15) {
            let intensity = "light";
            if (totalForce >= 20 && totalForce < 30) intensity = "medium";
            if (totalForce >= 30) intensity = "heavy";
  
            tg.HapticFeedback.impactOccurred(intensity);
            console.log(`Vibration: ${intensity}`);
          }
        }
      });
    }
  });
  