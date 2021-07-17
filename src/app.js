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
    res.redirect('/tr')
})

app.get('/tr', (req, res) => {
    res.render('index_tr')
})
app.get('/en', (req, res) => {
    res.render('index_en')
})


app.get('/member', (req, res) => {
    res.redirect('/')
})


app.get('/patch/tr', (req, res) => {
    res.render('patch_tr')
})
app.get('/patch/en', (req, res) => {
    res.render('patch_en')
})


app.get('/inquire-by/tr', (req, res) => {
    res.render('inquire_by')
})
app.get('/inquire-by/en', (req, res) => {
    res.render('inquire_by_en')
})

app.get('/inquire-by-unit/tr', (req, res) => {
    res.render('inquire_by_unit')
})
app.get('/inquire-by-unit/en', (req, res) => {
    res.render('inquire_by_unit_en')
})


app.get('/inquire-by-nick/tr', (req, res) => {
    res.render('inquire_by_nick')
})
app.get('/inquire-by-nick/en', (req, res) => {
    res.render('inquire_by_nick_en')
})


app.get('/delete', admin, (req, res) => {
    if(req.pass === process.env.SECRET) {
        res.redirect('/delete_profile')
    } else {
        res.render('delete')
    }
})

app.get('/delete-profile', admin, (req, res) => {
    if(req.pass === process.env.SECRET) {
        res.render('delete_profile')
    } else {
        res.redirect('/delete')
    }
})

app.listen(port, () => {
    console.log('server is up on '+ port)
})

