export const setCircleDashArray = (el, remain, total, fullOnZero) => {
  const absRemain = Math.abs(remain);
  el.ring.setAttribute(
    'stroke-dasharray',
    `${(((absRemain - 1 + absRemain / total) / total) * 283).toFixed(0)} 283`
  );

  if (remain) {
    el.svg.style.transform = `scaleX(${Math.sign(-remain)})`;
    el.ring.style.visibility = 'visible';
  } else if (!fullOnZero) el.ring.style.visibility = 'hidden';
};

export const setRemainingPathColor = (el, timeRemainPercent) => {
  if (timeRemainPercent <= 0.2) {
    el.ring.classList.remove('timer__color__warn', 'timer__color__remain');
    el.ring.classList.add('timer__color__alert');
  } else if (timeRemainPercent <= 0.4) {
    el.ring.classList.remove('timer__color__remain', 'timer__color__alert');
    el.ring.classList.add('timer__color__warn');
  } else {
    el.ring.classList.remove('timer__color__warn', 'timer__color__alert');
    el.ring.classList.add('timer__color__remain');
  }
};
