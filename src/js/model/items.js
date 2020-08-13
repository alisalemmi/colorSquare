const state = {
  width: 2,
  height: 1,
  score: {
    correct: 0,
    wrong: 0
  },
  items: [],
  total: 0,
  finish: true
};

export const getFinish = () => state.finish;
export const setFinish = isFinish => {
  state.finish = isFinish;
};

export const reset = () => {
  state.width = 2;
  state.height = 2;
  state.score.correct = 0;
  state.score.wrong = 0;
  state.items = [];
  state.total = 0;
  state.finish = false;
};

/**
 * shuffle input array and return it
 * @param {number[]} array
 */
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const selectItems = () => {
  state.items = [];

  // number of item to select
  const n = Math.ceil(
    Math.sqrt(state.width * state.height) *
      Math.log10(state.width * state.height)
  );

  // update total
  state.total += n;

  // make array and shuffle it
  for (let i = 0; i < state.height * state.width; i++)
    state.items.push({ select: false, type: i < n ? true : false });

  return shuffle(state.items);
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
    levelComplete: state.score.correct == state.total,
    score: 0 // getScore(),
  };
};

export const goNext = () => {
  if (state.width == state.height) state.width++;
  else state.height++;
};
