import { Typography, Avatar, IconButton } from "@mui/material";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, StyledEngineProvider } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import "../themes/components.css";
import { useMutation } from "@apollo/client";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

function QueuedSongList({ queue }) {
  const theme = useTheme();
  const greaterThanMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    greaterThanMd && (
      <StyledEngineProvider injectFirst>
        <div className="QueuedSongList">
          <Typography color="textSecondary" variant="button">
            QUEUE ({queue.length})
          </Typography>
          {queue.map((song) => (
            <QueuedSong key={song.id} song={song} />
          ))}
        </div>
      </StyledEngineProvider>
    )
  );
}

function QueuedSong({ song }) {
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  }

  return (
    <div className="container">
      <Avatar src={song.thumbnail} alt="Song Thumbnail" className="avatar" />
      <div className="queuedSongInfoContainer">
        <Typography variant="subtitle2" className="text">
          {song.title}
        </Typography>
        <Typography variant="body2" className="text">
          {song.artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Delete color="primary" />
      </IconButton>
    </div>
  );
}
export default QueuedSongList;
