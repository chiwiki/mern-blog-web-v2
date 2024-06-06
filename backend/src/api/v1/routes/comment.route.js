const express = require("express");
const {
  createComment,
  getComment,
  getReplies,
  deleteCommentCtrl,
  countBlogComments,
} = require("../controllers/comment.controller.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();
router.get("/:id", getComment);

router.post("/replies", getReplies);
router.post("/:blog_id", countBlogComments);
router.post("/", authMiddleware, createComment);
router.put("/delete-comment", authMiddleware, deleteCommentCtrl);
module.exports = router;
