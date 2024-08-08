const express = require('express');
const path = require('path');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

//const cors = require('cors')              For a distant future

const app= express()
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({
    extended: true          //To allow nested object (person:{a,b,c}, age:9 ,...)
}));



app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, 'public')));

const uri = `mongodb+srv://${process.env.usr}:${process.env.password}@${process.env.url}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true,  // Use with caution; set to false in production
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db("movie-reviews").collection("reviews");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

/* CORS options 
const corsOptions = {
    origin: 'http://localhost:5500', // Allow only requests from this origin
    methods: 'GET,POST', // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
};
*/

//The Server
const Port= process.env.PORT || 8080;
app.listen(Port,() => {
    console.log("Server is running on the Port: ",Port)
})

async function returnFilm(searchItem,num){
    const key = process.env.key;
    const apiLink = `http://www.omdbapi.com/?apikey=${key}&i=`; //ot &t=barbie&y=2023
    const poster = `http://img.omdbapi.com/?apikey=${key}&i=`;
    const search_api = `http://www.omdbapi.com?apikey=${key}&s=${searchItem}&page=${num}`;
    try {
        const response = await fetch(search_api);
        const data = await response.json();
        const results = data.Search;

        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

app.get('/',async (req,res) => {
    res.render('home');
})

app.get('/search/:item', async (req, res) => {
    const query = req.params.item;
    const pageno = 1;
    let results =null
    try{
        results = await returnFilm(query, pageno);
    }catch(error){
        console.log("Couldn't recieve info from api, cuz:", error)
    }
    res.render('results', { results: results, pageno: pageno, query: query });
});

app.get('/search/:item/:num', async (req, res) => {
    const query = req.params.item;
    const pageno = req.params.num;
    let results =null
    try{
        results = await returnFilm(query, pageno);
    }catch(error){
        console.log("Couldn't recieve info from api, cuz:", error)
    }
    res.render('results', { results: results, pageno: pageno, query: query });
});


app.get('/movies/:id', async (req, res) => {
    let item1 = null;
    let item2 = {
        "Title":"Movie Title","Year":"1000","Rated":"PG","Released":"28 May 1958","Runtime":"128 min","Genre":"Live, Laugh, Leviathon",
        "Director":"Director of Movie","Writer":"Alec Coppel, Samuel A. Taylor, Pierre Boileau","Actors":"Actor1, Actor2, Actor3",
        "Plot":"It was in one of the most open and least frequented parts of the broad Pacific that the packet of which I was supercargo fell a victim to the German sea-raider. The great war was then at its very beginning, and the ocean forces of the Hun had not completely sunk to their later degradation...   ",
        "Poster":"https://media.istockphoto.com/id/1039351052/vector/movie-and-film-festival-poster-template-design-modern-retro-vintage-style.jpg?s=612x612&w=0&k=20&c=aPVSLX7VlJj7DYBZ8afyj9ca15qoZEeZkLj_1exaUfE",
        "Ratings":[{"Source":"Internet Movie Database","Value":"8.3/10"},{"Source":"Rotten Tomatoes","Value":"92%"},{"Source":"Metacritic","Value":"100/100"}],
        "Metascore":"100","imdbRating":"8.3","imdbVotes":"429,568","imdbID":"tt0052357",
        "Type":"movie","Response":"True"
    };

    // Fetching Information from database
    try {
        const filter = { _id: req.params.id };
        const collection = await connectToDatabase();
        const item = await collection.findOne(filter);

        if (item) {
            item1 = item.revs; 
        } else {
            console.log("No document found with the specified _id.");
        }
    } catch (error) {
        console.log("Error getting info from Mongo, err:", error);
    }

    
    // Fetching info from API
    try {
        const apiLink = `http://www.omdbapi.com/?apikey=${process.env.key}&i=${req.params.id}`;
        const response = await fetch(apiLink);
        item2 = await response.json();
    } catch (error) {
        console.log('Error getting info from API, err:', error);
    }

    try {
        //res.send(item1)
        res.render('page', { item1, item2 });
    } catch (error) {
        console.log("Error rendering page:", error);
        res.status(500).send("Error rendering page: " + error.message);
    } finally {
        await client.close(); // Ensure client is closed properly
    }
});

app.post('/insert/:id', async (req,res) =>{
    const id= req.params.id;
    const usr= req.body.usr;
    const rating= req.body.rating;
    const review= req.body.review;

    const doc={
        usr:usr,
        rating: rating,
        review: review
    }

    try {
        const filter = { _id: id }; 
        const update = { $push: { revs: doc } }; 
        
        
        const collection = await connectToDatabase();
        //const result = await collection.updateOne(filter, update);
        const options = { upsert: true };

    // Perform the update or insert
        const result = await collection.updateOne(filter, update, options);

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            console.log('No document found and no new document created.');
        } else if (result.matchedCount > 0) {
            console.log('Document updated with new review.');
        } else if (result.upsertedCount > 0) {
            console.log('New document created with the review.');
        }
    } catch (err) {
        console.error('Error updating or creating document:', err);
    } finally {
        await client.close();
        res.redirect(`/movies/${id}`)
    }
})




