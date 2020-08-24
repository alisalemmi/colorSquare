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

    if (!result.isCorrect) Timer.add(config.wrongTimeAdd);

    if (result.levelComplete) {
      const n = Item.getCorrectInThisLevel();

      let addTime = config.correctTimeAdd * n;
      if (result.sectionComplete) addTime += config.sectionCompleteTimeAdd * n;

      Timer.add(addTime);
      e.target.innerHTML = `<div style="color: white;font-size: 2.5rem;transform: rotateY(-180deg);">+ ${addTime}s</div>`;

      await goNext();
    }
  }
};

const goNext = async () => {
  Item.setFinish(true);
  const level = Item.goNext();
  await UI.goNext(Item.selectItems(), level, clickHandler);

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
  TimerUI.update((config.time * 3) / 4, config.time);

  // reset
  await UI.reset(Item.reset(), clickHandler);

  Item.setFinish(false);
  Timer.start(config.time);
});

document.addEventListener('tick', e => {
  TimerUI.update(e.detail.remain, config.time);
});

document.addEventListener('timeUp', () => {
  Item.setFinish(true);
  Popup.showScore(Item.calcScore());
});

Popup.homeHandler(Item.getFinish);
