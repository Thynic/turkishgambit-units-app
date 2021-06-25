const express = require('express')
const router = new express.Router()
const authorize = require('../middleware/auth')

let units = []
let error = []

router.post('/inquire_by_nick', authorize, async (req, res) => {
    try {
  
      const { inquireNick, filter } = req.body
  
      const nickData = await req.googleSheets.spreadsheets.values.get({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!A:A`
      })
  
      const isMatch = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === inquireNick.toString().toLowerCase())
  
      if (!isMatch) {
        error.push('Oyuncu bulunamadı!')
      } else {
        const inqNickIndex = nickData.data.values.findIndex(nickD => nickD.toString().toLowerCase() === inquireNick.toString().toLowerCase())
  
        const unitsData = await req.googleSheets.spreadsheets.values.get({
          auth: req.auth,
          spreadsheetId: req.spreadsheetId,
          range: `'Oyuncu Verileri'!${inqNickIndex+1}:${inqNickIndex+1}`
        })
  
        const unitNames = await req.googleSheets.spreadsheets.values.get({
          auth: req.auth,
          spreadsheetId: req.spreadsheetId,
          range: `'Oyuncu Verileri'!1:1`
        })
  
        // console.log(unitsData.data.values[0])
  
  
          if (unitsData.data.values) {
            unitsData.data.values[0].forEach((unit, index) => {
            const isMax = (!parseInt(unit) && unit != '') && (unit.toString().toLowerCase() === 'max')
            if (index === 0) {
              units.push(unit)
            } else if (index === 1) {
              units.push(unit + ' ' + unitNames.data.values[0][index])
            } else {
              if (unit !== '') {
                if (filter === 'all')
                  units.push(unitNames.data.values[0][index] + ': ' + unit)
    
                if (filter === 'max') {
                  if (isMax)
                    units.push(unitNames.data.values[0][index])
                }
    
                if (filter === 'not-max') {
                  if (!isMax) {
                    units.push(unitNames.data.values[0][index] + ': ' + unit)
                  }
                }
              }
            } 
          })
        }
      }

      if (units.length === 2) {
        units[3] = 'yoktur'
      }
  
      res.redirect('/inquire_by_nick')
    } catch (e) {
      res.redirect('/inquire_by_nick')
      console.log(e)
    }
})

router.get('/inquire-by-nick-metadata', (req, res) => {
  try {
    if (error[0] === 'Oyuncu bulunamadı!') {
      res.send(error)
      error = []
    }
    else {
      res.send(units)
      units = []
    }
  } catch (e) {
    console.log(e)
    throw new Error ('get inquire-metadata error')
  }
})


  module.exports = router