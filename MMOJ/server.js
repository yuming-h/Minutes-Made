const express = require('express')
const next = require('next')
const { get } = require('./api/request')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        server.get('/order/:id', async (req, res) => {
            const actualPage = '/order'
            const { id } = req.params

            const queryParams = {id}
            app.render(req, res, actualPage, queryParams)
        })

        server.get('/restaurant/:seo?/:id/reviews', async (req, res) => {
            const actualPage = '/restaurant-reviews'
            const { id } = req.params

            const { data } = await get(`/restaurants/${id}/reviews`)
            const { name } = data

            const queryParams = {id, name}
            app.render(req, res, actualPage, queryParams)
        })
        
        server.get('/restaurant/:seo?/:id/', async (req, res) => {
            const actualPage = '/restaurant'
            const { id } = req.params
            const { data } = await get(`/restaurants/${id}`)
            const { name } = data

            const queryParams = {id, name}
            app.render(req, res, actualPage, queryParams)
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })