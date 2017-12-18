import axios from 'axios';
import api from '../../constants/api';
import * as gameActions from '../actions/gameActions';
import offlineStore from '../../store/offlineStore';

export function startFetchingGame() {
  return (dispatch) => {
    dispatch(gameActions.fetchGame());

    return axios.get(`${api.gameApi}`)
      .then(async (res) => {
        // await offlineStore.remove('completedObjectives');
        const completed = await offlineStore.getArrayFrom('completedObjectives');

      const items = res.data.items.map((item) => (completed.includes(item.estimote_beacon_id)
        ? { ...item, completed: true }
    : item));

      if (completed.length > 0) {
        res.data.items = items;
      }

      dispatch(gameActions.fetchGameSuccess(res.data));
    })
    .catch((error) => {
        dispatch(gameActions.fetchGameFailed(error));
    });
  };
}
