/**
 * Controller functions for handling user-related API endpoints.
 */

import { Request, Response } from 'express'
import { getUsers, getUser, createUser } from '../services/userService'

type UserParams = {
  id: string
}

export async function getUsersHandler(req: Request, res: Response) {
  const users = await getUsers()
  res.json(users)
}

export async function getUserHandler(req: Request<UserParams>, res: Response) {
  const userId = parseInt(req.params.id)
  const user = await getUser(userId)

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'Användaren kunde inte hittas.' })
  }
}

export async function createUserHandler(req: Request, res: Response) {
  const user = req.body
  const createdUser = await createUser(user.fname, user.lname, user.email, user.password, user.role)
  if (createdUser) {
    res.status(201).json(createdUser)
  } else {
    res.status(400).json({ error: 'Användaren kunde inte skapas.' })
  }
}