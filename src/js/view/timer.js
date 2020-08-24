import * as circle from './circle';

const DOM = {
  ring: document.querySelector('.scoreboard .timer__path-remaining'),
  label: document.querySelector('.scoreboard .timer__label'),
  svg: document.querySelector('.scoreboard .timer__svg')
};

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time % 60}`.padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const update = (remain, total) => {
  if (remain < 0) remain = 0;

  DOM.label.innerHTML = formatTime(remain);
  circle.setCircleDashArray(DOM, remain, total, true);
  circle.setRemainingPathColor(DOM, remain / total);
};
