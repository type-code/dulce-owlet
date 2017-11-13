$( document ).ready(function() {
if(document.cookie!="")
parsCookie(document.cookie);
function parsCookie(cookie){
	var arr = cookie.split(';');
	var arrlog = arr[0].split('=');
	var log = arrlog[1];
	var arrrole = arr[1].split('=');
	var role = arrrole[1];
	return user = [log,role];
}


	$( 'textarea.editor' ).ckeditor();


var SingInSubmit = $("#SingInSubmit").click(function(){
	var login = $("#login").val()
	var password = $("#password").val()
	if(login!="" && password!=""){
		$.ajax({
			url:'/forumLogin',
			type:'post',
			data:{login:login,password:password},
			success:function(code){
				console.log(code);
				if(code=="OK"){
					alert('вы успешно зашли, через несколько секунд вас перенаправит в учетную запись');
					location.reload();
				}
				else{
					alert('вы ввели неверный логин или пароль :(')
				}
			}
		})
	}
});

var quit = $("#quit").click(function(){
	$.ajax({
		url:'/forumQuit',
		type:'post',
		success:function(code){
			if(code == "OK"){
				location.reload();
			}
		}
	});
});

var buttonAddForumTopick = $('#addForumTopic').click(function(){
	var valAddForumTopick = $( 'textarea.editor' ).val();
	if ($(valAddForumTopick)!= ""){
		$.ajax({
			url:'/addForumTopick',
			type:'post',
			data:{content:valAddForumTopick,loginAdd:user[0],roleAdd:user[1]},
			success:function(code){
				if(code==200){
					location.reload();
				}
			}
		})
	}
	else{
		console.log("не густо");
	}
})
	$('.topic').click(function(){
		var link = $(this).data("topic");
		document.location = "http://dulce-owlet:9000/forum/topics/"+link;
	});

	$('.topicTopic').click(function(){
		console.log("click topicTopic");
		var link = $(this).data("topic");
		document.location = "http://dulce-owlet:9000/forum/topic/"+link;
	});

	//Send Topic

	$('.butonSendREST').click(function(){
		var valAddForumTopick = $( 'textarea.editor' ).val();
		var select = $('.selectPost').val();
		var header = $('.headerTopic').val();
    	console.log(select);
		if ($(valAddForumTopick)!="" && $(header)!=""){
			$.ajax({
				url:'/addTopic',
				type:'post',
				data:{header:header,content:valAddForumTopick,themId:select,userId:user[0],role:user[1]},
				success:function(code){
					if(code==200){
						location.reload();
					}
				}
			});
		}
	})

	///Send Comment
	$('.butonSendRESTTopick').click(function(){
		var valAddForumTopick = $( 'textarea.editor' ).val();
		// var link = document.origin;
		// this.data("topic");
		var idTopic = $(this).data("topic");
		console.log(valAddForumTopick);
		if(window.user!==undefined){
			if(user[0]!=""){
				$.ajax({
					url:"/addComment",
					type:"post",
					data:{idTopic:idTopic,userId:user[0],content:valAddForumTopick},
					success:function(code){
						if(code==200){
							location.reload();
						}
					}
				})
			}
		}
		else{
			alert("Для создания коментариев вы должны быть залогинены");
		}
	});
});

