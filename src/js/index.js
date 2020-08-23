import '../scss/main.scss';

import '../audio/correct.wav';
import '../audio/wrong.wav';

import * as config from '../config.json';

import * as UI from './view/UI';
import * as Item from './model/items';
import * as TimerUI from './view/timer';
import * as Timer from './model/timer';
import * as Popup from './view/popup';

//-----------------------------
//            click
//-----------------------------

const clickHandler = async e => {
  const index = parseInt(e.target.getAttribute('data-num'));

  const result = Item.select(index);

  if (result) {
    UI.update(e.target, result);

    if (result.isCorrect) Timer.add(config.correctTimeAdd);
    else Timer.add(config.wrongTimeAdd);

    if (result.levelComplete) {
      await goNext();
    }
  }
};

const goNext = async () => {
  Item.setFinish(true);
  Item.goNext();
  await UI.goNext(Item.selectItems(), clickHandler);

  UI.setItemsClick(clickHandler);
  Item.setFinish(false);
};

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('#check__menu').checked = true;
  }, config.introDuration + config.introDelay);
});

Popup.playButtonHandler(async () => {
  // show 3 2 1
  await Popup.showRestart();
  TimerUI.update(config.time, config.time);

  // reset
  await UI.reset(Item.reset(), clickHandler);

  Item.setFinish(false);
  Timer.start(config.time);
});

document.addEventListener('tick', e => {
  TimerUI.update(e.detail.remain, config.time);
});

document.addEventListener('timeUp', e => {
  Popup.showScore({});
});
