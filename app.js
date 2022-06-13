require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname+'/views/partials')
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //Para acceder al archivo .env
    clientSecret: process.env.CLIENT_SECRET //Para acceder al archivo .env
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/',(req,res,next)=>{
    res.render('home')
})
app.get('/artist-search',(req,res,next)=>{
    //console.log(req.query,'Si llegamos')
    const {search} = req.query
    spotifyApi
    .searchArtists(search)
    .then((data)=>{
        //console.log('El resivo de API', data.body.artists.items)
        res.render('artist-search-results',{albums:data.body.artists.items})
    })
    .catch((err)=>{
        console.log('Ha salido un error',err)
    })
})
app.get('/albums/:id',(req,res,next)=>{
    const {id}=req.params;
    console.log('Si se tiene el: ', id);
    spotifyApi.getArtistAlbums(id)
    .then(function(data) {
    console.log('Artist albums', data.body.items)
    res.render('albums',)   
    }), function(err) {
    console.error(err);
    }; 
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
