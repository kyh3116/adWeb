var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'yong_web',
	password : '984600ok',
	database : 'yong_database'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function restrict(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.sendFile(path.join(__dirname + '/my/login.html'));
  }
}

app.use('/', function(request, response, next) {
	if ( request.session.loggedin == true || request.url == "/login" || request.url == "/register" || request.url == "/") {
    next();
	}
	else {
    response.sendFile(path.join(__dirname + '/my/login_alert.html')); //여기가 로그인 안된 처음 페이지임.
	}
});

app.get('/', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/my/home_logined.html'));
	}
	else{
		response.sendFile(path.join(__dirname + '/public/home.html'));
	}
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/login.html'));
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home_logined');
				response.end();
			} else {
				//response.send('Incorrect Username and/or Password!');
				response.sendFile(path.join(__dirname + '/my/login_error.html'));
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home_logined', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/my/home_logined.html'));
	}
	else{
		response.sendFile(path.join(__dirname + '/public/home.html'));
	}
	
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/register.html'));
});

app.get('/login_alert', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/login_alert.html'));
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var password2 = request.body.password2;
	var email = request.body.email;
	console.log(username, password, email);
	if (username && password && email) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [username, password, email], function(error, results, fields) {
			if (error) throw error;
			if (results.length <= 0) {
        connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [username, password, email],
            function (error, data) {
                if (error)
                  console.log(error);
                else
                  console.log(data);
        });
			  response.send(username + ' Registered Successfully!<br><a href="/home">Home</a>');
			} else {
				response.send(username + ' Already exists!<br><a href="/home">Home</a>');
			}			
			response.end();
		});
	} else {
		response.send('Please enter User Information!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
  	request.session.loggedin = false;
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/my/home_logined.html'));
	}
	else{
		response.sendFile(path.join(__dirname + '/public/home.html'));
	}
});

app.get('/home', restrict, function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/my/home_logined.html'));
	}
	else{
		response.sendFile(path.join(__dirname + '/public/home.html'));
	}
});

app.get('/join_data', function(request, response){
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/my/join_data.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/tool', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/tool.html'));
});



// Board
app.get('/board', function (request, response) { 
    // ÆÄÀÏÀ» ÀÐ½À´Ï´Ù.
    fs.readFile(__dirname + '/board/list.html', 'utf8', function (error, data) {
        // µ¥ÀÌÅÍº£ÀÌ½º Äõ¸®¸¦ ½ÇÇàÇÕ´Ï´Ù.
        connection.query('SELECT * FROM shoppingmall', function (error, results) {
            // ÀÀ´äÇÕ´Ï´Ù.
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});
app.get('/delete/:id', function (request, response) { 
    // µ¥ÀÌÅÍº£ÀÌ½º Äõ¸®¸¦ ½ÇÇàÇÕ´Ï´Ù.
    connection.query('DELETE FROM shoppingmall WHERE id=?', [request.param('id')], function () {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.redirect('/board');
    });
});
app.get('/insert', function (request, response) {	
    // ÆÄÀÏÀ» ÀÐ½À´Ï´Ù.
    fs.readFile(__dirname + '/board/insert.html', 'utf8', function (error, data) {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.send(data);
    });
});
app.post('/insert', function (request, response) {
    var body = request.body;

    connection.query('INSERT INTO shoppingmall (mallname, link, sales_commission, regular_fare, difficulty_level_of_entry, entry_tip) VALUES (?, ?, ?, ?, ?, ?)', [
        body.mallname, body.link, body.sales_commission, body.regular_fare, body.difficulty_level_of_entry, body.entry_tip 
    ], function () {
        response.redirect('/board');
    });
});
app.get('/edit/:id', function (request, response) {
    fs.readFile(__dirname + '/board/edit.html', 'utf8', function (error, data) {
        connection.query('SELECT * FROM shoppingmall WHERE id = ?', [
            request.param('id')
        ], function (error, result) {
            response.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});
app.post('/edit/:id', function (request, response) {
    var body = request.body
    connection.query('UPDATE shoppingmall SET name=?, modelnumber=?, series=? WHERE id=?', [
        body.mallname, body.link, body.sales_commission, body.regular_fare, body.difficulty_level_of_entry, body.entry_tip, request.param('id')
    ], function () {
        response.redirect('/board');
    });
});

app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});