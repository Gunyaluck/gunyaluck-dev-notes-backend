import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { protectUser } from "../middlewares/protect.mjs";

const notificationRouter = Router();

// Get all notifications for current user (admin: like/comment on their posts; user: new article)
notificationRouter.get("/", protectUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await connectionPool.query(
        `
        SELECT n.id, n.recipient_id, n.actor_id, n.type, n.post_id, n.comment_id, n.is_read, n.created_at,
               u.name AS actor_name, u.profile_pic AS actor_avatar
        FROM notifications n
        LEFT JOIN users u ON u.id = n.actor_id
        WHERE n.recipient_id = $1
        ORDER BY n.created_at DESC
        `,
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Mark as read notification
notificationRouter.patch("/mark-as-read/:id", protectUser, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        const query = `
            UPDATE notifications
            SET is_read = true
            WHERE id = $1 AND recipient_id = $2
            RETURNING *
        `;
        const values = [notificationId, userId];
        const { rows } = await connectionPool.query(query, values);
        res.status(200).json({ message: "Marked as read", notification: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default notificationRouter;