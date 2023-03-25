import qrcode from 'whatsapp-web.js'
import pkg from 'whatsapp-web.js'
import { User, UserList } from './user.js';
import * as messageMod from './message.js';
import fs from 'fs';
const { Client, LocalAuth } = pkg

const json = JSON.parse(fs.readFileSync('./userslist.json'));
let userlist = new UserList(json.users)

const config = {
    modRoom: '',
    rooms: [],
    vips: [],
};

const client = new Client({
    authStrategy: new LocalAuth(),
})

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Chop chop.');
});

client.on('message', async (message) => {

    if (!userlist.userExistById(message.from)) {
        userlist.addUser(new User(message.from, 0))
    }
    if (config.vips.includes(message.from)) {
        return;
    }

    const chat = await message.getChat();
    if (!config.rooms.includes(chat.id._serialized)) {
        return;
    }
    if (messageMod.getSpamScore(message) >= 20) {
        message.delete(true);
        // Remove user score due to the violation
        userlist.getUserById(message.from).removeScore(10)
        // check if violator has below threshhold, if they do then remove violator from the chat
        if (userlist.getUserById(message.from).score) {
            // REMOVE PARTICIPANT
            // & FROM THE LIST( IF MISTAKE THEY GET RE ADDED AND START FRESH )
            userlist.removeUserById(message.from)
        }

    }
});

client.initialize();