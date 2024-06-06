const express = require("express");
const {
  getNotifications,
  getNotificationById,
  countNotifications,
  getNewNotifications,
  seenNotification,
  deleteAllNotification,
  markAsReadAll,
} = require("../controllers/notification.controller");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();
router.post("/count-notifications", authMiddleware, countNotifications);
router.post("/new-notifications", authMiddleware, getNewNotifications);

router.post("/delete-all", authMiddleware, deleteAllNotification);
router.post("/mark-as-read", authMiddleware, markAsReadAll);
router.post("/", authMiddleware, getNotifications);

router.get("/:id", authMiddleware, getNotificationById);
router.put("/:id", authMiddleware, seenNotification);

module.exports = router;
