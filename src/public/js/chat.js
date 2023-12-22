let userMail = "";

async function getMail() {
  const { value: email } = await Swal.fire({
    title: "Enter your Nickname",
    input: "text",
    inputLabel: "Your Nickname",
    showCancelButton: false,
    allowOutsideClick:false,
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
    msgLogFormateados += "<div class='card m-1 '>";
    msgLogFormateados += "<h6>" + msg.user + " dice:</h6>";
    msgLogFormateados += "<p>" + msg.message + "</p>";
    msgLogFormateados += "</div>";
  });
  divMsgLog.innerHTML = msgLogFormateados;
});
