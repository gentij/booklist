const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { createJWT } = require('../utils/auth');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.register = (req, res, next) => {
    let { name, username, email, password, password_confirmation } = req.body;

    //validation
    let errors = [];
    if(!username) {
        errors.push({ username: 'required'})
    }
    if (!name) {
        errors.push({ name: "required" });
    }
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!password_confirmation) {
        errors.push({
        password_confirmation: "required",
        });
    }
    if (password != password_confirmation) {
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({username: username})
    .then(user => {
        if(user) {
            return res.status(422).json({errors: [{user: "user already exists"}]});
        } else {
            const user = new User({
                name,
                username,
                email,
                password
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    user.password = hash;
                    user.save()
                        .then(response => {
                            res.status(200).json({
                                success: true,
                                result: response
                            })
                        })
                        .catch(err => {
                            res.status(500).json({errors: [{error: err}]});
                        })
                })
            }) 
        }
    }).catch(err => {
        res.status(500).json({errors: [{errors: 'Something went wrong'}]})
    })
}

exports.login = (req, res) => {
    let { username, password } = req.body;

    let errors = [];
    if (!username) {
      errors.push({ username: "required" });
    }
    if (!password) {
      errors.push({ password: "required" });
    }
    if (errors.length > 0) {
     return res.status(422).json({ errors: errors });
    }

    User.findOne({ username: username }).then(user => {
       if (!user) {
         return res.status(404).json({
           errors: [{ user: "user not found" }],
         });
       } else {
          bcrypt.compare(password, user.password).then(isMatch => {
             if (!isMatch) {
              return res.status(400).json({ errors: [{ password: "incorrect" }] 
              });
            }
      let access_token = createJWT(
         user.username,
         user._id,
         3600
      );
      jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
           res.status(500).json({ errors: err });
        }
        if (decoded) {
            return res.status(200).json({
               success: true,
               token: access_token,
               message: user
            });
          }
        });
       }).catch(err => {
         res.status(500).json({ errors: err });
       });
     }
  }).catch(err => {
     res.status(500).json({ errors: err });
  });
}