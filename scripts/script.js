document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
 
  const debugInfo = document.getElementById("debugInfo"); // Для відображення дебаг-інформації

  let shaking = false; // Стан трясіння
  let lastY = null; // Для виявлення трясіння по осі Y

  startButton.addEventListener("click", async () => {
    console.log("START button clicked!");

    // Запит дозволу на доступ до гіроскопа (для iOS)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === "granted") {
          console.log("Gyroscope permission granted!");
          startGame();
        } else {
          alert("Permission to access gyroscope was denied.");
        }
      } catch (error) {
        alert("Error while requesting gyroscope permission.");
      }
    } else {
      // Для Android та платформ, де дозвіл не потрібен
      console.log("Gyroscope permission not required.");
      startGame();
    }
  });

  function startGame() {

    // Прибираємо кнопку START і затемнення
    startButton.classList.add("fade-out");
    document.body.classList.add("no-overlay");

    // Запускаємо гіроскоп
    initGyroscope();
  }

  function initGyroscope() {

    window.addEventListener("devicemotion", (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      const threshold = 5; // Порогове значення для трясіння

      if (y !== null) {
        const deltaY = lastY !== null ? Math.abs(y - lastY) : 0;

        // Виявлення трясіння
        if (deltaY > threshold) {
          shaking = true;

          // Викликаємо вібрацію через Telegram API
          if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
          }
        } else {
          shaking = false;
        }

        lastY = y;

        // Оновлюємо дебаг-інформацію на екрані
        debugInfo.textContent = `
          X: ${x ? x.toFixed(2) : 0}, 
          Y: ${y ? y.toFixed(2) : 0}, 
          Z: ${z ? z.toFixed(2) : 0}, 
          DeltaY: ${deltaY.toFixed(2)}, 
          Shaking: ${shaking}, 
          Score: ${score}
        `;
      }
    }); 
  }

 
});
