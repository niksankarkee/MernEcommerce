const Products = require("../models/productModel");

// Filter, sorting and pagination

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    console.log({ queryStr });

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getProducts = async (req, res) => {
  try {
    console.log(req.query);
    const features = new APIfeatures(Products.find(), req.query)
      .filtering()
      .sorting();
    const products = await features.query;
    res.json({
        status: 'success',
        resut: products.length,
        products: products
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      product_id,
      title,
      price,
      description,
      content,
      images,
      category,
    } = req.body;

    if (!images) {
      return res.status(400).json({ msg: "No image upload" });
    }

    const product = await Products.findOne({ product_id });
    if (product) {
      return res.status(400).json({ msg: "This product already exists." });
    }

    const newProduct = new Products({
      product_id,
      title: title.toLowerCase(),
      price,
      description,
      content,
      images,
      category,
    });

    await newProduct.save();
    res.json({ msg: "Product created" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product Deleted" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const {
      product_id,
      title,
      price,
      description,
      content,
      images,
      category,
    } = req.body;
    if (!images) {
      return res.status(400).json({ msg: "No image upload" });
    }

    await Products.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      }
    );
    res.json({ msg: "Product Updated" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
