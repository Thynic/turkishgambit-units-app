const express = require('express')
const router = new express.Router()
const authorize = require('../auth')

let nicknames = []

router.post('/inquire_by_unit', authorize, async (req, res) => {

    try {
      const { unitCode, min } = req.body
    
      // Get metadata about spreadsheet
        const unitData = await req.googleSheets.spreadsheets.values.get({
          auth: req.auth,
          spreadsheetId: req.spreadsheetId,
          range: `'Oyuncu Verileri'!${unitCode}:${unitCode}`
        })
  
        const nickData = await req.googleSheets.spreadsheets.values.get({
          auth: req.auth,
          spreadsheetId: req.spreadsheetId,
          range: `'Oyuncu Verileri'!A:A`
        })
        
        if (unitCode && min) {
          let count = 1
          const unitName = unitData.data.values[0]
          nicknames[0] = unitName + ': '

          unitData.data.values.forEach((level, index) => {
            const isMax = parseInt(level) >= min ||
                          ((!parseInt(level) && level != '') && (level.toString().toLowerCase() === 'max'))
            if (isMax) {
              nicknames.push(count + '. ' + nickData.data.values[index])
              count++ 
            }
          })
        }

        res.redirect('/inquire_by_unit')
    } catch (e) {
      console.log(e)
      res.redirect('/inquire_by_unit')
    }
})

router.get('/metadata', (req, res) => {
    try {
      if (nicknames.length === 1) {
        nicknames[1] = 'yoktur'
      }
      res.send(nicknames)
      nicknames = []
    } catch {
      throw new Error ('get metadata error')
    }
})

module.exports = router