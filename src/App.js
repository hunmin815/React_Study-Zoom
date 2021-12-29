import React from "react";
import "./App.css";
import SocketIO from "socket.io-client";
import { useState } from "react";

const sockIO = SocketIO.connect("http://localhost:3333");

// sockIO.emit("enter_room", { payload: "jo" });

function App() {
  let [RoomName, RoomName_C] = useState("");

  const handelInputRoomName = (e) => {
    RoomName_C(e.target.value);
  };

  const EnterRoom = (e) => {
    e.preventDefault();
    sockIO.emit("enter_room", { payload: RoomName });
    sockIO.on("Hello", (data) => {
      console.log(`Server : ${data}`);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>{RoomName}</h3>
        <form id="form_Room">
          <input
            type="text"
            placeholder="Room Name"
            required
            onChange={handelInputRoomName}
          ></input>
          <button onClick={EnterRoom}>Enter room</button>
        </form>
      </header>
    </div>
  );
}

export default App;
