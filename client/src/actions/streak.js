import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_STREAKS,
  GET_STREAK,
  STREAK_ERROR,
  ADD_STREAK,
  UPDATE_STREAK,
  DELETE_STREAK
} from './types';

// Get user's streaks
export const getStreaks = () => async dispatch => {
  try {
    const res = await axios.get('/api/streaks');

    dispatch({
      type: GET_STREAKS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STREAK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get streak by ID
export const getStreakById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/streaks/${id}`);

    dispatch({
      type: GET_STREAK,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STREAK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add streak
export const addStreak = (formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/streaks', formData, config);

    dispatch({
      type: ADD_STREAK,
      payload: res.data
    });

    dispatch(setAlert('Streak Added', 'success'));
    navigate('/streaks');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STREAK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update streak
export const updateStreak = (id, formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/streaks/${id}`, formData, config);

    dispatch({
      type: UPDATE_STREAK,
      payload: res.data
    });

    dispatch(setAlert('Streak Updated', 'success'));
    navigate('/streaks');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STREAK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete streak
export const deleteStreak = id => async dispatch => {
  try {
    await axios.delete(`/api/streaks/${id}`);

    dispatch({
      type: DELETE_STREAK,
      payload: id
    });

    dispatch(setAlert('Streak Removed', 'success'));
  } catch (err) {
    dispatch({
      type: STREAK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};