
import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'

import { uploadProductImageFile } from '../middleware/imageUpload.middleware'
import { uploadProductImage, removeProductImage } from '../integrations/storage.adapter'
import { getProduct, updateProductImage } from '../repositories/product.repository'

export function imageUploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  uploadProductImageFile(req, res, (error) => {
    if (error) {
      const message =
        error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
          ? 'Bilden får vara högst 4 MB.'
          : error.message

      res.status(400).json({ message })
      return
    }

    next()
  })
}

export async function uploadProductImageHandler(req: Request, res: Response) {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Ogiltigt produkt-ID.' })
    return
  }

  if (!req.file) {
    res.status(400).json({ message: 'Ingen bild har skickats.' })
    return
  }

  let product

  try {
    product = await getProduct(id)
  } catch {
    res.status(404).json({ message: 'Produkten kunde inte hittas.' })
    return
  }

  if (!product.sku) {
    res.status(400).json({ message: 'Produkten saknar SKU.' })
    return
  }

  let image

  try {
    image = await uploadProductImage(product.sku, {
      buffer: req.file.buffer,
      mimeType: req.file.mimetype
    })
  } catch {
    res.status(502).json({
      message: 'Kunde inte ladda upp bilden till bildtjänsten.'
    })
    return
  }

  try {
    await updateProductImage(id, image.path, image.url)
  } catch (error) {
    // The new image is not referenced by the product.
    await removeProductImage(image.path).catch(console.error)
    throw error
  }

  if (product.img_path) {
    // The new image is already saved. A deletion error must not undo it.
    await removeProductImage(product.img_path).catch(console.error)
  }

  res.json({
    message: 'Produktbilden har uppdaterats.',
    img_url: image.url,
    img_path: image.path
  })
}
