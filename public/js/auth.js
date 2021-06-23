const fs = require('fs')
const { google } = require('googleapis')

const createFile = () => {
    json = {
        type: process.env.TYPE,
        project_id: process.env.PROJECTS_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
    }

    json = JSON.stringify(json)

    fs.writeFile('./creds.json', json, (err) => {
        if (!err) {
            console.log('created')
        }
    })
}


const authorize = async (req, res, next) => {
    try {
        
        const auth = new google.auth.GoogleAuth({
            keyFile: "google-credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        })
        
        // Create client instance for auth
        const client = await auth.getClient()
  
        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client })
      
        const spreadsheetId = "1HYcx0XSM8QBiU24J0qomFbMZA7us45cpug_4nAtG0yQ"
        // const spreadsheetId = "1_PyG_txQ8Bv00c5UIQmNdPlHFYRyWYse0CcgPlq0UnA" //test

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

