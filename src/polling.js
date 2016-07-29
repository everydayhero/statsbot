const intervals = {}

export const startPolling = (channel, metricName, poll, seconds) => {
  if (!intervals[channel]) intervals[channel] = {}
  if (intervals[channel][metricName]) {
    clearInterval(intervals[channel][metricName])
  }
  intervals[channel][metricName] = setInterval(poll, 1000 * seconds)
}

export const stopPolling = (channel) => {
  const poll = intervals[channel]
  if (poll) {
    Object.keys(poll).forEach((key) => {
      clearInterval(poll[key])
    })
    delete intervals[channel]
    return true
  }
  return false
}

export const durationToSeconds = (duration) => {
  let [number, noun = ''] = duration.toLowerCase().split(' ')
  const seconds = {
    second: 1,
    minute: 60,
    hour: 60 * 60
  }
  const validTimes = ['second', 'minute', 'hour']

  // "every hour"
  if (!noun && validTimes.indexOf(number) !== -1) {
    return seconds[duration]
  }

  // "every 5 minutes"
  noun = noun.replace(/s$/, '')
  if (!isNaN(number) && validTimes.indexOf(noun) !== -1) {
    return number * seconds[noun]
  }

  return null
}

