import getUrls from 'get-urls'
import qrcode from 'whatsapp-web.js'
import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg

const config = {
    modRoom: 'ID',
    rooms: ['ID'],
    vips: ['ID', 'ID'],
};

const client = new Client({
    authStrategy: new LocalAuth(),
})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Chop chop.');
});

client.on('message', async (message) => {
    // Skip VIPs
    if (config.vips.includes(message.from)) {
        return;
    }

    // Skip unmonitored chat rooms
    const chat = await message.getChat();
    if (config.rooms.includes(chat.id._serialized)) {
        return;
    }

    var botScore = 0;
    const messageSize = message.body.length;
    const totalLineBreaks = (message.body.match(/\n/g) || '').length;

    // Count total message size
    if (message.body.length > 500) {
        botScore += 10;
    }

    // Count total use of line breaks
    if ((message.body.match(/\n/g) || '').length > 50) {
        botScore += 10;
    }

    // Check for non-whitelisted URLs
    for (const url of getUrls(message.body)) {
      if (!url.match(/(youtu.be|youtube.com|instagram.com|tomorrowland.com|on.soundcloud.com|open.spotify.com)/g)) {
        botScore += 10;
      }
    }

    if (botScore >= 20) {
        message.delete(true);
    }
});

client.initialize();
