const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../database");

const router = express.Router();

router.use(bodyParser.json());

// Folder
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

  // get all user folders
  const folders = pool.query(
    "Select * From folder where user_id = ? & is_deleted=false",
    [userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return folder array to frontend
  res.status(200).json({ folders: folders });
});

// Create Folder
router.post("/", (req, res) => {
  // retrieve data from request body
  const title = req.body.folder.title;
  const type = req.body.folder.type;

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
  if (!title || !type) {
    return res.status(400).json({ message: "Required fields are empty." });
  }

  // generate required folder data
  const createdAt = new Date();

  // save folder in db
  pool.query(
    "Insert Into folder(user_id, title, type, created_At) Values(?,?,?,?)",
    [userId, title, type, createdAt],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return to frontend that folder has been created successfully
  res.status(201).json({ message: "Folder has been created successfully." });
});

// Get Folder
router.get("/:folderId", (req, res) => {
  // get url params
  const folderId = req.params.folderId;

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
  const folder = pool.query(
    "Select * From folder where folder_id=? user_id = ? & is_deleted=false",
    [folderId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return folder to frontend
  res.status(200).json({ folder: folder });
});

// Update Folder
router.put("/:folderId", (req, res) => {
  // get url params
  const folderId = req.params.folderId;

  // get url body
  const title = req.body.folder.title;

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

  // update folder title
  pool.query(
    "Update folder Set title=? where folder_id=? user_id = ? & is_deleted=false",
    [title, folderId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return to frontend that folder title has been edited
  res.status(200).json({ message: "Folder Title has been updated." });
});

// Delete Folder
router.delete("/:folderId", (req, res) => {
  // get url params
  const folderId = req.params.folderId;

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

  // set folder as deleted
  pool.query(
    "Update folder Set is_deleted=true where folder_id=? user_id = ?",
    [folderId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return that the folder has been deleted
  res.status(200).json({ message: "Folder is deleted successfully." });
});

module.exports = router;
