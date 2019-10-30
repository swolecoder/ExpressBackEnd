const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const Todo = require("./model/todo");
require("./db/db");
const routes = express.Router();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use("/todos", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", routes);

app.get("/", function(req, res) {
  res.send("Hello World");
});

//get all lists
routes.route("/").get((req, res) => {
  Todo.find((err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.json(items);
    }
  });
});

routes.route("/:id").get((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});

//add to list
routes.route("/add").post((req, res) => {
  let todo = new Todo(req.body);
  todo
    .save()
    .then(() => {
      res.status(200).json("Todo data saved in the database");
    })
    .catch(err => {
      res.status(400).send(`Saving to the databse failed ${err}`);
    });
});

//update todo
routes.route("/:id").put((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) {
      res.status(400).send(`Saving to the databse failed ${err}`);
    } else {
      todo.isCompleted = !req.body.isCompleted;
      todo
        .save()
        .then(() => {
          res.status(200).json("Todo data saved in the database");
        })
        .catch(err => {
          res.status(400).send(`Saving to the databse failed ${err}`);
        });
    }
  });
});

//remove from list
routes.route("/:id").delete((req, res) => {
  Todo.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) {
      res.status(400).send(`Saving to the databse failled ${err}`);
    } else {
      todo
        .save()
        .then(() => {
          res.status(200).json("Todo succesfully deleted to Database");
        })
        .catch(err => {
          res.status(400).send(`Saving to the databse failed ${err}`);
        });
    }
  });
});

app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});
