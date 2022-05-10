const express = require('express');
const app = express();
const port = 9000;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jwt');
const cookie = require('cookie');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let user;

app.get("/user", async (req,res) => {
    return res.send(user);
})

const userFromDB = async (email) => {
    //get user from db
    return user && user.email === email ? user : null;
}

app.post("/login", async (req, res) =>{
    let {email, pwd} = req.body;
    const password = email + pwd + "secretKey";
    const passwordHash = await bcrypt.hash(password, 12);
    let user = await userFromDB(email)
    if(user) {
         
    }else{
        let newUser = {email, password: passwordHash};
        let addedUser = await addUserToDB(newUser);
    }
    return res.sendStatus(200)
})

app.use(express.static('public')); //svelte content will be served from public folder
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
app.listen(port, () => console.log(`Listeng port ${port}`));