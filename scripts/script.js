document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const scoreContainer = document.querySelector(".score-container");
  const scoreValueElement = document.getElementById("scoreValue");

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
          console.log("Gyroscope permission granted!");
          startGame();
        } else {
          alert("Permission to access gyroscope was denied.");
        }
      } catch (error) {
        console.error("Error while requesting permission:", error);
        alert("Error while requesting gyroscope permission.");
      }
    } else {
      // Для Android та платформ, де не потрібен запит дозволу
      console.log("Gyroscope permission not required.");
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
    console.log("Gyroscope initialized. Start shaking!");

    window.addEventListener("devicemotion", (event) => {
      const { y } = event.accelerationIncludingGravity || {};
      const threshold = 15; // Порогове значення для виявлення трясіння

      if (y !== null) {
        const deltaY = lastY !== null ? Math.abs(y - lastY) : 0;
        shaking = deltaY > threshold;
        lastY = y;
      }
    });

    // Починаємо нарахування балів кожну секунду
    setInterval(() => {
      if (shaking) {
        const points = calculatePoints(); // Обчислюємо бали
        score += points;
        score = parseFloat(score.toFixed(2)); // Округлення до сотих
        scoreValueElement.textContent = score; // Оновлюємо відображення балів
        console.log(`Added ${points} points. Total Score: ${score}`);
      }
    }, 1000);
  }

  function calculatePoints() {
    const random = Math.random() * 100; // Генеруємо випадкове число від 0 до 100

    if (random < 0.1) return 10; // 0.1% - 10 балів
    if (random < 1.1) return 5; // 1% - 5 балів
    if (random < 4.1) return (Math.random() * (4.99 - 4) + 4).toFixed(2); // 3% - від 4.00 до 4.99
    if (random < 9.1) return (Math.random() * (4 - 3) + 3).toFixed(2); // 5% - від 3.00 до 4.00
    if (random < 24.1) return (Math.random() * (2.22 - 2) + 2).toFixed(2); // 15% - від 2.00 до 2.22
    if (random < 44.1) return 2; // 20% - 2 бали
    if (random < 64.1) return (Math.random() * (1.5 - 1.2) + 1.2).toFixed(2); // 20% - від 1.2 до 1.5
    if (random < 74.1) return 1.5; // 10% - 1.5 бала
    if (random < 100) return (Math.random() * (1.0 - 0.01) + 0.01).toFixed(2); // 30% - від 0.01 до 1.00

    return 1; // 50% - 1 бал
  }
});
