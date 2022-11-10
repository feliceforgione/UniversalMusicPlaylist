import React from "react";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@mui/material";
import { useTheme, StyledEngineProvider } from "@mui/material/styles";
import "./themes/components.css";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song: {
    id: "7b82d4e4-cec2-40b6-bfe9-65d90d887db1",
    title: "Constellation",
    artist: "Kille",
    thumbnail: "http://img.youtube.com/vi/92fBkhURuSY/0.jpg",
    duration: 256,
    url: "https://www.youtube.com/watch?v=92fBkhURuSY ",
  },
  isPlaying: false,
});

function App() {
  const theme = useTheme();
  const initialSongSate = React.useContext(SongContext);

  const [state, dispatch] = React.useReducer(songReducer, initialSongSate);
  const greaterThanMd = useMediaQuery(theme.breakpoints.up("md"));
  const greaterThanSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <StyledEngineProvider injectFirst>
        <Hidden only="xs">
          <Header />
        </Hidden>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={7}
            style={{ paddingTop: greaterThanSm ? 120 : 30 }}
          >
            <AddSong />
            <SongList />
          </Grid>
          <Grid
            className={
              greaterThanMd ? "gridPlayerFixedRight" : "gridPlayerFixedLeft"
            }
            item
            xs={12}
            md={5}
          >
            <SongPlayer />
          </Grid>
        </Grid>
      </StyledEngineProvider>
    </SongContext.Provider>
  );
}

export default App;
