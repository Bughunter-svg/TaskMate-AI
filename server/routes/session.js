const express = require("express");
const router = express.Router();

const { loadUserData, saveUserData } = require("../config/googleDrive");
const { getUser, setUser } = require("../store/userStore");

/* Load user into memory */
router.post("/start", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  let user = getUser(userId);

  if (!user) {
    user = await loadUserData(userId);
    setUser(userId, user);
  }

  res.json({ success: true, user });
});

/* Force save to Drive */
router.post("/save", async (req, res) => {
  const { userId } = req.body;
  const user = getUser(userId);

  if (!user) {
    return res.status(404).json({ error: "User not loaded" });
  }

  await saveUserData(userId, user);
  res.json({ success: true });
});

module.exports = router;
