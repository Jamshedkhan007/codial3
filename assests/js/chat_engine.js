class ChatEngine {
    constructor(chatboxId, userEmail) {
        this.chatbox = $(`#${chatboxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:8800');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }


    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('connection esatblished using sockets!...')


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codial3'
            });

            self.socket.on('user_joined', function (data) {
                console.log('a user joined', data);
            })

        });

        // CHANGE::send the message on clicking the send message button
        $('#send').click(function() {
            let msg = $('#message-input').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codial3'
                });
            }
        });


        self.socket.on('receive_message', function (data) {
            console.log('message recevied', data.message);



            let newMessage = $('<li>');

            let messageType = 'other';

            if (data.user_email == self.userEmail) {
                messageType = 'self'
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-message').append(newMessage);
        })
    }
}