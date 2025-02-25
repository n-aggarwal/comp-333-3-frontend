/*
<<<<<<< HEAD
import React from "react"
import { useState , useEffect } from "react"
import { TextField, FormControl, Button } from "@mui/material";
import axios from "axios";
import styles from './homeView.module.css';
import { useNavigate, Link } from "react-router-dom";
import MusicComponent from "../componenets/music_component";
import LoginComponent from "../componenets/login_component";
import RegisterComponent from "../componenets/register_componenet";

export default function HomeView () {

    const [user, setUser] = useState();
    const [musicData, setMusicData] = useState([]);

    const [showLogin, updateShowLogin] = useState(false);
    const [showRegister, updateShowRegister] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = loggedInUser;
          setUser(foundUser);
          getMusic();
        }
        // else {
        //     navigate("/login");
        // }
      }, [showLogin, showRegister]);

    function logout () {
        setUser();
        axios.post("http://localhost:80/index.php/user/logout", {}, {withCredentials: true}).then(
            () => {
                localStorage.clear();
                // navigate("/login");
                getMusic();
            }
        )

    }

    function updateMusicData() {
        getMusic();
    }
    

    function getMusic() {
        axios
            .get("http://localhost:80/index.php/music/list")
            .then((response) => {
                    console.log(response);
                    response = response.data;

                    setMusicData(response);

            })
            .catch((error) => {
            console.error("Error Displaying music:", error);
            // Handle registration error, display an error message, etc.
            });
        return;
    }

    return (
        <div>
            <h1>Home View</h1>
            {!user && <div><Button onClick={() => {
                updateShowLogin(!showLogin); 
                if (showRegister) {
                    updateShowRegister(!showRegister);
                }
            }}>Log In</Button>
            <Button onClick={() => {
                updateShowRegister(!showRegister);
                if (showLogin) {
                    updateShowLogin (!showLogin);
                }
                }}>Register</Button></ div>}
            

            {showLogin && (
                <LoginComponent
                    updateMusicData={updateMusicData}
                    showLogin={showLogin}
                    updateShowLogin={updateShowLogin}
                />
                )}
            {showRegister && (
                <RegisterComponent
                    updateMusicData={updateMusicData}
                    showRegister={showRegister}
                    updateShowRegister={updateShowRegister}
                />
                )}
            <Button>Create</Button>
            <div>
            {musicData.map((music) => (
                    <MusicComponent
                        key={music.id}
                        id={music.id}
                        username={music.username}
                        artist={music.artist}
                        song={music.song}
                        rating={music.rating}
                        signedinUser={user}
                        updateMusicData={updateMusicData}
                    />
                ))}
            </div>
            {user && <Button onClick={logout}>Logout</Button>}
        </div>
    )
}
*/
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MusicComponent from "../componenets/music_component";
import LoginComponent from "../componenets/login_component";
import RegisterComponent from "../componenets/register_componenet";
import axios from "axios";

function HomeView() {
  const navigate = useNavigate();
  const [songList, setSongList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newSong, setNewSong] = useState({
    artist: "",
    song: "",
    rating: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [artistFilter, setArtistFilter] = useState(""); // State for artist filtering
  const [musicData, setMusicData] = useState([]);
  const [showLogin, updateShowLogin] = useState(false);
  const [showRegister, updateShowRegister] = useState(false);


  useEffect(() => {
    const user = Cookies.get('name');
    if (user) {
      setLoggedInUser(user);
    } else {
      return;
    }

    axios.get(`http://localhost:80/index.php/music/list?username=${user}`, {withCredentials: true})
      .then((response) => {
        setSongList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching song list:", error);
      });

  }, [navigate]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = loggedInUser;
      setLoggedInUser(foundUser);
      getMusic();
    }
    // else {
    //     navigate("/login");
    // }
  }, [showLogin, showRegister]);

function logout () {
    setLoggedInUser();
    axios.post("http://localhost:80/index.php/user/logout", {}, {withCredentials: true}).then(
        () => {
            localStorage.clear();
            // navigate("/login");
            getMusic();
        }
    )

}

    function updateMusicData() {
        getMusic();
    }


    function getMusic() {
        axios
            .get("http://localhost:80/index.php/music/list")
            .then((response) => {
                    console.log(response);
                    response = response.data;

                    setMusicData(response);
                    setSongList(response);

            })
            .catch((error) => {
            console.error("Error Displaying music:", error);
            // Handle registration error, display an error message, etc.
            });
        return;
    }


  const handleCreateClick = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleCreateSong = () => {
    axios.post("http://localhost:80/index.php/music/create", JSON.stringify(newSong), {withCredentials: true})
      .then((response) => {
        axios.get("http://localhost:80/index.php/music/list", {withCredentials: true})
          .then((response) => {
            setSongList(response.data);
          })
          .catch((error) => {
            console.error("Error fetching song list:", error);
          });

        setOpenCreateDialog(false);
      })
      .catch((error) => {
        console.error("Error creating song:", error);
      });
  };

  const filteredSongs = songList.filter((song) =>
    artistFilter
      ? song.artist.toLowerCase().includes(artistFilter.toLowerCase())
      : true
  );

  return (
    <div>
        {!loggedInUser && <div><Button onClick={() => {
                updateShowLogin(!showLogin); 
                if (showRegister) {
                    updateShowRegister(!showRegister);
                }
            }}>Log In</Button>
            <Button onClick={() => {
                updateShowRegister(!showRegister);
                if (showLogin) {
                    updateShowLogin (!showLogin);
                }
                }}>Register</Button></ div>}
                {showLogin && (
                <LoginComponent
                    updateMusicData={updateMusicData}
                    showLogin={showLogin}
                    updateShowLogin={updateShowLogin}
                />
                )}
            {showRegister && (
                <RegisterComponent
                    updateMusicData={updateMusicData}
                    showRegister={showRegister}
                    updateShowRegister={updateShowRegister}
                />
                )}

      <TextField
        label="Search by Artist"
        value={artistFilter}
        onChange={(e) => setArtistFilter(e.target.value)}
        fullWidth
        style={{ margin: "20px 0" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClick}
      >
        Create Song
      </Button>

      <div>
        {filteredSongs.map((music) => (
          <MusicComponent
          key={music.id}
          id={music.id}
          username={music.username}
          artist={music.artist}
          song={music.song}
          rating={music.rating}
          signedinUser={loggedInUser}
          updateMusicData={updateMusicData}
      />
        ))}
      </div>

      <Dialog open={openCreateDialog} onClose={handleCreateClose}>
        <DialogTitle>Create New Song</DialogTitle>
        <DialogContent>
          <TextField
            label="Artist"
            value={newSong.artist}
            onChange={(e) =>
              setNewSong({ ...newSong, artist: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Song"
            value={newSong.song}
            onChange={(e) => setNewSong({ ...newSong, song: e.target.value})}
            fullWidth
          />
          <TextField
            label="Rating"
            value={newSong.rating}
            onChange={(e) =>
              setNewSong({ ...newSong, rating: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSong} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {loggedInUser && <Button onClick={logout}>Logout</Button>}
    </div>
  );
}

export default HomeView;
