var link = document.querySelectorAll(".nConteiner");
var editProject = document.querySelectorAll(".editP");
var removeProject = document.querySelectorAll(".removeP");
var admin_panel = document.querySelector(".admin_panel");
var link_exit =  document.querySelector("#linkExit");
var discriptionImg = document.querySelector("#discriptionImg");
var file = document.querySelector("#file");
var submit = document.querySelector("#submit1");
for(var i=0;i<link.length;i++){
	link[i].addEventListener("click",function(){
		console.log(this);
		var newId = this.getAttribute("id");
		console.log(newId);
		$.ajax({
			url:"/new",
			type:"post",
			data:{newId:newId}
		})
		document.location = "http://fts:9000/new/"+newId;
	});
}

for(var i = 0;i<removeProject.length;i++){
	removeProject[i].addEventListener("click",function(){
		let id = this.getAttribute("id");
		removePr(id);
	});
	editProject[i].addEventListener("click",function(){
		let id = this.getAttribute("id");
		let discription = this.parentNode;
		admin_panel.style.display = "block";
	 	discription = discription.children[3].innerText;
	 	discriptionImg.style.display = "block";
	 	discriptionImg.value = discription;
	 	file.style.display = "inline-block";
	 	submit.style.display = "inline-block";
	 	editPr(id);
	});
}

function removePr(id){
	$.ajax({
		url:'/removeProject',
		type:'post',
		data:{id:id},
		success:function(){
			document.location.reload();
		}
	})
}

function editPr(id){
	submit.addEventListener("click",function(){
		if(file.files.length>0){
			var filetwo = file.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(filetwo);
			var discription = document.querySelector("#discriptionImg").value;
			reader.onloadend = function(){
				$.ajax({
					url:'/updateProjectUpload',
					type:'post',
					data:{
						id:id,
						data:reader.result,
						discription:discription
					},
					success:function(){
						document.location.reload();
					}
				});
			}
		}
		else{
			var discription = document.querySelector("#discriptionImg").value;
			console.log(discription);
			$.ajax({
				url:'/updateProject',
				type:'post',
				data:{id:id,discription:discription},
				success:function(){
					document.location.reload();
				}
			})
		}
	});
}

link_exit.addEventListener("click",function(){
	admin_panel.style.display = "none";
});