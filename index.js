const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./database");

const authenticationRoute = require("./routes/Authentication");
const folderRoute = require("./routes/Folder");
const chatRoute = require("./routes/Chat");
const promptRoute = require("./routes/Prompt");
const messageRoute = require("./routes/Message");

const app = express();

app.use(bodyParser.json());
app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .send({ message: err.message, stack: err.stack });
});
app.use("/api/authentication", authenticationRoute);
app.use("/api/folder", folderRoute);
app.use("/api/chat", chatRoute);
app.use("/api/prompt", promptRoute);
app.use("/api/message", messageRoute);

// Home Page
app.get("/", (req, res) => {
  // check if user is authorized
  if (!req.header.authorization) {
    // if user is not authorized redirect to sign-in page
    return res.redirect("/sign-in");
  }

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

  // user authorized
  // get all user data
  // get all user chats
  const chats = pool.query(
    "Select folder_id, title, created_at From chat where user_id = ? & is_deleted=false",
    [userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // get all user prompts
  const prompts = pool.query(
    "Select folder_id, title, created_at From prompt where user_id = ? & is_deleted=false",
    [userId],
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

  //  send user data to frontend
  res.status(200).json({ chats: chats, prompts: prompts, folders: folders });
});

// Page Endpoint Not Found
app.all("*", (req, res) => {
  res.status(400).send("Error Page");
});

// initialize server
app.listen(4200, () => {
  console.log("server is listening on port 4200...");
});
