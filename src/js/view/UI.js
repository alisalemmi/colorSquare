import Z from 'random-z';
import config from '../../config.json';

const DOM = {
  puzzle: document.querySelector('.puzzle'),
  correct: document.querySelector('.scoreboard__correct__number'),
  wrong: document.querySelector('.scoreboard__wrong__number'),
  total: document.querySelector('.scoreboard__total__number'),
  items: [],
  mute: document.querySelector('.mute')
};

let mute = false;

let variance = 0.001;
let mean;

const sleep = time => new Promise(r => setTimeout(r, time));

const getItemClass = (pos, width, height, length, isExpanded) => {
  if (!isExpanded) return 'puzzle__item';

  if (width === height && length - pos <= height)
    return 'puzzle__item puzzle__item--new-y';

  if (width === height + 1 && pos % width === 0)
    return 'puzzle__item puzzle__item--new-x';

  return 'puzzle__item';
};

const getItemColor = type => {
  return type
    ? config.puzzleColors[
        Math.floor(Math.abs(Z() * variance + mean)) % config.puzzleColors.length
      ]
    : config.frontColor;
};

/**
 * add items to the puzzle
 * @param {Number[]} puzzle
 */
export const addItem = puzzle => {
  // update grid
  DOM.puzzle.style.gridTemplateColumns = `repeat(${puzzle.width}, min-content)`;

  // update probablity variable
  mean = Math.random() * config.puzzleColors.length;
  variance *= 1.5;

  // check extend
  const isExtend = DOM.items.length !== puzzle.items.length;

  // update exsting items
  for (let i = 0; i < DOM.items.length; i++) {
    DOM.items[i].className = getItemClass(
      i,
      puzzle.width,
      puzzle.height,
      puzzle.items.length,
      isExtend
    );

    DOM.items[i].style.color = getItemColor(puzzle.items[i].type);
  }

  // add new items
  for (let i = DOM.items.length; i < puzzle.items.length; i++) {
    const className = getItemClass(
      i,
      puzzle.width,
      puzzle.height,
      puzzle.items.length,
      isExtend
    );

    const style = `style="color: ${getItemColor(puzzle.items[i].type)}"`;

    DOM.puzzle.innerHTML += `<div class="${className}" ${style} data-num=${i}></div>`;
  }

  DOM.items = document.querySelectorAll('.puzzle__item');
};

export const setItemsClick = func => {
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
  if (!result.isCorrect) target.style.color = config.wrongColor;

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
  for (const item of DOM.items) {
    item.classList.remove('puzzle__item--select');
    item.innerHTML = '';
  }
};

const showSolution = () => {
  for (const item of DOM.items) item.classList.add('puzzle__item--select');
};

const clearPuzzle = async () => {
  // wait to selected item rotate
  await sleep(config.puzzleItemRotateTime + config.clearPuzzleDelay);

  hideSolution();

  // wait until item rotation finished
  await sleep(config.puzzleItemRotateTime * 2);
};

const solution = async () => {
  // wait untill adding animation finished
  await sleep(config.puzzleItemRotateTime * 2);

  // show solution
  showSolution();

  await sleep(
    (config.showSolutionDuration * Math.log10(DOM.items.length)) / Math.log10(8)
  );

  hideSolution();
};

export const reset = async (initialItems, clickHandler) => {
  DOM.correct.innerHTML = 0;
  DOM.wrong.innerHTML = 0;
  DOM.total.innerHTML = 0;

  DOM.puzzle.innerHTML = '';
  DOM.items = [];

  await sleep(config.puzzleNewItemTime);
  addItem({
    items: [initialItems[0]],
    width: 1,
    height: 1
  });

  await sleep(config.puzzleNewItemTime * 1.5);
  addItem({
    items: [initialItems[0], initialItems[1]],
    width: 2,
    height: 1
  });

  await sleep(config.puzzleNewItemTime * 1.8);
  addItem({
    items: [initialItems[0], initialItems[1], initialItems[2], initialItems[3]],
    width: 2,
    height: 2
  });

  setItemsClick(clickHandler);

  await solution();
};

export const goNext = async (newItems, clickHandler) => {
  await clearPuzzle();

  // add new item
  addItem(newItems);
  setItemsClick(clickHandler);

  // show solution
  await solution();
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
