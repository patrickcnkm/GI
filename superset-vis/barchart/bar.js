import d3 from 'd3';

require('./bar.css');

function dashboard(slice, payload) {

  const margin = {top: 30, right: 120, bottom: 0, left: 120},
        width = slice.width() - margin.left - margin.right,
        height = slice.height() - margin.top - margin.bottom;
		
  // the bar height
  const barHeight = 20;
  
  // duration and delay
  const duration = 750,
        delay = 25;
		
  // the key name of the node's root node's children
  let fn;
  // put these children nodes in an array  
  let kind = [];
	  
  // set up the x-scale 
  const x = d3.scale.linear()
  .range([0, width]);
  
  const xAxis = d3.svg.axis()
  .scale(x)
  .orient('top');

  // thd divide when the nodes have the childNodes or not
  const color = d3.scale.ordinal()
  .range(['steelblue', '#ccc']);	  

  const partition = d3.layout.partition()	
  //find the node's value
  .value(function(d) {
    let finalName  = findFather(d);	
    for(let i = 0; i < kind.length; i++) {
	  if (finalName === kind[i].key) {
      return d.values[i].y;	       	  
    }	  
  }
  });
    
  // set up the svg
  const svg = d3.select('body').append('svg')
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
	
  /**
   this part needs the support of superset
   and we must know how to use 'root' from the data in the superset  
  */
  // these two sentences simulate the process of getting data from superset
  var json = payload.data.json;
  var root = json.root;
  
  for(let i = 0; i < root.children.length; i++) {
	kind.push(root.children[i]);	
  }
  let part = partition.nodes(root);  
  x.domain([0, root.value]).nice();
  down(root, 0);	  
}

/**
find root node's child node 's name which is this node's ancestor node
d : the node 's data
return: root node's child node 's name which is this node's ancestor node	
*/
function findFather(d){							
  // if the node's parent node is the root node, return the node's name
  if (d.parent.depth === 0) {
	fn = d.key;								
	return fn;
  //if not, recursive call the function until find it
  } else {
	findFather(d.parent);
  }
  //return root node's child node which is this node's ancestor node's name.					
  return fn; 
}

/**
Drill down the bar chart
d: the data of the node, i: index of the node
return : null;
*/
function down(d, i) {
  if (!d.children || this.__transition__) return;	
  let end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  let exit = svg.selectAll('.enter')
  .attr('class', 'exit');

  // Entering nodes immediately obscure the clicked-on bar, so hide it.
  exit.selectAll('rect').filter(function(p) { return p === d; })
  .style('fill-opacity', 1e-6);

  // Enter the new bars for the clicked-on data.
  // Per above, entering bars are immediately visible.
  let enter = bar(d)
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
  let enterTransition = enter.transition()
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
  let exitTransition = exit.transition()
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
  let end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  let exit = svg.selectAll('.enter')
  .attr('class', 'exit');

  // Enter the new bars for the clicked-on data's parent.
  let enter = bar(d.parent)
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
  let enterTransition = enter.transition()
  .duration(end)
  .style('opacity', 1);

  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enterTransition.select('rect')
  .attr('width', function(d) { return x(d.value); })
  .each('end', function(p) { if (p === d) d3.select(this).style('fill-opacity', null); });

  // Transition exiting bars to the parent's position.
  let exitTransition = exit.selectAll('g').transition()
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
  let bar = svg.insert('g', '.y.axis')
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
  let x0 = 0;
  return function(d) {
    let tx = 'translate(' + x0 + ',' + barHeight * i * 1.2 + ')';
    x0 += x(d.value);
    return tx;
  };
}