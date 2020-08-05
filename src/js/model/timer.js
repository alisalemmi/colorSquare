let timerInterval = null;
let remain = 0;

export const stop = () => {
  clearInterval(timerInterval);
};

export const start = total => {
  remain = total;

  const tick = new CustomEvent('tick', {
    detail: {
      remain,
      total
    }
  });

  document.dispatchEvent(tick);

  if (timerInterval) stop();

  timerInterval = setInterval(() => {
    remain--;

    tick.detail.remain = remain;
    tick.detail.total = total;

    document.dispatchEvent(tick);

    if (remain === 0) {
      stop();
      document.dispatchEvent(new Event('timeUp'));
    }
  }, 1000);
};

export const getTime = () => remain;
