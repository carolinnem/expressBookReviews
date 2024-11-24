const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return !(userswithsamename.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in as " + req.session.authorization.username);
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const reviewText = req.query.reviewText
  const isbn = req.params.isbn;


  if (!username){
      res.status(401).send('User not logged in!')
  }

  if (!reviewText){
      res.send('Please fill in the required form')
  }

  if (books[isbn]){
      if (books[isbn].reviews[username]){
          books[isbn].reviews[username] = reviewText
          res.send('Review modified!')
      }
      else {
          books[isbn].reviews[username] = reviewText
          res.send('Review added!')
      }
  }
  else {
      res.status(404).send('Book not found')
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  if (!username){
      res.status(401).send('User not logged in!')
  }

  if (books[isbn]){
      if (books[isbn].reviews[username]){
          delete books[isbn].reviews[username]
          res.send('Review deleted!')
      }
      else {
          res.send('You have not reviewed this book')
      }
  }
  else {
      res.status(404).send('Book not found')
  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
