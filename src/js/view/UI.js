import config from '../../config.json';

const DOM = {
  puzzle: document.querySelector('.puzzle'),
  correct: document.querySelector('.scoreboard__correct__number'),
  wrong: document.querySelector('.scoreboard__wrong__number'),
  total: document.querySelector('.scoreboard__total__number'),
  items: []
};

let mute = false;

const sleep = time => new Promise(r => setTimeout(r, time));

/**
 * add items to the puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  console.log('add', items);
  // update grid
  DOM.puzzle.innerHTML = '';
  DOM.puzzle.style.gridTemplateColumns = `repeat(${items.width}, min-content)`;

  // add items
  let i = 0;
  for (const item of items.items) {
    let classList = `puzzle__item${item.type ? ' puzzle__item--sample' : ''}`;

    if (items.width === items.height && items.items.length - i <= items.height)
      classList += ' puzzle__item--new-y';
    else if (items.width === items.height + 1 && i % items.width === 0)
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

export const reset = async (initialItems, clickHandler) => {
  console.log(initialItems);
  DOM.correct.innerHTML = 0;
  DOM.wrong.innerHTML = 0;
  DOM.total.innerHTML = 0;

  await sleep(4200);
  addItem({
    items: [initialItems[0]],
    width: 1,
    height: 1
  });

  await sleep(config.puzzleNewItemTime * 2);
  addItem({
    items: [initialItems[0], initialItems[1]],
    width: 2,
    height: 1
  });

  await sleep(config.puzzleNewItemTime * 2);
  addItem({
    items: [initialItems[0], initialItems[1], initialItems[2], initialItems[3]],
    width: 2,
    height: 2
  });

  setItemsClick(clickHandler);

  // wait untill adding animation finished
  await sleep(config.puzzleItemRotateTime * 2);

  // show solution
  showSolution();

  await sleep(config.showSolutionDuration);

  hideSolution();
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
