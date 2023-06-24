import config from './config.js'
import spam from './spam.js'
import games from './games.js'
import images from './images.js'
import util from './util.js'
import planner from './planner.js'
import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
import { spawn } from 'child_process'
const { Client, LocalAuth, Buttons, List, MessageMedia } = pkg

const client = new Client({
  authStrategy: new LocalAuth(),
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0',
})

/*
// LLM CLI
const llm = spawn('./llama/bin/rob.sh', [], {cwd: './llama/bin/'})
var currentAnswer = ''
var onLLMResponse = null
llm.stdout.on('data', function (data) {
  currentAnswer += data;

  if (currentAnswer.endsWith('{#INPUT#}')) {
    if (onLLMResponse) {
      onLLMResponse(currentAnswer.toString().replace("{#INPUT#}", ''))
    }

    currentAnswer = '';
  }
});
*/

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
  console.log('Chop chop.')
})

client.on('group_join', async (notification) => {
  if (config.blacklist.includes(notification.author)) {
    client.sendMessage(
      config.modRoom,
      'Someone from the blacklist has joined the group again: ' +
        notification.author
    )
    return
  }
})

client.on('message', async (message) => {
  const author = message.author || message.from
  const isVip = config.vips.includes(author)

  if (message.body.startsWith('!delete') && isVip) {
    message.delete(true)
    return
  }

  if (isVip && message.mentionedIds.includes(config.me)) {
    if (message.body.match(/(a joke)/gi)) {
      message.reply(games.joke())
      return
    }

    if (message.body.match(/(fact)/gi)) {
      message.reply(games.fact())
      return
    }

    if (message.body.match(/(advice)/gi)) {
      message.reply(games.advice())
      return
    }

    if (message.body.match(/(will)/gi)) {
      message.reply(games.magicBall())
      return
    }

    if (message.body.match(/(weather|forecast)/gi)) {
      message.reply(await planner.getForecast())
      return
    }

    /*
    llm.stdin.write(message.body.replace(/[\n\r]/g, '') + '\n');
    onLLMResponse = function(response) {
      if (response.indexOf('July 21|23 and July 28|30.') === -1) {
        message.reply(response.trim());
        return;
      }

      message.reply(response.substring(542).trim());
    }*/

    return
  }

  if (message.body.startsWith('!karma') && isVip) {
    client.sendMessage(
      config.modRoom,
      `Karma:

${util.karmaList(config.karma)}`
    )

    return
  }

  if (message.body.startsWith('!clear') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      delete config.karma[flaggedAuthor]
    }

    message.mentionedIds.forEach((mention) => {
      delete config.karma[mention]
    })

    return
  }

  if (message.body.startsWith('!status') && isVip) {
    client.sendMessage(
      config.modRoom,
      `Yo! I'm up and running.

Blacklisted: ${util.phoneList(config.blacklist)}
Mute: ${util.phoneList(config.mutelist)}
Trusted: ${util.phoneList(config.trustlist)}`
    )

    return
  }

  if (message.body.startsWith('!flag') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      console.error('Flagged: ', {
        body: flaggedMessage.body,
        author: flaggedAuthor,
      })
      flaggedMessage.delete(true)
      config.blacklist.push(flaggedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.blacklist.push(mention)
    })

    console.log('Blacklist:', config.blacklist)

    return
  }

  if (message.body.startsWith('!unflag') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      config.blacklist = config.blacklist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.blacklist = config.blacklist.filter((user) => user != mention)
    })

    console.log('Blacklist:', config.blacklist)

    return
  }

  if (message.body.startsWith('!mute') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      quotedMessage.delete(true)
      config.mutelist.push(quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.mutelist.push(mention)
    })

    console.log('Mutelist:', config.mutelist)

    return
  }

  if (message.body.startsWith('!unmute') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      config.mutelist = config.mutelist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.mutelist = config.mutelist.filter((user) => user != mention)
    })

    console.log('Mutelist:', config.mutelist)

    return
  }

  if (message.body.startsWith('!trust') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      quotedMessage.delete(true)
      config.trustlist.push(quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.trustlist.push(mention)
    })

    console.log('Trustlist:', config.trustlist)

    return
  }

  if (message.body.startsWith('!untrust') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      config.trustlist = config.trustlist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.trustlist = config.trustlist.filter((user) => user != mention)
    })

    console.log('Trustlist:', config.trustlist)

    return
  }

  if (spam.isSuspicious(message.body)) {
    const chat = await message.getChat()
    const contact = await message.getContact()

    const media = new MessageMedia('image/png', images.getWarningSticker())
    client.sendMessage(chat.id._serialized, media, {
      quotedMessageId: message.id._serialized,
      sendMediaAsSticker: true,
      stickerAuthor: 'Rob',
      stickerName: 'Follow the Rules',
    })

    config.karma[author] = (config.karma[author] || 0) + 10

    client.sendMessage(
      config.modRoom,
      `⛔ WARNING! ⛔ @${contact.id.user} (Karma: ${config.karma[author]}), has sent messages with suspicious content to "${chat.name}".`,
      { mentions: [contact] }
    )
  }

  if (isVip) {
    return
  }

  // Normal message handling
  if (config.blacklist.includes(author)) {
    message.delete(true)

    // This was deprecated by WA API
    // const chat = await message.getChat()
    // chat.removeParticipants([author])
    return
  }

  if (config.mutelist.includes(author)) {
    message.delete(true)
    return
  }

  if (config.trustlist.includes(author)) {
    return
  }

  if (config.karma[author] > 100) {
    message.delete(true)
    config.blacklist.push(author)
    return
  }

  if (config.karma[author] > 40) {
    message.delete(true)
    return
  }

  var spamScore = spam.getSpamScore(message.body)

  if (author.startsWith('254')) {
    spamScore += 10
  }

  if (spamScore >= 20) {
    message.delete(true)
    config.karma[author] = (config.karma[author] || 0) + spamScore
    const contact = await message.getContact()
    client.sendMessage(
      config.modRoom,
      `I have deleted a message from @${contact.id.user}, with a spam score of ${spamScore}:

${message.body}
`,
      { mentions: [contact] }
    )
  }
})

client.initialize()
