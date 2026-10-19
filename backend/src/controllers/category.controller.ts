/**
 * Controller functions for handling category-related API endpoints.
 */

import { Request, Response } from 'express'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/category.service'

type CategoryParams = {
  id: string
}

export async function getCategoriesHandler(req: Request, res: Response) {
  const categories = await getCategories()
  if (categories) {
    res.json(categories)
  } else {
    res.status(404).json({ error: 'Inga kategorier hittades.' })
  }
}

export async function getCategoryHandler(
  req: Request<CategoryParams>,
  res: Response
) {
  const categoryId = parseInt(req.params.id)
  const category = await getCategory(categoryId)

  if (category) {
    res.json(category)
  } else {
    res.status(404).json({ error: 'Kategorin kunde inte hittas.' })
  }
}

export async function createCategoryHandler(req: Request, res: Response) {
  const newCategory = req.body
  const createdCategory = await createCategory(
    newCategory.name,
    newCategory.description
  )

  if (createdCategory) {
    res.status(201).json(createdCategory)
  } else {
    res.status(400).json({ error: 'Kategorin kunde inte skapas.' })
  }
}

export async function updateCategoryHandler(
  req: Request<CategoryParams>,
  res: Response
) {
  const categoryId = parseInt(req.params.id)
  const category = await getCategory(categoryId)

  if (category) {
    const updatedCategory = { ...category, ...req.body }
    const result = await updateCategory(categoryId, updatedCategory)
    if (result) {
      res.json(result)
    } else {
      res.status(400).json({ error: 'Kategorin kunde inte uppdateras.' })
    }
  } else {
    res
      .status(404)
      .json({ error: 'Kategorin du vill ändra kunde inte hittas.' })
  }
}

export async function deleteCategoryHandler(
  req: Request<CategoryParams>,
  res: Response
) {
  const categoryId = parseInt(req.params.id)
  const category = await getCategory(categoryId)

  if (category) {
    await deleteCategory(categoryId)
    res.json({ message: 'Kategorin har tagits bort.' })
  } else {
    res
      .status(404)
      .json({ error: 'Kategorin du vill ta bort kunde inte hittas.' })
  }
}
