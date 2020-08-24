const state = {
  width: 2,
  height: 1,
  items: [],
  score: {
    correct: 0,
    wrong: 0
  },
  total: 0,
  level: {
    complete: 1,
    total: 1
  },
  finish: true
};

export const getFinish = () => state.finish;
export const setFinish = isFinish => {
  state.finish = isFinish;
};

/**
 * shuffle input array and return it
 * @param {number[]} array
 */
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getCorrectInThisLevel = () => {
  return Math.ceil(
    ((Math.sqrt(state.width * state.height) *
      Math.log10(state.width * state.height) +
      Math.sqrt(state.level.complete)) *
      2) /
      3
  );
};

export const selectItems = () => {
  state.items = [];

  // number of item to select
  const n = getCorrectInThisLevel();

  // update total
  state.total += n;

  // make array and shuffle it
  for (let i = 0; i < state.height * state.width; i++)
    state.items.push({ select: false, type: i < n });

  shuffle(state.items);

  return {
    width: state.width,
    height: state.height,
    items: state.items
  };
};

export const reset = () => {
  state.width = 2;
  state.height = 2;
  state.score.correct = 0;
  state.score.wrong = 0;
  state.total = 0;
  state.items = selectItems().items;
  state.level.complete = 1;
  state.level.total = 1;
  state.finish = false;

  return state.items;
};

const getScore = () =>
  Math.floor((state.score.correct - state.score.wrong / 3) * 8);

export const calcScore = () => {
  return {
    correct: state.score.correct,
    wrong: state.score.wrong,
    score: getScore()
  };
};

/**
 * select item with this index.
 * @param {Number} index index of selected item
 */
export const select = index => {
  if (state.finish || state.items[index].select) return;

  // set item to selected
  state.items[index].select = true;

  // check that selected item is correct
  const isCorrect = state.items[index].type;

  if (isCorrect) state.score.correct++;
  else state.score.wrong++;

  return {
    isCorrect,
    correct: state.score.correct,
    wrong: state.score.wrong,
    levelComplete: state.score.correct === state.total,
    sectionComplete:
      state.score.correct === state.total &&
      state.level.complete === state.level.total,
    score: getScore()
  };
};

export const goNext = () => {
  if (state.level.complete < state.level.total) state.level.complete++;
  else {
    if (state.width === state.height) state.width++;
    else state.height++;

    state.level.complete = 1;
    state.level.total = state.width - 1;
  }
};
