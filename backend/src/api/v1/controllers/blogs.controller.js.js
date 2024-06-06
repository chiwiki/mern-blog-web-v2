const asyncHandler = require("express-async-handler");
const { createBlogValidation } = require("../validations/blog.validation");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
var that = (module.exports = {
  createBlog: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    try {
      console.log("user: ", _id);
      const blog_id = await createBlogValidation(_id, req.body);
      res.json(blog_id);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getLatestBlog: asyncHandler(async (req, res) => {
    let { page } = req.body;
    const limit = 5;

    console.log("page: ", page);
    try {
      const blogs = await Blog.find({ draft: false })
        .populate(
          "author",
          "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img -_id"
        )
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "title des tags banner content activity blog_id publishedAt -_id"
        );
      res.json(blogs);
    } catch (error) {
      throw new Error(error);
    }
  }),
  countLatestBlogs: asyncHandler(async (req, res) => {
    try {
      const totalDocs = await Blog.countDocuments({ draft: false });
      res.json({ totalDocs });
    } catch (error) {
      throw new Error(error);
    }
  }),
  getTrendingBlogs: asyncHandler(async (req, res) => {
    const limit = 5;

    try {
      const trendingBlogs = await Blog.find({ draft: false })
        .populate(
          "author",
          "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img -_id"
        )
        .sort({
          "activity.total_reads": -1,
          "activity.total_likes": -1,
          publishedAt: -1,
        })
        .limit(limit)
        .select(
          "title des tags banner content activity publishedAt blog_id -_id"
        );

      res.json(trendingBlogs);
    } catch (error) {
      throw new Error(error);
    }
  }),
  readBlog: asyncHandler(async (req, res) => {
    const { blog_id } = req.params;
    const { mode, draft } = req.body;
    let increment = mode !== "edit" ? 1 : 0;

    try {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { "activity.total_reads": increment } },
        { new: true }
      )
        .populate(
          "author",
          "personal_info.fullname personal_info.username personal_info.profile_img account_info.total_reads _id"
        )
        .select(
          "title des content banner activity publishedAt blog_id tags author"
        );

      const user = await User.findOneAndUpdate(
        { _id: blog.author._id },
        { $inc: { "account_info.total_reads": increment } },
        { new: true }
      ).select(
        "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img -_id"
      );

      res.json(blog);
      // if (blog.draft && !draft) {
      //   throw new Error("You can't access draft like this");
      // }
      // res.json(blog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  likeBlog: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { blog_id } = req.params;

    const { is_liked_by_user } = req.body;
    console.log("is liked by user: ", is_liked_by_user);
    let increment = is_liked_by_user ? -1 : 1;
    try {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { "activity.total_likes": increment } }
      );

      if (!is_liked_by_user) {
        const notification = new Notification({
          type: "like",
          blog: blog._id,
          notification_for: blog.author,
          user: _id,
        });
        const sendNotifi = await notification.save();
        const savedNotification = await Notification.findOne({
          _id: sendNotifi._id,
        })
          .populate("blog", "title blog_id banner")
          .populate(
            "user",
            "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img"
          )
          .populate("comment", "comment")
          .populate("replied_on_comment", "comment")
          .populate("reply", "comment")
          .select("createdAt seen type reply ");

        res.json({ isLikedByUser: true, notification: savedNotification });
      } else {
        await Notification.findOneAndDelete({
          type: "like",
          blog: blog._id,
          user: _id,
        });
        res.json({ isLikedByUser: false });
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  isLikedByUser: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { _id } = req.body;
    try {
      const existNotification = await Notification.exists({
        type: "like",
        blog: _id,
        user: user_id,
      });
      if (existNotification) {
        res.json({ isLikedByUser: true });
      } else {
        res.json({ isLikedByUser: false });
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  searchBlogs: asyncHandler(async (req, res) => {
    let { tag, query, author, limit, page } = req.body;
    console.log("page: ", page);
    console.log("tag: ", tag);
    let findQuery = { draft: false };
    if (tag) {
      findQuery = { ...findQuery, tags: tag };
    } else if (query) {
      findQuery = { ...findQuery, title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { ...findQuery, author: author };
    }
    let maxLimit = limit || 5;
    try {
      const blogs = await Blog.find(findQuery)
        .populate(
          "author",
          "personal_info.username personal_info.fullname personal_info.profile_img "
        )
        .sort({ publishedAt: -1 })
        .select("blog_id title des banner tags activity publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
      res.json({ blogs });
    } catch (error) {
      throw new Error(error);
    }
  }),
  countSearchBlog: asyncHandler(async (req, res) => {
    let { tag, query, author } = req.body;
    let findQuery = { draft: false };
    if (tag) {
      findQuery = { ...findQuery, tags: tag };
    } else if (query) {
      findQuery = { ...findQuery, title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { ...findQuery, author: author };
    }
    console.log(findQuery);
    try {
      const totalDocs = await Blog.countDocuments(findQuery);
      res.json({ totalDocs });
    } catch (error) {
      throw new Error(error);
    }
  }),
  getBlogById: asyncHandler(async (req, res) => {
    const { blog_id } = req.params;
    try {
      const blog = await Blog.findOne({ blog_id }).select(
        "title banner des content tags "
      );
      res.json(blog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getBlogsByUser: asyncHandler(async (req, res) => {
    console.log("get blog: ", req.body);
    const { _id: userId } = req.user;
    const { query, draft, deletedDocCount, page } = req.body;
    const maxLimit = 3;
    let skipDocs = (page - 1) * maxLimit;
    if (deletedDocCount) {
      skipDocs -= deletedDocCount;
    }
    try {
      const blogs = await Blog.find({
        author: userId,
        title: new RegExp(query, "i"),
        draft,
      })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 });

      res.json({ blogs, success: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
  countBlogsByUser: asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { query, draft } = req.body;
    console.log("draft: ", draft);
    try {
      const totalDocs = await Blog.countDocuments({
        author: userId,
        title: new RegExp(query, "i"),
        draft,
      });
      res.json({ totalDocs });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
  deleteBlog: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { blog_id } = req.params;
    try {
      const deletedBlog = await Blog.findOneAndDelete({ blog_id });
      res.json({ success: true, message: "deleted blog successfully!" });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
});
