const socket = io();

let user;
let chatBox = document.getElementById("chatBox");
let chatBoxClick = document.getElementById("chatBoxClick");
let userName = document.getElementById("userName");

Swal.fire({
  title: "Set your name to chat",
  input: "text",
  inputValidator: (value) => {
    return !value && "Need to set a name!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
  userName.innerText = `User: ${user}`
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

chatBoxClick.addEventListener("click", () => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("message", {
      user,
      message: chatBox.value,
    });
    chatBox.value = "";
  }
});

socket.on('messageLogs', data => {
    let log = document.getElementById('chatLogs')
    let messages = ''
    data.forEach(element => {
        messages += `<b>${element.user}</b>: ${element.message}<br>`
    })
    log.innerHTML = messages
    
})

socket.on('userLoggedIn', (data) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${data.user} is connected!`,
        showConfirmButton: false,
        timer: 1500,
        toast: true
      })
      
})

socket.on('messagesArray', data=> {
    let log = document.getElementById('chatLogs')
    let newMessages = ''
    data.forEach(element => {
        newMessages += `<b>${element.user}</b>: ${element.message}<br>`
    })
    log.innerHTML = newMessages
})
