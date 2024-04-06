import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './App.css';

function App() {
  const [peers, setPeers] = useState([]);
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  // This effect runs when the component mounts and sets up the video and socket connections
  useEffect(() => {
    if (!usernameSubmitted) return;

    socketRef.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit("join room", "someRoomId", username); // Pass username when joining room

      socketRef.current.on("all users", users => {
        const peers = [];
        users.forEach(user => {
          const peer = createPeer(user.id, socketRef.current.id, stream, user.username); // Pass username here
          peersRef.current.push({
            peerID: user.id,
            peer,
            username: user.username, // Store username alongside peer
          });
          peers.push({ peer, username: user.username });
        });
        setPeers(peers);
      });

      socketRef.current.on("user joined", payload => {
        const peer = addPeer(payload.signal, payload.callerID, stream, payload.username); // Pass username here
        if (!peersRef.current.some(p => p.peerID === payload.callerID)) { // Check if peer already exists
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            username: payload.username, // Store username alongside peer
          });
          setPeers(users => [...users, { peer, username: payload.username }]);
        }
      });

      socketRef.current.on("receiving returned signal", payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);
        if (item) {
          item.peer.signal(payload.signal);
        }
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, usernameSubmitted]); // Effect depends on usernameSubmitted

  function handleUsernameSubmit(e) {
    e.preventDefault();
    setUsernameSubmitted(true);
  }

  if (!usernameSubmitted) {
    return (
      <div className="username-wrapper">
        <form onSubmit={handleUsernameSubmit} className="username-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  function createPeer(userToSignal, callerID, stream) {
    console.log("Creating peer with ID:", userToSignal, callerID, stream);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    console.log("Adding peer with ID:", incomingSignal, callerID, stream);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      if (socketRef && socketRef.current) {
        socketRef.current.emit("returning signal", { signal, callerID });
      } else {
        console.error("Socket reference is null.");
      }
    });

    if (incomingSignal) {
      peer.signal(incomingSignal);
    }

    return peer;
  }

  // <video muted autoPlay ref={userVideo} className="video" />
  return (
    <div className="App">
      <div className="video-container">
        <div className="video-wrapper">
          <video muted autoPlay ref={userVideo} className="video" />
          <div className="username-label">{username}</div>
        </div>
        {peers.map((peerObj, index) => (
          <Video key={index} peer={peerObj.peer} username={peerObj.username} />
        ))}
      </div>
    </div>
  );
}

function Video({ peer, username }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", stream => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, [peer]);

  return (
    <div className="video-wrapper">
      <video playsInline autoPlay ref={ref} className="video" />
      <div className="username-label">{username}</div>
    </div>
  );
}

export default App;
