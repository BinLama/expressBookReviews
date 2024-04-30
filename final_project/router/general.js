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
public_users.get('/', function (req, res) {
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
public_users.get('/title/:title', function (req, res)  {
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

  
const booklist = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(books);
    }, 10000)
})

// Get the book list available in the shop
public_users.get('/async', async (req, res) => {
  //Write your code here
  try {
    const nbooklist = await booklist; 
    return res.status(200).json(nbooklist);
  } catch (error) {
    res.status(500).json({message: "internal server error", error})
  }
});

// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  //Write your code here
    try {
        const isbn = req.params.isbn;
        const nbooklist = await booklist;
        const book = nbooklist[isbn]
        if (book) {
            return res.status(200).json({book})
        }
        return res.status(404).json({message: `book with isbn ${isbn} not found`});
      
    } catch (error) {
        res.status(500).json({message: "internal server error", error})
    }
 });
  
// Get book details based on author
public_users.get('/async/author/:author', async (req, res) => {

    try {
        const author = req.params.author;
        const nbooklist = await booklist;
        const bookKeys = Object.keys(nbooklist);
        for (let bookKey of bookKeys) {
          if (books[bookKey].author === author) {
              return res.status(200).json(books[bookKey])
          }
        }
      
        return res.status(404).json({message: "author not found"});
        
    } catch (error) {
        res.status(500).json({message: "internal server error", error: error.message})

    }
});

// Get all books based on title 
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const nbooklist = await booklist;

        const bookKeys = Object.keys(nbooklist);
        for (let bookKey of bookKeys) {
            if (books[bookKey].title === title) {
                return res.status(200).json(books[bookKey])
            }
        }
        return res.status(404).json({message: "title not found"});
    } catch (error) {
        res.status(500).json({message: "internal server error", error})
    }
});

module.exports.general = public_users;
