import {
  InputAdornment,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import { AddBoxOutlined, Link } from "@mui/icons-material";
import "../themes/components.css";
import { StyledEngineProvider } from "@mui/material/styles";

import YoutubePlayer from "react-player/youtube";
import SoundcloudPlayer from "react-player/soundcloud";
import ReactPlayer from "react-player/lazy";
import { ADD_SONG } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

const DEFAULT_SONG = {
  duration: 0,
  title: "",
  artist: "",
  thumbnail: "",
};

function AddSong() {
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [url, setUrl] = React.useState("");
  const [playable, setPlayable] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);
  const [song, setSong] = React.useState(DEFAULT_SONG);

  React.useEffect(() => {
    const isPlayable =
      YoutubePlayer.canPlay(url) || SoundcloudPlayer.canPlay(url);

    setPlayable(isPlayable);
  }, [url]);

  function handleChangeSong(event) {
    const { name, value } = event.target;
    setSong((prevSong) => ({ ...prevSong, [name]: value }));
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  async function handleAddSong() {
    try {
      const { url, title, artist, thumbnail, duration } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
        },
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl("");
    } catch (error) {
      console.error("Error adding song", error);
    }
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  function handleError(field) {
    return error && error.graphQLErrors[0].extensions.path.includes(field);
  }

  const { thumbnail, title, artist } = song;
  return (
    <StyledEngineProvider injectFirst>
      <div className="container">
        <Dialog open={dialog} onClose={handleCloseDialog} className="dialog">
          <DialogTitle>Edit Song</DialogTitle>
          <DialogContent>
            <img src={thumbnail} alt="Song thumbnail" className="thumbnail" />
            <TextField
              onChange={handleChangeSong}
              value={title}
              margin="dense"
              name="title"
              label="Title"
              fullWidth
              error={handleError("title")}
              helperText={handleError("title") && "Fill out field"}
            />
            <TextField
              onChange={handleChangeSong}
              value={artist}
              margin="dense"
              name="artist"
              label="Artist"
              fullWidth
              error={handleError("artist")}
              helperText={handleError("artist") && "Fill out field"}
            />
            <TextField
              onChange={handleChangeSong}
              value={thumbnail}
              margin="dense"
              name="thumbnail"
              label="Thumbnail"
              fullWidth
              error={handleError("thumbnail")}
              helperText={handleError("thumbnail") && "Fill out field"}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddSong} variant="outline" color="primary">
              Add Song
            </Button>
          </DialogActions>
        </Dialog>
        <TextField
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          className="urlInput"
          placeholder="Add YouTube or SoundCloud Url"
          fullWidth
          margin="normal"
          type="url"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Link></Link>
              </InputAdornment>
            ),
          }}
        />
        <Button
          disabled={!playable}
          className="addSongButton"
          onClick={() => setDialog(true)}
          variant="contained"
          color="primary"
          endIcon={<AddBoxOutlined />}
        >
          {" "}
          Add{" "}
        </Button>
        <ReactPlayer hidden url={url} onReady={handleEditSong} />
      </div>
    </StyledEngineProvider>
  );
}

export default AddSong;
