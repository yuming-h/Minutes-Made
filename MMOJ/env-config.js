const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'process.env.BACKEND_URL': prod ? '%Some URL here%' : 'http://localhost:8080'
}