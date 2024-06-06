const Notification = require("../models/notification.model");
const asyncHandler = require("express-async-handler");

var that = (module.exports = {
  getNotificationById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const notification = await Notification.findById(id)
        .populate("blog", "title blog_id")
        .populate(
          "user",
          "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img"
        )
        .populate(
          "notification_for",
          "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img"
        )
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .select("createdAt seen type reply ");
      res.json(notification);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getNewNotifications: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { filter } = req.body;
    try {
      let findQuery = {
        notification_for: user_id,
        user: { $ne: user_id },
        seen: false,
      };
      if (filter !== "all") {
        findQuery.type = filter;
      }

      const newNotificationsCount = await Notification.countDocuments(
        findQuery
      );

      res.json({
        totalDocs: newNotificationsCount,
      });
    } catch (error) {
      throw new Error(error);
    }
  }),
  getNotifications: asyncHandler(async (req, res) => {
    const { filter, page, deletedDocCount } = req.body;
    const { _id: user_id } = req.user;
    console.log("notifications");
    try {
      let findQuery = {
        notification_for: user_id,
        user: { $ne: user_id },
      };
      if (filter !== "all") {
        findQuery.type = filter;
      }
      let maxLimit = 5;
      let skipDocs = (page - 1) * maxLimit;
      if (deletedDocCount) {
        skipDocs -= deletedDocCount;
      }
      const notifications = await Notification.find(findQuery)
        .sort({ createdAt: -1 })
        .populate("blog", "title blog_id banner")
        .populate(
          "user",
          "personal_info.username personal_info.email personal_info.fullname personal_info.profile_img"
        )
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .skip(skipDocs)
        .limit(maxLimit)
        .select("createdAt seen type reply ");

      res.json({ notifications });
    } catch (error) {
      throw new Error(error);
    }
  }),
  countNotifications: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { filter } = req.body;
    console.log("user: ", req.user);
    let findQuery = {
      notification_for: user_id,
      user: { $ne: user_id },
    };
    if (filter !== "all") {
      findQuery.type = filter;
    }

    try {
      const totalDocs = await Notification.countDocuments(findQuery);
      res.json({ totalDocs });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
  seenNotification: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      await Notification.findOneAndUpdate({ _id: id }, { seen: true });
      res.json({ success: true, message: "seen notification" });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
  deleteAllNotification: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { filter } = req.body;

    try {
      let findQuery = {
        notification_for: user_id,
        user: { $ne: user_id },
      };
      if (filter !== "all") {
        findQuery.type = filter;
      }
      const notifications = await Notification.deleteMany(findQuery);
      res.json({ message: "deleted successfully", notifications });
    } catch (error) {
      throw new Error(error);
    }
  }),
  markAsReadAll: asyncHandler(async (req, res) => {
    const { _id: user_id } = req.user;
    const { filter } = req.body;

    try {
      let findQuery = {
        notification_for: user_id,
        user: { $ne: user_id },
      };
      if (filter !== "all") {
        findQuery.type = filter;
      }
      const notifications = await Notification.updateMany(findQuery, {
        seen: true,
      });
      res.json({ notifications, message: "mark as read all" });
    } catch (error) {
      throw new Error(error);
    }
  }),
});
