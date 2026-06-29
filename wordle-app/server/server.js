const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const {Resend} = require ('resend')
const resend = new Resend(process.env.RESEND)


const app = express()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err)=> {
    if (err) {
        console.log(err)
    }
    else {
        console.log('Connected')
    }
})

app.use(cors())
app.use(express.json())

app.post('/login', (req,res) => {
    const { email, password, google } =  req.body
    let userData
    db.query(`SELECT * FROM users WHERE email=?`, [email], (err,result)=> {
        if (err) {
            console.log("Query failed:", err)
            return res.status(500).json({ error: "Server error" });
        }
        if (result.length === 0) {
            db.query(`INSERT INTO users (email, password, google) VALUES (?, ?, ?)`, [email,password, google], (err, result) => {
                if (err) {
                    console.log("Insert failed:", err);
                    return res.status(500).json({ error: "Server error" });
                }
                userData = {id: result.insertId, google, email, password}
                return res.json(userData); 
            });
            return
        }
        userData = result[0]
        res.json(userData)

    })
})

app.get('/login/:email', (req,res)=> {
    const email = req.params.email
    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err,result)=> {
        if (err) {
            console.log("Query failed:", err)
            return res.status(500).json({ error: "Server error" })
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Don't exist" })
        }
        res.json(result[0])
    })
})

function createEmailTemplate({ title, message, code }) {
    return `
      <div style="
        font-family: Arial, sans-serif;
        background: #f6f6f6;
        padding: 40px;
      ">
        <div style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
        ">
  
          <h2 style="margin-bottom: 10px;">${title}</h2>
  
          <p style="color: #555;">
            ${message}
          </p>
  
          ${
            code
              ? `
            <div style="
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              margin: 20px 0;
              padding: 15px;
              background: #f2f2f2;
              border-radius: 8px;
            ">
              ${code}
            </div>
          `
              : ""
          }
  
          <p style="font-size: 12px; color: gray;">
            If you didn’t request this, you can ignore this email.
          </p>
  
        </div>
      </div>
    `;
  }
async function sendVerificationEmail(email, code) {
    const {data, error} = await resend.emails.send({
        from:'onboarding@resend.dev',
        to: 'aronchen500@gmail.com',
        html:createEmailTemplate({ title: "Verify your account", message: "Use the code below to verify your account.", code}),
        subject:'Verification Code',
        reply_to:'aronchen500@gmail.com'
    })
    if (error) {
        console.log('Failed to send code:', error)
        return
    }
}
app.post('/verification', (req,res) => {
    const {email} = req.body
    const randomCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    sendVerificationEmail(email, randomCode)
    db.query(`UPDATE users SET verificationCode = ?, verificationCodeExpires = ? WHERE email = ?`, [randomCode,expiresAt, email], (err, result) => {
        if (err) {
            console.log('Update Failed:', err)
            return res.status(500).json({error: "Update Failed"})
        }
        //remove verificationcode later
        return res.json({success: true, expiresAt, verificationCode: randomCode})
    })
})


app.patch('/user/:id', (req, res) => {
    const { id } = req.params
    const updates = req.body

    const allowedFields = [
        'darkMode', 'keyboardOnly', 'hardMode', 'playedOnce',
        'gamesPlayed', 'gamesWon', 'currentStreak', 'maxStreak',
        'lastPuzzleNumber', 'gameState',
        'WonIN1', 'WonIN2', 'WonIN3', 'WonIN4', 'WonIN5', 'WonIN6'
    ]

    const fields = Object.keys(updates).filter(key => allowedFields.includes(key))
    if (fields.length === 0) {
        return res.status(400).json({ error: "No valid fields to update" })
    }

    const setFieldArray = fields.map(element => `${element} = ?`).join(', ')
    const values = fields.map(element => element === 'gameState' ? JSON.stringify(updates[element]) : updates[element])

    db.query(`UPDATE users SET ${setFieldArray} WHERE id = ?`, [...values, id], (err, result) => {
        if (err) {
            console.log("Update failed:", err)
            return res.status(500).json({ error: "Server error" })
        }
        db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, rows) => {
            if (err) {
                console.log("Fetch after update failed:", err)
                return res.status(500).json({ error: "Server error" })
            }
            if (rows.length === 0) {
                return res.status(404).json({ error: "User not found" })
            }
            res.json(rows[0])
        })
    })
})


app.listen(3000, () => {
    console.log('connected to port 3000')
})

