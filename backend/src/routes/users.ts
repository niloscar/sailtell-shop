/**
 * This file defines the routes for handling user-related API endpoints.
 */

import { Router } from 'express'
import { mockUsers } from '../data/mockdata'

const usersRouter = Router()

/* Mock data for users. */
const users = mockUsers

/* GET /api/users - Get all users */
usersRouter.get('/', (req, res) => {
  res.json(users)
})

/* GET /api/users/:id - Get a user by ID */
usersRouter.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id)
  const user = users.find(user => user.id === userId)

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'Användaren kunde inte hittas.' })
  }
})

export default usersRouter