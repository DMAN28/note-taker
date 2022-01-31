// Dependencies 
const path = require('path');
const express = require('express');
const fs = require('fs');

//Path 
const db = path.join(__dirname, '/db')
const mainPath = path.join(__dirname, '/public')

//Set up Express server
const app = express();



// + Port
const PORT = process.env.PORT || 4400;


// handling parsing data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"))
////////Route


//API get request for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainPath, "./notes.html"));
});


app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(db, "db.json"))
    return res.body

})

//HTMl get request for index.html 
app.get("*", function (req, res) {
    res.sendFile(path.join(mainPath, "./index.html"));

});






//API POST
app.post('/api/notes', function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', "utf8"));
    let newNote = req.body;

    let uniqueId = (savedNotes.length).toString();
    newNote.id = uniqueId;
    savedNotes.push(newNote);


    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes))

    res.json(savedNotes);
})


app.delete('/api/notes/:id', function (req, res) {

    //read data 
    var notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    var id = req.params.id;
    var newID = 0;

    notes = notes.filter(currentNote => {

        return currentNote.id != id;
    })

    for (currentNote of notes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
    res.json(notes);
    return;

});




//Listener 
app.listen(PORT, () => {
    console.log("App port listening on PORT " + PORT);
});