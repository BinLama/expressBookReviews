const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

    const found = users.filter((user) => user.username === username);
    if (found.length === 0) {
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const exist = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    if (exist.length > 0) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(404).json({message: "Please provide proper credentials"})
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: username
        }, "secret", {expiresIn: 60 * 60})

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("user successfully logged in");
    } else {
        res.status(208).json({message: "Invalid login. Check username and password"})
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const user = req.user;
  const review = req.query.review;
  console.log(user, isbn);

  const book = books[isbn];
  if (book) {
    book.reviews[user.data] = review;
    return res.status(201).json({book})
  }
  return res.status(404).json({message: "book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.user;
    const book = books[isbn];

    if (book) {
        delete book.reviews[user.data]
        return res.status(200).json({book})
    }
    return res.status(404).json({message: "book not found"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
