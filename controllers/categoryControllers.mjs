import * as categoryService from "../services/categoryService.mjs";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read categories because database issue",
      error: err.message || "Internal server error",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ 
      message: "Created category successfully",
      category 
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("required")) {
      return res.status(400).json({ 
        message: err.message,
        error: err.message 
      });
    }
    res.status(500).json({
      message: "Server could not create category because database issue",
      error: err.message || "Internal server error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await categoryService.updateCategory(categoryId, req.body);
    res.status(200).json({ message: "Updated category successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not update category because database issue" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await categoryService.deleteCategory(categoryId);
    res.status(200).json({ message: "Deleted category successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server could not delete category because database issue" });
  }
};