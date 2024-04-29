const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (username === "" || password === "") {
        return res.status(400).json({message: "please provide proper credentials"})
    }

    if (isValid(username)) {
        users.push({username, password})
        return res.status(201).send("user registered")
    }
    
    res.status(404).send("user already exists")
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json({book})
  }
  return res.status(404).json({message: `book with isbn ${isbn} not found`});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const bookKeys = Object.keys(books);
  for (let bookKey of bookKeys) {
    if (books[bookKey].author === author) {
        return res.status(200).json(books[bookKey])
    }
  }

  return res.status(404).json({message: "author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const bookKeys = Object.keys(books);
    for (let bookKey of bookKeys) {
      if (books[bookKey].title === title) {
          return res.status(200).json(books[bookKey])
      }
    }
  return res.status(404).json({message: "title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json({review: book.reviews})
    }

  return res.status(404).json({message: "book not found"});
});

module.exports.general = public_users;
