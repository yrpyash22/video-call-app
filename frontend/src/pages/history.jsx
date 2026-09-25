import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import "../App.css";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (error) {
        console.log("History error:", error);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="historyPage">

      {/* Header */}
      <nav className="historyNav">

        <div className="historyLogo">
          <VideoCallIcon />
          <h2>YRP Video Call</h2>
        </div>

        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/home")}
          className="historyHomeButton"
        >
          Home
        </Button>

      </nav>

      {/* Main Content */}
      <main className="historyContainer">

        <div className="historyHeader">
          <h1>Meeting History</h1>

          <p>
            Your previous video meeting codes
          </p>
        </div>

        {meetings.length !== 0 ? (

          <div className="historyGrid">

            {meetings.map((e, i) => (
              <Card
                key={i}
                className="historyCard"
                variant="outlined"
              >
                <CardContent>

                  <Typography
                    className="historyCodeLabel"
                  >
                    Meeting Code
                  </Typography>

                  <Typography
                    className="historyCode"
                  >
                    {e.meetingCode}
                  </Typography>

                  <Typography
                    className="historyDate"
                  >
                    Date: {formatDate(e.date)}
                  </Typography>

                </CardContent>
              </Card>
            ))}

          </div>

        ) : (

          <div className="emptyHistory">
            <VideoCallIcon />

            <h2>No Meeting History</h2>

            <p>
              You haven't joined any meetings yet.
            </p>

            <Button
              variant="contained"
              onClick={() => navigate("/home")}
            >
              Join a Meeting
            </Button>
          </div>

        )}

      </main>

    </div>
  );
}
