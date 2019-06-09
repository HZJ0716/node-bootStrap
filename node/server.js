var mysql = require('mysql');
var http = require('http');
var querystring = require('querystring');


// 数据库设置
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '123456',
	port : '3306',
	database : 'bilibili',
	multipleStatements : 'true'
});

// 创建服务器连接
var server = http.createServer( function(req, res){
	// 定义头部解决汉字编码问题
	res.setHeader('Content-Type','text/plain;charset=utf-8');
	// 解决本地跨域问题
	res.setHeader('Access-Control-Allow-Origin','*');
	// 从前端url网址获取信息
	if(req.url == '/china'){
	let sql='SELECT * FROM china limit 10';
		// 连接数据库并执行SQL语句
		connection.query(sql,(err, result) =>{
			if(err){
				console.log('[SELECT ERROR] - ',err.message);
				return;
			}
			// 将数据库查询信息返回给前端
			res.end(JSON.stringify(result));
		});
	}
	else if(req.url == '/fanju'){
		let sql='SELECT * FROM fanju limit 10';
		connection.query(sql,(err, result) =>{
			if(err){
				console.log('[SELECT ERROR] - ',err.message);
				return;
			}
			res.end(JSON.stringify(result));
		});
	}
	else if(req.url == '/search'){
			let str = '';
			// 获取前台上传的数据
			req.on('data',(data)=>{
				str += data;
			});
			req.on('end', ()=>{
				// 将数据转为字符串
				str = str.toString();
				// 将数据转为JSON类型
				var sea =  querystring.parse(str);
				let s = /\s/g;
				let qu = s.test(sea.item);
				if(!qu){
					// 对数据库进行模糊查询
					let sql = 'select * from '+sea.listName+' where title like "%'+ sea.data+'%" limit 10';
					connection.query(sql,(err, result) =>{
						if(err){
							console.log('[SELECT ERROR] - ',err.message);
							return;
						}
						res.end(JSON.stringify(result));
					});
				}
			});
	}
	else if(req.url == '/add'){
		let str = '';
		// 获取前台上传的数据
		req.on('data',(data)=>{
			str += data;
		});
		req.on('end', ()=>{
			// 将数据转为字符串
			str = str.toString();
			// 将数据转为JSON类型
			var sea =  querystring.parse(str);
			let params = [sea.badge,sea.imgCover,sea.follow,sea.title,sea.play,sea.score,sea.link];
			// 插入新的数据
			let sql = 'INSERT INTO '+sea.listName+' (badge,imgCover,follow,title,play,score,link) VALUES (?,?,?,?,?,?,?)';
			connection.query(sql, params, (err, result) =>{
				if(err){
					console.log('[SELECT ERROR] - ',err.message);
					res.end();
					return;
				}
				res.end('success');
			});
		});
	}
	else if(req.url == '/del'){
		let str = '';
		// 获取前台上传的数据
		req.on('data',(data)=>{
			str += data;
		});
		req.on('end', ()=>{
			// 将数据转为字符串
			str = str.toString();
			// 将数据转为JSON类型
			var sea =  querystring.parse(str);
			// 删除相应的id数据
			let sql = 'DELETE FROM '+sea.listName+' where id='+sea.index;
			connection.query(sql, (err, result) =>{
				if(err){
					console.log('[SELECT ERROR] - ',err.message);
					res.end();
					return;
				}
				res.end('success');
			});
		});
	}
	else if(req.url == '/upd'){
		let str = '';
		// 获取前台上传的数据
		req.on('data',(data)=>{
			str += data;
		});
		req.on('end', ()=>{
			// 将数据转为字符串
			str = str.toString();
			// 将数据转为JSON类型
			var sea =  querystring.parse(str);
			let params = [sea.badge,sea.imgCover,sea.follow,sea.title,sea.play,sea.score,sea.link,sea.id];
			// 修改相应id的数据
			let sql = 'UPDATE '+sea.listName+' SET badge = ?,imgCover = ?,follow = ?,title = ?,play = ?,score = ?,link = ? WHERE id = ?';
			connection.query(sql, params, (err, result) =>{
				if(err){
					console.log('[SELECT ERROR] - ',err.message);
					res.end();
					return;
				}
				res.end('success');
			});
		});
	}
	else if(req.url == '/page'){
		let str = '';
		// 获取前台上传的数据
		req.on('data',(data)=>{
			str += data;
		});
		req.on('end',()=>{
			// 将数据转为字符串
			str = str.toString();
			// 将数据转为JSON类型
			var sea =  querystring.parse(str);
			let nowNum = (sea.nowNum-1)*10;
			let pageNum = sea.pageNum;
			let resp = [];
			let sql = 'select count(*) as rows from '+sea.listName;
			let sql1 ='select * from '+sea.listName+ ' limit ' + nowNum +','+pageNum;
			connection.query(sql, (err, result) =>{
				if(err){
					console.log('[SELECT ERROR] - ',err.message);
				}
				resp[0] = Math.ceil(result[0].rows/pageNum);
				connection.query(sql1, (err, result) =>{
					if(err){
						console.log('[SELECT ERROR] - ',err.message);
					}
					resp[1] = result;
					res.end(JSON.stringify(resp));
				});
			});
		})
	}
	else{
		console.log('请求错误');
	}
});

server.listen(8080, '127.0.0.1');
console.log('listening on port  8080');