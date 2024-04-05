# Simple Conference Project

This project is a simple web-based video conference application designed for testing and study purposes. It leverages modern web technologies to create a real-time communication platform where multiple users can join a video chat room, share their video and audio streams, and communicate with each other seamlessly. This README provides an overview of the project, including the libraries used, the architecture of the application, and instructions on how to run it.

## Overview

The application is built using React for the frontend and Node.js with Socket.IO for the backend. It utilizes the WebRTC protocol for peer-to-peer (P2P) communication, enabling direct video and audio data transfer between browsers without the need for intermediary servers to relay the data.

### Why We Need Socket.IO and Peers

- **Socket.IO**: WebRTC uses a mechanism called signaling to allow peers to exchange metadata to coordinate communication. This metadata includes information about how to connect (such as IP addresses and ports) and what media formats are supported. Socket.IO is used in this project as the signaling mechanism to exchange this metadata between peers wishing to establish a P2P connection.
- **Peers**: In the context of WebRTC and this project, a peer represents an endpoint participating in a P2P communication. Each user in the video conference is a peer, capable of sending and receiving media streams. The `simple-peer` library is used to abstract the complexity of managing WebRTC peer connections, making it easier to implement the video and audio exchange logic.

### Why We Need to Signal

Signaling is an essential process in establishing a WebRTC connection. It is the method by which peers exchange information needed to find and establish a direct connection. This information includes:

- Session control messages to open or close communications.
- Error messages.
- Media metadata such as codecs and codec settings, bandwidth, and media types.
- Key data, to establish secure connections.
- Network data, such as a peer's IP address and port as seen by the outside world.

Without signaling, peers would not be able to negotiate the parameters of their connection or even know of each other's existence.

## How to Run the Project

### Prerequisites

- Node.js installed on your machine.

### Steps to Run

1. **Clone the Repository**: Clone this project to your local machine using `git clone`, followed by the URL to this repository.

2. **Install Dependencies**:
    - Navigate to the project directory in your terminal.
    - Run `npm install` to install the required Node.js dependencies for the server.
    - Navigate to the client directory (`cd client` if your frontend is in a `client` folder) and run `npm install` to install the React dependencies.

3. **Start the Server**:
    - In the root directory of the project, run `node server.js` or `npm start` (if you have a start script defined) to start the backend server.

4. **Start the React App**:
    - In the client directory, run `npm start` to start the React development server. This should automatically open a browser window with the application running.

5. **Join the Conference**:
    - Open multiple browser tabs or different browsers and navigate to the local address provided by the React development server (usually `http://localhost:3000`) to join the conference from multiple endpoints.

### Conclusion

This simple conference project demonstrates the power of WebRTC for real-time communication and how technologies like React, Socket.IO, and simple-peer can be combined to create a functional video conferencing application. Whether for study or testing, it provides a solid foundation for understanding the basics of building real-time, P2P communication applications on the web.

