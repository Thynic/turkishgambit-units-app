const express = require('express')
const router = new express.Router()

let enteredPass

router.post('/delete', (req, res) => {
  try {
      const { password } = req.body
      enteredPass = password
      if (password === process.env.SECRET) {
          res.redirect('/delete_profile')
      } else {
          res.render('delete', {
            error: ':('
          })
      }
  } catch (e) {
      console.log(e)
      throw new Error('delete page error')
  }
})

const admin = (req, res, next) => {
  try {
    req.pass = enteredPass
    next()
  } catch (e) {
    console.log(e)
    res.redirect('/delete')
  }
  
}

module.exports = {
    router,
    admin
}