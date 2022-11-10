import React from "react";
import "../themes/components.css";
import { StyledEngineProvider } from "@mui/material/styles";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { PlayArrow, Save, Pause } from "@mui/icons-material";
import { useSubscription, useMutation } from "@apollo/client";
import { GET_SONGS } from "./../graphql/subscriptions";
import { SongContext } from "./../App";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

function SongList() {
  const { data, loading, error } = useSubscription(GET_SONGS);

  if (loading) {
    return (
      <StyledEngineProvider injectFirst>
        <div className="spinner">
          <CircularProgress />
        </div>
      </StyledEngineProvider>
    );
  }

  if (error) {
    return <div>Error fetching songs! {error}</div>;
  }

  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
}

function Song({ song }) {
  const { thumbnail, title, artist, id } = song;

  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });

  const { state, dispatch } = React.useContext(SongContext);
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);

  React.useEffect(() => {
    const isSongPlaying = state.isPlaying && state.song.id === id;
    setCurrentSongPlaying(isSongPlaying);
  }, [id, state.song.id, state.isPlaying]);

  function handleTogglePlay() {
    dispatch({
      type: "SET_SONG",
      payload: { song },
    });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  }
  return (
    <StyledEngineProvider injectFirst>
      <Card style={{ margin: "10px" }}>
        {" "}
        <div className="songInfoContainer">
          <CardMedia className="songThumbnail" image={thumbnail} />
          <div className="songInfo">
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography variant="body1" component="p" color="textSecondary">
                {artist}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                color="primary"
                onClick={handleTogglePlay}
              >
                {currentSongPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                size="small"
                color="secondary"
                onClick={handleAddOrRemoveFromQueue}
              >
                <Save />
              </IconButton>
            </CardActions>
          </div>
        </div>
      </Card>
    </StyledEngineProvider>
  );
}

export default SongList;
