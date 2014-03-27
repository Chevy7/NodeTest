var common = require("./../../Desktop/Node/common");//通用帮助类
var model = require("./../../Desktop/Node/model");//模型
var db= require("./../../Desktop/Node/dbHelper");//数据库帮助


var orm = db.getDB();//获取上下文
var opts = db.getOpts();//获取数据库配置参数

//日志添加
function addLog(response,queryStr)
{
	var params = common.paramHandel(queryStr);
	var siteName =params["siteName"];

	addLogDAL(siteName,function(res){
	    response.writeHead(200,{"Content-Type":"text/html"});
	    response.write(res+"");
		response.end();
	});
}

//返回数据列表
function getList(response,queryStr)
{
	var params = common.paramHandel(queryStr);
	var page = params["page"];
	var size = params["size"];
	var sdate =  params["sdate"];
	var edate =  params["edate"];
	if (!page) {
		page =1
	};
	if (!size) {
		size =3
	};
	getListDAL(page,size,function(data){
		response.writeHead(200,{"Content-Type":"text/html"});
		for (var i = 0; i <data.length; ++i) {
			var unit = data[i];
    		response.write(unit.SiteName+"&nbsp;&nbsp;&nbsp;"+unit.ViewDate.Format("yyyy-MM-dd hh:mm:ss")+"<br/>");
		};
		response.end();
	});
}



//数据层
function addLogDAL(siteName,haddler)
{
	orm.connect(opts, function (err, db) {
		if (err) throw err;
		var Log = db.define("Logs",model.Log);

	    var date = common.getDate();
		Log.create(
        [
	        {
				SiteName:siteName,
				ViewDate:date
	        }
        ],function(err,items){
        	if (err) {
        		throw err;
        	}
        	else
        	{
        		haddler(true); //返回值 如何处理
        	}
        });
	});
};

function getListDAL(page,pageSize,haddler)
{
	orm.connect(opts, function (err, db) {
		if (err) throw err;
		var Log = db.define("Logs",model.Log);
		var index = (page-1)*pageSize;
		db.driver.execQuery("SELECT SiteName, ViewDate FROM Logs order by ViewDate DESC limit "+index+","+pageSize, function (err, data) {  
				if (err)throw err;
				haddler(data);
		});
	});
}

//方法导出
exports.addLog = addLog;
exports.getList = getList;