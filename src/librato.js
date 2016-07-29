import axios from 'axios'

const request = axios.create({
  baseURL: 'https://metrics-api.librato.com/v1',
  auth: {
    username: process.env.LIBRATO_USER,
    password: process.env.LIBRATO_TOKEN
  }
})

export default {
  getMetric: (name) => (
    request.get(`/metrics/${name}?count=1&resolution=60`)
      .then((resp) => {
        const measurements = resp.data.measurements
        return measurements[Object.keys(measurements)[0]][0].value
      })
      .catch((err) => {
        const message = err.response.status === 404
          ? 'Nope, sorry that\'s not a real metric'
          : `Sorry, ${err.response.statusText.toLowerCase()}`
        throw new Error(message)
      })
  )
}