document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const statusDiv = document.createElement("div");
  
    // Створюємо блок для статусу (візуальні підказки)
    statusDiv.style.position = "absolute";
    statusDiv.style.top = "20px";
    statusDiv.style.left = "50%";
    statusDiv.style.transform = "translateX(-50%)";
    statusDiv.style.padding = "10px";
    statusDiv.style.backgroundColor = "#fff";
    statusDiv.style.color = "#000";
    statusDiv.style.border = "1px solid #ccc";
    statusDiv.style.zIndex = "10";
    document.body.appendChild(statusDiv);
  
    function updateStatus(message) {
      statusDiv.textContent = message;
    }
  
    // Ініціалізація Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.ready();
    updateStatus("Telegram WebApp initialized");
  
    // Обробник кліку по кнопці START
    startButton.addEventListener("click", async () => {
      updateStatus("START button clicked");
  
      // Анімація зникнення кнопки
      startButton.style.transition = "opacity 0.5s ease";
      startButton.style.opacity = "0";
  
      // Запит дозволу до гіроскопа
      try {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
          updateStatus("Requesting gyroscope permission...");
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === "granted") {
            updateStatus("Gyroscope access granted!");
            initGyroscope();
            hideOverlay();
          } else {
            updateStatus("Access to gyroscope denied.");
          }
        } else {
          updateStatus("Gyroscope does not require permission.");
          initGyroscope();
          hideOverlay();
        }
      } catch (e) {
        updateStatus(`Error: ${e.message}`);
      }
    });
  
    // Прибираємо затемнення
    function hideOverlay() {
      setTimeout(() => {
        overlay.style.display = "none";
        updateStatus("Overlay hidden. Ready to shake!");
      }, 500);
    }
  
    // Обробка даних гіроскопа
    function initGyroscope() {
      updateStatus("Initializing gyroscope...");
  
      window.addEventListener("devicemotion", (event) => {
        const acceleration = event.accelerationIncludingGravity;
  
        if (acceleration) {
          const totalForce = Math.sqrt(
            acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
          );
  
          updateStatus(`Total Force: ${totalForce.toFixed(2)}`);
  
          // Вібрація в залежності від сили руху
          if (totalForce > 15) {
            let intensity = "light";
            if (totalForce >= 20 && totalForce < 30) intensity = "medium";
            if (totalForce >= 30) intensity = "heavy";
  
            tg.HapticFeedback.impactOccurred(intensity);
            updateStatus(`Vibration triggered: ${intensity}`);
          }
        } else {
          updateStatus("No acceleration data available.");
        }
      });
  
      updateStatus("Gyroscope listener added. Shake the phone!");
    }
  });
  