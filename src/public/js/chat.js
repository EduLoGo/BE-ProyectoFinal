const socket = io();

let userMail = "";

async function getMail() {
  const { value: email } = await Swal.fire({
    title: "Enter your Nickname",
    input: "text",
    inputLabel: "Your Nickname",
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write a Nickname!";
      }
    },
  });
  userMail = email;
}

getMail();

function SendToBack(userMail, userMsg) {
  if (userMsg.value !== "") {
    socket.emit("MsgNew", {
      user: userMail,
      message: userMsg.value,
    });
  }
  userMsg.value = "";
}

const msgBox = document.getElementById("userMsg");
userMsg.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    SendToBack(userMail, msgBox);
  }
});

const btnSend = document.getElementById("btnSend");
btnSend.addEventListener("click", () => {
  SendToBack(userMail, msgBox);
});

socket.on("MsgHistory", (msgLog) => {
  const divMsgLog = document.getElementById("logMsg");
  let msgLogFormateados = "";
  msgLog.forEach((msg) => {
    msgLogFormateados += "<div class='card m-1 p-1 border'>";
    msgLogFormateados += "<h6 class='card-title'>" + msg.user + " dice:</h6>";
    msgLogFormateados += "<p class='card-text'>" + msg.message + "</p>";
    msgLogFormateados += "</div>";
  });
  divMsgLog.innerHTML = msgLogFormateados;
});
