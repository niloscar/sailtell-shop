
/**
 * Controller functions for handling GitHub issues.
 */

import type { Request, Response } from 'express'
import { z } from 'zod'
import { createIssue, listOpenIssues } from '../integrations/auth/github.adapter'

const issueSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1)
})

export async function getIssues(_req: Request, res: Response) {
  try {
    const issues = await listOpenIssues()

    res.json(issues)
  } catch (error) {
    console.error('Kunde inte hämta GitHub-issues:', error)
    res.status(502).json({ error: 'Kunde inte hämta issues från GitHub.' })
  }
}

export async function postIssue(req: Request, res: Response) {
  const result = issueSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: 'Rubrik och beskrivning krävs.' })
    return
  }

  const githubLogin = req.session.githubLogin

  if (!githubLogin) {
    res.status(403).json({ error: 'Logga in med GitHub för att rapportera fel.' })
    return
  }

  const { title, description } = result.data
  const body = `${description}\n\n---\nReported by @${githubLogin} in the admin panel.`

  try {
    const issue = await createIssue(title, body)

    res.status(201).json(issue)
  } catch (error) {
    console.error('Kunde inte skapa GitHub-issue:', error)
    res.status(502).json({ error: 'Kunde inte skapa issue på GitHub.' })
  }
}
