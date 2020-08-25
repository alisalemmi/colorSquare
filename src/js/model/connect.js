import Axios from 'axios';
import config from '../../config.json';

const init = async () => {
  const url = new URLSearchParams(window.location.search);
  config.name = `${url.get('name')} ${url.get('lastname')}`;
  config.username = url.get('username');

  const res = await Axios.get(`/api/init/${config.username}/${config.name}`);
  config.maxScore = res.data.directedSquare || 0;
};

init();

/**
 * send result to server
 * @param {{correct: number, wrong: number, score: number}} score
 */
export const sendResult = async score => {
  try {
    const res = await Axios.post(
      `/api/setScore/memoryTable/${config.username}`,
      score
    );

    config.myRank = res.data.rank.rank;
    config.maxScore = res.data.rank.score;
    config.rankScore = res.data.tops[0].score;
    config.tops = res.data.tops;
  } catch {
    config.maxScore = Math.max(config.maxScore, score.score);
    config.rankScore = Math.max(config.rankScore, score.score);
  }
};
