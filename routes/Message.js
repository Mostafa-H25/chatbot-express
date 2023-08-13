const express = require("express");
const bodyParser = require("body-parser");
const pool = require("../database");

const router = express.Router();

router.use(bodyParser.json());

// Message
// Get All
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

  // get all chat Messages
  const messages = pool.query(
    "Select request_content, request_created_at, response_content, response_created_at From message where user_id = ? AND chat_id=? AND is_deleted=false",
    [userId, chatId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return messages array to frontend
  res.status(200).json({ messages: messages });
});

// Create Message
router.post("/:chatId", (req, res) => {
  // get url params
  const chatId = req.params.chatId;

  // retrieve data from request body
  const requestContent = req.body.message.requestContent;

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
  if (!requestContent) {
    return res.status(400).json({ message: "Message field is empty." });
  }

  // generate required message data
  const requestCreatedAt = new Date();
  const responseContent = "AI Response";
  const responseCreatedAt = new Date();

  // save chat in db
  pool.query(
    "Insert Into folder(user_id, chat_id, request_content, request_created_at, response_content, response_created_at) Values(?,?,?,?,?,?)",
    [
      userId,
      chatId,
      requestContent,
      requestCreatedAt,
      responseContent,
      responseCreatedAt,
    ],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  //  return to frontend that message has been created successfully
  res.status(201).json({ message: "Message has been created successfully." });
});

// Get Message
router.get("/:messageId", (req, res) => {
  // get url params
  const messageId = req.params.messageId;

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

  // get user message
  const message = pool.query(
    "Select * From prompt where message_id=? user_id = ? & is_deleted=false",
    [messageId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );
  // return message to frontend
  res.status(200).json({ message: message });
});

// Update Message
// router.put("/:messageId", (req, res) => {
//   // get url params
//   const messageId = req.params.messageId;

//   // retrieve token from header
//   const token = req.header.authorization;

//   // check if token is active
//   const isActive = pool.query(
//     "Select is_active From token where token = ?",
//     [token],
//     (err, result, fields) => {
//       if (err) {
//         return console.log(err);
//       }
//       return result;
//     }
//   );

//   // token is invalid
//   if (!isActive) {
//     return res.status(403).json({ message: "Token is invalid." });
//   }

//   // get user id
//   const userId = pool.query(
//     "Select user_id From token where token= ?",
//     [token],
//     (err, result, fields) => {
//       if (err) {
//         return console.log(err);
//       }
//       return result;
//     }
//   );

//   // update prompt data
//   pool.query(
//     "Update prompt Set title=?, folder_id=?, description=?, prompt=? where prompt_id=? user_id = ? & is_deleted=false",
//     [title, folderId, description, prompt, chatId, userId],
//     (err, result, fields) => {
//       if (err) {
//         return console.log(err);
//       }
//       return result;
//     }
//   );

//   // return to frontend that prompt has been edited
//   res.status(200).json({ message: "Prompt has been updated." });
// });

// Delete Message
router.delete("/:messageId", (req, res) => {
  // get url params
  const messageId = req.params.messageId;

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

  // set message as deleted
  pool.query(
    "Update message Set is_deleted=true where message_id=? user_id = ?",
    [messageId, userId],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // return that the message has been deleted
  res.status(200).json({ message: "Message is deleted successfully." });
});

module.exports = router;
