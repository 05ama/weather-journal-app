// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
//Express >= 4.16.0, body parser has been re-added under the methods express.json() and express.urlencoded()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port,()=>{console.log("server is running");
                                    console.log(`localhost: ${port}`);});
//Routes

//a GET route that returns the projectData object 
app.get('/all',function(req,res){
    console.log("server get");
    res.send(projectData);
})

//a POST route that adds incoming data to projectData
app.post('/add',function(req,res){
    console.log("server");
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;
    console.log(projectData);
})
