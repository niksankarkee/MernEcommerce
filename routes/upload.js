const router = require("express").Router();
const cloudinary = require("cloudinary");
const { auth } = require("../middleware/auth");
const { authAdmin } = require("../middleware/AuthAdmin");
const fs = require("fs");

// We will upload image
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload image  auth, authAdmin, add in future
router.post("/upload", (req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ msg: "No file were uploaded." });
    }

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      // if file size > 1mb
      removeTmp(file.tempFilePath);
      return res.status(400).send({ msg: "Size too large." });
    }

    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      removeTmp(file.tempFilePath);
      return res.status(400).send({ msg: "File format is incorrect." });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      async (err, result) => {
        if (err) {
          throw err;
        }
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Delete image auth, authAdmin,
router.post("/destroy", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ msg: "No images Selected" });
    }
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ msg: "Image Deleted" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = router;
