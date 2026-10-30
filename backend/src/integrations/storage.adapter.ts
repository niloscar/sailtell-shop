
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? ''
const BUCKET = process.env.SUPABASE_BUCKET ?? 'product-images'
const TIMEOUT_MS = 10_000

if (!SUPABASE_URL || !SECRET_KEY) {
  throw new Error('Supabase är inte konfigurerat.')
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  global: {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS)
      })
  }
})

type ImageFileType = {
  buffer: Buffer
  mimeType: string
}

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg'
}

export async function uploadProductImage(sku: string, image: ImageFileType) {
  const extension = EXTENSIONS[image.mimeType]
  const path = `products/${sku}/${randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, image.buffer, {
    contentType: image.mimeType,
    upsert: false
  })

  if (error) {
    throw new Error(`Kunde inte ladda upp bild till Supabase: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return { path, url: data.publicUrl }
}

export async function removeProductImage(path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])

  if (error) {
    throw new Error(`Kunde inte ta bort bild från Supabase: ${error.message}`)
  }
}
