const Comment = require("../models/comment.model");
const asyncHandler = require("express-async-handler");
const Blog = require("../models/blog.model");
const Notification = require("../models/notification.model");
let comment_arr = [];

const deleteComments = async (_id) => {
  console.log("comment_id", _id);
  comment_arr.push(_id);

  await Comment.findOneAndDelete({ _id })
    .then(async (comment) => {
      if (comment.parent) {
        console.log("hekkkk");
        await Comment.findOneAndUpdate(
          { _id: comment.parent },
          { $pull: { children: _id } }
        )
          .then((data) => {
            console.log("comment delete from parent");
          })
          .catch((err) => console.log(err.message));
      }

      await Notification.findOneAndDelete({ comment: _id }).then(
        (notification) => console.log("comment notification deleted")
      );

      const replyNotifi = await Notification.findOneAndUpdate(
        { reply: _id },
        { $unset: { reply: 1 } }
      );
      if (replyNotifi) {
        console.log("reply Notification deleted ");
      }
      console.log("comment parent", comment.parent);

      await Blog.findOneAndUpdate(
        { _id: comment.blog_id },
        {
          $pull: { comments: _id },
          $inc: {
            "activity.total_comments": -1,
            "activity.total_parent_comments": comment.parent ? 0 : -1,
          },
        }
      ).then(async (blog) => {
        if (comment.children.length) {
          for (let child of comment.children) {
            await deleteComments(child);
          }
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
var that = (module.exports = {
  createComment: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    let { _id, replying_to, blog_author, comment, notification_id } = req.body;
    try {
      if (!comment.length) {
        throw new Error("You need to write something to comment");
      }
      let commentObj = {
        comment,
        blog_id: _id,
        blog_author,
        commented_by: user_id,
      };

      if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
      }
      const createdComment = await Comment(commentObj).save();
      const newComment = await Comment.findOne({
        _id: createdComment._id,
      }).populate(
        "commented_by",
        "personal_info.username personal_info.profile_img personal_info.fullname"
      );
      console.log("new comment: ", commentObj);

      const blog = await Blog.findOneAndUpdate(
        { _id },
        {
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": replying_to ? 0 : 1,
          },
          $push: { comments: newComment._id },
        }
      );
      let notificationObj = {
        type: replying_to ? "reply" : "comment",
        blog: blog._id,
        user: user_id,
        notification_for: blog.author,
        comment: newComment._id,
      };
      if (replying_to) {
        const parentComment = await Comment.findOneAndUpdate(
          { _id: replying_to },
          { $push: { children: newComment._id } }
        );
        notificationObj.notification_for = parentComment.commented_by;
        notificationObj.replied_on_comment = parentComment._id;
        if (notification_id) {
          const updatedNotification = await Notification.findOneAndUpdate(
            { _id: notification_id },
            { reply: newComment._id }
          );
          console.log("reply to persons: ", updatedNotification);
        }
      }
      const newNotification = await new Notification(notificationObj).save();
      const savedNotification = await Notification.findOne({
        _id: newNotification._id,
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
      console.log(savedNotification);
      res.json({ comment: newComment, notification: savedNotification });
    } catch (error) {
      throw new Error(error);
    }
  }),
  getBlogComments: asyncHandler(async (req, res) => {
    const { skip, blog_id } = req.body;
    const maxLimit = 5;
    try {
      const comments = await Comment.find({ blog_id, isReply: false })
        .populate(
          "commented_by",
          "personal_info.fullname personal_info.username personal_info.profile_img personal_info.email"
        )
        .skip(skip)
        .limit(maxLimit)
        .sort({ commentedAt: -1 });
      res.json(comments);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getReplies: asyncHandler(async (req, res) => {
    const { _id, skip } = req.body;
    const maxLimt = 5;
    try {
      const replies = await Comment.findOne({ _id }).populate({
        path: "children",
        option: {
          skip: skip,
          limit: maxLimt,
        },
        populate: {
          path: "commented_by",
          select:
            "personal_info.fullname personal_info.username personal_info.email personal_info.profile_img",
        },
        select: "-blog_id",
      });
      res.json(replies.children);
    } catch (error) {
      throw new Error(error);
    }
  }),
  countBlogComments: asyncHandler(async (req, res) => {
    const { blog_id } = req.params;
    const { skip } = req.body;
    const maxLimit = 5;
    try {
      const comments = await Comment.find({
        blog_id,
        isReply: false,
      })
        .populate(
          "commented_by",
          "personal_info.username personal_info.fullname personal_info.profile_img"
        )
        .skip(skip)
        .limit(maxLimit)
        .sort({
          commentedAt: -1,
        });
      res.json(comments);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getComment: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await Comment.findById(id);
      res.json(comment);
    } catch (error) {
      throw new Error(error);
    }
  }),

  deleteCommentCtrl: asyncHandler(async (req, res) => {
    let { _id: user_id } = req.user;
    let { _id } = req.body;

    Comment.findOne({ _id }).then(async (comment) => {
      if (
        user_id.toString() == comment.commented_by.toString() ||
        user_id.toString() == comment.blog_author.toString()
      ) {
        await deleteComments(comment._id);
        console.log(comment_arr);
        for (let child of comment_arr) {
          await Comment.findByIdAndDelete(child);
        }
        comment_arr = [];
        res.status(200).json({ status: "done" });
      } else {
        console.log(user_id.toString() == comment.commented_by.toString());

        return res.status(403).json({ error: "You can delete other comment" });
      }
    });
  }),
});
