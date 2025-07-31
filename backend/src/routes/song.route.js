const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songModel = require("../models/song.model");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

//Sending Request from Frontend to backend...

router.post("/songs", upload.single("audio"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const fileData = await uploadFile(req.file);
  console.log(fileData);

  //  Creating Song...

  const song = await songModel.create({
    title: req.body.title,
    artist: req.body.artist,
    audio: fileData.url,
    mood: req.body.mood,
  });
  console.log(song.audio);

  // After song is saved
  const savedSong = await songModel.findById(song._id);
  console.log("Saved in MongoDB:", savedSong.audio);

  res.status(201).json({
    message: "Song Created succesfully...",
    song: song,
  });
});

// Sending Request from Backend to frontend...
router.get("/songs", async (req, res) => {
  const { mood } = req.query;

  const songs = await songModel.find({
    mood: { $regex: new RegExp(`^${mood}$`, "i") }, // case-insensitive match
  });

  res.status(200).json({
    message: "Songs Fetched  Succsefully...",
    songs,
  });
});

module.exports = router;
