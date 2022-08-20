import { Socket } from 'phoenix'

let csrfToken = document
    .querySelector("meta[name='csrf-token']")
    .getAttribute('content')

const UserSocket = new Socket('/socket', {
    params: { token: window.userToken },
})

UserSocket.connect()

const channel = UserSocket.channel('topic:subtopic', {})

channel
    .join()
    .receive('ok', (resp) => {
        console.log('Joined successfully', resp)
    })
    .receive('error', (resp) => {
        console.log('Unable to join', resp)
    })

let button = document.createElement('button')

button.addEventListener('click', () => {
    console.log('Event sent')
    channel
        .push('event', {
            name: 'coco',
            what: 'dog',
        })
        .receive('ok', (resp) => {
            console.log('eeeveeennj w', resp)
        })
})

document.body.appendChild(button)

export default UserSocket
