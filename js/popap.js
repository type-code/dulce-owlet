var popap = $(".showSmileList").click(function(){
var newSmile = [];
var symbol = "::";
	$(".smileListWraper").toggleClass( "toggleSmileList");
	$.ajax({
		url:'/getSmile',
		type:'post',
		data:{folder:'angelic'},
		success:function(smile_list){
			console.log("смыйлы пришли");
			for(i in smile_list){
				newSmile[i] = $("<img src = ../img/angelic/"+smile_list[i]+">");
				$(".smileList").append(newSmile);
				newSmile[i].click(function(){
					console.log("нажал на этот смайл:");
					console.log(this);
					var texar = $(".textarea").html();
					$(this).clone().appendTo(".textarea");
					// var sourse = $(this).attr("src");
					// var cut1 = sourse.split("angelic/");
					// var cut2 = cut1[1].split(".");
					// var smile = symbol + cut2[0];

				});
			}
		}
	})
});