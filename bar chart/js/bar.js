/**
The bar chart is used to drill down the data.
The length of the bar represents the total sales of bar's name.
The blue bar represents this part of data can be divides into different section, and grey one means the data can't be divided.
When clicking the white background bubble, it can back up to the parent section.
*/

// margin width
var margin = {top: 30, right: 120, bottom: 0, left: 120},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
// set up the x-scale 
var x = d3.scale.linear()
  .range([0, width]);
// the bar height
var barHeight = 20;

// thd divide when the nodes have the childNodes or not
var color = d3.scale.ordinal()
  .range(['steelblue', '#ccc']);
	
// duration and delay
var duration = 750,
    delay = 25;

// the key name of the node's root node's children
var fn;	

/**
find root node's child node 's name which is this node's ancestor node
d : the node 's data
return: root node's child node 's name which is this node's ancestor node	
*/
function findFather(d){							
  
  // if the node is the root node, return
  if (d.key == 'all') {								
	return;
  }
  // if the node's parent node is the root node, return the node's name
  if (d.parent.key == 'all') {
	fn = d.key;								
	return;
  //if not, recursive call the function until find it
  } else {
	findFather(d.parent);
  }
  //return root node's child node which is this node's ancestor node's name.					
  return fn;
  
}

// set up the partition
var partition = d3.layout.partition()	
  //find the node's value
  .value(function(d) {
	var finalName  = findFather(d);
	  if (finalName == '\u9152\u4e1a') {							
		return d.values[0].y;							
	  } else if (finalName == '\u96f6\u552e') {							
		return d.values[1].y; 							
	  } else if (finalName == '\u7cd6\u4e1a') {						
		return d.values[2].y;
	  } else {
		return d.values[3].y;
	  }
  }
);
	
// set up the x-scale
var xAxis = d3.svg.axis()
  .scale(x)
  .orient('top');
	
// set up the svg
var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
// make a background rect on the svg which use to back up to the parent section
svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .on('click', up);
	
// append the x-scale in the svg
svg.append('g')
      .attr('class', 'x axis');
	
// append the y-scale in the svg
svg.append('g')
      .attr('class', 'y axis')
   .append('line')
      .attr('y1', '100%');

// read the json , turn the data into the partition, and call the function
d3.json('spain1.json', function(error, root) {
  if (error) throw error;
 
  var a = partition.nodes(root);
  console.log(a);
  
  
  x.domain([0, root.value]).nice();
  down(root, 0);
});

/**
Drill down the bar chart
d: the data of the node, i: index of the node
return : null;
*/
function down(d, i) {
  if (!d.children || this.__transition__) return;	
  var end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll('.enter')
    .attr('class', 'exit');

  // Entering nodes immediately obscure the clicked-on bar, so hide it.
  exit.selectAll('rect').filter(function(p) { return p === d; })
    .style('fill-opacity', 1e-6);

  // Enter the new bars for the clicked-on data.
  // Per above, entering bars are immediately visible.
  var enter = bar(d)
    .attr('transform', stack(i))
    .style('opacity', 1);

  // Have the text fade-in, even though the bars are visible.
  // Color the bars as parents; they will fade to children if appropriate.
  enter.select('text')
    .style('fill-opacity', 1e-6);
  enter.select('rect')
    .style('fill', color(true));

  // Update the x-scale domain.
  x.domain([0, d3.max(d.children, function(d) { return d.value; })])
      .nice();

  // Update the x-axis.
  svg.selectAll('.x.axis').transition()
    .duration(duration)
    .call(xAxis);

  // Transition entering bars to their new position.
  var enterTransition = enter.transition()
    .duration(duration)
    .delay(function(d, i) { return i * delay; })
    .attr('transform', function(d, i) { return 'translate(0,' + barHeight * i * 1.2 + ')'; });

  // Transition entering text.
  enterTransition.select('text')
    .style('fill-opacity', 1);

  // Transition entering rects to the new x-scale.
  enterTransition.select('rect')
    .attr('width', function(d) { return x(d.value); })
    .style('fill', function(d) { return color(!!d.children); });

  // Transition exiting bars to fade out.
  var exitTransition = exit.transition()
    .duration(duration)
    .style('opacity', 1e-6)
    .remove();

  // Transition exiting bars to the new x-scale.
  exitTransition.selectAll('rect')
    .attr('width', function(d) { return x(d.value); });

  // Rebind the current node to the background.
  svg.select('.background')
    .datum(d)
    .transition()
      .duration(end);

  d.index = i;
}

/**
Drill up the bar chart
d: the data of the node, i: index of the node
return : null;
*/
function up(d) {
  if (!d.parent || this.__transition__) return;
  var end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll('.enter')
    .attr('class', 'exit');

  // Enter the new bars for the clicked-on data's parent.
  var enter = bar(d.parent)
    .attr('transform', function(d, i) { return 'translate(0,' + barHeight * i * 1.2 + ')'; })
    .style('opacity', 1e-6);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  enter.select('rect')
    .style('fill', function(d) { return color(!!d.children); })
    .filter(function(p) { return p === d; })
    .style('fill-opacity', 1e-6);

  // Update the x-scale domain.
  x.domain([0, d3.max(d.parent.children, function(d) { return d.value; })]).nice();

  // Update the x-axis.
  svg.selectAll('.x.axis')
    .transition()
      .duration(duration)
    .call(xAxis);

  // Transition entering bars to fade in over the full duration.
  var enterTransition = enter.transition()
    .duration(end)
    .style('opacity', 1);

  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enterTransition.select('rect')
    .attr('width', function(d) { return x(d.value); })
    .each('end', function(p) { if (p === d) d3.select(this).style('fill-opacity', null); });

  // Transition exiting bars to the parent's position.
  var exitTransition = exit.selectAll('g').transition()
    .duration(duration)
    .delay(function(d, i) { return i * delay; })
    .attr('transform', stack(d.index));

  // Transition exiting text to fade out.
  exitTransition.select('text')
    .style('fill-opacity', 1e-6);

  // Transition exiting rects to the new scale and fade to parent color.
  exitTransition.select('rect')
    .attr('width', function(d) { return x(d.value); })
    .style('fill', color(true));

  // Remove exiting nodes when the last child has finished transitioning.
  exit.transition()
    .duration(end)
    .remove();

  // Rebind the current parent to the background.
  svg.select('.background')
      .datum(d.parent)
    .transition()
      .duration(end);
}

/** 
Creates a set up of bars for the given data node, at the specified index.
d: the data of the node
return: the bar include the rect and the its title
*/
function bar(d) {
  var bar = svg.insert('g', '.y.axis')
    .attr('class', 'enter')
    .attr('transform', 'translate(0,5)')
  .selectAll('g')
      .data(d.children)
  .enter().append('g')
    .style('cursor', function(d) { return !d.children ? null : 'pointer'; })
    .on('click', down);

  bar.append('text')
    .attr('x', -6)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function(d) { return d.key||d.x; });

  bar.append('rect')
    .attr('width', function(d) { return x(d.value); })
    .attr('height', barHeight);

  return bar;
}

/**
A stateful closure for stacking bars horizontally.
i : index of data
return : the transition sentence of the bar
*/
function stack(i) {
  var x0 = 0;
  return function(d) {
    var tx = 'translate(' + x0 + ',' + barHeight * i * 1.2 + ')';
    x0 += x(d.value);
    return tx;
  };
}

