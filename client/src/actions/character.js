import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_CHARACTERS,
  GET_CHARACTER,
  CHARACTER_ERROR,
  ADD_CHARACTER,
  UPDATE_CHARACTER,
  DELETE_CHARACTER,
  TOGGLE_CHARACTER_COMPLETED
} from './types';

// Get all character traits
export const getCharacters = () => async dispatch => {
  try {
    const res = await axios.get('/api/character');

    dispatch({
      type: GET_CHARACTERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get character trait by ID
export const getCharacterById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/character/${id}`);

    dispatch({
      type: GET_CHARACTER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add character trait
export const addCharacter = (formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/character', formData, config);

    dispatch({
      type: ADD_CHARACTER,
      payload: res.data
    });

    dispatch(setAlert('Character Trait Added', 'success'));
    navigate('/character');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update character trait
export const updateCharacter = (id, formData, navigate) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/character/${id}`, formData, config);

    dispatch({
      type: UPDATE_CHARACTER,
      payload: res.data
    });

    dispatch(setAlert('Character Trait Updated', 'success'));
    navigate('/character');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Toggle character trait completion
export const toggleCharacterCompleted = id => async dispatch => {
  try {
    const res = await axios.get(`/api/character/${id}`);
    const character = res.data;
    
    const updatedCharacter = {
      ...character,
      completed: !character.completed
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const updatedRes = await axios.put(`/api/character/${id}`, updatedCharacter, config);

    dispatch({
      type: TOGGLE_CHARACTER_COMPLETED,
      payload: updatedRes.data
    });
  } catch (err) {
    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete character trait
export const deleteCharacter = id => async dispatch => {
  try {
    await axios.delete(`/api/character/${id}`);

    dispatch({
      type: DELETE_CHARACTER,
      payload: id
    });

    dispatch(setAlert('Character Trait Removed', 'success'));
  } catch (err) {
    dispatch({
      type: CHARACTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}; 