import React from "react";
import "./App.css";
import SocketIO, { Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";

const sockIO = SocketIO.connect("http://localhost:3333");

// sockIO.emit("enter_room", { payload: "jo" });
function App() {
  // const RoominputRef = useRef();
  // console.log("roominputRef : ", RoominputRef.current[0]);

  let [roomName, setRoomName] = useState(""); // 방 이름

  // 방 이름 상태 관리
  const handelInputRoomName = (e) => {
    setRoomName(e.target.value);
  };
  // .

  // 메세지 생성 함수
  const addMessage = (message) => {
    const ul = document.getElementById("ChatContent").querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    console.log(`addMessage : ${message}`);
    ul.appendChild(li);
  };
  // .

  // 메세지 받기
  useEffect(() => {
    sockIO.on("Server_new_message", addMessage);
  }, []);
  // .

  // const room = document.getElementById("room");
  // submit 이벤트
  // const handleMessageSubmit = (e) => {
  //   e.preventDefault();

  //   const roominput = room.querySelector("input");
  //   console.log(roominput);
  //   const value = roominput.value;

  //   // Back-end로 new_message 이벤트 전달 (값 : input, 방 이름)
  //   sockIO.emit("new_message", roominput.value, roomName, () => {
  //     addMessage(`You : ${value}`);
  //   });
  //   roominput.value = "";
  // };
  // .

  // 방 입장
  // 방 제목 보여주기
  const showRoom = () => {
    document.querySelector("h3").innerText = `Room : ${roomName}`;
    // const form = room.querySelector("form");
    // form.addEventListener("submit", handleMessageSubmit); // submit 이벤트 발생 시
  };
  // .

  const EnterRoom = (e) => {
    e.preventDefault();
    setisHome(false);

    sockIO.emit("enter_room", { payload: roomName }, showRoom);
    sockIO.on("Hello", (data) => {
      console.log(`Server : ${data}`);
    });
    console.log(`방 이름 : ${roomName}`); // 제출 할 input 값
    document.getElementsByClassName("welcome")[0].classList.add("hide");
    document.getElementsByClassName("ExitRoom")[0].classList.remove("hide");
  };
  useEffect(() => {
    sockIO.on("welcome", () => {
      addMessage("Someone joined!");
    });
  }, []);
  // .

  let [chatCont, setChatCont] = useState([]); // 채팅 내용
  let [Message, setMassage] = useState(""); // 메세지

  // 메세지 input 상태 관리
  const handelInputMessage = (e) => {
    setMassage(e.target.value);
  };
  // .

  // 메세지 전송
  const Send = (e) => {
    e.preventDefault();
    // setChatCont(chatCont.concat(Message)); // 채팅 내용 배열에 메세지 추가

    sockIO.emit("new_message", Message, roomName, () => {
      addMessage(`You : ${Message}`);
    });
    setMassage("");
  };
  // .

  // 방 나가기
  useEffect(() => {
    sockIO.on("bye", () => {
      addMessage("Someone left!");
    });
  }, []);

  const ExitRoom = (e) => {
    e.preventDefault();
    setRoomName("");
    document.getElementsByClassName("welcome")[0].classList.remove("hide");
    document.getElementsByClassName("ExitRoom")[0].classList.add("hide");
  };
  // .

  return (
    <div className="App">
      <h3>{roomName}</h3>
      <form
        name="welcome"
        className="welcome"
        // {isHome === true ? "" : "hide"}
      >
        <input
          name="inputRoom"
          type="text"
          placeholder="Room Name"
          required
          onChange={handelInputRoomName}
          value={roomName}
        ></input>
        <button onClick={EnterRoom}>Enter room</button>
      </form>

      <div id="ChatContent">
        <ul></ul>
      </div>
      {chatCont.map((message, i) => {
        return <ul key={i}>{message}</ul>;
      })}
      <div id="room">
        <form>
          <input
            name="inputMessage"
            type="text"
            placeholder="message"
            required
            onChange={handelInputMessage}
            value={Message}
          ></input>
          <button onClick={Send}>Send</button>
          {/* <button>Send</button> */}
        </form>
      </div>
      <button onClick={ExitRoom} className="ExitRoom hide">
        Exit
      </button>
    </div>
  );
}

export default App;
