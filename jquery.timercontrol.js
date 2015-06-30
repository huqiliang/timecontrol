;(function($){
		$.fn.extend({
			"appendyear":function(opts){
				var defaults={
					beginyear:bd_year,
					count:bdtoed_year
				}
				var options = $.extend({},defaults,opts);
				for (var i = 0; i < options.count; i++) {
					if(i==0){$(this).append("<li class='selected'><a>"+(parseInt(options.beginyear)+i)+"年</a><i></i></li>")}
					else{
						$(this).append("<li><a>"+(parseInt(options.beginyear)+i)+"年</a><i></i></li>")
					}
				}	
				$(this).find("li").click(function(){
					$.changeText();
					$(this).addClass("selected").siblings().removeClass("selected")
					var selected_year=parseInt($(this).text());
					var selected_month=parseInt($(".price_month").find(".selected").text());
					if(parseInt($(this).text())==bd_year){
						$(".price_month ul").appendmonth()
						$(".price_day ul").appendday()
					}else if(parseInt($(this).text())==ed_year){
						$(".price_month ul").appendmonth({
							ebeginmonth:1,
							count:ed_month
						})
						if(selected_month==ed_month){
							$(".price_day ul").appendday({
								beginday:1,
								endday:ed_day,
								isend:true,
								count:DayNumOfMonth(selected_year,selected_month)
							})
						}else{
							$(".price_day ul").appendday({
								beginday:1,
								endday:100,
								count:DayNumOfMonth(selected_year,selected_month)
							})
						}
					}else{
						$(".price_month ul").appendmonth({
							beginmonth:1,
							count:12
						});
						$(".price_day ul").appendday({
							beginday:1,
							endday:100,
							count:DayNumOfMonth(selected_year,selected_month)
						})
					}
				})
				
				//do bussiness
				var dayCount = $("#fangwan").val();
				
				
			},
			"appendmonth":function(opts){
				$(this).html('')
				var defaults={
					beginmonth:bd_month,
					count:bdtoen_month
				}
				var options = $.extend({},defaults,opts);
				for (var i = 0; i < options.count; i++) {
					if(parseInt(options.beginmonth)+i>12)
						break
					if(i==0){$(this).append("<li class='selected'><a>"+(parseInt(options.beginmonth)+i)+"月</a><i></i></li>")}
					else{
						$(this).append("<li><a>"+(parseInt(options.beginmonth)+i)+"月</a><i></i></li>")
					}					
				}	
				$(this).find("li").click(function(){
					$.changeText();
					$(this).addClass("selected").siblings().removeClass("selected");
					var selected_year=parseInt($(".price_year").find(".selected").text());
					var selected_month=parseInt($(this).text())
					if(selected_month==bd_month && selected_year==bd_year){
						$(".price_day ul").appendday();
					}else{
						if(selected_month==ed_month && selected_year==ed_year){isend=true}else{isend=false}
						$(".price_day ul").appendday({
							beginday:1,
							endday:ed_day,
							isend:isend,
							count:DayNumOfMonth(selected_year,selected_month)
						});
					}
				})
			},
			"appendday":function(opts){
				$(this).html('')
				var defaults={
					beginday:bd_day,
					endday:ed_day,
					isend:false,
					count:DayNumOfMonth(bd_year,bd_month)
				}
				var options = $.extend({},defaults,opts);
				if(bdtoed_year==1 && bdtoen_month==1){
					options.isend=true;
				}
				for (var i = 0; i < options.count; i++) {
						if(i<(options.beginday-1) ){
							$(this).append("<li class='disabled'><a>"+(i+1)+"日</a><i></i></li>")
						}else if(i==(options.beginday-1)){
							if(newdate.notoday){
								$(this).append("<li class='disabled'><a>"+(i+1)+"日</a><i></i></li>")
							}else{
								$(this).append("<li class='selected'><a>"+(i+1)+"日</a><i></i></li>")
							}
						}else if(options.isend==true && i>(options.endday-1)){
							$(this).append("<li class='disabled'><a>"+(i+1)+"日</a><i></i></li>")
						}else{
							$(this).append("<li><a>"+(i+1)+"日</a><i></i></li>")
						}
		
				}	
				$(this).find("li").click(function(){
					if(!$(this).hasClass("selected")) {
						$.changeText();
					}
					if(!$(this).hasClass("disabled")){
						$(this).addClass("selected").siblings().removeClass("selected")
					}
				})
			},
			"timercontrol":function(options){
				var defaults={
					bd:"2015-4-12",
					ed:"2016-8-19"
				}
				time_option = $.extend({},defaults,options);
				newdate={
					bd:compareDate(time_option.bd),
					ed:StringToDate(time_option.ed),
					notoday:!isCompareDate(time_option.bd) && !isCompareDate(time_option.ed)
				}				
				//ed:new Date(time_option.ed)
				bd_year=newdate.bd.getFullYear();
				ed_year=newdate.ed.getFullYear();
				bd_month=newdate.bd.getMonth()+1;
				ed_month=newdate.ed.getMonth()+1;
				bd_day=newdate.bd.getDate();
				ed_day=newdate.ed.getDate();
				bdtoed_year=Math.abs(bd_year-ed_year)+1;
				
				bdtoen_month=bdtoed_year>1?12:(Math.abs(ed_month-bd_month)+1);
				//初始化日期数据
				$(".price_year ul").appendyear();
				$(".price_month ul").appendmonth();
				$(".price_day ul").appendday();
			}
		})
		
		var StringToDate=function(DateStr){if(typeof DateStr=="undefined")return new Date($("#now").val());if(typeof DateStr=="date")return DateStr;var converted = Date.parse(DateStr);var myDate = new Date(converted);if(isNaN(myDate)){DateStr=DateStr.replace(/:/g,"-");DateStr=DateStr.replace(" ","-");DateStr=DateStr.replace(".","-");var arys= DateStr.split('-');switch(arys.length){case 7 : myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5],arys[6]);break;case 6 : myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5]);break;default: myDate = new Date(arys[0],--arys[1],arys[2]);break;};};return myDate;}
		
		//获取时间与当前时间对比  
		function isCompareDate(date){
			var arrA=date.split("-");
			var dateA=new Date(arrA[0],parseInt(arrA[1])-1,arrA[2]);
			var dateAT=dateA.getTime();
			//var myDate = new Date();
			var dateBStr = new Date($("#now").val()).toLocaleDateString();
			
			var pattern=/(\d{4}).*(\d{1,2}).*(\d{1,2})/;
			var arrB=pattern.exec(dateBStr);
			
			var changedate=$("#now").val().replace(/-/g,"/")
			var dateB=new Date(changedate);
			var dateBT=dateB.getTime();
			
			if(Number(dateAT-dateBT)>0){           //比当前时间大
				return true;
			}else{
				return false;					   //比当前时间小
			}
		}
		//获取时间与当前时间对比 格式2015-1-11
		function compareDate(date){
			var arrA=date.split("-");
			var dateA=new Date(arrA[0],parseInt(arrA[1])-1,arrA[2]);
			var dateAT=dateA.getTime();
			/*var myDate = new Date();
			var dateBStr=myDate.toLocaleDateString();*/
			var changedate=$("#now").val().replace(/-/g,"/")
			var dateBStr = new Date($("#now").val()).toLocaleDateString();
	//		var pattern=/(\d{4}).*(\d{1,2}).*(\d{1,2})/;
			var pattern=/(\d{4}).*?(\d{1,2}).*?(\d{1,2})/;
			var arrB=pattern.exec(dateBStr);
		//	console.info(changedate);
			var dateB=new Date(changedate);
			var dateBT=dateB.getTime();
		//	console.info(dateA);
		//	console.info(dateB);
			if(Number(dateAT-dateBT)>0){
				return new Date(dateAT);
			}else{
				return new Date(dateBT);
			}
		}
		

	//一个月的天数计算
	function DayNumOfMonth(Year,Month)
	{
	    Month--;
	    var d = new Date(Year,Month,1);
	    d.setDate(d.getDate()+32-d.getDate());
	    return (32-d.getDate());
	}
	Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    $.changeText=function(){
    	$("#takeorder").removeClass().addClass("price_btn").addClass("refresh");
    	$("#takeorder").text("立即查询")
    }
	//价格计算封装
	$.computeprice=function(obj){
		var obj=$.extend({},$(".true_price"),obj);
		var auto_price=$("#soldPrice").val(); //初始价格 修改为java获取
		num=parseInt($("#price_num").val());
		$("#pnum").val(num);
		//sumday=patterm[0].length-2;
		sumday=$(".price_day .selected").length;
		if (typeof num=="number" && typeof sumday=="number" && num!=0 && sumday!=0) {
			obj.text(auto_price*num*sumday+".00");
		}else{
			obj.text(auto_price+".00");
		}
	}
	//数量加减
	var auto_val=parseInt($("#price_num").val());
	$("#price_num_red").click(function() {
		$.changeText();
		if(auto_val<=1) {
			alert("数量最少为1");
		}
		if (auto_val>1) {$("#price_num").val(auto_val-1);$.computeprice();};
		auto_val=parseInt($("#price_num").val());
	});
	$("#price_num_add").click(function() {
		$.changeText();
		/*if (auto_val<9999) {$("#price_num").val(auto_val+1);$.computeprice();};
		$("#pauto_val=parseInt(rice_num").val());*/
		var limitNum = $("#limitNum").val();
		if(!parseInt(limitNum)) {
			limitNum = 1;
		}
		if(auto_val < limitNum) {
			$("#price_num").val(auto_val+1);$.computeprice();
			auto_val=parseInt($("#price_num").val());
		}
	});
	$("#price_num").change(function() {
		if (auto_val>1 && auto_val<9999) {
			$.computeprice();
		}else{
			$("#price_num").val(1);
			alert("不允许的数字");
		}
	});

})(jQuery);