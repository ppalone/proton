// Socket
const socket = io();

// DOM Elements
const chatForm = document.querySelector('.chat-form');
const messageList = document.querySelector('.chat__messages');
const chatScreen = document.querySelector('.chat');
const chatInput = document.querySelector('.chat-ip input');
const modelWrapper = document.querySelector('.model-wrapper');
const model = document.querySelector('.model');
const showUserBtn = document.querySelector('.show-users');
const usersList = document.querySelector('.users-list ul');
const sidebar = document.querySelector('.sidebar');
const hamburgerIcon = document.querySelector('.hamburger__icon');
const closeIcon = document.querySelector('.close__icon');
const rooms = document.querySelectorAll('.sidebar__rooms > ul > li');

// console.log(unreadMessages);

// Username of current user
let currentUser;
// Room id of the current room
let roomid = window.location.pathname.split('/')[2];

let isIntersecting;

// Create a new Intersection Observer
const observer = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach((entry) => {
      isIntersecting = entry.isIntersecting;
    });
  },
  {
    root: null,
    threshold: 0,
  }
);

// Observer the last child of messagesList
// Only if it exists
if (messageList.lastElementChild) {
  observer.observe(messageList.lastElementChild);
}

rooms.forEach((room) => {
  if (room.dataset.url === roomid) {
    room.classList.add('sidebar__room-active');
  }
});

const closeSideabar = () => {
  sidebar.classList.remove('sidebar__open');
};

const openSidebar = () => {
  sidebar.classList.add('sidebar__open');
};

const formatTime = (string) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  let date = new Date(string);
  let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let day = date.getDate();
  let month = months[date.getMonth()];

  return `${hh}:${mm} ${day} ${month}`;
};

String.prototype.escape = function () {
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

// Scroll to the bottom
messageList.scrollTo(0, messageList.scrollHeight);

socket.emit('join', roomid);

socket.on('join', ({ username }) => {
  currentUser = username;
});

// Functions
const createChatMessage = ({ username, message }) => {
  let date = new Date();
  let ele = document.createElement('li');
  ele.className = 'message';
  message = message.escape();
  ele.innerHTML = `<strong style="color: purple; font-size: 18px" class="message-user" >${username}</strong>
    <i style="font-size: 14px; color: rgba(0, 0, 0, 0.75);">${formatTime(
      date.toISOString()
    )}</i>
    <p>${message}</p>
  `;
  return ele;
};

socket.on('message', (data) => {
  // When anyone recieves a message

  // observer.unobserve(messageList.lastElementChild);
  messageList.appendChild(createChatMessage(data));
  // TODO: Add an observable to last one
  observer.observe(messageList.lastElementChild);

  if (isIntersecting) {
    messageList.scrollTo(0, messageList.scrollHeight);
    observer.observe(messageList.lastElementChild);
  }
});

socket.on('typing', (data) => {
  document.querySelector(
    '.chat__typing'
  ).innerHTML = `${data.username} is typing . . .`;
});

socket.on('stoptyping', () => {
  document.querySelector('.chat__typing').innerHTML = ``;
});

// Events
// open/close Sidebar
hamburgerIcon.addEventListener('click', openSidebar);
closeIcon.addEventListener('click', closeSideabar);

chatInput.addEventListener('focus', () => {
  // console.log('Typing!');
  socket.emit('typing', { room: roomid });
});

chatInput.addEventListener('blur', () => {
  // console.log('Not Typing!');
  socket.emit('stoptyping', { room: roomid, user: currentUser });
});

chatForm.onsubmit = (e) => {
  e.preventDefault();

  // Check if the message is empty
  if (!chatInput.value.trim()) {
    return;
  }

  // Emit a message to server

  data = {
    msg: chatInput.value.trim(),
    room: roomid,
  };

  socket.emit('message', data);

  messageData = {
    username: currentUser,
    message: chatInput.value.trim(),
  };

  messageList.appendChild(createChatMessage(messageData));

  chatInput.value = '';

  // Remove focus so stop typing event is triggered
  chatInput.blur();

  messageList.scrollTo(0, messageList.scrollHeight);
  return false;
};

showUserBtn.onclick = async () => {
  try {
    usersList.innerHTML = '';
    let res = await fetch('/active');
    let activeUsers = await res.json();

    activeUsers.forEach((user) => {
      let li = document.createElement('li');
      li.textContent = user;
      usersList.appendChild(li);
    });

    modelWrapper.classList.add('model-active');
  } catch (error) {
    // console.log(error)
    usersList.innerHTML = "Can't get active users";
    modelWrapper.classList.add('model-active');
  }
};

modelWrapper.onclick = () => {
  modelWrapper.classList.remove('model-active');
};
