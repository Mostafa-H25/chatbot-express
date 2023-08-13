const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../database");

const router = express.Router();

router.use(bodyParser.json());

// Chat
// Get All
router.get("/", (req, res) => {
  // retrieve token from header
  const token = req.header.authorization;

  // check if token is active
  const isActive = pool.query(
    "Select is_active From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // token is invalid
  if (!isActive) {
    return res.status(403).json({ message: "Token is invalid." });
  }

  // get user id
  const userId = pool.query(
    "Select user_id From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // get all user chats
  const chats = pool.query(
    "Select folder_id, title, created_at From chat where user_id = ? AND is_deleted=false",
    [userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return chat array to frontend
  res.status(200).json({ chats: chats });
});

// Create Chat
router.post("/", (req, res) => {
  // retrieve data from request body
  const title = req.body.chat.title;

  // retrieve token from header
  const token = req.header.authorization;

  // check if token is active
  const isActive = pool.query(
    "Select is_active From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // token is invalid
  if (!isActive) {
    return res.status(403).json({ message: "Token is invalid." });
  }

  // get user id
  const userId = pool.query(
    "Select user_id From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // check if fields are empty
  if (!title) {
    return res.status(400).json({ message: "Title field is empty." });
  }

  // generate required chat data
  const modifiedAt = new Date();
  const createdAt = new Date();

  // save chat in db
  pool.query(
    "Insert Into folder(user_id, title, modified_at, created_at) Values(?,?,?,?)",
    [userId, title, modifiedAt, createdAt],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return to frontend that chat has been created successfully
  res.status(201).json({ message: "Chat has been created successfully." });
});

// Get Chat
router.get("/:chatId", (req, res) => {
  // get url params
  const chatId = req.params.chatId;

  // retrieve token from header
  const token = req.header.authorization;

  // check if token is active
  const isActive = pool.query(
    "Select is_active From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // token is invalid
  if (!isActive) {
    return res.status(403).json({ message: "Token is invalid." });
  }

  // get user id
  const userId = pool.query(
    "Select user_id From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // get user folder
  const chat = pool.query(
    "Select * From chat where chat_id = ? AND user_id = ? AND is_deleted=false",
    [chatId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return chat to frontend
  res.status(200).json({ chat: chat });
});

// Update Chat
router.put("/:chatId", (req, res) => {
  // get url params
  const chatId = req.params.chatId;

  // get url body
  const title = req.body.chat.title;
  const folderId = req.body.chat.folderId;
  if (!folderId) folderId = null;

  // retrieve token from header
  const token = req.header.authorization;

  // check if token is active
  const isActive = pool.query(
    "Select is_active From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // token is invalid
  if (!isActive) {
    return res.status(403).json({ message: "Token is invalid." });
  }

  // get user id
  const userId = pool.query(
    "Select user_id From token where token= ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // update chat title
  pool.query(
    "Update chat Set title=?, folder_id=? where chat_id=? AND user_id = ? AND is_deleted=false",
    [title, folderId, chatId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return to frontend that chat has been edited
  res.status(200).json({ message: "Chat has been updated." });
});

// Delete Chat
router.delete("/:chatId", (req, res) => {
  // get url params
  const chatId = req.params.chatId;

  // retrieve token from header
  const token = req.header.authorization;

  // check if token is active
  const isActive = pool.query(
    "Select is_active From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // token is invalid
  if (!isActive) {
    return res.status(403).json({ message: "Token is invalid." });
  }

  // get user id
  const userId = pool.query(
    "Select user_id From token where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // set chat as deleted
  pool.query(
    "Update chat Set is_deleted=true where chat_id=? AND user_id = ?",
    [chatId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return that the chat has been deleted
  res.status(200).json({ message: "Chat is deleted successfully." });
});

module.exports = router;
