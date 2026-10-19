import * as categoryRepository from '../repositories/category.repository'
import slugify from '../utilities/slugify'

import type { UpdateCategory } from '../types/category.types'

export async function getCategories() {
  return await categoryRepository.findCategories()
}

export async function getCategory(id: number) {
  const category = await categoryRepository.findCategoryById(id)

  if (!category) {
    throw new Error('Kategorin kunde inte hittas.')
  }

  return category
}

export async function getCategoryBySlug(slug: string) {
  const category = await categoryRepository.findCategoryBySlug(slug)

  if (!category) {
    throw new Error('Kategorin kunde inte hittas.')
  }

  return category
}

export async function createCategory(name: string, description: string) {
  const category = await categoryRepository.createCategory(name, description)

  if (!category) {
    throw new Error('Kategorin kunde inte skapas.')
  }

  return category
}

export async function updateCategory(
  id: number,
  updatedCategory: UpdateCategory
) {
  const category = await categoryRepository.updateCategory(id, updatedCategory)

  if (!category) {
    throw new Error('Kategorin kunde inte uppdateras.')
  }

  return category
}

export async function deleteCategory(id: number) {
  const category = await categoryRepository.deleteCategory(id)

  if (!category) {
    throw new Error('Kategorin kunde inte tas bort.')
  }

  return category
}
