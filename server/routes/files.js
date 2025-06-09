const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyJWT = require("../utils/auth");

// Apply JWT verification middleware to all routes in this router
router.use(verifyJWT);

// Upload a file for the authenticated user
router.post("/upload", async (req, res) => {
  const { filename } = req.body;
  const email = req.user.email;

  console.log("Upload request:", { filename, email });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("Upload failed: user not found for email", email);
      return res.status(404).json({ error: "User not found" });
    }

    const createdFile = await prisma.file.create({
      data: {
        name: filename,
        url: `https://your-storage.com/${filename}`, // Placeholder URL
        ownerId: user.id,
      },
    });

    console.log("File created:", createdFile);
    res.json({ message: "File uploaded!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Grant access to a specific file for a user (by email)
router.post("/grant", async (req, res) => {
  const { toEmail, fileId } = req.body;
  const fromEmail = req.user.email;

  if (!fileId) {
    return res.status(400).json({ error: "fileId is required" });
  }

  try {
    const fromUser = await prisma.user.findUnique({
      where: { email: fromEmail },
    });
    const toUser = await prisma.user.findUnique({
      where: { email: toEmail },
    });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the file belongs to the user granting access
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.ownerId !== fromUser.id) {
      return res.status(403).json({ error: "You do not own this file" });
    }

    // Check if access already granted to this user for this file
    const existingAccess = await prisma.access.findFirst({
      where: {
        fromId: fromUser.id,
        toId: toUser.id,
        fileId: fileId,
      },
    });

    if (existingAccess) {
      return res.status(400).json({ error: "Access already granted" });
    }

    await prisma.access.create({
      data: {
        fromId: fromUser.id,
        toId: toUser.id,
        fileId: fileId,
      },
    });

    res.json({ message: `Access granted to ${toEmail} for file ${file.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get files shared with the authenticated user
router.get("/shared", async (req, res) => {
  const viewerEmail = req.user.email;

  try {
    const viewer = await prisma.user.findUnique({
      where: { email: viewerEmail },
    });

    if (!viewer) {
      return res.status(404).json({ error: "User not found" });
    }

    const accesses = await prisma.access.findMany({
      where: { toId: viewer.id },
      include: {
        from: {
          include: {
            files: true,
          },
        },
        file: true,
      },
    });

    const sharedFiles = accesses.map((access) => ({
      owner: access.from.name,
      filename: access.file.name,
    }));

    res.json({ sharedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get files owned by the authenticated user
router.get("/myfiles", async (req, res) => {
  const email = req.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { files: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ files: user.files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
