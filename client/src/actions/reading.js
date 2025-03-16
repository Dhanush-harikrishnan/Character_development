import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_READINGS,
  READING_ERROR,
  ADD_READING,
  UPDATE_READING,
  DELETE_READING
} from './types';

// Get user's readings
export const getReadings = () => async dispatch => {
  try {
    const res = await axios.get('/api/reading');

    dispatch({
      type: GET_READINGS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: READING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add reading
export const addReading = (formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/reading', formData, config);

    dispatch({
      type: ADD_READING,
      payload: res.data
    });

    dispatch(setAlert('Reading Added', 'success'));
    navigate('/reading');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: READING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update reading
export const updateReading = (id, formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/reading/${id}`, formData, config);

    dispatch({
      type: UPDATE_READING,
      payload: res.data
    });

    dispatch(setAlert('Reading Updated', 'success'));
    navigate('/reading');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: READING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete reading
export const deleteReading = id => async dispatch => {
  try {
    await axios.delete(`/api/reading/${id}`);

    dispatch({
      type: DELETE_READING,
      payload: id
    });

    dispatch(setAlert('Reading Removed', 'success'));
  } catch (err) {
    dispatch({
      type: READING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};