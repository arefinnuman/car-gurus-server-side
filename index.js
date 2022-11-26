const port = process.env.PORT || 5000;

require("dotenv").config();
require("colors");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmm92lc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const carsCollection = client.db("carGurusDb").collection("carsCollection");
    const bookingCollection = client
      .db("carGurusDb")
      .collection("bookingCollection");
    const usersCollection = client
      .db("carGurusDb")
      .collection("usersCollection");

    app.post("/sell-car", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);
      console.log(result);
      res.send(result);
    });

    app.get("/buy-cars", async (req, res) => {
      const cars = await carsCollection.find({}).toArray();
      res.send(cars);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      // const decodedEmail = req.decoded.email;
      // if (email !== decodedEmail) {
      //   return res.send(403).send({ message: "Forbidden Access" });
      // }
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    // Getting specific Booking
    // app.get("/bookings/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const booking = await bookingCollection.findOne(query);
    //   res.send(booking);
    // });
  } catch (err) {
    console.log(err);
  } finally {
  }
};
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server is running".cyan, `on port ${port}`.yellow);
});
