const prod = process.env.NODE_ENV === 'production'

module.exports = {
  // TODO: fill in the URL for Pulp-Free production URL
  // TODO: change staging URL once we have a staging workspace setup
  'process.env.BACKEND_URL': prod ? '%Some URL here%' : 'http://localhost:8080'
}