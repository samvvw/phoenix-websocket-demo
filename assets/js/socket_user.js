import { Socket, Presence } from 'phoenix'

const UserSocket = new Socket('/socket', {
    params: { token: window.userToken },
})

UserSocket.connect()

let channel
let presence
let connectedUserList = document.createElement('ul')
let messageList = document.createElement('ul')
let singleButton = document.createElement('button')
let singleCurrentUser = document.createElement('span')
let singleInput = document.createElement('input')
let leaveButton = document.createElement('button')
let currentUser

const joinChannel = (channel) => {
    channel
        .join()
        .receive('ok', (resp) => {
            console.log('Joined successfully', resp)
        })
        .receive('error', (resp) => {
            console.log('Unable to join', resp)
        })
}

const updateUIState = () => {
    if (!currentUser || !channel) {
        singleButton.innerText = 'Join'
        singleInput.placeholder = 'Enter User Name'
        connectedUserList.innerHTML = ''
        singleCurrentUser.innerHTML = ''
        document.body.removeChild(leaveButton)
    } else {
        singleButton.innerText = 'Send'
        singleInput.placeholder = 'Enter message'
    }
}

window.addEventListener('load', () => {
    updateUIState()
})

singleButton.addEventListener('click', () => {
    const text = singleInput.value
    if (!currentUser || !channel) {
        channel = UserSocket.channel('topic:subtopic', { name: text })
        joinChannel(channel)
        presence = new Presence(channel)
        addChannelListeners()
        currentUser = text
        singleCurrentUser.innerText = text
        leaveButton.innerText = 'Leave Channel'
        leaveButton.id = 'leaveButton'
        leaveButton.addEventListener('click', () => {
            channel.leave()
            channel = null
            currentUser = null
            updateUIState()
        })
        document.body.appendChild(leaveButton)
    } else {
        console.log('Event sent')
        channel
            .push('event', {
                name: currentUser,
                message: text,
            })
            .receive('ok', (resp) => {
                console.log('eeeveeennj w', resp)
            })
    }
})
const listBy = (id, { metas: [first, ...rest] }) => {
    first.count = rest.length + 1 // count of this user's presences
    first.id = id
    return first
}
const updateConnectedUsers = (connectedUsers) => {
    connectedUserList.innerHTML = ''
    connectedUsers.forEach((connectedUser) => {
        let connectedUserElement = document.createElement('li')
        connectedUserElement.innerText = connectedUser.id
        connectedUserList.appendChild(connectedUserElement)
    })
}
const addChannelListeners = () => {
    presence.onJoin((key, currentpresence) => {
        updateUIState()
        singleInput.value = ''
    })
    presence.onSync((response) => {
        const presenceList = presence.list(listBy)
        updateConnectedUsers(presenceList)
        console.log('OnSync -> ', presenceList)
    })
    channel.on('event-response', (response) => {
        console.log('EVENT____: ', response)
    })
    channel.on('wow', (response) => {
        console.log(presence.list())
        console.log('response -> ', response)
        const userName = document.createElement('span')
        const message = document.createElement('p')
        const li = document.createElement('li')
        userName.innerText = response.name
        message.innerText = response.message
        li.appendChild(userName)
        li.appendChild(message)
        messageList.appendChild(li)
    })
    // channel.on('presence_state', (response) => {
    //     console.log('presence_state ->', Object.keys(response))
    // })
}

const chatButton = document.createElement('button')
chatButton.innerText = 'Chat'
chatButton.addEventListener('click', () => {
    fetch('/chat').then((response) => response.json())
    // .then((data) => console.log(data))
})
document.body.appendChild(chatButton)

document.body.appendChild(connectedUserList)
document.body.appendChild(singleCurrentUser)
document.body.appendChild(singleInput)
document.body.appendChild(singleButton)
document.body.appendChild(messageList)

export default UserSocket
