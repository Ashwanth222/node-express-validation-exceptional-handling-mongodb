var express = require('express'), // Call express
    app = express(), // Define our app using express
    port = process.env.PORT || 3000, // Set the port
    dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/tasksdb',
    mongoose = require('mongoose'), // Call mongoose to interact with a MongoDB(Database) instance
    Task = require('./api/models/tasksModel'), // Created model loading here
    bodyParser = require('body-parser'); //Middleware to process incoming request body objects
const axios = require('axios');
// Mongoose instance connection url connection
mongoose.Promise = global.Promise;

mongoose.connect(dbUrl); 

/* Configure app to use bodyParser()
   this will let us get the data from a POST */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Importing route
var routes = require('./api/routes/tasksRoutes'); 

//Register the route
routes(app); 

// Start the server
app.listen(port);
console.log('RESTful API demo server started on: ' + `http://localhost:${port}/`);

// Get an instance of the express Router
var router = express.Router();

// Health route to make sure everything is working (accessed at GET http://localhost:3000/health)
app.use('/health', require('express-healthcheck')({
  healthy: function () {
      return { message: 'ExpressJS web service is up and running' };
  }
}));

app.get("/axios/getAll", (req, res, next) => {
  console.log("'/test' call");
  axios.get("http://localhost:8084/reviews")
  .then(response => res.json(response.data))
     .catch(err => res.secn(err));
})


app.post("/axios/create", (req, res, next) => {
  console.log("'/test' call");
  axios.post('http://localhost:8084/reviews', req.body)
  .then(response => res.json(response.data))
  .catch(function (error) {
    console.log(error);
  });
})

app.put("/axios/update/:id", async (req, res, next) => {
  try{
  let postId = req.params.id;
  axios.put('http://localhost:8084/reviews'+ "/" + postId, req.body)
  .then(response => res.json(response.data))
  .res.status(200).json({ data: response.data });
}catch (err) {
    console.log(err);
    //res.status(500).json({ msg: "request id is not present" });
  }
});

app.get("/axios/:id", async (req, res) => {
  try {
    let postId = req.params.id;
    console.log("Making axios call with post id= " + postId);
    const response = await axios.get('http://localhost:8084/reviews' + "/" + postId);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something bad has occurred." });
  }
});

app.delete("/axios/:id", async (req, res) => {
  try {
    let postId = req.params.id;
    console.log("Making axios call with post id= " + postId);
    const response = await axios.delete('http://localhost:8084/reviews' + "/" + postId);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something bad has occurred." });
  }
});

// All of our routes will be prefixed with /api
app.use('/api', router);

// Returning response with 404 when incorrect url is requested 
app.use(function(req, res) {
  res.status(404).send({ error: { errors: [ { domain: 'global', reason: 'notFound', message: 'Not Found', 
                        description: 'Couldn\'t find the requested resource \'' + req.originalUrl + '\'' } ], code: 404, message: 'Not Found' } })
});