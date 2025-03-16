import {
  GET_STREAKS,
  GET_STREAK,
  STREAK_ERROR,
  ADD_STREAK,
  CHECK_IN_STREAK,
  RESET_STREAK,
  UPDATE_STREAK,
  DELETE_STREAK
} from '../actions/types';

const initialState = {
  streaks: [],
  streak: null,
  loading: true,
  error: {}
};

export default function streakReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STREAKS:
      return {
        ...state,
        streaks: payload,
        loading: false
      };
    case GET_STREAK:
      return {
        ...state,
        streak: payload,
        loading: false
      };
    case ADD_STREAK:
      return {
        ...state,
        streaks: [payload, ...state.streaks],
        loading: false
      };
    case UPDATE_STREAK:
    case CHECK_IN_STREAK:
    case RESET_STREAK:
      return {
        ...state,
        streaks: state.streaks.map(streak =>
          streak._id === payload._id ? payload : streak
        ),
        streak: payload,
        loading: false
      };
    case DELETE_STREAK:
      return {
        ...state,
        streaks: state.streaks.filter(streak => streak._id !== payload),
        loading: false
      };
    case STREAK_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}