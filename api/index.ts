import express,{Request,Response} from 'express';
import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import cors from 'cors';
import multer from 'multer';



const app = express();
app.use(cors());
const port = 8000;

const CONNECTION_STRING = "mongodb+srv://admin:haITBdA2P4CXzk6c@cluster0.qegemxe.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "todoapp";

let database: Db ;
let todoappcollection: Collection ;

app.listen(port, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      console.error("Error connecting to the database:", error);
    } else {
      database = client!.db(DATABASE_NAME);
      todoappcollection = database.collection("todoappcollection");
      console.log("MongoDB connection established");
    }
  });
});

app.use(express.json()); // Parse JSON request bodies

app.get('/api/todoapp/GetNotes', (req:Request, res:Response) => {
  if (todoappcollection) {
    todoappcollection.find({}).toArray()
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.error("Error fetching notes:", err);
        res.status(500).json({ message: "Error fetching notes" });
      });
  } else {
    res.status(500).json({ message: "Database connection not established" });
  }
});

app.post('/api/todoapp/AddNotes', (req:Request, res:Response) => {
  if (todoappcollection) {
    todoappcollection.countDocuments()
      .then(numOfDocs => {
        const newNotes = req.body.newNotes;
        return todoappcollection.insertOne({
          id: (numOfDocs + 1).toString(),
          description: newNotes
        });
      })
      .then((result: InsertOneResult) => {
        res.json("Add success");
      })
      .catch(err => {
        console.error("Error adding note:", err);
        res.status(500).json({ message: "Error adding note" });
      });
  } else {
    res.status(500).json({ message: "Database connection not established" });
  }
});

app.delete('/api/todoapp/DeleteNotes', (req:Request, res:Response) => {
  if (todoappcollection) {
    const id = req.query.id;
    todoappcollection.deleteOne({
      id
    })
      .then(() => {
        res.json("Delete success");
      })
      .catch(err => {
        console.error("Error deleting note:", err);
        res.status(500).json({ message: "Error deleting note" });
      });
  } else {
    res.status(500).json({ message: "Database connection not established" });
  }
});

app.put('/api/todoapp/UpdateNotes', (req:Request, res:Response) => {
  if (todoappcollection) {
    const updatedDescription = req.body.updatedDescription;
    const id = req.body.id;

    todoappcollection.updateOne(
      { id },
      { $set: { description: updatedDescription } }
    )
      .then(() => {
        res.json("Note updated successfully");
      })
      .catch(err => {
        console.error("Error updating note:", err);
        res.status(500).json({ message: "Error updating note" });
      });
  } else {
    res.status(500).json({ message: "Database connection not established" });
  }
});
