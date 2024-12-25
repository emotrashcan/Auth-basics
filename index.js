const express = require('express');
const app = express();
const User = require('./models/user.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


mongoose.connect('mongodb://localhost:27017/auth', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!");
        console.log(err);
    });


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({secret : 'notagood'}));

app.get('/register', (req, res) => {
    res.render('register');
})

app.use(express.urlencoded({extended: true}));

app.post('/register', async (req, res) =>{
    const {username, password} = req.body;
   const hash = await bcrypt.hash(password, 12);
   const user = new User({
    username,
    password: hash
   })
   await user.save();
   req.session.user_id = user._id;
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.send("this is the homepage")
})

app.get('/secret', (req, res) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
res.render('secret');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username: username});
    const validpass = await bcrypt.compare(password, user.password);
    if(validpass){
        req.session.user_id = user._id;
        res.redirect('/secret');
     }
else{
    res.redirect('/');
}
});

app.post('/logout', (req, res) => {
     req.session.destroy();
     res.redirect('/login');
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
})