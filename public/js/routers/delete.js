const express = require('express')
const router = new express.Router()
const authorize = require('../middleware/auth')

let delFeedback = []

router.post('/delete_profile', authorize, async (req, res) => {
    try {
        const { unwantedNick } = req.body
  
        const nickData = await req.googleSheets.spreadsheets.values.get({
          auth: req.auth,
          spreadsheetId: req.spreadsheetId,
          range: `'Oyuncu Verileri'!A:A`
        })
    
        const nickIndex = nickData.data.values.findIndex(nickD => nickD.toString() === unwantedNick.toString())
    
        if (parseInt(nickIndex) > 0) {
          await req.googleSheets.spreadsheets.values.clear({
            auth: req.auth,
            spreadsheetId: req.spreadsheetId,
            range: `'Oyuncu Verileri'!${nickIndex+1}:${nickIndex+1}`
          })
    
          delFeedback.push('Oyuncu silindi!')
    
        } else {
          delFeedback.push('Oyuncu bulunamadı!')
        }
      
        res.redirect('/delete_profile')
      
    } catch (e) {
      console.log(e)
      res.redirect('/delete_profile')
    }
  
})

router.get('/deleted-metadata', (req, res) => {
    try {
      if (delFeedback.length > 0) {
        res.send(delFeedback)
      }
      delFeedback = []
    } catch (e) {
      console.log(e)
      throw new Error('get deleted-metadata error')
    }
  })

module.exports = router
  