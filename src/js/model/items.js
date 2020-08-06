const state = {
  samples: [],
  items: [],
  total: 0,
  score: {
    correct: 0,
    wrong: 0
  },
  finish: true,
  width: 2,
  height: 2
};

export const getFinish = () => state.finish;
export const setFinish = isFinish => {
  state.finish = isFinish;
};

export const reset = () => {
  state.samples = [];
  state.items = [];
  state.total = 0;
  state.score.correct = 0;
  state.score.wrong = 0;
  state.finish = false;
  state.width = 2;
  state.height = 2;
};

/**
 * select 2nlogn different item randomly and return them
 */
export const selectSample = (n, m) => {
  const NO = 2 * n * Math.log10(n);
  let x;
  let y;
  for (let i = 0; i < NO; i++) {
    do {
      x = Math.floor(Math.random() * n);
      y = Math.floor(Math.random() * m);
    } while (state.samples.includes({ x: x, y: y }));
    state.samples.push({ x: x, y: y });
  }

  state.total = NO;

  return state.samples;
};

/**
 * select item randomly for filling in puzzle
 * @param {Number} n number of columns in puzzle
 * @param {Number} m number of rows in puzzle
 */
export const selectItem = (n = 2, m = 2) => {
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) {
      state.items.push({ x: i, y: j, select: false });
    }
  }

  return state.items;
};

/**
 * select item with this index.
 * return [isCorrect, correct, wrong, total score, isAllFind].
 * second item in array is either number of correct or wrong.
 * @param {Number} index index of item
 */
export const select = (i, j) => {
  const index = j * width + i;
  if (state.finish || state.items[index].select) return;

  state.items[index].select = true;

  let isCorrect = false;
  if (state.samples.includes({ x: i, y: j })) {
    isCorrect = true;
    state.score.correct++;
  } else state.score.wrong++;

  return {
    isCorrect,
    correct: state.score.correct,
    wrong: state.score.wrong,
    score: getScore(),
    isAllFind: state.total === state.score.correct
  };
};

const getScore = () =>
  Math.floor(((state.score.correct - state.score.wrong) / state.total) * 1000);

const getTimeScore = time => Math.floor((time / (50 - state.total)) * 1000);

const getMaxScore = score => {
  let scores = localStorage.getItem('score')?.split(' ');
  if (scores == null) scores = [];
  scores.push(score);
  localStorage.setItem('score', scores.join(' '));

  return Math.max(...scores);
};

/**
 * calculate final score and return it.
 */
export const calcScore = remainTime => {
  const score = getScore();
  const timeScore = getTimeScore(remainTime);

  return {
    score,
    timeScore,
    correct: state.score.correct,
    wrong: state.score.wrong,
    max: getMaxScore(score + timeScore)
  };
};

export const getSolution = () =>
  state.items.map(val => state.samples.includes({ x: val.x, y: val.y }));
