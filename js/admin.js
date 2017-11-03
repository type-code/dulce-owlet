parsCookie(document.cookie);
function parsCookie(cookie){
	var arr = cookie.split(';');
	var arrlog = arr[0].split('=');
	var log = arrlog[1];
	var arrpas = arr[1].split('=');
	var pas = arrpas[1];
	return user = [log,pas];
}
var show_admin_panel_button = document.querySelector(".show_admi_panel");
var show_admin_panel_button2 = document.querySelector(".show_admin_panel2");
var admin_panel1 = document.querySelector(".admin_panel");
var linkExit = document.querySelector("#linkExit");
var shadow = document.querySelector(".shadow");
var submit1 = document.querySelector("#submit1");
var discription1 = document.querySelector("#discriptionImg");
var File1 = document.querySelectorAll("#file");
var discHelp = document.querySelector(".discHelp");
var topic = document.querySelector("#topic");
var news = document.querySelector("#news");
var date = document.querySelector("#date");
var file2 = document.querySelectorAll("#file2");
var submit2 = document.querySelector("#submit2");
var edit = document.querySelectorAll(".edit");
var remove = document.querySelectorAll(".remove");
var editP = document.querySelectorAll(".editP");
var removeP = document.querySelectorAll(".removeP");
$.ajax({
	url:'/checkCookies',
	method:'post',
	success:function(data){
		for(i in data){
			if(user[0] == data[i].login && user[1] == data[i].password){
				for(var i=0;i<remove.length;i++){
					edit[i].style.display = "inline-block";
					remove[i].style.display = "inline-block";
				}
				for(var i=0;i<removeP.length;i++){
					editP[i].style.display = "inline-block";
					removeP[i].style.display = "inline-block";
				}
				show_admin_panel_button.style.display = "block";
				show_admin_panel_button2.style.display = "inline-block";
				show_admin_panel_button.addEventListener("click",function(){
					show_admin_panel(1);
				});
				show_admin_panel_button2.addEventListener("click",function(){
					show_admin_panel(2);
				});
			}
		}
	}
});

////SHOW ADMIN PANEL
function show_admin_panel(argument){
	switch(argument){
		case 1:
			admin_panel1.style.display = "block";
			shadow.style.display = "block";
			submit1.style.display = "inline-block";
			discription1.style.display = "block";
			File1[0].style.display = "inline-block";
			submit1.addEventListener("click",function(){
				var file = File1[0].files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = function(){
					$.ajax({
						url:"/adminPanel1",
						type:"POST",
						data:{
							name:file.name,
							data:reader.result,
							discription:discription1.value
						},
						success:function(){
							document.location.reload();
						}
					});
				}
			});
		break;

		case 2:
			admin_panel1.style.display = "block";
			shadow.style.display = "block";
			discHelp.style.display = "inline-block";
			topic.style.display = "block";
			news.style.display = "block";
			date.style.display = "block";
			file2[0].style.display = "inline-block";
			submit2.style.display = "inline-block";
			submit2.addEventListener("click",function(){
				var filetwo = file2[0].files[0];
				var reader = new FileReader();
				reader.readAsDataURL(filetwo);
				news.value=news.value.replace(/\r\n|\r|\n/g,"<br>");
				console.log(news.value);
				reader.onloadend = function(){
					$.ajax({
						url:"/adminPanel2",
						type:"POST",
						data:{
							name:filetwo.name,
							data:reader.result,
							date:date.value,
							news:news.value,
							title:topic.value
						},success:function(){
							document.location.reload();
						}
					});
				}
			});
		break;
	}
	linkExit.addEventListener("click",function(){
		admin_panel1.style.display = "none";
		shadow.style.display = "none";
		submit1.style.display = "none";
		discription1.style.display = "none";
		File1[0].style.display = "none";
		discHelp.style.display = "none";
		topic.style.display = "none";
		news.style.display = "none";
		date.style.display = "none";
		file2[0].style.display = "none";
		submit2.style.display = "none";
	});
}
