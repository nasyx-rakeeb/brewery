import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
//const port = 3000; // Choose a port for your server
import hbs from "hbs";
import path from "path";
const __dirname = path.resolve();
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import LogInCollection from "./mongodb.js";
import ReviewCollection from "./review.js";
import {engine} from 'express-handlebars';
import bodyParser from "body-parser";
//const uri = "mongodb+srv://sutirthasen:obito123@cluster0.yx7nmz5.mongodb.net/?retryWrites=true&w=majority";
var uri = process.env.MONGODB_URI;
var port = process.env.PORT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const __dir = path.dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//node version 16.17.1
const tempelatePath = path.join(__dir, '../templates')
const publicPath = path.join(__dir, '../public')
//console.log(publicPath);

app.engine('hbs', engine(
    {defaultLayout:false}
));
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/review', (req, res) => {
    res.render('review')
})




app.get('/fetching', async(req, res) => {
    let userdata, temp

    await fetch('https://api.openbrewerydb.org/v1/breweries')
        .then(response => {

           return response.json(); // Parse the response as JSON
        })
        .then(data => {
             userdata = data.map( tag => {
                return {
                    name: tag.name,
                    address: tag.address_1,
                    phone: tag.phone,
                    website: tag.website_url,
                    state: tag.state_province,
                    city: tag.city
        
                }
            })
             temp = userdata;
            //console.log(temp); // Handle the data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    //console.log(temp)
    res.status(201).render("home",{temp})
})


app.get('/demo', (req, res) => {
    res.render('search')
})

app.post("/fetching2", async(req, res) => {
    console.log(req.body)
    let userdata, temp
    var name = req.body.name
    let city = req.body.city
    var type = req.body.type
    
    var ans;
    var url1 = "https://api.openbrewerydb.org/v1/breweries"+"?by_city="+ city
    var url2 = "https://api.openbrewerydb.org/v1/breweries"+"?by_name="+ name
    var url3 = "https://api.openbrewerydb.org/v1/breweries"+"?by_type="+ type
    var url4 = "https://api.openbrewerydb.org/v1/breweries"

    if(name === "" && type === ""){
        ans= url1
    }else if(city === "" && type === ""){
        ans = url2
    }else if(city === "" && type === "" && name === ""){
        ans = url4
    }else{
        ans = url3
    }


    await fetch(ans)
        .then(response => {

           return response.json(); // Parse the response as JSON
        })
        .then(data => {
             userdata = data.map( tag => {
                return {
                    name: tag.name,
                    address: tag.address_1,
                    phone: tag.phone,
                    website: tag.website_url,
                    state: tag.state_province,
                    city: tag.city
        
                }
            })
             temp = userdata;
            //console.log(temp); // Handle the data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    //console.log(temp)
    res.status(201).render("home",{temp})
})

app.post('/reviewdetails', async(req, res) => {
    try {

        var data = req.body;
        //console.log(data)
        const response = await ReviewCollection.create(data)
        //console.log(response)

        let review = await ReviewCollection.find({name: req.body.name }).lean()
        //console.log(review)
        
        res.status(201).render("showreview", {review})

    } 
    
    catch (e) {

        res.send("wrong details")
        

    }
})


app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        name: req.body.name,
        password: req.body.password
    }

   
        const okk = await LogInCollection.insertMany([data])
        console.log(okk)
    
  
    res.status(201).render("login", {
        naming: req.body.name
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("search", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  mongoose.connect(uri)
  //mongoose.connect("mongodb://localhost:27017/brewery")
.then(() =>{
    console.log("mongodb connected")
})
.catch(() => {
    console.log("failed to connect")
})
});