import { Router } from 'express'
import { loginUser } from '../services/authService'
import { clearSession, setSessionUserId, getSessionUserId } from '../services/sessionService'

const authRouter = Router()

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'E-post och lösenord krävs.' })
        return
    }

    try {
        const loginResult = loginUser(email, password)

        setSessionUserId(req, loginResult.user.id) // Store the user ID in the session to keep the user logged in

        res.json(loginResult)
    } catch (error) {
        const message = (error instanceof Error)
            ? error.message
            : 'Inloggningen misslyckades.'

        res.status(401).json({ error: message })
    }
})

authRouter.get('/session', (req, res) => {
    res.json({ "userId": getSessionUserId(req) }) // Return the userId from the session, or null if not logged in.
})

authRouter.post('/logout', async (req, res) => {
    try {
      await clearSession(req)

      res.clearCookie('connect.sid') // Clear the session cookie on the client side
      res.json({ message: 'Utloggad.' })
    } catch {
      res.status(500).json({ error: 'Kunde inte logga ut.' })
    }
})

export default authRouter