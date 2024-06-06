const express = require("express");
const {
  createBlog,
  getLatestBlog,
  getTrendingBlogs,
  readBlog,
  likeBlog,
  isLikedByUser,
  countLatestBlogs,
  countSearchBlog,
  searchBlogs,
  getBlogById,
  deleteBlog,
  getBlogsByUser,
  countBlogsByUser,
} = require("../controllers/blogs.controller.js");
const { authMiddleware } = require("../middleware/authMiddleware.js.js");
const router = express.Router();
router.get("/trending", getTrendingBlogs);
router.get("/:blog_id", getBlogById);
router.post("/is-liked-by-user", authMiddleware, isLikedByUser);

router.put("/like/:blog_id", authMiddleware, likeBlog);

router.put("/:blog_id", readBlog);

router.post("/latest-blogs", getLatestBlog);
router.post("/search", searchBlogs);
router.post("/blogs-written-by-user", authMiddleware, getBlogsByUser);
router.post("/count-search-blogs", countSearchBlog);
router.post("/count-latest-blogs", countLatestBlogs);
router.post("/user-written-blogs-count", authMiddleware, countBlogsByUser);
router.post("/", authMiddleware, createBlog);
router.delete("/:blog_id", authMiddleware, deleteBlog);
module.exports = router;
