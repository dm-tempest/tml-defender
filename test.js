import test from 'ava'
import spam from './spam.js'

test('it counts emoji in a string', (t) => {
  t.is(0, spam.countEmojis('Lorem ipsum dolor'))
  t.is(2, spam.countEmojis('📖 in here 📖 in there'))
})

test('it scores long messages', async (t) => {
  t.is(10, spam.getSpamScore('Lorem ipsum dolor'.repeat(200)))
})

test('it scores too many line breaks', async (t) => {
  t.is(10, spam.getSpamScore('Lorem\n\n\n\n\n\n\n\n\n\n\n'))
})

test('it scores suspicious URLs', async (t) => {
  t.is(10, spam.getSpamScore('Hey join http://www.blah.com'))
})

test('it scores chat invitations', async (t) => {
  t.is(15, spam.getSpamScore('Hey join http://chat.whatsapp.com'))
})

test('it scores too much emoji', async (t) => {
  t.is(10, spam.getSpamScore('📖 in here 📖 in there'.repeat(5)))
})

test('it scores spammy words', async (t) => {
  t.is(10, spam.getSpamScore('Hey join invest'))
})
