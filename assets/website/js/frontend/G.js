// JavaScript Document
(function (_w) {

    var w = _w;

    //main namespace
    G = {};
	G.page_code = 'index';
	G.Message = {
		error:'系统错误，请联系管理员处理'
	};

	
    G.Fun = {
		//获取url中的参数
		getUrlParam: function(name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		    if (r != null) return unescape(r[2]); return null; //返回参数值
		},
    	Today: function(){
    		return G.Fun.formatter_date();	
    	},
	    addDay: function(date, num) {
	      // 创建一个新的 Date 对象，避免直接修改原日期对象
	      var newDate = new Date(date.getTime());
	      // 获取当前日期的天数并加一
	      var day = newDate.getDate();
	      newDate.setDate(day + num);
	      return G.Fun.formatter_date(newDate);
	    },
    	formatter_date: function(time){
			const date = typeof time == 'undefined' ? new Date() : new Date(time);
			const formattedDate = date.toLocaleString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
			
			return formattedDate;
    	},
    	formatter_date_to_items: function(time) {
    		var d = G.Fun.formatter_date(time);
    		var dSplit = d.split('/');
    		var year = dSplit[0];
    		var month = dSplit[1].length == 1 ? '0' + dSplit[1] : dSplit[1];
    		var day = dSplit[2].length == 1 ? '0' + dSplit[2] : dSplit[2];

    		var re = {
    			year: year,
    			month: month,
    			day: day
    		};
    		return re
    	},
    	check_invite_url: function(url, type){
    		if (typeof G_Invite_config != 'undefined')
    		{
    			var flag = true;
    			var index = G_Invite_config['url_urls']['key'].indexOf(url);
    			if (index > -1)
    			{
    				url = G_Invite_config['url_urls']['value'][index];
    				flag = false;
    			}

    			if (flag)
    			{
	    			if (typeof G_Invite_config['code_urls'][type] != 'undefined')
	    			{
	    				url = G_Invite_config['code_urls'][type];
	    				flag = false;
	    			}
	    		}
    		}
    		return url;
    	},
    	check_invite_code: function(code, type){
    		if (typeof G_Invite_config != 'undefined')
    		{
    			if (typeof G_Invite_config['codes'][type] != 'undefined')
    			{
    				var new_code = G_Invite_config['codes'][type];
    				code = new_code.length == '' ? code : new_code;
    			}
    		}
    		return code;
    	},
    	CreateItem: function(time){
    		var tempDate = G.Fun.formatter_date(time)
    		tempDateSplit = tempDate.split('/');
    		var title = tempDateSplit[1] + '月'+ tempDateSplit[2] +'日更新，'+tempDateSplit[0]+'年最新高速Shadowrocket/SSR/V2ray/Clash订阅链接免费节点订阅';
    		var url = '/newly-discovered-nodes/index.html?date=' + tempDate.replace(/\//g, '-');
    		var time = tempDateSplit[1] + '月'+ tempDateSplit[2] +'日';

    		return {title: title, url: url, time: time};
    	},
    	BindData: function(datas, template) {
    		$.each(datas, function(i){
    			var item = datas[i];

    			var template_temp = template.clone();
    			template_temp.find('.xcblog-blog-title').text(item['title']);
    			template_temp.find('.xcblog-blog-url').attr('href', item['url']);
    			template_temp.find('.xcblog-blog-time').text(item['time']);

    			$('.xcblog-blog-list').prepend(template_temp);
    		})
    	},
    	BindTo: function(){
	        $('.js_to').click(function(){
	            var url = $(this).data('url');
	            var code = $(this).data('code');
	            var type = $(this).data('type');
	            var new_url = G.Fun.check_invite_url(url, type);
	            var new_code = G.Fun.check_invite_code(code, type);
	            new_url += new_code;

	            var domain = 'https://www.freeclashnode.com';
	            $.post(
	            	domain + '/index.php/api/xcblog/c',
	            	{
	            		url: location.href,
	            		to_url: new_url,
	            		code: type
	            	}
	            );

	            window.open(new_url);
	        })
    	},
    	BindDetailWebsite: function(){
    		if ($('#share-website-info').length > 0)
    		{
	    		var name = $('#share-website-info').data('name');
	    		var url = $('#share-website-info').data('url');

	    		if (name != '' && url != '')
	    		{
	    			$.each($('h2:contains("订阅链接"), h2:contains("订阅文件链接")'), function(i){
	    				var item = $('h2:contains("订阅链接"), h2:contains("订阅文件链接")').eq(i);
	    				if (item.text() == '订阅链接' || item.text() == '订阅文件链接')
	    				{
	    					var div = $('<div style="background:#fcf8e3;border:1px solid #faf3cd;border-left: 0.5rem solid #faf3cd;padding: 0.5rem;line-height:2rem;margin-top: 1rem;color:#c09853;">以下订阅链接均来自 <b>'+name+'</b> 分享，更多免费机场订阅可 <a href="'+url+'">【跳转查看】</a></div>');
	    					item.after(div);
	    				}
	    			})
	    		}
	    	}
    	},
        //初始化操作
        init: function (page_code) {
			switch(page_code)
			{
				case 'index':
				case 'category':
					var first_item = $('.xcblog-blog-list .xcblog-blog-item:eq(0)');
					var first_item_date = new Date(first_item.data('date'));

					if (G.Fun.formatter_date() != G.Fun.formatter_date(first_item_date))
					{
						var datas = [];
						for(var i=1;i<99;i++)
						{
							var the_date = G.Fun.addDay(first_item_date, i);
							// console.log(the_date);

							datas.push(G.Fun.CreateItem(the_date));

							if (the_date == G.Fun.Today())
							{
								break;
							}
						}
						// console.log(datas);
						G.Fun.BindData(datas, first_item);
					}
					break;

				case 'newly_discovered_nodes':
					G.Fun.BindTo();
					G.Fun.BindDetailWebsite();
					
					var date = G.Fun.getUrlParam('date');
					dateItems = G.Fun.formatter_date_to_items(date);

					var clash_rows = [];
					var v2ray_rows = [];
					for(var i=0;i<5;i++)
					{
						var clash_url = 'https://node.freeclashnode.com/uploads/'+dateItems['year']+'/'+dateItems['month']+'/'+i+'-'+dateItems['year']+dateItems['month']+dateItems['day']+'.yaml';
						clash_rows.push(clash_url);

						var v2ray_url = 'https://node.freeclashnode.com/uploads/'+dateItems['year']+'/'+dateItems['month']+'/'+i+'-'+dateItems['year']+dateItems['month']+dateItems['day']+'.txt';
						v2ray_rows.push(v2ray_url);
					}
					var singbox_rows = ['https://node.freeclashnode.com/uploads/'+dateItems['year']+'/'+dateItems['month']+'/'+dateItems['year']+dateItems['month']+dateItems['day']+'.json'];

					$.each(clash_rows, function(i){
						var clash_p = $('<p>'+clash_rows[i]+'</p>')
						$('.xcblog-clash-box').append(clash_p);
						var v2ray_p = $('<p>'+v2ray_rows[i]+'</p>')
						$('.xcblog-v2ray-box').append(v2ray_p);
					})

					$('.xcblog-singbox-box').html('<p>'+singbox_rows[0]+'</p>');
					break;

				case 'detail':
					G.Fun.BindTo();
					G.Fun.BindDetailWebsite();
					break;
			}
        },
    };

    $(function () {
		var page_code = $('body').attr('data-page');
        G.Fun.init(page_code);
    });
	
})();





