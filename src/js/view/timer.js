const DOM = {
  path: document.querySelector('.timer__path-remaining'),
  label: document.querySelector('.timer__label')
};

export const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time % 60}`.padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const setCircleDashArray = (el, remain, total) => {
  el.setAttribute(
    'stroke-dasharray',
    `${(((remain - 1 + remain / total) / total) * 283).toFixed(0)} 283`
  );
};

export const setRemainingPathColor = (el, timeRemainPercent) => {
  if (timeRemainPercent <= 0.2) {
    el.classList.remove('warn', 'remain');
    el.classList.add('alert');
  } else if (timeRemainPercent <= 0.4) {
    el.classList.remove('remain', 'alert');
    el.classList.add('warn');
  } else {
    el.classList.remove('warn', 'alert');
    el.classList.add('remain');
  }
};

export const update = (remain, total) => {
  DOM.label.innerHTML = formatTime(remain);
  setCircleDashArray(DOM.path, remain, total);
  setRemainingPathColor(DOM.path, remain / total);
};
