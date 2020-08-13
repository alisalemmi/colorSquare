import * as config from '../../config.json';

const DOM = {
  puzzle: document.querySelector('.puzzle'),
  correct: document.querySelector('.scoreboard__correct__number'),
  wrong: document.querySelector('.scoreboard__wrong__number'),
  total: document.querySelector('.scoreboard__total__number'),
  items: []
};

let mute = false;

/**
 * add items to the puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  // calc width and height of the puzzle
  const tmp = Math.sqrt(items.length);
  const width = Math.ceil(tmp);
  const height = Math.floor(tmp);

  // update grid
  DOM.puzzle.innerHTML = '';
  DOM.puzzle.style.gridTemplateColumns = `repeat(${width}, min-content)`;

  // add items
  let i = 0;
  for (const item of items) {
    const classList = `puzzle__item${item.type ? ' puzzle__item--sample' : ''}`;

    if (width == height && items.length - i <= height)
      classList += ' puzzle__item--new-y';
    else if (width == height + 1 && i % width == 0)
      classList += ' puzzle__item--new-x';

    DOM.puzzle.innerHTML += `<div class="${classList}" data-num=${i++}></div>`;
  }
};

export const setItemsClick = func => {
  DOM.items = document.querySelectorAll('.puzzle__item');

  for (const item of DOM.items) {
    item.addEventListener('click', func);
  }
};

/**
 * 1- update style if clicked item
 * 2- update score
 * 3- play audio
 * @param {Element} target
 * @param {{isCorrect, correct, wrong, score, newItem}} result
 */
export const update = (target, result) => {
  // select item
  target.classList.add('puzzle__item--select');

  // update scoreboard
  DOM.correct.innerHTML = result.correct;
  DOM.wrong.innerHTML = result.wrong;
  DOM.total.innerHTML = result.score;

  // play music
  if (!mute) {
    new Audio(
      result.isCorrect ? './audio/correct.wav' : './audio/wrong.wav'
    ).play();
  }
};

const hideSolution = () => {
  for (const item of DOM.items) item.classList.remove('puzzle__item--select');
};

const showSolution = () => {
  for (const item of DOM.items) item.classList.add('puzzle__item--select');
};

const sleep = time => new Promise(r => setTimeout(r, time));

export const goNext = async (newItems, clickHandler) => {
  // wait to selected item rotate
  await sleep(config.puzzleItemRotateTime);

  hideSolution();

  // wait until item rotation finished
  await sleep(config.puzzleItemRotateTime * 2);

  // add new item
  addItem(newItems);
  setItemsClick(clickHandler);

  // wait untill adding animation finished
  await sleep(config.puzzleItemRotateTime * 2);

  // show solution
  showSolution();

  await sleep(config.showSolutionDuration);

  hideSolution();
};
