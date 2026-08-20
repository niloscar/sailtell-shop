import { mockUsers as users } from '../data/mockdata'
import { User } from '../types/user'

type PublicUser = Omit<User, 'passwordHash'>

type LoginResult = {
    user: PublicUser
}

export function loginUser(email: string, password: string): LoginResult {
    const user = users.find(user => user.email === email)

    if (!user || user.passwordHash !== password) {
        throw new Error('Fel användarnamn eller lösenord')
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    }
}