import { PlayArrow, SkipNext, SkipPrevious, Pause } from "@mui/icons-material";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Slider,
  CardMedia,
} from "@mui/material";
import React from "react";
import QueuedSongList from "./QueuedSongList";
import "../themes/components.css";
import { StyledEngineProvider } from "@mui/material/styles";
import { SongContext } from "./../App";
import { useQuery } from "@apollo/client";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import ReactPlayer from "react-player/lazy";

function SongPlayer() {
  const { data } = useQuery(GET_QUEUED_SONGS);
  const { state, dispatch } = React.useContext(SongContext);
  const [played, setPlayed] = React.useState(0);
  const [playedSeconds, setPlayedSeconds] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [positionInQueue, setPositionInQueue] = React.useState(0);
  const reactPlayerRef = React.useRef();

  React.useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
    setPositionInQueue(songIndex);
  }, [data.queue, state.song.id]);

  React.useEffect(() => {
    const nextSong = data.queue[positionInQueue + 1];
    if (played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queue, played, dispatch, positionInQueue]);

  function handlePlaySong() {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleProgressChange(event, newValue) {
    setPlayed(newValue);
  }

  function handleSeekMouseDown() {
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  function formatDuration(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  function handlePlayPrevSong() {
    const prevSong = data.queue[positionInQueue - 1];
    if (prevSong) {
      dispatch({ type: "SET_SONG", payload: { song: prevSong } });
    }
  }

  function handlePlayNextSong() {
    const nextSong = data.queue[positionInQueue + 1];
    if (nextSong) {
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Card variant="outlined" className="songPlayerContainer">
          <div className="songPlayerDetails">
            <CardContent className="songPlayerContent">
              <Typography variant="h5" component="h3">
                {state.song.title}
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                color="textSecondary"
              >
                {state.song.artist}
              </Typography>
            </CardContent>
            <div className="songPlayerControls">
              <IconButton onClick={handlePlayPrevSong}>
                <SkipPrevious />
              </IconButton>
              <IconButton onClick={handlePlaySong}>
                {state.isPlaying ? (
                  <Pause className="playIcon" />
                ) : (
                  <PlayArrow className="playIcon" />
                )}
              </IconButton>
              <IconButton onClick={handlePlayNextSong}>
                <SkipNext />
              </IconButton>
              <Typography
                variant="subtitle1"
                component="p"
                color="textSecondary"
              >
                {formatDuration(playedSeconds)}
              </Typography>
            </div>
            <Slider
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={played}
              onChange={handleProgressChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
            />
          </div>
          <ReactPlayer
            ref={reactPlayerRef}
            url={state.song.url}
            playing={state.isPlaying}
            hidden
            onProgress={({ played, playedSeconds }) => {
              if (!seeking) {
                setPlayed(played);
                setPlayedSeconds(playedSeconds);
              }
            }}
          />
          <CardMedia
            image={state.song.thumbnail}
            className="songPlayerThumbnail"
          />
        </Card>
        <QueuedSongList queue={data.queue} />
      </StyledEngineProvider>
    </>
  );
}

export default SongPlayer;
