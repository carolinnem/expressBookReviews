const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;

  if(username && password)
  {
    if(isValid(username))
    {
      users.push({"username":username,"password":password});
      
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else
    {
      return res.status(402).json({message: "Username already exists"});
    }
  }
  else{
    return res.status(402).json({message: "All fields are required"});
  }
});

// Get the book list available in the shop
function getBooks() {
  const getBooksDB = new Promise((resolve, reject) => {
      try {
        const data = JSON.stringify({books}, null, 4)
        resolve(data);
      } catch (err) {
        reject(err);
      }
    })
  return getBooksDB;
}

public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = await getBooks();
    return res.send(getAllBooks);

  } catch (error) {
    return res.status(500).send('Internal Server Error: ' + error);

  }
  
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const getBooksISBN = new Promise((resolve, reject) => {
    try {
      const dataISBN = books[req.params.isbn]
      resolve(res.send(dataISBN));
    } catch (errISBN) {
      reject(res.send(errISBN));
    }
  })
  return getBooksISBN;
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const getBooksAuthor = new Promise((resolve, reject) => {
    try {
      const dataAuthor = [];
      Object.keys(books).forEach(function(key, value){
        if (books[key].author == req.params.author) {
          dataAuthor.push(books[key]);
        }
      });
      resolve(res.send(dataAuthor));
    } catch (errAuthor) {
      reject(res.send(errAuthor));
    }
  })
  return getBooksAuthor;
});


// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const getBooksTitle = new Promise((resolve, reject) => {
    try {
      const dataTitle = [];
      Object.keys(books).forEach(function(key, value){
        if (books[key].title == req.params.title) {
          dataTitle.push(books[key]);
        }
      });
      resolve(res.send(dataTitle));
    } catch (errTitle) {
      reject(res.send(errTitle));
    }
  })
  return getBooksTitle;

});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  return res.send(books[parseInt(req.params.isbn)]["reviews"]);
});

module.exports.general = public_users;
