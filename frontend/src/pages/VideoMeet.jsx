import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";

import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicOffIcon from '@mui/icons-material/MicOff'
import MicIcon from '@mui/icons-material/Mic'
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ChatIcon from '@mui/icons-material/Chat'

import styles from "../styles/videoComponent.module.css";
import server from '../environment';

const server_url = server;

// This Object to store active peer connection for multi-user calls or tracks all WebRTC connections by user.
var connections = {};

// Configuration for WebRTC connections, including (STUN servers) to discover public ip addresses.
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(false);
    let [audio, setAudio] = useState(false);


    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [usernameError, setUsernameError] = useState("");

    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);


    // Runs on component mount to initialize permissions for the meeting.
    useEffect(() => {
        console.log("HELLO");
        getPermissions();
    }, []);

    // Component mount hote hi camera/mic/screen-share ki permission maangta hai browser se, aur agar mil jaye to local preview video me dikhata hai.
    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream)
                {
                    window.localStream = userMediaStream;
                    if (localVideoref.current)
                    {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };


    // Updates the local video stream when audio or video state changes.
    useEffect(() => {
        if (video !== undefined && audio !== undefined)
        {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);
        }
    }, [video, audio]);

    // Jab user video/audio toggle karta hai, tab naya media stream leta hai. Fir ye stream sabhi existing peer connections me add karta hai aur naya WebRTC "offer" banake dusre users ko bhejta hai (taaki unhe updated stream mile).
    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable))
        {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e))
        }
        else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            catch (e) { console.log(e); }
        }
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        }
        catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        // all connections per loop WebRTC offer banaye or use socket ke through add kare
        for (let id in connections)
        {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);

            // Genetate WebRTC offer log SDP(Session Description Protocal), set local description and emit signal to remote peer connection.
            connections[id].createOffer().then((description) => {
                console.log(description);
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        // Attach onended listeners to stream tracks to reset video and audio states whean they end.
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            for (let id in connections)
            {
                connections[id].addStream(window.localStream);

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }



    // Screen sharing handle karta hai — same logic jaise upar, bas camera stream ki jagah screen ka stream bhejta hai.
    let getDislayMedia = () => {
        if(screen)
        {
            if(navigator.mediaDevices.getDisplayMedia)
            {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE");
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            getUserMedia();
        })
    }


    // Ye WebRTC ka "signaling" handle karta hai: 
        // Agar SDP (offer/answer) aaya hai → set karta hai aur agar offer tha to answer bana ke wapas bhejta hai.
        // Agar ICE candidate aaya hai → connection ke liye add karta hai 
        // (Ye poore WebRTC handshake ka core hai)
    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === 'offer') {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));

                                }).catch(e => console.log(e))
                            }).catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }


    // Socket.io se backend se connect karta hai:
    // join-call emit karta hai (meeting join karne ke liye)
    // Jab naya user join kare (user-joined) → uske liye naya RTCPeerConnection banata hai, ICE candidates aur stream ka event listener lagata hai
    // Jab koi user leave kare (user-left) → uski video list se hata deta hai
    // Chat message aane par addMessage call karta hai
    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {

                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                        else {
                            // Create a new video
                            console.log("CREATING NEW");

                            let newVideo = { socketId: socketListId, stream: event.stream, autoplay: true, playsinline: true };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    }
                    else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        try {
                            connections[id2].addStream(window.localStream);
                        }
                        catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        })
                    }
                }
            })
        })
    }


    // Jab camera/mic band ho, tab ek dummy black video + silent audio stream generate karta hai, taaki connection break na ho (ek placeholder stream jata rehta hai).
    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }


    // Agar screen mai koi be changes ho to ye useeffect call hoga
    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen]);


    // Simple toggle functions — video/audio/screen ON-OFF karte hain, aur call end pe home page pe redirect karte hain.
    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }

    let handleAudio = () => {
        setAudio(!audio);
        // getUserMedia();
    }

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let handleMessage = (e) => {
        setMessage(e.target.value);
    }



    // Chat box open/close karna, message bhejna (socket ke through), aur naya message list me add karna.
    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
        // this.setState({ message: "", sender: username })
    }


    // Jab user "Connect" button dabata hai lobby screen pe → username validate karta hai, phir
    let connect = () => {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            setUsernameError("Please enter your username");
            return;
        }
        setUsername(trimmedUsername);
        setUsernameError("");
        setAskForUsername(false);
        getMedia();
    }


    // call karke socket se connect ho jata hai.
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }


    return (
        <div>

            {askForUsername === true ? (
                
                // LOBBY SCREEN
                <div className={styles.lobbyPage}>

                    <div className={styles.lobbyCard}>

                        <div className={styles.lobbyIcon}>
                            <VideocamIcon />
                        </div>

                        <h1>Join the Meeting</h1>

                        <p className={styles.lobbySubtitle}>
                            Enter your name to join the video call
                        </p>

                        <TextField
                            fullWidth
                            label="Your Name"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);

                                if (e.target.value.trim()) {
                                    setUsernameError("");
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && username.trim()) {
                                    connect();
                                }
                            }}
                            variant="outlined"
                            error={Boolean(usernameError)}
                        />

                        {usernameError && (
                            <p className={styles.usernameError}>
                                {usernameError}
                            </p>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={connect}
                            disabled={!username.trim()}
                            className={styles.connectButton}
                            startIcon={<VideocamIcon />}
                        >
                            Connect
                        </Button>

                        <div className={styles.previewContainer}>

                            <p>Camera Preview</p>

                            <video
                                className={styles.previewVideo}
                                ref={localVideoref}
                                autoPlay
                                muted
                                playsInline
                            ></video>

                        </div>

                    </div>

                </div>

            ) : (

                // =========================
                // VIDEO MEETING SCREEN
                // =========================

                <div className={styles.meetVideoContainer}>

                    {/* CHAT */}
                    {showModal && (
                        <div className={styles.chatRoom}>

                            <div className={styles.chatContainer}>

                                <h1>Chat</h1>

                                <div className={styles.chattingDisplay}>

                                    {messages.length !== 0 ? (

                                        messages.map((item, index) => {

                                            return (
                                                <div
                                                    style={{ marginBottom: "20px" }}
                                                    key={index}
                                                >

                                                    <p
                                                        style={{
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {item.sender}
                                                    </p>

                                                    <p>
                                                        {item.data}
                                                    </p>

                                                </div>
                                            );

                                        })

                                    ) : (

                                        <p>No Messages Yet</p>

                                    )}

                                </div>

                                <div className={styles.chattingArea}>

                                    <TextField
                                        fullWidth
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        label="Enter Your Chat"
                                        variant="outlined"
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </Button>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* CONTROL BUTTONS */}

                    <div className={styles.buttonContainers}>

                        {/* Video */}
                        <IconButton
                            onClick={handleVideo}
                            style={{ color: "white" }}
                        >
                            {video === true ? (
                                <VideocamIcon />
                            ) : (
                                <VideocamOffIcon />
                            )}
                        </IconButton>


                        {/* End Call */}
                        <IconButton
                            onClick={handleEndCall}
                            style={{ color: "red" }}
                        >
                            <CallEndIcon />
                        </IconButton>


                        {/* Audio */}
                        <IconButton
                            onClick={handleAudio}
                            style={{ color: "white" }}
                        >
                            {audio === true ? (
                                <MicIcon />
                            ) : (
                                <MicOffIcon />
                            )}
                        </IconButton>


                        {/* Screen Share */}
                        {screenAvailable === true && (
                            <IconButton
                                onClick={handleScreen}
                                style={{ color: "white" }}
                            >
                                {screen === true ? (
                                    <ScreenShareIcon />
                                ) : (
                                    <StopScreenShareIcon />
                                )}
                            </IconButton>
                        )}


                        {/* Chat */}
                        <Badge
                            badgeContent={newMessages}
                            max={999}
                            color="secondary"
                        >
                            <IconButton
                                onClick={() => setModal(!showModal)}
                                style={{ color: "white" }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                    </div>


                    {/* LOCAL VIDEO */}

                    <video
                        className={styles.meetUserVideo}
                        ref={localVideoref}
                        autoPlay
                        muted
                        playsInline
                    ></video>


                    {/* OTHER PARTICIPANTS */}

                    <div className={styles.conferenceView}>

                        {videos.map((video) => (

                            <div key={video.socketId}>

                                <video
                                    data-socket={video.socketId}
                                    ref={(ref) => {

                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }

                                    }}
                                    autoPlay
                                    playsInline
                                ></video>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
}