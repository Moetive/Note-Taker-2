const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const util = require('util');
router.get('/notes', (req, res) => {
    console.log('running');
    readFileAsync('./db/db.json', 'utf8')
    .then(notes => {
        console.log(notes);
        return res.json(JSON.parse(notes))
    });
})

router.post('/notes', (req,res) => {
    console.log(req.body);
    

    const newNote = req.body
    newNote.id = uuidv4();
//    defining the new notes to req.body
    readFileAsync('./db/db.json', 'utf8')
    .then(notes => {
        console.log('notes inside post route', notes);
        const parseNotes = JSON.parse(notes);
        console.log(typeof parseNotes);
         // Feteches from notes array
               parseNotes.push(newNote);
        console.log("parseNotes with new note: ", parseNotes);
         // Adds new notes to the array
    
        writeFileAsync('./db/db.json', JSON.stringify(parseNotes, null, 2));
    })    
    return res.send(newNote)
        // writes to the db.json and returns 
})
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

router.delete('/notes/:id', (req,res) => {
    console.log("req.params:", req.params);

    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("notesArray", JSON.parse(data));
            const notesArray = JSON.parse(data);

            const filteredArray = notesArray.filter(item => item.id != req.params.id);

            fs.writeFile("./db/db.json", JSON.stringify(filteredArray, null, 2), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(filteredArray);
                }
            })
        }
    } ) 
})

module.exports = router;