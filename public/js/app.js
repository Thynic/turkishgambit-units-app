const express = require('express')
const router = new express.Router()
const { google } = require('googleapis')

let nicknames = []

router.post('', async (req, res) => {
    const { unitCode, min } = req.body

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      })
    
      // Create client instance for auth
      const client = await auth.getClient()
    
      // Instance of Google Sheets API
      const googleSheets = google.sheets({ version: "v4", auth: client })
    
      const spreadsheetId = "1HYcx0XSM8QBiU24J0qomFbMZA7us45cpug_4nAtG0yQ"
  
      // Get metadata about spreadsheet
      const unitData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}:${unitCode}`
      })

      const nickData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `'Oyuncu Verileri'!A:A`
      })

      let count = 1
      const unitName = unitData.data.values[0]
      nicknames[0] = unitName + ': '
      unitData.data.values.forEach((level, index) => {
        if (parseInt(level) >= min ||
            (!parseInt(level) && parseInt(level.toString().length) < 5) &&
            level != ''
           ) {
                nicknames.push(count + '. ' + nickData.data.values[index])
                count++ 
        }
      })

      res.redirect('/')
})

router.get('/metadata', (req, res) => {
  if (nicknames.length === 1) {
      nicknames[1] = 'yoktur'
  }
  res.send(nicknames)
  nicknames = []
})

module.exports = router