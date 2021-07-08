const path = require('path')
const express = require('express')
const hbs = require('hbs')

const patchRouter = require('../public/js/routers/patch')
const inquireRouter = require('../public/js/routers/inquire')
const profileRouter = require('../public/js/routers/profile')
const deleteRouter = require('../public/js/routers/delete')

const { router: deletePassRouter, admin } = require('../public/js/middleware/admin')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(patchRouter)
app.use(inquireRouter)
app.use(profileRouter)
app.use(deleteRouter)

app.use(deletePassRouter)

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/inquire_by', (req, res) => {
    res.render('inquire_by')
})

app.get('/inquire_by_unit', (req, res) => {
    res.render('inquire_by_unit')
})

app.get('/inquire_by_nick', (req, res) => {
    res.render('inquire_by_nick')
})

app.get('/patch', (req, res) => {
    res.render('patch')
})

app.get('/delete', admin, (req, res) => {
    if(req.pass === process.env.SECRET) {
        res.redirect('/delete_profile')
    } else {
        res.render('delete')
    }
})

app.get('/delete_profile', admin, (req, res) => {
    if(req.pass === process.env.SECRET) {
        res.render('delete_profile')
    } else {
        res.redirect('/delete')
    }
})

app.listen(port, () => {
    console.log('server is up on '+ port)
})

