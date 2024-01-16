// Ждем, пока весь HTML-документ будет полностью загружен и готов к манипуляциям с DOM
document.addEventListener('DOMContentLoaded', function () {
  // Получаем необходимые элементы DOM
  const startButton = document.getElementById('start');
  const gameField = document.getElementById('game');
  const timeHeader = document.getElementById('time-header');
  const timeSpan = document.getElementById('time');
  const resultHeader = document.getElementById('result-header');
  const resultSpan = document.getElementById('result');
  const gameTimeInput = document.getElementById('game-time');

  // Массив с цветами
  const colors = ['#fe019a', '#fe59c2', '#04d9ff', '#5555ff', '#bc13fe', '#f80000', '#ff073a', '#ffa420', '#ffa343', '#ffea19', '#fefe22', '#c8ff00', '#ccff00', '#7df9ff', '#39ff14'];

  // Объявляем переменные для управления состоянием игры и временем
  let gameActive = false;
  let time = parseFloat(gameTimeInput.value);
  let timerId;
  let clickCount = 0;

  // Назначаем обработчик события на кнопку "Начать"
  startButton.addEventListener('click', startGame);
  // Назначаем обработчик события на поле ввода времени для моментального обновления отображаемого времени
  gameTimeInput.addEventListener('input', updateDisplayedTime);

  // Функция запускает новую игру
  function startGame() {
    // Устанавливаем состояние игры в активное
    gameActive = true;
    // Скрываем кнопку "Начать"
    startButton.style.display = 'none';
    // Устанавливаем цвет фона игрового поля в белый
    gameField.style.backgroundColor = '#fff';

    // Убираем класс hide перед обновлением времени
    timeHeader.classList.remove('hide');
    // Скрываем результаты предыдущей игры
    resultHeader.classList.add('hide');

    // Получаем время игры из поля ввода и обновляем соответствующий элемент DOM
    time = parseFloat(gameTimeInput.value);
    timeSpan.textContent = time.toFixed(1);
    // Сбрасываем счетчик кликов
    clickCount = 0;

    // Запускаем функцию, отвечающую за появление кубиков
    updateGameField();

    // Запускаем таймер обновления времени каждые 100 миллисекунд
    timerId = setInterval(updateTime, 100);
    // Устанавливаем таймаут, по истечении которого завершится игра
    setTimeout(endGame, time * 1000);
  }

  // Функция обновляет отображаемое время при изменении в поле ввода
  function updateDisplayedTime() {
    // Проверяем, активна ли игра
    if (!gameActive) {
      time = parseFloat(gameTimeInput.value);
      timeSpan.textContent = time.toFixed(1);
    } 
  }

  // Функция отвечает за появление кубиков на игровом поле
  function updateGameField() {
    const cube = document.createElement('div');
    cube.className = 'cube';
    // Генерируем случайные размеры и цвет для кубика
    const size = Math.random() * 50 + 20;
    cube.style.width = `${size}px`;
    cube.style.height = `${size}px`;
    cube.style.backgroundColor = getRandomColor();
    // Размещаем кубик в случайном месте игрового поля
    cube.style.position = 'absolute';
    cube.style.top = `${Math.random() * (gameField.clientHeight - size)}px`;
    cube.style.left = `${Math.random() * (gameField.clientWidth - size)}px`;

    // Добавляем обработчик события для клика по кубику
    cube.addEventListener('click', function (event) {
      event.stopPropagation();
      // Удаляем кубик при клике и увеличиваем счетчик кликов
      gameField.removeChild(cube);
      clickCount++;
      // Вызываем функцию для появления нового кубика
      updateGameField();
    });

    // Добавляем обработчик события при наведении для изменения вида курсора
    cube.addEventListener('mouseover', function () {
      cube.style.cursor = 'pointer';
    });

    // Добавляем кубик на игровое поле
    gameField.appendChild(cube);
  }

  // Функция обновляет отсчет времени
  function updateTime() {
    if (gameActive) {
      // Уменьшаем время на 0.1 секунду и обновляем соответствующий элемент DOM
      time = Math.max(0, time - 0.1);
      timeSpan.textContent = time.toFixed(1);

      // Если время вышло, завершаем игру
      if (time <= 0) {
        endGame();
      }
    }
  }

  // Функция завершает игру и показывает результаты
  function endGame() {
    gameActive = false;
    clearInterval(timerId);
    timeHeader.classList.add('hide');
    resultHeader.classList.remove('hide');
    resultSpan.textContent = clickCount;
    startButton.style.display = 'block';
    gameField.style.backgroundColor = '#ccc';
  
    // Удаляем все кубики с игрового поля
    while (gameField.firstChild) {
      gameField.removeChild(gameField.firstChild);
    }
  
    // Взаимодействие с инпутом, чтобы убирать строку результата и получать время
    gameTimeInput.addEventListener('input', function() {
      resultHeader.classList.add('hide');
      timeHeader.classList.remove('hide');
      time = parseFloat(gameTimeInput.value);
      timeSpan.textContent = time.toFixed(1);
      // console.log('Значение инпута изменилось:', gameTimeInput.value);
    });
  }

  // Функция генерирует случайный цвет
  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
});
