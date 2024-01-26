const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");
const logger = require("./logger");

const app = express();

app.use(express.static("public"));
app.use(logger);
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((err, req, res, next) => {
  console.log("Error: ", err);
  res.status(500).send("An error occurred, please try again later.");
});

connectToDb()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("Error starting server: ", err);
  });

const updateLesson = (lessonId, spaces) => {
  const db = getDb();
  const collection = db.collection("lesson");

  collection.findOneAndUpdate(
    { _id: ObjectId(lessonId) },
    { $inc: { spaces: -spaces } },
    (err, result) => {
      if (err) throw err;
    }
  );
};

app.get("/lessons", async (req, res, next) => {
  try {
    const searchText = req.query.search
    let query = {}

    if (searchText) {
      query = {
        $or: [
          { subject: { $regex: searchText, $options: 'i' } },
          { location: { $regex: searchText, $options: 'i' } }
        ]
      }
    }

    const db = getDb();
    const collection = db.collection("lesson");
    console.log("taking timeeee", db)

    const items = await collection.find(query).toArray();
    
    res.send(items);
  } catch (err) {
    next(err);
  }
});
app.post("/orders", async (req, res, next) => {
  try {
    const order = req.body;

    const db = getDb();
    const collection = db.collection("order");

    const result = await collection.insertOne(order);

    // Assuming order.lesson_id and order.spaces are part of the request body
    // If not, adjust accordingly

    // Example: Assuming order.lesson_id and order.spaces are part of the request body
    // const lesson_id = req.body.lesson_id;
    // const spaces = req.body.spaces;

    // Update the lesson (ensure to handle this asynchronously)
    // await updateLesson(lesson_id, spaces);

    res.json(result);
  } catch (err) {
    next(err);
  }
});
app.put("/lessons/:id", (req, res) => {
  const lessonId = req.params.id;
  const spaces = req.body.spaces;

  updateLesson(lessonId, spaces);

  res.send("Lesson updated successfully");
});