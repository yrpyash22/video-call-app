import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import LogoutIcon from "@mui/icons-material/Logout";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import "../App.css";
import withAuth from "../utils/withAuth";
import { AuthContext } from "../contexts/AuthContext";


function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if(!meetingCode.trim())
    {
      return;
    }

    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="homePage">

      {/* Navbar */}
      <nav className="navBar">

        <div className="navLogo">
          <VideoCallIcon />
          <h2>YRP Video Call</h2>
        </div>

        <div className="navActions">
          <div className="historyButton" onClick={() => navigate("/history")}>
            <IconButton>
              <RestoreIcon />
            </IconButton>
            <span>History</span>
          </div>

          <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} className="logoutButton">
            Logout
          </Button>
        </div>
      </nav>


      {/* Main Content */}
      <main className="meetContainer">

        {/* Left */}
        <section className="leftPanel">
          <div className="homeContent">
            <div className="welcomeIcon">
              <VideoCallIcon />
            </div>

            <p className="smallHeading"> WELCOME TO YRP VIDEO CALL</p>

            <h1> Connect with anyone, <span> anywhere.</span></h1>

            <p className="homeDescription">
              Start a video meeting instantly. Enter your meeting code
              below and connect with your friends, family or teammates.
            </p>

            <div className="meetingBox">

              <TextField
                fullWidth
                label="Enter Meeting Code"
                variant="outlined"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinVideoCall();
                  }
                }}
              />

              <Button variant="contained" startIcon={<VideoCallIcon />} onClick={handleJoinVideoCall} disabled={!meetingCode.trim()} className="joinButton">
                Join Meeting
              </Button>
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="rightPanel">
          <div className="imageGlow"></div>

          <img src="/logo3.png" alt="YRP Video Call" className="homeLogo"/>

          <div className="floatingText">
            <VideoCallIcon />
            <div>
              <strong>Ready to connect?</strong>
              <p>Join your meeting now</p>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}

export default withAuth(HomeComponent);