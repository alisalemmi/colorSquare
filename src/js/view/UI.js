const DOM = {
  puzzle: document.querySelector('.puzzle'),
  time: document.querySelector('.timer-number'),
  samples: document.querySelector('.sample'),
  items: null,
  correct: document.querySelector('.scoreboard__correct__number'),
  wrong: document.querySelector('.scoreboard__wrong__number'),
  total: document.querySelector('.scoreboard__total__number'),
  mute: document.querySelector('.mute')
};

let mute = false;

export const reset = () => {
  DOM.correct.innerHTML = '0';
  DOM.wrong.innerHTML = '0';
  DOM.total.innerHTML = '0';
};

/**
 * add selected samples to page
 * @param {Number[]} samples
 */
export const addSample = samples => {
  DOM.samples.innerHTML = '';
  for (const i of samples)
    DOM.samples.innerHTML += `<div><img src="./img/${i}.png" alt="Sample${i}" class="sample__item"/></div>`;
};

/**
 * add selected items to puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  DOM.puzzle.innerHTML = '';

  let i = 0;
  for (const item of items)
    DOM.puzzle.innerHTML += `<div><img src="./img/${
      item.type
    }.png" alt="Sample${
      item.type
    }" class="puzzle__item" data-num=${i++}/></div>`;
};

/**
 * add event listener to items
 * @param {EventListenerOrEventListenerObject} func
 */
export const setItemsClick = func => {
  DOM.items = document.querySelectorAll('.puzzle__item');

  DOM.items.forEach(item => {
    item.addEventListener('click', func);
  });
};

/**
 * 1- update style if clicked item
 * 2- update score
 * 3- play audio
 * @param {Element} target
 * @param {[Boolean, Number, Number]} result
 */
export const update = (target, result) => {
  target.style.opacity = 0.5;

  DOM.correct.innerHTML = result.correct;
  DOM.wrong.innerHTML = result.wrong;
  DOM.total.innerHTML = result.score;

  if (!mute) {
    new Audio(
      result.isCorrect ? './audio/correct.wav' : './audio/wrong.wav'
    ).play();
  }
};

/**
 *
 * @param {Number[]} solution
 */
export const setSolution = solution => {
  DOM.items.forEach((item, i) => {
    item.classList.add(solution[i] ? 'item--correct' : 'item--wrong');
  });
};

DOM.mute.addEventListener('click', () => {
  if (mute) {
    DOM.mute.innerHTML =
      '<svg class="icon"><use xlink:href="./img/sprite.svg#speaker"/></svg>';
    mute = false;
  } else {
    DOM.mute.innerHTML =
      '<svg class="icon"><use xlink:href="./img/sprite.svg#speaker-1"/></svg>';
    mute = true;
  }
});
