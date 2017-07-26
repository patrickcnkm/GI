import d3 from 'd3';

require('./bar.css');

function dashboard(slice, payload){
  // set the width and height of tree
  const height = slice.height();
  const width = slice.width();
  // set the tree layout
  const tree  = d3.layout.tree()
  .size([height, width])
  .value(function(d) {return m.get(d.name);});
  // set the partition layout which is used to dealing the data
  const partition = d3.layout.partition()
  .value(function(d) {return d.size;});
  // set the diagonal plotter  
  const diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });
  // set the svg
  const svg = d3.select('#svg')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('transform','translate(200,0)');
  // the root of the tree
  var root;
  // set the map which is used to storaging the data
  var m = new Map();
  // the node which is being deal with
  var now = null;
  
  /**
   this part needs the support of superset
   and we should know how to use 'flare' from the data in the superset  
  */
  // these two sentences simulate the process of getting data from superset
  var json = payload.data.json;
  var flare = json.flare;
  
  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;	
  // deal with the data by partition layout and put the data in the map
  let count = partition.nodes(root);
  count.forEach(function(d){ m.put(d.name,d.value); })
  // begin painting
  redraw(root);  
}

//
/**
 redraw the tree
 source : the clicked node
 return : null
*/
function redraw(source){
  // recalculate the position of the nodes and links
  let nodes = tree.nodes(root);
  let links = tree.links(nodes);
  // set the x-move distance for every node by its depth
  nodes.forEach(function(d) { d.y = d.depth * 180; });
  
  // get the update part
  let nodeUpdate = svg.selectAll('.node')
  .data(nodes, function(d){ return d.name; });
  // get the enter part 
  let nodeEnter = nodeUpdate.enter();
  // get the exit part
  let nodeExit = nodeUpdate.exit();
   
  // dealing with the enter part
  let enterNodes = nodeEnter.append('g')
  .attr('class','node')
  .attr('transform', function(d) {
	return 'translate(' + source.y0 + ',' + source.x0 + ')';
  });

  // add the node point
  enterNodes.append('circle')
  .attr('r', 0)
  .style('fill', function(d) {
	return d._children ? 'lightsteelblue' : '#fff';
  })
  .on('click', function(d) {
	toggle(d);
	redraw(d);

  });
  // add the text
  enterNodes.append('text')
  .attr('x', function(d) {
	return d.children || d._children ? -14 : 14;
  })
  .attr('id',function(d) {
	return d.name
  })
  .attr('class','txt')
  .attr('dy', '.35em')
  .style('font-size','15px')
  .attr('text-anchor', function(d) {
	return d.children || d._children ? 'end' : 'start';
  })
  .text(function(d) {return d.name +' '+ d.value; })
  .style('fill-opacity', 0)
  .on('click',change);
  
  // dealing with the update part
  let updateNodes = nodeUpdate.transition()
  .duration(500)
  .attr('transform', function(d) {
	return 'translate(' + d.y + ',' + d.x + ')';
  });
	
  updateNodes.select('circle')
  .attr('r',8)
  .style('fill', function(d) {
	return d._children ? 'lightsteelblue' : '#fff';
  });
	
  updateNodes.select('text')
  .style('fill-opacity', 1);
	
  // dealing with the exit part 
  let exitNodes= nodeExit.transition()
  .duration(500)
  .attr('transform', function(d) {
	return 'translate(' + source.y + ',' + source.x + ')';
  })
  .remove();
	
  exitNodes.select('circle')
  .style('r', 0);
	
  exitNodes.select('text')
  .style('fill-opacity');

  // get the update part of link
  let linkUpdate = svg.selectAll('.link')
  .data(links, function(d){ return d.target.name; });
  // get the enter part of link
  let linkEnter = linkUpdate.enter();
  // get the exit part of link
  let linkExit = linkUpdate.exit();
  
  // dealing with the enter part
  linkEnter.insert('path','.node')
  .attr('class', 'link')
  .attr('d', function(d) {
	let o = {x: source.x0, y: source.y0};
	return diagonal({source: o, target: o});
  })
  .transition()
  .duration(500)
  .attr('d', diagonal);
  
  // dealing with the update part
  linkUpdate.transition()
  .duration(500)
  .attr('d',diagonal);
  // dealing with the exit part
  linkExit.transition()
  .duration(500)
  .attr('d', function(d) {
	let o = {x: source.x0, y: source.y0};
	return diagonal({source: o, target: o});
  })
  .remove();
  
  //save the coordinate of the node
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
	m.put(d.name,d.value);	  
  });  
}

/**
add and remove node's children nodes by clicking
d: the clicked node
return : null
*/
function toggle(d){ 
  // if the node has children nodes , remove them and put them in the node's property named _children
  if (d.children) {
	d._children = d.children;
	d.children = null;
  // if the node has NOT children nodeS, get its children nodes from it's property named _children
  } else {
	d.children = d._children;
	d._children = null;
  }
}


/**
create the input box and button to modify the data of the clicked node
d: the clicked node which need to be modified the data
return : null;
*/
function change(d){
  let e = d;
  let seltexts = d3.select('#' + now);
  seltexts.style('font-weight','normal')
  .attr('fill','black');

  if(!d) return;
  // when clicking the node, the color of the its text will be red
  let sel = '#' + d.name;
  let seltext = d3.select(sel);
  seltext.style('font-weight','bolder')
	     .attr('fill','red');
		 
  // record the name of the clicked node
  let newName = d.name;
  // if the name changed
  if (newName === now) {
	// just get the data from the input box
	number = d3.select('#numberIn').property('value');
  // else create the input box and button
  } else {
	d3.selectAll('input').remove();
	d3.selectAll('button').remove();
	now = newName;
	let numberIn = d3.select('#numberin')
      .append('input')
	  .attr('id','numberIn')
	  .attr('type','number')
      .style('text-align','center')
	  .property('value',m.get(d.name));
	  
	let rangeIn = d3.select('#rangein')
      .append('input')
	  .attr('id','rangeIn')
	  .attr('type','range')
      .attr('min',1)
	  .attr('max',m.get(d.name) * 3)
	  .property('value',m.get(d.name))
	  .on('mousemove',show);
	  
	var button = d3.select('#but')
	  .append('button')
	  .attr('id','button')
	  .attr('type','button')
	  .text('click');
		
	
	}
  //add an listener to the button
  button.on('click',function(d){
	  renew(e);
  }) 
}
/**
 when the user uses the range input box, the number input box can get the data from it immediately
*/
function show(){
  let number = d3.select('#rangeIn').property('value');
  d3.select('#numberIn').property('value',number);
}

/**
 renew the data and text(used by button)
 d: the clicked node which need to be modified the data
 return : null;
*/
function renew(d){
  // get the data and put them in the map
  let recordNumber = d.value; 
  let number = d3.select('#numberIn').property('value');
  m.put(d.name,number);
  // caculate the rate bewteen the new number and the origin number
  let rate = number/recordNumber;
  
  // to judge the nodes have children ,_children or not and the node has the property named size(which means the node have no children at first)
  flagC = d.hasOwnProperty('children');
  flag_C = d.hasOwnProperty('_children');
  flag_S = d.hasOwnProperty('size');
  
  //根据节点的不同情况更新数据
  if(!flag_S) {

	if(flagC) {		
      for(let i = 0; i < d.children.length; i++){
		renew2(d.children[i],rate);
	  }
	} else {
	  m.put(d.name, Math.round(d.value * rate));
      for(let i = 0; i < d._children.length; i++){
		renew2(d._children[i],rate);
	  }
    }		
  }
  else{	  
	m.put(d.name, Math.round(d.value * rate));
    d.value = Math.round(d.value * rate);
  }
  // recalculate the data by partition layout 
  let nodes = tree.nodes(root);
  //  put the data in the map
  for(let i = 0; i < nodes.length; i++){
    m.put(nodes[i].name,nodes[i].value);
  }
  // renew the data on the page
  for(let i = 0; i < nodes.length; i++){
    let name = nodes[i].name;
    let sel = '#' + nodes[i].name;
    let seltext = d3.select(sel);
    seltext.text(nodes[i].name+' '+nodes[i].value);
  }
}
/**
 renew the data and text(used by recursion)
 d: the node need to be renew the data
 return : null;
*/
function renew2(d,rate){
  flagC = d.hasOwnProperty('children');
  flag_C = d.hasOwnProperty('_children');
  flag_S = d.hasOwnProperty('size');

  if(!flag_S) {

	if(flagC) {		
      for(let i = 0; i < d.children.length; i++){
		renew2(d.children[i],rate);
	  }
	} else {
	  m.put(d.name, Math.round(d.value * rate));
      for(let i = 0; i < d._children.length; i++){
		renew2(d._children[i],rate);
	  }
    }		
  }
  else{	  
	m.put(d.name, Math.round(d.value * rate));
    d.value = Math.round(d.value * rate);
  }

  let nodes = tree.nodes(root);
  
  for(let i = 0; i < nodes.length; i++){
      m.put(nodes[i].name,nodes[i].value);
  }

  for(let i = 0; i < nodes.length; i++){
    let name = nodes[i].name;
    let sel = '#' + nodes[i].name;
    let seltext = d3.select(sel);
    seltext.text(nodes[i].name+' '+nodes[i].value);
  }
}

// the map used to storage the data
function Map() {
  this.keys = new Array();
  this.data = new Array();
  // add the pair of the key and value
  this.put = function(key, value) {
    if (this.data[key] == null) { //if the key doesn't exist, create it
      this.keys.push(value);
    }
      this.data[key] = value; //add value to the key
  };
	
  // get the value by the key
  this.get = function(key) {
    return this.data[key];
  };
  
  // remove the key and its value
  this.remove = function(key) {
    this.keys.remove(key);
    this.data[key] = null;
  };
  
  // judge the map is empty or not
  this.isEmpty = function() {
    return this.keys.length == 0;
  };
  
  // get the size of the map
  this.size = function() {
    return this.keys.length;
  }; 
}
