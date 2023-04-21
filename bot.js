import config from './config.js'
import spam from './spam.js'
import { User, UserList } from './user.js'
import fs from 'fs'
import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
const { Client, LocalAuth, Buttons, List } = pkg

const json = JSON.parse(fs.readFileSync('./userslist.json'))
let userlist = new UserList(json.users)

const client = new Client({
  authStrategy: new LocalAuth(),
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
  console.log('Chop chop.')
})

client.on('message', async (message) => {
  if (!userlist.userExistById(message.from)) {
    userlist.addUser(new User(message.from, 0, false))
  }

  if(userlist.getUserById(message.from).trusted == undefined || userlist.getUserById(message.from).trusted == null  ){
    userlist.getUserById(message.from).removeTrusted()
  }

  if (config.vips.includes(message.from)|| userlist.getUserById(message.from).trusted ) {
    return
  }

  const spamScore = spam.getSpamScore(message.body)
  if (spamScore >= 20) {
    message.delete(true)

    // Remove user score due to the violation
    userlist.getUserById(message.from).removeScore(10) 
    
    // THIS SCORE NEEDS DEFINED
    // check if violator has below threshhold, if they do then remove violator from the chat

    if (userlist.getUserById(message.from).score <= -30) {

      // THIS THRESHOLD NEEDS DEFINED
      // REMOVE PARTICIPANT
      
      userlist.removeUserById(message.from)
    }

    const contact = await message.getContact()
    client.sendMessage(
      config.modRoom,
      `I have deleted a message from @${contact.id.user}, with a spam score of ${spamScore}:

${message.body}
`,
      { mentions: [contact] }
    )
  } else {
    //allow users to build score
    userlist.getUserById(message.from).addScore(2) // THIS SCORE NEEDS DEFINED
  }
})

client.initialize()
