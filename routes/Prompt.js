const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../database");

const router = express.Router();

router.use(bodyParser.json());

// Prompt
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

  // get all user prompts
  const prompts = pool.query(
    "Select folder_id, title, created_at From prompt where user_id = ? AND is_deleted=false",
    [userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return prompt array to frontend
  res.status(200).json({ prompts: prompts });
});

// Create Prompt
router.post("/", (req, res) => {
  // retrieve data from request body
  const title = req.body.prompt.title;

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

  // generate required prompt data
  const createdAt = new Date();

  // save chat in db
  pool.query(
    "Insert Into folder(user_id, title, created_at) Values(?,?,?)",
    [userId, title, createdAt],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return to frontend that prompt has been created successfully
  res.status(201).json({ message: "Prompt has been created successfully." });
});

// Get Prompt
router.get("/:promptId", (req, res) => {
  // get url params
  const promptId = req.params.promptId;

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

  // get user prompt
  const prompt = pool.query(
    "Select * From prompt where prompt_id=? AND user_id = ? AND is_deleted=false",
    [chatId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return prompt to frontend
  res.status(200).json({ prompt: prompt });
});

// Update Prompt
router.put("/:promptId", (req, res) => {
  // get url params
  const promptId = req.params.promptId;

  // get url body
  const title = req.body.prompt.title;
  const folderId = req.body.prompt.folderId;
  if (!folderId) folderId = null;
  const description = req.body.prompt.folderId;
  const prompt = req.body.prompt.folderId;

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

  // update prompt data
  pool.query(
    "Update prompt Set title=?, folder_id=?, description=?, prompt=? where prompt_id=? AND user_id = ? AND is_deleted=false",
    [title, folderId, description, prompt, chatId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return to frontend that prompt has been edited
  res.status(200).json({ message: "Prompt has been updated." });
});

// Delete Prompt
router.delete("/:promptId", (req, res) => {
  // get url params
  const promptId = req.params.promptId;

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

  // set prompt as deleted
  pool.query(
    "Update prompt Set is_deleted=true where prompt_id=? AND user_id = ?",
    [promptId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return that the prompt has been deleted
  res.status(200).json({ message: "Prompt is deleted successfully." });
});

module.exports = router;
