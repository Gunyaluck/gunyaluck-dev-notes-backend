import * as categoryRepository from "../repositories/categoryRepository.mjs";

export const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

export const createCategory = async (categoryData) => {
  if (!categoryData.name || !categoryData.name.trim()) {
    throw new Error("Category name is required");
  }
  return await categoryRepository.createCategory(categoryData);
};

export const updateCategory = async (categoryId, categoryData) => {
  if (!categoryData.name || !categoryData.name.trim()) {
    throw new Error("Category name is required");
  }
  return await categoryRepository.updateCategory(categoryId, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return await categoryRepository.deleteCategory(categoryId);
};