	// 分页操作
		function Page(){
			str = '';
			var strs = '';
			$.ajax({
				'url': 'http://127.0.0.1:8080/page',
				'method': 'POST',
				'data': {'pageNum':pageNum,'nowNum':nowNum,'totalNum':totalNum,'listName':listName},
				'success': function(data){
					let datas = JSON.parse(data);
					totalNum = datas[0];
					if(listName != 'shop'){
						let strs = '';
						strs = '<tr><th>番剧名称</th><th>番剧图片</th><th>追番人数</th><th>播放次数</th><th>番剧评分</th><th>番剧权限</th><th>操作</th></tr>';
						$('.tb').html(strs);
						for(let i=0; i<datas[1].length; i++){
							str +='<tr><td class="t">' +datas[1][i].title;
							str +='</td><td><img src="' +datas[1][i].imgCover+'">';
							str +='</td><td>' +datas[1][i].follow;
							str +='</td><td>' +datas[1][i].play;
							str +='</td><td>' +datas[1][i].score;
							str +='</td><td>' +datas[1][i].badge;
							str +='</td><td style="display:none">' +datas[1][i].id;
							str +='</td><td><button class="btn btn-primary lh" data-toggle="modal"';
							str +='data-target="#Update" onclick="Update(this)">修改</button>';
							str +='<button class="btn btn-danger lh"';
							str +='onclick="Delete('+datas[1][i].id+')">删除</button>';
							str +='</td></tr>';
							$('.tbody').html(str);
						}
					}else{
						let strs = '';
						strs = '<tr><th>商品名</th><th>商品图片</th><th>价格</th><th>介绍</th><th>操作</th></tr>';
						$('.tb').html(strs);
						for(let i=0; i<datas[1].length; i++){
							str +='<tr><td class="t">' +datas[1][i].name;
							str +='</td><td><img src="' +datas[1][i].itemsImg+'">';
							str +='</td><td>' +datas[1][i].price;
							str +='</td><td class="t">' +datas[1][i].brief;
							str +='</td><td style="display:none">' +datas[1][i].itemsId;
							str +='</td><td><button class="btn btn-primary lh" data-toggle="modal"';
							str +='data-target="#Update" onclick="Update(this)">修改</button>';
							str +='<button class="btn btn-danger lh"';
							str +='onclick="Delete('+datas[1][i].id+')">删除</button>';
							str +='</td></tr>';
							$('.tbody').html(str);
						}
					}
					// 分页设置只显示五个下标
					if(totalNum <= 5){
						for(let i=0; i<totalNum; i++){
							strs += '<button class="fl btn '+((i+1)==nowNum?'btn-primary':'')+'" onclick="handlePage('+ (i+1) +')">'+ (i+1) +'</button>';
							$('.pageBody').html(strs);
						}	
					}else{
						if(nowNum < 5){
							for(let i=0; i<5; i++){
								strs += '<button class="fl btn '+((i+1)==nowNum?'btn-primary':'')+'" onclick="handlePage('+ (i+1) +')">'+ (i+1) +'</button>';
								$('.pageBody').html(strs);
							} 
						}else if(nowNum >= 5 && (nowNum+3) < totalNum){
							for(let i=nowNum-2; i<((nowNum+3)>=totalNum?totalNum:(nowNum+3)); i++){
								strs += '<button class="fl btn '+((i)==nowNum?'btn-primary':'')+'" onclick="handlePage('+ i +')">'+ i +'</button>';
								$('.pageBody').html(strs);
							}
						}else{
							for(let i=totalNum-4; i<=totalNum; i++){
								strs += '<button class="fl btn '+((i)==nowNum?'btn-primary':'')+'" onclick="handlePage('+ i +')">'+ i +'</button>';
								$('.pageBody').html(strs);
							}
						}
					}
					$('.nowNum').html('当前第'+nowNum+'页');
					$('.pageTotal').html('总共'+totalNum+'页');
				}
			});
		}
	// 初始化分页
		function initPage(){
			pageNum = 10; // 每页查询数据
			nowNum = 1; // 当前页面号数
			totalNum = 1; // 数据总页数
			Page();
		}
// 上一页操作	
		function Prev(){
			if(nowNum-1 > 0){
				nowNum = nowNum-1;
			}else{
				nowNum = 1;
			}
			Page();
		}
// 下一页操作		
		function Next(){
			if(nowNum+1 > totalNum){
				nowNum = totalNum;
			}else{
				nowNum = nowNum+1;
			}
			Page();
		}
// 点击切换分页
		function handlePage(index){
			nowNum = index;
			Page();
		}