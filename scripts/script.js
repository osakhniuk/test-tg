document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const scoreContainer = document.querySelector(".score-container");
  const scoreValueElement = document.getElementById("scoreValue");
  const debugInfo = document.getElementById("debugInfo"); // Для відображення дебаг-інформації

  let score = 0; // Загальна кількість балів
  let shaking = false; // Стан трясіння
  let lastY = null; // Для виявлення трясіння по осі Y

  startButton.addEventListener("click", async () => {
    console.log("START button clicked!");

    // Запит дозволу на доступ до гіроскопа (для iOS)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === "granted") {
          startGame();
        } else {
          alert("Permission to access gyroscope was denied.");
        }
      } catch (error) {
        alert("Error while requesting gyroscope permission.");
      }
    } else {
      startGame();
    }
  });

  function startGame() {
    // Показуємо рахунок
    scoreContainer.style.display = "block";

    // Прибираємо кнопку START і затемнення
    startButton.classList.add("fade-out");
    document.body.classList.add("no-overlay");

    // Запускаємо гіроскоп
    initGyroscope();
  }

  function initGyroscope() {
    window.addEventListener("devicemotion", (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      const threshold = 15; // Порогове значення

      if (y !== null) {
        const deltaY = lastY !== null ? Math.abs(y - lastY) : 0;

        if (deltaY > threshold) {
          shaking = true;
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium"); // Вібрація
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

    // Починаємо нарахування балів
    setInterval(() => {
      if (shaking) {
        const points = calculatePoints();
        score += points;
        score = parseFloat(score.toFixed(2));
        scoreValueElement.textContent = score; // Оновлюємо рахунок
      }
    }, 1000);
  }

  function calculatePoints() {
    const random = Math.random() * 100;

    if (random < 0.1) return 10;
    if (random < 1.1) return 5;
    if (random < 4.1) return (Math.random() * (4.99 - 4) + 4).toFixed(2);
    if (random < 9.1) return (Math.random() * (4 - 3) + 3).toFixed(2);
    if (random < 24.1) return (Math.random() * (2.22 - 2) + 2).toFixed(2);
    if (random < 44.1) return 2;
    if (random < 64.1) return (Math.random() * (1.5 - 1.2) + 1.2).toFixed(2);
    if (random < 74.1) return 1.5;
    if (random < 100) return (Math.random() * (1.0 - 0.01) + 0.01).toFixed(2);

    return 1;
  }
});
