import {
  GET_READINGS,
  READING_ERROR,
  ADD_READING,
  LOG_READING_PROGRESS,
  UPDATE_READING,
  DELETE_READING
} from '../actions/types';

const initialState = {
  readings: [],
  loading: true,
  error: {}
};

const readingReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_READINGS:
      return {
        ...state,
        readings: payload,
        loading: false
      };

    case ADD_READING:
      return {
        ...state,
        readings: [payload, ...state.readings],
        loading: false
      };

    case UPDATE_READING:
    case LOG_READING_PROGRESS:
      return {
        ...state,
        readings: state.readings.map(reading =>
          reading._id === payload._id ? payload : reading
        ),
        loading: false
      };

    case DELETE_READING:
      return {
        ...state,
        readings: state.readings.filter(reading => reading._id !== payload),
        loading: false
      };

    case READING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    default:
      return state;
  }
};

export default readingReducer;