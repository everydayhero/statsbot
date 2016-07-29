import Botkit from 'botkit'
import librato from './librato'
import { durationToSeconds, startPolling, stopPolling } from './polling'

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

const replyWithMetric = (metricName, bot, message) => (
  librato.getMetric(metricName)
    .then((resp) => {
      bot.reply(message, '`' + metricName + '`  =  ' + resp)
    })
    .catch((err) => {
      bot.reply(message, err.message)
      throw err
    })
)

controller.hears('find (.*)', interaction, (bot, message) => {
  librato.findMetric(message.match[1])
    .then(({ metrics, count }) => {
      bot.reply(message, `There are ${count}\n${metrics.join('\n')}`)
    })
    .catch((err) => {
      bot.reply(message, err.message)
    })
})

controller.hears('stop', interaction, (bot, message) => {
  stopPolling(message.channel)
    ? bot.reply(message, 'Ok, will stop polling')
    : bot.reply(message, 'I\'m not polling this channel!?')
})

controller.hears(['start polling (.*)', 'poll (.*)', 'tell me (.*)', 'what’s (.*)', 'whats (.*)'], interaction, (bot, message) => {
  const input = message.match[1].split(' ')
  const metricName = input.shift()
  replyWithMetric(metricName, bot, message)
    .then(() => {
      const command = input.shift()
      const duration = input.join(' ')
      if (command === 'every' && duration) {
        const poll = replyWithMetric.bind(null, metricName, bot, message)
        const seconds = durationToSeconds(duration)
        if (seconds) {
          bot.reply(message, '_and i\'ll start polling_')
          startPolling(message.channel, metricName, poll, seconds)
        } else {
          bot.reply(message, `I don't understand "${duration}"`)
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
})
