import * as circle from './circle';
import config from '../../config.json';

const resetCircleDashArray = el => {
  el.ring.style.transitionDelay = '0s';
  el.ring.style.transitionDuration = '0s';
  el.ring.setAttribute('stroke-dasharray', '0 283');
};

export const animate = (el, remain, total) => {
  // reset
  resetCircleDashArray(el);

  el.label.innerHTML = remain;
  circle.setRemainingPathColor(el, remain / total);

  // animate to score
  setTimeout(() => {
    el.ring.style.transitionDelay = `${config.popupCloseDuration}ms`;
    el.ring.style.transitionDuration = '0.5s';
    circle.setCircleDashArray(el, remain, total, false);
  }, 10);
};
