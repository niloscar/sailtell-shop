/**
 * Controller functions for handling user-related API endpoints.
 */

import { Request, Response } from 'express'
import { mockUsers } from '../data/mockdata'

type UserParams = {
  id: string
}

const users = mockUsers

export async function getUsers(req: Request, res: Response) {
  console.log('getUsers called')
  res.json(users)
}

export async function getUser(req: Request<UserParams>, res: Response) {
  const userId = parseInt(req.params.id)
  const user = users.find(user => user.id === userId)

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'Användaren kunde inte hittas.' })
  }
}

export async function createUser(req: Request, res: Response) {
  console.log('createUser called')
}

export async function updateUser(req: Request<UserParams>, res: Response) {
    const userId = parseInt(req.params.id)
    const userIndex = users.findIndex(user => user.id === userId)

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body }
      users[userIndex] = updatedUser
      res.json(updatedUser)
    } else {
      res.status(404).json({ error: 'Användaren du vill ändra kunde inte hittas.' })
    }
}

export async function deleteUser(req: Request, res: Response) {
  console.log('deleteUser called')
}