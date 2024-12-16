document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
  
    // Ініціалізація Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.ready();
  
    console.log("Telegram Mini App initialized");
  
    // Обробник кліку по кнопці START
    startButton.addEventListener("click", async () => {
      console.log("START button clicked");
  
      // Анімація зникнення кнопки
      startButton.style.transition = "opacity 0.5s ease";
      startButton.style.opacity = "0";
  
      // Запит дозволу до гіроскопа
      try {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
          console.log("Requesting gyroscope permission...");
          const permission = await DeviceMotionEvent.requestPermission();
          console.log("Permission result:", permission);
  
          if (permission === "granted") {
            console.log("Gyroscope access granted");
            initGyroscope();
            hideOverlay();
          } else {
            alert("Access to gyroscope denied.");
            console.error("Permission denied for gyroscope.");
          }
        } else {
          console.log("DeviceMotionEvent does not require permission on this platform.");
          initGyroscope();
          hideOverlay();
        }
      } catch (e) {
        console.error("Error requesting gyroscope permission:", e);
        alert(`Error: ${e.message}`);
      }
    });
  
    // Прибираємо затемнення
    function hideOverlay() {
      console.log("Hiding overlay...");
      setTimeout(() => {
        overlay.style.display = "none";
        console.log("Overlay hidden.");
      }, 500);
    }
  
    // Обробка даних гіроскопа
    function initGyroscope() {
      console.log("Initializing gyroscope...");
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
            console.log(`Vibration triggered with intensity: ${intensity}`);
          }
        } else {
          console.warn("No acceleration data available.");
        }
      });
  
      console.log("Gyroscope listener added.");
    }
  });
  