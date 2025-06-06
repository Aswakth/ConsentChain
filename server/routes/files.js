const express = require("express");
const router = express.Router();
const { users } = require("../models/data");
const { verifyJWT } = require("../utils/auth");

router.use(verifyJWT);

router.post("/upload", verifyJWT, (req, res) => {
  const { filename } = req.body;
  const email = req.user.email;

  if (!users[email])
    users[email] = { name: req.user.name, files: [], access: [] };
  users[email].files.push(filename);

  res.json({ message: "File uploaded!" });
});

router.post("/grant", verifyJWT, (req, res) => {
  const { toEmail } = req.body;
  const fromEmail = req.user.email;

  if (!users[fromEmail])
    return res.status(404).json({ error: "User not found" });

  users[fromEmail].access.push(toEmail);
  res.json({ message: `Access granted to ${toEmail}` });
});

router.get("/shared", verifyJWT, (req, res) => {
  const viewerEmail = req.user.email;
  const sharedFiles = [];

  for (const [ownerEmail, data] of Object.entries(users)) {
    if (data.access.includes(viewerEmail)) {
      sharedFiles.push(...data.files.map((f) => `${ownerEmail}: ${f}`));
    }
  }

  res.json({ sharedFiles });
});

module.exports = router;
