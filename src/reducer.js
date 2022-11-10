function songReducer(state, action) {
  switch (action.type) {
    case "SET_SONG": {
      return { ...state, song: action.payload.song };
    }
    case "PLAY_SONG": {
      return { ...state, isPlaying: true };
    }
    case "PAUSE_SONG": {
      return { ...state, isPlaying: false };
    }
    default:
      return state;
  }
}

export default songReducer;
