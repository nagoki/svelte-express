const express = require('express');
const app = express();
const port = 9000;
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let user;

app.get("/user", async (req,res) => {
    return res.send(user);
})

app.post("/login", async (req, res) =>{
    let {email, pwd} = req.body;
    user = {email, pwd}
    return res.sendStatus(200)
})

app.use(express.static('public')); //svelte content will be served from public folder
app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
app.listen(port, () => console.log(`Listeng port ${port}`));