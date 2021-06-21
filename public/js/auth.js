const fs = require('fs')
const { google } = require('googleapis')

const createFile = () => {
    // json = {
    //     type: process.env.type,
    //     project_id: process.env.project_id,
    //     private_key_id: process.env.private_key_id,
    //     private_key: process.env.private_key,
    //     client_email: process.env.client_email,
    //     client_id: process.env.client_id,
    //     auth_uri: process.env.auth_uri,
    //     token_uri: process.env.token_uri,
    //     auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    //     client_x509_cert_url: process.env.client_x509_cert_url
    // }

    // json = process.env.
    
    // json = JSON.stringify(json)

    fs.writeFile('./creds.json', json, (err) => {
    if (!err) {
        console.log('created')
    }
    })
}


const authorize = async (req, res, next) => {
    try {
        
        const auth = new google.auth.GoogleAuth({
            keyFile: GOOGLE_APPLICATION_CREDENTIALS,
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        })
        
        // Create client instance for auth
        const client = await auth.getClient()
  
        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client })
      
        const spreadsheetId = "1HYcx0XSM8QBiU24J0qomFbMZA7us45cpug_4nAtG0yQ"

        req.auth = auth
        req.googleSheets = googleSheets
        req.spreadsheetId = spreadsheetId

        next()
    } catch {
        throw new Error('authentication failed.')
    }

}

module.exports = {
    authorize,
    createFile
}

