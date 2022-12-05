const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
// import { myFunction } from '.js/script.js';
// const content = require("./js/script");
const userList = document.getElementById('users');
// const content = document.getElementById('msg');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message text
    // window.onload = (function(){myFunction()});
    // let msg=myFunction();
    const msg = e.target.elements.msg.value;
    
    // console.log(content.value);
    // emitting message to server
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

// add users to dom
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

function format_text(text){
    return text.replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<strong>$1</strong>")
         .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
          .replace(/(?:~)([^~<\n]+)(?:~)/g, "<s>$1</s>")
          .replace(/(?:```)([^```<\n]+)(?:```)/g, "<tt>$1</tt>")  
}