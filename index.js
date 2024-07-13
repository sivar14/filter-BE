const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');



const app = express();
app.use(express.json());
const port = 8000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);


//display all users
app.get("/Getusers", (req, res) => {
    return res.json(users);
});

//delete users
app.delete("/Deleteusers/:id", (req, res) => {

    let {id} = req.params;
    let filteredUsrs = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsrs), (err, data) => {
        return res.json(filteredUsrs);
    });

    
});

// add users

app.post("/Addusers", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        res.status(400).send({ message: "all fields required" });
    }


    users.push({ name, age, city, id: uuidv4() });

    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "added successfully" });
    });
});


//update

app.put("/users/:id", (req, res) => {
    let {id }=req.params;
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        res.status(400).send({ message: "all fields required" });
    }
    let index = users.findIndex((user) => user.id == id);
    users.splice(index, 1, { ...req.body });

    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "updated successfully" });
    });
});




app.listen(port, () => {
    console.log(`app is runnig on port :${port}`)
});