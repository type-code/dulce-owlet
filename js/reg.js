$(".fRSubmitt").click(function(){
	var login = $(".frlogin").val();
	var password = $(".frpassword").val()
	var rePassword = $(".frrepassword").val();
	var email = $(".fremail").val();
	var checkKaptcha = $(".fRForm").serializeArray()
	if(checkKaptcha[0].value!=""){
		if(login!="" && password!="" && rePassword !=""){
			if(password == rePassword){
				console.log("password : true");
				$.ajax({
					url:'/forumReg',
					type:'post',
					data:{
						login:login,
						password:password,
						rePassword:rePassword,
						email:email
					},success:function(code){
						if(code=="200"){
							alert("регистрация прошла успешно");
						}
						else{
							alert("пользователь с таким именем уже сущевствует");
						}
					}
				});
			}
			else{
				alert("пароли несовпадают");
			}
		}
		else{
			alert("нужно заполнить все поля");
		}
	}
	else{
		alert("капча незаполнена");
	}
})