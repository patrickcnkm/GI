/**
该页面所展示的为一个以树状图构成的数据结构图。
通过点击节点可以展开或者缩进其子节点数据，
通过点击节点旁所属的文字，可以开启一个修改数据的界面，可以通过滑动输入或者数字输入来对数据进行修改，
在点击按钮提交后，可以对树状图中的数据进行修改
*/


//树状图的长宽设定
const height = 600;
const width = 1000;
//树状布局，用于图像绘制
var tree  = d3.layout.tree()
  .size([height, width])
  .value(function(d) {return m.get(d.name);});
//分层布局，用于数据分析与储存
var partition  = d3.layout.partition()
  .value(function(d) {return d.size;});
//对角线绘制器  
var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });
//创建图像背景svg  
var svg = d3.select("#svg").append("svg")
    .attr("width", width)
    .attr("height", height)
	.attr("transform","translate(200,0)");
//数据中树的根结点
var root;
//用于储存数据的Map
var m = new Map();

//数据读取以及程序调用
d3.json("flare.json",function(error,flare) {
  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;
	
  //先行处理数据，将数据中的每一个节点的名字以及数值储存在一个map中，以供后续操作。
  var count = partition.nodes(root);
  count.forEach(function(d){ m.put(d.name,d.value); })
  //开始绘图
  redraw(root);
});

//
/**
用于对绘图进行更新
source : 被点击的节点
return : null
*/
function redraw(source){
  //重新计算节点与连线位置
  var nodes = tree.nodes(root);
  var links = tree.links(nodes);
  
  nodes.forEach(function(d) { d.y = d.depth * 180; });
  
  //获取节点的update部分(现有部分)
  var nodeUpdate = svg.selectAll(".node")
    .data(nodes, function(d){ return d.name; });
  //获取节点的enter部分(进入部分)
  var nodeEnter = nodeUpdate.enter();
  //获取节点的exit部分(离开部分)
  var nodeExit = nodeUpdate.exit();
   
  //enter部分的处理
  var enterNodes = nodeEnter.append("g")
    .attr("class","node")
	.attr("transform", function(d) {
		return "translate(" + source.y0 + "," + source.x0 + ")";
	});

  //添加圆点
  enterNodes.append("circle")
    .attr("r", 0)
	.style("fill", function(d) {
	  return d._children ? "lightsteelblue" : "#fff";
	})
	.on("click", function(d) {
		toggle(d);
		redraw(d);

	});
  //添加文字
  enterNodes.append("text")
    .attr("x", function(d) {
	  return d.children || d._children ? -14 : 14;
	})
	.attr("id",function(d) {
	  return d.name
	})
	.attr("class","txt")
	.attr("dy", ".35em")
	.style("font-size","15px")
	.attr("text-anchor", function(d) {
	return d.children || d._children ? "end" : "start";
	})
	.text(function(d) {return d.name +" "+ d.value; })
	.style("fill-opacity", 0)
	.on("click",change);
  
  //update部分处理方法
  var updateNodes = nodeUpdate.transition()
    .duration(500)
	.attr("transform", function(d) {
	  return "translate(" + d.y + "," + d.x + ")";
	});
	
  updateNodes.select("circle")
    .attr("r",8)
	.style("fill", function(d) {
		return d._children ? "lightsteelblue" : "#fff";
	});
	
  updateNodes.select("text")
    .style("fill-opacity", 1);
	
  //exit部分处理方法  
  var exitNodes= nodeExit.transition()
    .duration(500)
	.attr("transform", function(d) {
	  return "translate(" + source.y + "," + source.x + ")";
	})
	.remove();
	
  exitNodes.select("circle")
    .style("r", 0);
	
  exitNodes.select("text")
    .style("fill-opacity");

  //获取连线的update部分
  var linkUpdate = svg.selectAll(".link")
        .data(links, function(d){ return d.target.name; });
  //获取连线的enter部分	
  var linkEnter = linkUpdate.enter();
  //获取连线的exit部分
  var linkExit = linkUpdate.exit();
  
  //enter部分处理方法
  linkEnter.insert("path",".node")
    .attr("class", "link")
	.attr("d", function(d) {
	  var o = {x: source.x0, y: source.y0};
	  return diagonal({source: o, target: o});
	})
	.transition()
	.duration(500)
	.attr("d", diagonal);
  //update部分处理方法
  linkUpdate.transition()
    .duration(500)
	.attr("d",diagonal);
  //exit部分处理方法
  linkExit.transition()
    .duration(500)
	.attr("d", function(d) {
	  var o = {x: source.x0, y: source.y0};
	  return diagonal({source: o, target: o});
	})
	.remove();
  
  //保存节点坐标
  nodes.forEach(function(d) {
	  d.x0 = d.x;
	  d.y0 = d.y;
	  m.put(d.name,d.value);	  
  });  
}

/**
开关切换
d: 被点击的节点
return : null
*/
function toggle(d){ 
  //如果有孩子，将孩子转移，并且消除孩子 
  if (d.children) {
	d._children = d.children;
	d.children = null;
  //如果没有孩子，从_children中获得孩子
  } else {
	d.children = d._children;
	d._children = null;
  }
}

//获取节点数值并且根据输入进行更改

//现在正在处理的节点的名字
var now = null;

/**
创建输入框，按钮，并且调用数据更新函数
d: 需要进行数据修改的节点
return : null;
*/
function change(d){
  //消除被选中的节点的痕迹
  var e = d;
  var seltexts = d3.select("#" + now);
  seltexts.style("font-weight","normal")
	.attr("fill","black");

  //如果没有节点被传进来，直接返回
  if(!d) return;
  //获取需要被变更的节点的文字部分，并且标红
  var sel = "#" + d.name;
  var seltext = d3.select(sel);
  seltext.style("font-weight","bolder")
	     .attr("fill","red");
  //将被变更节点的原数值进行记录		 
  //var recordNumber = d.value;
  //记录将被变更的节点的名字
  var newName = d.name;
  //number为将接受的输入的数字
  //var number;
  //如果选择的节点没有改变
  if (newName === now) {
	//直接获取 输入的数字 
	number = d3.select("#numberIn").property("value");
  //否则，创建输入框，然后再获得输入的数字
  } else {
	d3.selectAll("input").remove();
	d3.selectAll("button").remove();
	now = newName;
	var numberIn = d3.select("#numberin")
      .append("input")
	  .attr("id","numberIn")
	  .attr("type","number")
      .style("text-align","center")
	  .property("value",m.get(d.name));
	  
	var rangeIn = d3.select("#rangein")
      .append("input")
	  .attr("id","rangeIn")
	  .attr("type","range")
      .attr("min",1)
	  .attr("max",m.get(d.name) * 3)
	  .property("value",m.get(d.name))
	  .on("mousemove",show);
	  
	var button = d3.select("#but")
	  .append("button")
	  .attr("id","button")
	  .attr("type","button")
	  .text("click");
		
	
	}
  //计算新数值与原数值的比率
  button.on("click",function(d){
	  renew(e);
  }) 
  
  //将其存入map
  
  //启用更新函数
  //renew(d,rate);	
}
/**
实时获得滑动输入的数字，并且显示在数值输入框中
*/
function show(){
  var number = d3.select("#rangeIn").property("value");
  d3.select("#numberIn").property("value",number);
}

/**
页面数据更新以及对文字进行更新(按钮调用版本)
d: 需要进行数据修改的节点
return : null;
*/
function renew(d){
  //获取数据，并且把数据存入map
  var recordNumber = d.value; 
  var number = d3.select("#numberIn").property("value");
  m.put(d.name,number);
  //计算原值与新值的比例
  var rate = number/recordNumber;
  
  //对节点是否有孩子，是否有存储孩子的_children，以及节点是否为底层数据(只有底层数据有d.size)进行判断
  flagC = d.hasOwnProperty("children");
  flag_C = d.hasOwnProperty("_children");
  flag_S = d.hasOwnProperty("size");
  
  //根据节点的不同情况更新数据
  if(!flag_S) {

	if(flagC) {		
      for(var i = 0; i < d.children.length; i++){
		renew2(d.children[i],rate);
	  }
	} else {
	  m.put(d.name, Math.round(d.value * rate));
      for(var i = 0; i < d._children.length; i++){
		renew2(d._children[i],rate);
	  }
    }		
  }
  else{	  
	m.put(d.name, Math.round(d.value * rate));
    d.value = Math.round(d.value * rate);
  }
  //重新计算树状数据
  var nodes = tree.nodes(root);
  //将新的树状数据存入map
  for(var i = 0; i < nodes.length; i++){
      m.put(nodes[i].name,nodes[i].value);
  }
  //更新页面数据
  for(var i = 0; i < nodes.length; i++){
    var name = nodes[i].name;
    var sel = "#" + nodes[i].name;
    var seltext = d3.select(sel);
    seltext.text(nodes[i].name+" "+nodes[i].value);
  }
}
/**
页面数据更新以及对文字进行更新(递归调用版本)
d: 需要进行数据修改的节点
return : null;
*/
function renew2(d,rate){
  flagC = d.hasOwnProperty("children");
  flag_C = d.hasOwnProperty("_children");
  flag_S = d.hasOwnProperty("size");

  if(!flag_S) {

	if(flagC) {		
      for(var i = 0; i < d.children.length; i++){
		renew2(d.children[i],rate);
	  }
	} else {
	  m.put(d.name, Math.round(d.value * rate));
      for(var i = 0; i < d._children.length; i++){
		renew2(d._children[i],rate);
	  }
    }		
  }
  else{	  
	m.put(d.name, Math.round(d.value * rate));
    d.value = Math.round(d.value * rate);
  }

  var nodes = tree.nodes(root);
  
  for(var i = 0; i < nodes.length; i++){
      m.put(nodes[i].name,nodes[i].value);
  }

  for(var i = 0; i < nodes.length; i++){
    var name = nodes[i].name;
    var sel = "#" + nodes[i].name;
    var seltext = d3.select(sel);
    seltext.text(nodes[i].name+" "+nodes[i].value);
  }
}

// 封装表单数据方法
function Map() {
  this.keys = new Array();
  this.data = new Array();
  //添加键值对
  this.put = function(key, value) {
    if (this.data[key] == null) { //如键不存在则给键域数组添加键名
      this.keys.push(value);
    }
      this.data[key] = value; //给键索引对应的值域赋值
  };
	
  //获取键对应的值
  this.get = function(key) {
    return this.data[key];
  };
  
  //去除键值，(去除键数据中的键名及对应的值)
  this.remove = function(key) {
    this.keys.remove(key);
    this.data[key] = null;
  };
  
  //判断键值元素是否为空
  this.isEmpty = function() {
    return this.keys.length == 0;
  };
  
  //获取键值元素大小
  this.size = function() {
    return this.keys.length;
  }; 
}
