const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
dotenv.config()

const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND)

const app = express()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET
if (!JWT_SECRET || !JWT_RESET_SECRET) {
    console.error('missing secret.')
}

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});
db.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('Connected')
    }
})

app.use(cors())
app.use(express.json())


function removeSensitiveData(user) {
    const safe = { ...user }
    delete safe.password
    delete safe.verificationCode
    delete safe.verificationCodeExpires
    return safe
}

function signAuthToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = authHeader.slice('Bearer '.length)
    try {
        req.user = jwt.verify(token, JWT_SECRET)
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid or expired session, please log in again' })
    }
}


app.post('/login', async (req, res) => {
    let { email, password, google, access_token } = req.body

    if (google) {
        if (!access_token) {
            return res.status(400).json({ error: 'Missing Google token' })
        }
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        if (!response.ok) {
            return res.status(401).json({ error: 'Invalid Google token' })
        }
        const data = await response.json()
        if (!data.email) {
            return res.status(401).json({ error: 'Invalid Google token' })
        }
        email = data.email
    }

    if (!email) {
        return res.status(400).json({ error: 'Email required' })
    }

    db.query(`SELECT * FROM users WHERE email=?`, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' })
        }

        if (result.length === 0) {
            let hash
            if (google) {
                hash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
            }
            else {
                if (!password || password.length < 6) {
                    return res.status(400).json({ error: 'Password must be at least six characters long' })
                }
                hash = await bcrypt.hash(password, 10)
            }

            db.query(`INSERT INTO users (email, password, google) VALUES (?, ?, ?)`, [email, hash, google], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Server error' })
                }
                db.query(`SELECT * FROM users WHERE id = ?`, [result.insertId], (err, rows) => {
                    if (err || rows.length === 0) {
                        return res.status(500).json({ error: 'Server error' })
                    }
                    const newUser = removeSensitiveData(rows[0])
                    const token = signAuthToken(newUser)
                    return res.json({ user: newUser, token })
                })
            })
            return
        }

        const userData = result[0]

        if (google) {
            if (!userData.google) {
                return res.status(401).json({ error: 'This account uses a password, not Google' })
            }
        } else {
            if (userData.google) {
                return res.status(401).json({ error: 'This email previously logged in using Google.' })
            }
            if (!password) {
                return res.status(400).json({ error: 'Password required' })
            }
            const match = await bcrypt.compare(password, userData.password)
            if (!match) {
                return res.status(401).json({ error: 'Wrong password' })
            }
        }

        const safeUser = removeSensitiveData(userData)
        const token = signAuthToken(safeUser)
        res.json({ user: safeUser, token })
    })
})



app.delete('/deleteAccount', requireAuth, (req, res) => {
    db.query(`DELETE FROM users WHERE id = ?`, [req.user.id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' })
        }
        return res.status(200).json({ success: true })
    })
})


app.get('/login/:email', (req, res) => {
    const email = req.params.email
    db.query(`SELECT google FROM users WHERE email = ?`, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' })
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Don't exist" })
        }
        res.json({ exists: true, google: result[0].google })
    })
})


function createEmailTemplate({ title, message, code }) {
    return `
      <div style="font-family: Arial; background: #f6f6f6; padding: 40px;">
        <div style="max-width: 500px; margin: auto;  background: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="margin-bottom: 10px;">${title}</h2>
          <p style="color: #555;">
            ${message}
          </p>
  
          ${code ? `<div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; padding: 15px; background: #f2f2f2; border-radius: 8px;">
              ${code}
            </div>`: ""
        }
  
          <p style="font-size: 12px; color: gray;">
            If you didn't request this, you can ignore this email.
          </p>
        </div>
      </div>
    `;
}
async function sendVerificationEmail(email, code) {
    const { data, error } = await resend.emails.send({
        from: 'code@yannieismylover.uk',
        to: email,
        html: createEmailTemplate({ title: "Verify your account", message: "Use the code below to verify your account.", code }),
        subject: 'Verification Code',
        reply_to: 'aronchen500@gmail.com'
    })
    if (error) {
        console.log('Failed to send code:', error)
        return
    }
}

app.patch('/verification', async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ error: 'Email required' })
    }

    const randomCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    sendVerificationEmail(email, randomCode)
    const hash = await bcrypt.hash(randomCode, 10)
    db.query(`UPDATE users SET verificationCode = ?, verificationCodeExpires = ? WHERE email = ?`, [hash, expiresAt, email], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Update Failed' })
        }
        return res.json({ success: true, expiresAt })
    })
})

app.get('/verification', async (req, res) => {
    const { email, code } = req.query
    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code required' })
    }

    db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Update Failed' })
        }
        if (result.length === 0 || !result[0].verificationCode) {
            return res.json({ success: false })
        }

        const user = result[0]
        const notExpired = user.verificationCodeExpires && new Date(user.verificationCodeExpires) > new Date()
        const match = await bcrypt.compare(code, user.verificationCode)

        if (!match || !notExpired) {
            return res.json({ success: false })
        }

        db.query(`UPDATE users SET verificationCode = NULL, verificationCodeExpires = NULL WHERE email = ?`, [email])

        const resetToken = jwt.sign({ email, purpose: 'password_reset' }, JWT_RESET_SECRET, { expiresIn: '10m' })
        return res.json({ success: true, resetToken })
    })
})

app.patch('/newPassword', async (req, res) => {
    const { password, email, resetToken } = req.body

    if (!resetToken) {
        return res.status(401).json({ error: 'Missing reset token' })
    }
    jwt.verify(resetToken, JWT_RESET_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({
                error: 'Something went wrong, please request a new code'
            })
        }
        if (payload.purpose !== 'password_reset' || payload.email !== email) {
            return res.status(401).json({ error: 'Invalid reset token' })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least six characters long' })
        }
    })


    const hash = await bcrypt.hash(password, 10)
    db.query(`UPDATE users SET password = ?, google = 0 WHERE email = ?`, [hash, email], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' })
        }

        db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(500).json({ error: 'Server error' })
            }
            const safeUser = removeSensitiveData(rows[0])
            const token = signAuthToken(safeUser)
            res.json({ user: safeUser, token })
        })
    })
})

app.patch('/user/:id', requireAuth, (req, res) => {
    const { id } = req.params
    if (Number(id) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
    }

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

    db.query(`UPDATE users SET ${setFieldArray} WHERE id = ?`, [...values, id], (err) => {
        if (err) {
            console.log("Update failed:", err)
            return res.status(500).json({ error: "Server error" })
        }
        db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, result) => {
            if (err) {
                console.log("Fetch after update failed:", err)
                return res.status(500).json({ error: "Server error" })
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "User not found" })
            }
            res.json(removeSensitiveData(result[0]))
        })
    })
})

app.listen(3000, () => {
    console.log('connected to port 3000')
})