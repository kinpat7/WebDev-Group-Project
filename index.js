/**
 *  index.js
 *  @author John O'Grady
 *  @date 10/11/2015
 *  @note index javascript file... handles routing, server responses/requests, orm, rss generation, ciphering, parsing url
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Feed = require('feed');
var orm = require('orm');
var json2xml = require('json2xml');

/**
 * custom packages
 */
var Cipher = require('./public/res/js/lib/cipher.js');
var XMLCleaner = require('./public/res/js/lib/XMLCleaner.js');
/** GloBal variables **/
var ormdb;
var xmlCleaner = new XMLCleaner();

/** for calling js, and css files, etc... **/
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/xml'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');

/** Connect to our postgresql DB **/
orm.connect('postgres://wmznuqubnhpoqp:ETFxj9YgaezDqQhA-OrIeou-7x@ec2-107-21-219-201.compute-1.amazonaws.com:5432/d3nm324q5l4nb6?ssl=true', function(err, db) {
    if (err) { throw err; }
    ormdb = db;
});

/** for parsing query string in url **/
app.use(bodyParser.urlencoded({extended: false}));

/**
 * routes...
**/

/** Get Requests **/

/**
 * serve index page
 */
app.get('/', function(request, response) {
    console.log(request.connection.remoteAddress);
    response.render('index');
});

/**
 * serve list of blog posts
 */
app.get('/blog', function(request, response) {
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    post.find({id: orm.gte(1)}, 5, function(error, posts) {
        response.render('blog', {posts: posts});
    });
});

/**
 * server a certain blog with id :id
 */
app.get('/blog/:id', function(request, response) {
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    post.find({id: request.params.id}, 1, function(error, post) {
        if (!error) {
            response.render('post', {post: post[0]});

        } else {
            response.render('error', {});
        }
    });
});

/**
 * server our generated rss feeds. each item in the rss feed is generated from our blog posts in the DB
 */
app.get('/rss', function(request, response) {
    var feed = new Feed({
        title: 'Cipher-com RSS Feed.',
        description: 'RSS feed to track the development stage of Cipher-com',
        link: 'https://cipher-com.herokuapp.com/',
        image: 'https://cipher-com.herokuapp.com/res/img/brand_logo_new.png'
    });
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    post.find({id: orm.gte(1)}, 5, function(error, posts) {
        for(var key in posts) {
            feed.addItem({
                title: posts[key].title,
                description: posts[key].description,
                link: 'http://cipher-com.herokuapp.com/blog/' + posts[key].id
            })
        }
        response.set('Content-Type', 'application/rss+xml');
        response.send(xmlCleaner.cleanRSS(feed.render('rss-2.0')));
    });
});

/** Post Requests **/
app.post('/enc', function(request, response) {
    /** instantiate our cipher object **/
    var cipher = new Cipher(request.body.inputtext);
    /** define our entry entity in relation requests **/
    var entry = ormdb.define('requests', {
        id: Number,
        original: String,
        encrypted: String,
        requested: Date,
        ip: String
    });
    /** generate xml to send to the client **/
    var encryptedText = json2xml({
        cipher: {
            value: cipher.caesar(cipher.string),
            type: 'caesar'
        }
    });
    /** cleanRemoteAddress function removes all chars except digits and . - to make a valid ip address **/
    var ip = xmlCleaner.cleanRemoteAddress(request.connection.remoteAddress);
    /** instantiate our DateHelper object for storing dates **/
    dateHelper = new DateHelper(new Date());
    /** insert the requst into the DB **/
    entry.create({
        original: cipher.string,
        encrypted: cipher.caesar(cipher.string),
        ip: ip,
        requested: dateHelper.datetime()
        /** check for errors in the insert **/
    }, function(error) {
        if (error) {
            throw error;
        }
    });
    /** send the encrypted text back to the client **/
    response.send(encryptedText);
});

/** start an instance of the app/server **/
var server = app.listen((process.env.PORT || 80), function () {
    var hostname = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s%s', hostname, port);
});
