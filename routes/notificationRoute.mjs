import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";
import { protectUser, requireAdmin } from "../middlewares/protect.mjs";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const notificationRouter = Router();

// Get all notifications
notificationRouter.get("/", protectUser, requireAdmin, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const result = await connectionPool.query(
        `
        SELECT *
        FROM notifications
        WHERE recipient_id = $1
        ORDER BY created_at DESC
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
notificationRouter.patch("/mark-as-read/:id", protectUser, requireAdmin, async (req, res) => {
    try {
        const notificationId = req.params.id;

        const query = `
            UPDATE notifications
            SET is_read = true
            WHERE id = $1
            RETURNING *
        `;
        const values = [notificationId];
        const { rows } = await connectionPool.query(query, values);
        res.status(200).json({ message: "Marked as read", notification: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default notificationRouter;