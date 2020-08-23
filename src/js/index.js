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
  Popup.showRestart(() => Timer.start(config.time));

  Item.setFinish(false);

  // reset
  UI.reset(Item.reset(), clickHandler);

  // add items
  // UI.addSamples(Item.selectSample());
  // UI.addItem(Item.selectItems());

  // goNext();

  // handle click
  // UI.setItemsClick(clickHandler);
});
