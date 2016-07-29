import Botkit from 'botkit'
import librato from './librato'

const controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()

const interaction = 'direct_message,direct_mention,mention'

controller.hears(['hello', 'hi'], interaction, (bot, message) => {
  controller.storage.users.get(message.user, (_, user) => {
    if (user && user.name) {
      bot.reply(message, `Hello ${user.name}`)
    } else {
      bot.reply(message, 'Hello.')
    }
  })
})

controller.hears(['tell me (.*)', '[what’s|whats] (.*)'], interaction, (bot, message) => {
  const metricName = message.match[1]
  librato.getMetric(metricName)
    .then((resp) => {
      bot.reply(message, '' + resp)
    })
    .catch((err) => {
      bot.reply(message, err.message)
    })
})
