const express = require('express')
const router = new express.Router()
const authorize = require('./auth')

let nicknames = []
let patchNickname = []

router.post('/inquire', authorize, async (req, res) => {

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
            if (parseInt(level) >= min ||
                ((!parseInt(level) && level != '') && (level.toString().toLowerCase() === 'max'))
              )
                {
                    nicknames.push(count + '. ' + nickData.data.values[index])
                    count++ 
            }
          })
        }

        res.redirect('/inquire')
    } catch (e) {
      console.log(e)
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

router.post('/patch', authorize, async (req, res) => {
  try {
    const { nick, unitCode, level } = req.body
    // patchNickname.push(nick)
    let index
    
    const nickData = await req.googleSheets.spreadsheets.values.get({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!A:A`
    })

    const isMatch = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    if (!isMatch) {
      index = nickData.data.values.length

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!A${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[nick]],
        }
      })

      patchNickname.push([nick])

      await req.googleSheets.spreadsheets.values.update({
        auth: req.auth,
        spreadsheetId: req.spreadsheetId,
        range: `'Oyuncu Verileri'!${unitCode}${index+1}`, 
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[level]],
        }
      })
    }  else {

    // const nickData = await req.googleSheets.spreadsheets.values.get({
    //   auth: req.auth,
    //   spreadsheetId: req.spreadsheetId,
    //   range: `'Oyuncu Verileri'!A:A`
    // })
  
    const nickIndex = nickData.data.values.findIndex(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())

    const patcherNick = nickData.data.values.find(nickD => nickD.toString().toLowerCase() === nick.toString().toLowerCase())
    patchNickname.push(patcherNick)

    await req.googleSheets.spreadsheets.values.update({
      auth: req.auth,
      spreadsheetId: req.spreadsheetId,
      range: `'Oyuncu Verileri'!${unitCode}${nickIndex+1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[level]],
      }
    })
  }

    res.redirect('/patch')

  } catch (e) {
    console.log(e)
    res.redirect('/patch')
  }
})

router.get('/patch-metadata', (req, res) => {
  try {
    res.send(patchNickname)
    patchNickname = []
  } catch {
    throw new Error ('get patch-metadata error')
  }
})

module.exports = router