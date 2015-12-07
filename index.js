/**
 *  index.js
 *  @author John O'Grady <natedrake> | 14101718
 *  @date 10/11/2015
 *  @note index javascript file... handles routing, server responses/requests,
  *     orm, rss generation, ciphering, parsing url, xml generation
 */
var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Feed = require('feed');
var orm = require('orm');
var json2xml = require('json2xml');
var nodexslt = require("node_xslt");
var striptags = require('striptags');
var XMLWriter = require("xml-writer");

/**
 * custom packages
 */
var Cipher = require('./public/res/js/lib/cipher.js');
var XMLCleaner = require('./public/res/js/lib/XMLCleaner.js');
var DateHelper = require('./public/res/js/lib/datehelper.js');

/** GloBal variables **/
var ormdb;
var xmlCleaner = new XMLCleaner();
var dateHelper;
var xmlWriter = new XMLWriter(true);    /** true param if xml to be indented **/

/**
 * for calling js, and css files, etc... 
 **/
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/xml'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');

/** 
 * Connect to our postgresql DB 
 **/
orm.connect('mysql://natedrake13:@localhost/c9', function(err, db) {
    if (err) { throw err; }
    ormdb = db;
});
/**
 * for parsing query string in url 
 **/
app.use(bodyParser.urlencoded({extended: false}));


/**
 * 
 * routes...
 * 
**/

/**
 * Get Requests 
 **/
app.get('/', function(request, response) {
    response.render('index');
});
/**
 * serve a list of blog posts
 */
app.get('/blog', function(request, response) {
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    post.find({}, ["id", "Z"], function(error, posts) {
        response.render('blog', {posts: posts});
    });
});
/**
 * serve a certain blog with id :id
 */
app.get('/blog/:id', function(request, response) {
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    var comment = ormdb.define('comments', {
        id: Number,
        body: String,
        posted: Date,
        post: Number,
        comment: Number
    });
    post.find({id: request.params.id}, 1, function(error, post) {
        if (!error) {
            comment.find({post: request.params.id}, ["posted", "Z"], function(error, comments) {
                if (!error) {
                    response.render('post', {post: post[0], comments: comments});
                }
            });
        } else {
            response.render('error', {});
        }
    });
});
/**
 * serve our generated rss feeds. each item in the rss feed 
 *      is generated from our blog posts in the DB
 */
app.get('/rss', function(request, response) {
    var feed = new Feed({
        title: 'Cipher-com RSS Feed.',
        description: 'RSS feed to track the development stage of Cipher-com',
        link: 'https://cipher-natedrake13.c9users.io',
        image: 'https://cipher-natedrake13.c9users.io/res/img/brand_logo_new.png'
    });
    var post = ormdb.define('blog', {
        id: Number,
        title: String,
        description: String
    });
    /**
     * get all posts in our blog
     **/
    post.find({id: orm.gte(1)}, function(error, posts) {
        for(var key in posts) {
            feed.addItem({
                title: posts[key].title,
                description: posts[key].description,
                link: 'https://cipher-natedrake13.c9users.io/blog/' + posts[key].id
            });
        }
        response.set('Content-Type', 'application/rss+xml');
        response.send(xmlCleaner.cleanRSS(feed.render('rss-2.0')));
    });
});

/**
 *  view archive of all requests ever made
 **/
app.get('/archive', function(request, response) {
    var xml = nodexslt.readXmlFile(__dirname+'/xml/requests.xml');
    var xslt = nodexslt.readXsltFile(__dirname+'/xml/style.xsl');
    response.send(nodexslt.transform(xslt, xml, []));
});
/**
* Post Requests 
**/
app.post('/enc', function(request, response) {
    /**
        Define the model of our encryption request object 
     **/
    var entry = ormdb.define('requests', {
        id: Number,
        original: String,
        encrypted: String,
        requested: Date,
        ip: String
    });
    /**
     * Create the cipher object, used to encrypt the submitted text 
     **/
    var cipher = new Cipher(request.body.inputtext);
    var encryptedText = '';
    /**
     * check which cipher was selected in request 
     **/
    switch(request.body.cipherinput) {
        case 'cae':
            cipher.setOffset(3);
            encryptedText = cipher.caesar();
            break;
        case 'vig':
            encryptedText = cipher.vigenere(request.body.cipherkey);
            break;
        default:
            break;
    }
    /**
     * make sure the user has submitted data
     **/
    if (request.body.inputtext.length >= 1) {
        entry.create({
            original: request.body.inputtext,
            encrypted: encryptedText,
            requested: new Date(),
            ip: getIP(request)
        }, function(err, results) {
            if (err) { throw err; }
            updateXML();
        });
        /**
         * send xhtml back to the user
         **/
        response.send(encryptedText);
    } else {
        /**
         * No data submitted to the server
         **/
        response.send('No data submitted, please try again.');
    }
});

app.post('/removerequest/:id', function(request, response) {
    /**
        Define the model of our encryption request object 
     **/
    var entry = ormdb.define('requests', {
        id: Number,
        original: String,
        encrypted: String,
        requested: Date,
        ip: String
    });
    /**
     * make sure the id of the post is submitted
     **/
    if (request.params.id) {
        response.send(request.params.id);
        entry.find({id: request.params.id}).remove(function(error) {
            if (error) { throw error; }
            updateXML();
        });
    } else {
        response.send('No data submitted, please try again.');
    }
});

/**
 *  ajax requests for previous requests from user
 **/
app.post('/requests', function(request, response) {
    /**
     * define our request entry model 
     **/
    var entry = ormdb.define('requests', {
        id: Number,
        original: String,
        encrypted: String,
        requested: Date,
        ip: String
    });
    /**
     * search the requests relation for any row with an 
     *      ip attribute that matches the users ip address 
     **/
    entry.find({ip: getIP(request)}, 5, ["id", "Z"], function(error, results) {
        /**
         * always safe to check for errors 
         **/
        if (!error) {
            /**
             * check if the user has ever made a request using their current ip address 
             **/
            if (!results.length) {
                /** 
                 * no results, return message to user 
                 **/
                response.send('<div class="empty-table">No recent requests. Please submit a request!</div>');
            } else {
                /** 
                 * there are some results from the table 
                 **/
                var requests = {requests:[]};
                for(var key in results) {
                    /** 
                     * iterate through each request and add it to our json string 
                     **/
                    requests.requests.push({
                        request: ((results[key]))
                    });
                }
                /** 
                 * convert the xml to json and parse the xml using nodexslt 
                 **/
                var xml = nodexslt.readXmlString(json2xml(requests));
                /**
                 * parse the xsl code for transformation 
                 **/
                var xslt = nodexslt.readXsltFile('./xml/style.xsl');
                /** 
                 * send the transformed code using the xml and xsl code above 
                 **/
                response.send(nodexslt.transform(xslt, xml, []));
            }
        }
    });
});

/**
 * ajax request to submit comment on blog post 
 **/
app.post('/comment', function(request, response) {
    /**
     * create a model of our comments relation
     **/
    var comment = ormdb.define('comments', {
       id: Number,
       body: String,
       posted: Date,
       post: Number,
       comment: Number
    });
    /**
     * check if the comment body is submitted
     **/
    if (typeof(request.body.comment) !== undefined) {
        /** 
         * make sure the comment body contains content
         **/
        if (request.body.body.length >= 1 ) {
            /**
             * add the comment to the database
             **/
            comment.create({ 
                body: striptags(request.body.body), 
                posted: new Date(), 
                post: striptags(request.body.postid)
            }, function(err, results) {
                /**
                 * throw any errors with the insert
                 **/
                if (err) { throw err; }
            });
        }
    }
});

function updateXML() {
    /**
     * model of our requests table
     **/
    var entry = ormdb.define('requests', {
        id: Number,
        original: String,
        encrypted: String,
        requested: Date,
        ip: String
    });
    
    entry.find({}, function(error, results) {
        /**
         * update our xml archive 
         **/
        xmlWriter.startDocument();
        xmlWriter.startElement('cc:requests');
        /** 
         * write namespace and schema definitions 
         **/
        xmlWriter
            .writeAttribute('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance')
            .writeAttribute('xsi:schemaLocation', 'https://cipher-natedrake13.c9users.io/ns/tns '+__dirname+'/xml/schema.xsd')
            .writeAttribute('xmlns', 'http://www.w3.org/1999/XSL/Transform')
            .writeAttribute('xmlns:cc', 'https://cipher-natedrake13.c9users.io/ns/tns');
            
        if (error)  { throw error; }
        for(var key in results) {
            
            /** 
             * create a datehelper object form UTC string passed from sql server 
             *      SQL is returning date as Wed, 5 Nov 2015 16:51:12 GMT +0000 (UTC)
             *      using datehelper and Date.parse method we can return dd/mm/yyyy hh:ii:ss
            **/
            var epoch = (Date.parse(results[key].requested));
            var date = new DateHelper(new Date(epoch));
            xmlWriter.startElement('cc:request');
            xmlWriter.writeElement('cc:id', results[key].id);
            xmlWriter.writeElement('cc:original', results[key].original);
            xmlWriter.writeElement('cc:encrypted', results[key].encrypted);
            xmlWriter.writeElement('cc:requested', date.datetime());
            xmlWriter.writeElement('cc:ip', results[key].ip);
            xmlWriter.endElement();  /** close the request element **/
        }
        /**
         * close the root element {requests} 
         **/
        xmlWriter.endElement();
        /**
         * end the xml document 
         **/
        xmlWriter.endDocument();
        /**
        * check if the requests.xml file exists 
        **/
        fs.exists(__dirname+'/xml/requests.xml', function(exists) {
            if (exists) {
                var writeStream = fs.createWriteStream(__dirname+'/xml/requests.xml');
                writeStream.write(xmlWriter.toString(), 'UTF-8', function(error) {
                   if (error)  { throw error; }
                   xmlWriter = new XMLWriter(true);
                });
            }
        });
    });
}

/**
 * start an instance of the app/server 
 **/
var server = app.listen((process.env.PORT || 8080), function () {
    var hostname = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', hostname, port);
});

/**
 * gets ip address of remote user
 **/
function getIP(request) {
    var ip = (request.headers['x-forwarded-for'] || request.connection.remoteAddress)
    return xmlCleaner.cleanRemoteAddress(ip);
}