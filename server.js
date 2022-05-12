const express = require('express');
const app = express();
const port = 9000;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let user;

// we need to add accesstoken and verify the same.

const verifyToken = async (token, secret) => {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, secret, (err, data) => resolve({err, data}))
    });
}

//middleware to verify accesstoken.
const auth = async (req, res, next) => {
    let authorization = req.get('authorization');
    if(!authorization) return res.sendStatus(401); //no access token found.
    let {err, data} = await verifyToken(authorization, 'accessTokenSecret');
    if(err)
        res.sendStatus(401);
    req.authData = data; // you can pass data to other routes
    next()
}

app.get("/user", async (req,res) => {
    console.log(req.authData);
    return res.send(user);
})

const userFromDB = async (email) => {
    //get user from db
    return user && user.email === email ? user : null;
}

const addUserToDB = async (newUser) => {
    //add user to db
    user = newUser;
    user.id = 1;
    return user;
}

app.post("/login", async (req, res) =>{
    let {email, pwd} = req.body;
    const password = email + pwd + "secretKey";
    const passwordHash = await bcrypt.hash(password, 12);
    let user = await userFromDB(email)
    if(user) {
         const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch) return res.sendStatus(401);
         const refreshToken = jwt.sign({id: user.id}, "refreshTokenSecret", {expiresIn: '60s'}); //you can give long time
         res.set('set-cookie', `refreshToken=${refreshToken}; Path='/user/refreshToken; HttpOnly; Max-Age=60`);
         return res.sendStatus(200);
    }else{
        let newUser = {email, password: passwordHash};
        let addedUser = await addUserToDB(newUser);
        const refreshToken = jwt.sign({id: addedUser.id}, "refreshTokenSecret", {expiresIn: '60s'}); //you can give long time
        res.set('set-cookie', `refreshToken=${refreshToken}; Path='/user/refreshToken; HttpOnly; Max-Age=60`);
        return res.sendStatus(200);
    }
})

app.use(express.static('public')); //svelte content will be served from public folder
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
app.listen(port, () => console.log(`Listeng port ${port}`));