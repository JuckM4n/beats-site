let player;
let durationControl;
let soundControl;
let intervalId;

document.addEventListener('DOMContentLoaded', e => {
  player = document.getElementById('player');

  // вешаем обработчик события на на тег video
  player.addEventListener('click', playStop);

  // находим все кнопки play и навешиваем через цикл на каждую обработчик
  let playButtons = document.querySelectorAll('.play');
  for (let i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener('click', playStop);
  }

  // обработчик событий на кнопку динамик
  let micControl = document.getElementById('micLevel');
  micControl.addEventListener('click', soundOf);

  // обработчики события для ползунка продолжительности видео
  durationControl = document.getElementById('durationLevel');
  durationControl.addEventListener('mousedown', stopInterval);
  durationControl.addEventListener('click', setVideoDuration);

  durationControl.min = 0;
  durationControl.value = 0;

  // обработчики события для ползунка громоксти
  soundControl = document.getElementById('volumeLevel');
  soundControl.addEventListener('click', changeSoundVolume);
  soundControl.addEventListener('mouseup', changeSoundVolume);

  // задаем максимальное и минимальное значение volume
  soundControl.min = 0;
  soundControl.max = 10;

  soundControl.value = soundControl.max;

})

function playStop() {
  // нахожу мою кнопку с картинкой PLAY и показываю или скрываю ее
  let playImg = document.querySelector('.player__play');
  playImg.classList.toggle('player__play--active');

  // присваиваем ползунку проолжительности видео максимальное значение 
  // равное продолжительности нашего видео
  durationControl.max = player.duration;

  // проверяем стоит ли видео на паузе, если да то продолжаем воспроизведение
  if (player.paused) {
    // запускаем видео
    player.play();
    // обновляем ползунок каждые 15 мили секунд функцией updateDuration
    intervalId = setInterval(updateDuration, 1000 / 66);
  } else {
    // понимаем что видео не стоит на паузе,и ставим его на паузу
    player.pause();
    clearInterval(intervalId);
  }
}

// обновляет позицию ползунка продолжительности видео
function updateDuration() {
  durationControl.value = player.currentTime;
}

function stopInterval() {
  player.pause();
  clearInterval(intervalId);
}

// Реализует возможность перемотки видео
function setVideoDuration() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }

  player.currentTime = durationControl.value;
  // обновляем ползунок каждые 15 мили секунд функцией updateDuration
  intervalId = setInterval(updateDuration, 1000 / 66);
}

// управление звуком видео
function changeSoundVolume() {
  // свойстов video.volume может иметь значени от 0 до 1 
  // поэтому делим все на 10 , что бы более четко контролировать значение

  player.volume = soundControl.value / 10;
}

function soundOf() {
  // делаем проверку уровня громкости 
  // если у нашего видео есть звук , то мы его выключаем 
  // предварительно запомнив текущую позицию громкости в переменную soundLevel

  if (player.volume === 0) {
    player.volume = soundLevel;
    soundControl.value = soundLevel * 10;
  } else {
    soundLevel = player.volume;
    player.volume = 0;
    soundControl.value = 0;
  }
}
