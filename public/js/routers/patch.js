const express = require('express')
const router = new express.Router()
const authorize = require('../middleware/auth')

let patchData = []

router.post('/patch/tr', authorize, async (req, res) => {
  try {
    const { nick, unitCode, level } = req.body
    
    const nickData = await req.googleSheets.spreadsheets.values.get({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!A:A`
    })

    const isMatch = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    if (!isMatch) {
      const index = nickData.data.values.length

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!A${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[nick]],
        }
      })

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[level]],
        }
      })

      const patchedUnit = await req.googleSheets.spreadsheets.values.get({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}1`
      })

      patchData.push(patchedUnit.data.values.toString())
      patchData.push(nick.toString())
    }  else {
  
    const nickIndex = nickData.data.values.findIndex(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    const patcherNick = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    await req.googleSheets.spreadsheets.values.update({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!${unitCode}${nickIndex+1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[level]],
      }
    })

    const patchedUnit = await req.googleSheets.spreadsheets.values.get({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!${unitCode}1`
    })

    patchData.push(patchedUnit.data.values.toString())
    patchData.push(patcherNick.toString())
  }

  patchData[0] += ' → ' + level

  
  res.redirect('/patch/tr')

  } catch (e) {
    console.log(e)
    res.redirect('/patch/tr')
  }
})

router.post('/patch/en', authorize, async (req, res) => {
  try {
    const { nick, unitCode, level } = req.body
    
    const nickData = await req.googleSheets.spreadsheets.values.get({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!A:A`
    })

    const isMatch = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    if (!isMatch) {
      const index = nickData.data.values.length

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!A${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[nick]],
        }
      })

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[level]],
        }
      })

      const patchedUnit = await req.googleSheets.spreadsheets.values.get({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}1`
      })

      patchData.push(patchedUnit.data.values.toString())
      patchData.push(nick.toString())
    }  else {
  
    const nickIndex = nickData.data.values.findIndex(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    const patcherNick = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    await req.googleSheets.spreadsheets.values.update({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!${unitCode}${nickIndex+1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[level]],
      }
    })

    const patchedUnit = await req.googleSheets.spreadsheets.values.get({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!${unitCode}1`
    })

    patchData.push(patchedUnit.data.values.toString())
    patchData.push(patcherNick.toString())
  }

  patchData[0] += ' → ' + level

  
  res.redirect('/patch/en')

  } catch (e) {
    console.log(e)
    res.redirect('/patch/en')
  }
})

router.get('/patch-metadata', (req, res) => {
  try {
    res.send(patchData)
    patchData = []
  } catch {
    throw new Error ('get patch-metadata error')
  }
})

module.exports = router