import { useEffect, useState } from 'react'
import { getIssues, createIssue } from '../../api/issuesApi'

import type { SubmitEvent } from 'react'
import type { Issue } from '../../api/issuesApi'

import styles from './PageAdminIssues.module.css'

export default function PageAdminIssues() {
  const [issues, setIssues] = useState<Issue[] | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getIssues()
      .then(setIssues)
      .catch(() => setError('Kunde inte hämta issues från GitHub.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const newIssue = await createIssue(title.trim(), description.trim())

      setIssues((prevIssues) => [newIssue, ...(prevIssues ?? [])])
      setTitle('')
      setDescription('')
      setSuccess(true)
    } catch {
      setError('Kunde inte skapa ärende på GitHub.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="headingSize1">Ärenden</h1>

      <section>
        <h2 className="headingSize2">Rapportera ett problem</h2>

        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="issue-title">Rubrik</label>
            <input
              id="issue-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="issue-description">Beskrivning</label>
            <textarea
              id="issue-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Skapar...' : 'Skapa ärende'}
          </button>
        </form>

        {error && (
          <p className="errorMessage" role="alert">
            {error}
          </p>
        )}
        {success && <p role="status">Ärendet har skapats.</p>}
      </section>

      <section>
        <h2 className="headingSize2">Öppna ärenden</h2>

        {loading ? (
          <p>Hämtar ärenden...</p>
        ) : issues === null ? null : issues.length === 0 ? (
          <p>Inga öppna ärenden.</p>
        ) : (
          <ul className={styles.issueList}>
            {issues.map((issue) => (
              <li className={styles.issueItem} key={issue.number}>
                <span className={styles.issueAuthor}>{issue.author}</span>
                <span className={styles.issueId}>#{issue.number}</span>
                <a
                  className={styles.issueTitle}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {issue.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
