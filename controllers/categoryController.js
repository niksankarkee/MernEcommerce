const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    //   if user have role = 1 --- > admin
    //   only admin can create, delete, and update category
    const { name } = req.body;
    const category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: "This category is already exists." });
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.json("Check admin success");
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "Catagory deleted" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await Category.findOneAndUpdate({ _id: req.params.id }, { name });
    res.json({ msg: "Catagory updated" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
