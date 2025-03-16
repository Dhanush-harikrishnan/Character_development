import {
  GET_CHARACTERS,
  GET_CHARACTER,
  CHARACTER_ERROR,
  ADD_CHARACTER,
  UPDATE_CHARACTER,
  DELETE_CHARACTER,
  TOGGLE_CHARACTER_COMPLETED
} from '../actions/types';

const initialState = {
  characters: [],
  character: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CHARACTERS:
      return {
        ...state,
        characters: payload,
        loading: false
      };
    case GET_CHARACTER:
      return {
        ...state,
        character: payload,
        loading: false
      };
    case ADD_CHARACTER:
      return {
        ...state,
        characters: [payload, ...state.characters],
        loading: false
      };
    case UPDATE_CHARACTER:
    case TOGGLE_CHARACTER_COMPLETED:
      return {
        ...state,
        characters: state.characters.map(character =>
          character._id === payload._id ? payload : character
        ),
        character: payload,
        loading: false
      };
    case DELETE_CHARACTER:
      return {
        ...state,
        characters: state.characters.filter(character => character._id !== payload),
        loading: false
      };
    case CHARACTER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
} 