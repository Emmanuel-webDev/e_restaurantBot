const socket = io('http://localhost:5050')

const msgForm = document.getElementById('input')
const msgList = document.getElementById('chatbox')
const chtBoxInput = document.getElementById('chat-box')

function appendMsg(message, sender){
    const msgElem = document.createElement("div");
    msgElem.classList.add('message-text', sender)
    msgElem.textContent = message
    msgList.appendChild(msgElem)
   msgList.scrollTop = msgList.scrollHeight;
}

socket.on('welcome-msg', (dt)=>{
   appendMsg(dt.a, "bot")
})

msgForm.addEventListener("submit", function msgSubmit(e){
    e.preventDefault();

    let msg = chtBoxInput.value.trim()
    if(!msg){
       return alert("Message cant be empty")
    }
    socket.emit('message', msg)
    appendMsg(msg, "user")
    chtBoxInput.value = ''
})


socket.on('response', (data)=>{
  appendMsg(data, "bot")
})

