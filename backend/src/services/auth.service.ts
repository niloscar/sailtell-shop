/**
 * Authentication service functions for handling user login, session management, and logout.
 *
 * Todo:
 * - Implement password hashing and verification for secure authentication.
 */

import bcrypt from "bcrypt";
import { User, PublicUser } from "../types/user.types";
import pool from "../database";

type LoginResult = {
  user: PublicUser;
};

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  const { rows } = await pool.query<User>(
    `SELECT
      id,
      fname,
      lname,
      email,
      role,
      password_hash
    FROM users
    WHERE LOWER(email) = LOWER($1)`,
    [email],
  );

  const user = rows[0];

  if (!user) {
    throw new Error("Fel användarnamn eller lösenord");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new Error("Fel användarnamn eller lösenord");
  }

  return {
    user: {
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
    },
  };
}
