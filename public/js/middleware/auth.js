const { google } = require('googleapis')

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
      
        const spreadsheetId = process.env.SHEET_ID

        req.auth = auth
        req.googleSheets = googleSheets
        req.spreadsheetId = spreadsheetId

        next()
    } catch {
        throw new Error('authentication failed.')
    }

}

module.exports = authorize

