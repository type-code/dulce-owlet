var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');
var db = null;
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var htmlspecialchars = require('htmlspecialchars');
// MongoClient.connect("mongodb://chrom-web.ga:27017/",function(err,database){
 MongoClient.connect("mongodb://localhost:27017/dulce",function(err,database){
	db = database;
});
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({limit:'100mb'}));
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.listen(9000,function(){
	console.log("Server started!!");
});
app.get('/',function(req,res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip);
	db.collection('projects').find().toArray(function(err,data){
		db.collection('news').find().toArray(function(err,data2){
			res.render("index.ejs",{projects:data,news:data2});
		});
	});
});
app.get('/login',function(req,res){
	res.sendFile(__dirname +"/login.html");
});
//SELECT ALL NEWS
app.get('/news',function(req,res){
	db.collection('news').find().toArray(function(err,data){
		var j=0;
		var needDelete = false;
		for(var i in data) {
			if (data!="" && data[i].news.length > 200 )
				data[i].news = data[i].news.slice(0, 190) + "...";
				data[i].news = data[i].news.split("");
				while(j<data[i].news.length){
					if(data[i].news[j] == "<" && data[i].news[j+1] == "i")
						needDelete = true;

					if(needDelete)
						data[i].news[j] = "";

					if(data[i].news[j] == ">")
						needDelete = false;
					j++;
				}
				data[i].news = data[i].news.join("");
		}
		// var www = data[0].news[5] = "b";
		// console.log(www);
		res.render("news.ejs",{news:data});
	});
});

//SELECT THIS NEWS
// app.post('/new',function(req,res){
// 	global.newsId = req.body.newId;
// 	console.log(newsId)
// 	db.collection('news').find({_id:ObjectID(global.newsId )}).toArray(function(err,data){
// 			global.globalData = data;
// 	});
// });
app.get('/new/:id',function(req,res){
	var	nId = req.params.id;
	db.collection('news').find({_id:ObjectID(nId)}).toArray(function(err,data){
		res.render('new',{news:data});
	});
});

//getNew
app.post('/getNew',function(req,res){
	db.collection('news').find({_id:ObjectID(req.body.getId)}).toArray(function(err,data){
		res.send(data);
		console.log(data);
	});
});

// updateNew
app.post('/updateNewUpload',function(req,res){
	var b64Data = req.body.data.split(',')[1];
	var buffer = new Buffer(b64Data,'base64');
	var newName = Date.now()+req.body.name;
	var date = req.body.date;
	var news = req.body.news;
	var title = req.body.title;
	fs.writeFile('./img/'+newName,buffer,function(e){
		if(e) console.log.error(e);
	});
		db.collection('news').update(
		{_id:ObjectID(req.body.id)},
		{$set:{
				title:req.body.title,
				date:req.body.date,
				img:newName,
				news:news
			}
		}
	),
	res.status(200).end();
	console.log("^UPDATE NEW");
});

app.post('/updateNew',function(req,res){
	var date = req.body.date;
	var news = req.body.news
	var title = req.body.title;
		db.collection('news').update(
		{_id:ObjectID(req.body.id)},
		{$set:{
				title:req.body.title,
				date:req.body.date,
				news:news
			}
		}
	),
	res.status(200).end();
	console.log("^UPDATE NEW");
});

//removeNew
app.post('/removeNew',function(req,res){
	db.collection('news').remove(
		{_id:ObjectID(req.body.id)}
	),
	res.status(200).end();
	console.log("^REMOVE NEW");
});

//updateProject

app.post('/updateProjectUpload',function(req,res){
	var b64Data = req.body.data.split(',')[1];
	var buffer = new Buffer(b64Data,'base64');
	var newName = Date.now()+req.body.name;
	var discription = req.body.discription;
	fs.writeFile('./img/'+newName,buffer,function(e){
		if(e) console.log.error(e);
	});
		db.collection('projects').update(
		{_id:ObjectID(req.body.id)},
		{$set:{
				discription:req.body.discription,
				img:newName
			}
		}
	),
	res.status(200).end();
	console.log("^UPDATE PROJECT");
});

app.post('/updateProject',function(req,res){
	var discription = req.body.discription;
		db.collection('projects').update(
		{_id:ObjectID(req.body.id)},
		{$set:{
				discription:req.body.discription
			}
		}
	),
	res.status(200).end();
	console.log("^UPDATE PROJECT");
});

//removeProject
app.post('/removeProject',function(req,res){
	db.collection('projects').remove(
		{_id:ObjectID(req.body.id)}
	),
	res.status(200).end();
	console.log("^REMOVE PROJECT");
});
/////GAMEMAKER
app.post('/getGmData',function(req,res){
	console.log(req.body.insert_login);
		db.collection('players').find({login:req.body.insert_login}).toArray(function(err,data){
			if(data!=""){
				console.log("Account with this name exists");
				res.send("500").end();
			}
			else{
				db.collection('players').insert({
					login:req.body.insert_login,
					password:req.body.insert_password,
					steam_id:req.body.steam_id
					}),
				res.send("200").end();
				console.log("account created");
			}
		});
});

////ADMIN OWLET LOGIN
app.post('/autorezationOwlet',function(req,res){
	var login = req.body.login;
	var password = req.body.password;
	db.collection('admin').find({login:login,password:password}).toArray(function(err,data){
		if(data){
			res.cookie("login",login);
			res.cookie("password",password);
			res.end();
		}
		else{
		}
	});
});

///ADMIN OWLET CHECK COOKIES
app.post('/checkCookies',function(req,res){
	db.collection('admin').find().toArray(function(err,data){
		res.send(data).end();
	});
});

//uploadNews for admin panel 1
app.post('/adminPanel1',function(req,res){
	var b64Data = req.body.data.split(',')[1];
	var buffer = new Buffer(b64Data,'base64');
	var newName = Date.now()+req.body.name;
	var discription = req.body.discription;
	fs.writeFile('./img/'+newName,buffer,function(e){
		if(e) console.log.error(e);
	});
	db.collection('projects').insert({
		img:newName,
		discription:discription
	}),res.send(200).end();
});

app.post('/adminPanel2',function(req,res){
	var b64Data = req.body.data.split(',')[1];
	var buffer = new Buffer(b64Data,'base64');
	var newName = Date.now()+req.body.name;
	var date = req.body.date;
	var news = req.body.news
	var title = req.body.title;
	fs.writeFile('./img/'+newName,buffer,function(e){
		if(e) console.log.error(e);
	});
	db.collection('news').insert({
		img:newName,
		date:date,
		news:news,
		title:title
	}),res.send(200).end();
});

/////FORUM
app.get('/forum',function(req,res){
	console.log(" Method GET /forum");
	db.collection('forumThem').find().toArray(function(err,dataForumNews){
		db.collection('forumPosts').find().toArray(function(err,dataForumPosts){
			//var them = new Array(dataForumNews.length);
			for(var i = 0;i < dataForumNews.length;i++){
				for(var j = 0;j < dataForumPosts.length;j++){
					if(dataForumNews[i]._id == dataForumPosts[j].themId){
						dataForumNews[i].count++;
					}
				}
			}
			if(req.cookies.login!= undefined){
				if(req.cookies.status == "admin"){
					res.render("forum.ejs",{dataNews:dataForumNews,dataPosts:dataForumPosts,role:"admin",login:req.cookies.login});
				}
				else if(req.cookies.status == "moder"){
					res.render("forum.ejs",{dataNews:dataForumNews,dataPosts:dataForumPosts,role:"moder",login:req.cookies.login});
				}
				else{
					res.render("forum.ejs",{dataNews:dataForumNews,dataPosts:dataForumPosts,role:"user",login:req.cookies.login});
				}
			}
			else{
				res.render("forum.ejs",{dataNews:dataForumNews,dataPosts:dataForumPosts,role:"unlogin_user",login:req.cookies.login});
			}
		});	
	})
});

app.get('/registration',function(req,res){
	res.sendFile(__dirname+"/views/registration.html");
	// res.render("forum.ejs",{data:"322"});
});

app.post('/getSmile',function(req,res){
	var arr=[];
	var folder = req.body.folder;
	fs.readdir('img/'+folder, function (err, files) {
	  	res.send(files).end();
	});
});

app.post('/forumReg',function(req,res){
	var login = req.body.login;
	var password = req.body.password;
	var rePassword = req.body.rePassword;
	var email = req.body.email;
	db.collection('users').find({login:login}).toArray(function(err,data){
		if(data!=""){
			console.log("reg falce");
			res.send("500").end();
		}
		else{
			db.collection('users').insert({
				login:login,
				password:password,
				rePassword:rePassword,
				email:email
			}),
			res.send("200").end();
		}
	});
});

app.post('/forumLogin',function(req,res){
	var login = req.body.login;
	var password = req.body.password;
	db.collection('users').findOne({login:login,password:password,},function(err,data){
		if(data!= null){
			if(data.login == login && data.password == password){
				res.cookie("login",login);
				res.cookie("status",data.status);
				res.send(200).end();
			}
			else{
				res.send(500).end();
			}
		}
		else{
			res.send("err").end();
		}
	});
	
});

app.post('/forumQuit',function(req,res){
	res.clearCookie('login');
	res.clearCookie('status');
	res.send(200).end();
});

app.post('/addForumTopick',function(req,res){
	var content = req.body.content;
	var loginAdd = req.body.loginAdd;
	var roleAdd = req.body.roleAdd;
	var date = req.body.date;
	db.collection('forumThem').insert({
		content:content,
		loginAdd:loginAdd,
		date:date,
		roleAdd:roleAdd,
		count:0
	}),
	res.send("200").end();
});

app.get('/forum/topics/:id',function(req,res){
	var	nId = req.params.id;
	db.collection('forumPosts').find({themId:nId}).toArray(function(err,data){
		res.render('topics',{post:data});
	});
});


app.get('/forum/topic/:id',function(req,res){
	console.log(req.params.id);
	var	nId = req.params.id;
	db.collection('forumPosts').find({_id:ObjectID(nId)}).toArray(function(err,data){
		db.collection('forumComment').find({idTopic:nId}).toArray(function(err,data1){
			res.render('topic',{post:data,comment:data1});
		})
	});
});
app.get('/forum/createTopic',function(req,res){
	db.collection('forumThem').find().toArray(function(err,data){
		res.render('createTopic',{topic:data});
	});
});

app.post('/addTopic',function(req,res){
	var content = req.body.content;
	var themId = req.body.themId;
	var userId = req.body.userId;
	var header = req.body.header;
	var role = req.body.role;
	var date = req.body.date;
	db.collection('forumPosts').insert({
		content:content,
		header:header,
		themId:themId,
		userId:userId,
		date:date,
		role:role
	}),
	res.send("200").end();
});

app.post('/addComment',function(req,res){
	var userId = req.body.userId;
	var content= req.body.content;
	var idTopic = req.body.idTopic;
	var date = req.body.date;
	db.collection('forumComment').insert({
		userId:userId,
		content:content,
		date:date,
		idTopic:idTopic
	}),
	res.send("200").end();
});
app.get('*',function(req,res){
	res.redirect("/");
});