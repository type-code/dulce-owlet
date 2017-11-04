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
		document.location = "http://dulce-owlet:9000/forum/them/"+link;
	});
});