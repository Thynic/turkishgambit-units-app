const express = require('express')
const router = new express.Router()

let enteredIndexPass

router.post('', (req, res) => {
  try {
      const { mPassword } = req.body
      enteredIndexPass = mPassword
      if (mPassword === process.env.SECRETG) {
          res.redirect('/member')
      } else {
          res.render('', {
            error: ':('
          })
      }
  } catch (e) {
      console.log(e)
      throw new Error('index page error')
  }
})

const member = (req, res, next) => {
  try {
    req.mPass = enteredIndexPass
    next()
  } catch (e) {
    console.log(e)
    res.redirect('')
  }
}

module.exports = {
    router,
    member
}