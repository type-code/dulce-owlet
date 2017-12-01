var link = document.querySelectorAll(".readMore");
var edit = document.querySelectorAll(".edit");
var remove = document.querySelectorAll(".remove");
var editPanel = document.querySelector(".editPanel");
var topic = document.querySelector("#topic");
var news = document.querySelector("#news");
var date = document.querySelector("#date");
var submit2 = document.querySelector("#submit2");
var linkExit = document.querySelector("#linkExit");
var allNews = document.querySelectorAll(".news");

for(var i=0;i<link.length;i++){
	link[i].addEventListener("click",function(){
		console.log(this);
		var newId = this.getAttribute("id");
		console.log(newId);
		$.ajax({
			url:"/new",
			type:"post",
			data:{newId:newId}
		});
		document.location = "http://dulce-owlet:9000/new/"+newId;
	});
}

for(i in edit){
	edit[i].addEventListener("click",function(){
		edit_new(this.getAttribute("id"),this.parentNode);
	});
	remove[i].addEventListener("click",function(){
		remove_new(this.getAttribute("id"));
	});
}

function edit_new(id){
	editPanel.style.display = "block";
	linkExit.addEventListener("click",function(){
		editPanel.style.display = "none";
		document.location = "http://dulce-owlet:9000/news";
	});
	$.ajax({
		url:'/getNew',
		type:'post',
		data:{getId:id},
		success:function(data){
			console.log(data[0].title);
			topic.value = data[0].title;
			date.value = data[0].date;
			news.value = data[0].news;
			update(id,topic,date,news)
		}
	});
}

function update(id,topic,date,news){
	submit2.addEventListener("click",function(){
		var file2 =  document.querySelector("#file2");
		console.log(file2.files)
		if(file2.files.length>0){
			var filetwo = file2.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(filetwo);
			news.value=news.value.replace(/\r\n|\r|\n/g,"<br>");
			reader.onloadend = function(){
				$.ajax({
					url:'/updateNewUpload',
					type:'post',
					data:{
						name:filetwo.name,
						data:reader.result,
						date:date.value,
						news:news.value,
						title:topic.value,
						id:id
					},success:function(){
						document.location.reload();
				}
				});
			}
		}
		else{
			$.ajax({
				url:'/updateNew',
				type:'post',
				data:{
				date:date.value,
					news:news.value,
					title:topic.value,
					id:id
				},success:function(){
					document.location.reload();
				}
			});
		}
	});
}

function remove_new(id){
	$.ajax({
		url:'/removeNew',
		type:'post',
		data:{id:id}
	});
	document.location.reload();
}
