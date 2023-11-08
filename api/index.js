var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer=require("multer");

var app = express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://admin:haITBdA2P4CXzk6c@cluster0.qegemxe.mongodb.net/?retryWrites=true&w=majority"
var DATABASE_NAME = "todoapp";
var database;

app.listen(8000, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      console.error("Error connecting to the database:", error);
    } else {
      database = client.db(DATABASE_NAME);
      console.log("MongoDB connection established");
    }
  });
});

app.get('/api/todoapp/GetNotes',(req,res)=>{
    database.collection("todoappcollection").find({}).toArray((err,result)=>{
        res.send(result);
    })
})

app.post('/api/todoapp/AddNotes',multer().none(),(req,res)=>{
    database.collection("todoappcollection").count({},function(err,numOfDocs){
        database.collection("todoappcollection").insertOne({
            id:(numOfDocs+1).toString(),
            description:req.body.newNotes
        });
        res.json("add suscess");
    })
})

app.delete('/api/todoapp/DeleteNotes',(req,res)=>{
    database.collection("todoappcollection").deleteOne({
      id:req.query.id
    });
   res.json("delete suscess");
})

app.put('/api/todoapp/UpdateNotes', multer().none(), (req, res) => {
    const updatedDescription = req.body.updatedDescription;
    const id = req.body.id;

    database.collection("todoappcollection").updateOne(
        { id: id },
        { $set: { description: updatedDescription } },
        (err, result) => {
            if (err) {
                console.error("Error updating note:", err);
                res.status(500).json({ message: "Error updating note" });
            } else {
                res.json({ message: "Note updated successfully" });
            }
        }
    );
});




