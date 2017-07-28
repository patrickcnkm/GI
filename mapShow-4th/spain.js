var width = 800;
var height = 600;

var centered;
var projection = d3.geo.mercator()
  .center([-3,40])
  .scale(2500)
  .translate([width/2, height/2]);
var path = d3.geo.path()
  .projection(projection);
  
  

  
var initScale = projection.scale();
var initTran = projection.translate();
var show;
var colorNow;
var color = d3.scale.category10();
var local = [[495.3992987335959,262.1106217507889],[321.03672042841794,412.56666852390305],[617.5071640855325,200.1616708713583],   [349.9095736732053,311.6928452998247],[657.6897878920113,324.2253941380627],[319.3439368265585,205.61062197141854],[269.6041536628616,107.37805862545093]];

var arrow = [[-0.809409,40.625],[-4.74788,37.9699],[2.00777,41.6575],[-3.95134,39.7401],[2.99156,39.6162],[-4.83256,41.5715],[-5.84196,43.3261]];

var svg  = d3.select('body')
  .append('svg')
  .attr('width',width)
  .attr('height',height);


var zoom = d3.behavior.zoom()
  .on('zoom', function(d) {
      projection.translate([
        initTran[0] + d3.event.translate[0],
        initTran[1] + d3.event.translate[1] ]);
      
      show.attr('d',path);
  });

  
var subsvg = d3.select('body')
  .append('svg')
  .attr('width',70)
  .attr('height',height);
  
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    //.on("click", clickedout)
    .style('fill','none')
	.on('mouseover',outb)
    .call(zoom);
    
subsvg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clickedout)
    .style('fill','none')
	.on('mouseover',outb);
    
subsvg.append('rect')
  .attr("width", 20)
  .attr("height", 20)
  .style('fill','white')
  .style('cursor','pointer')
  .on("click", clickedbig)
  .attr('transform','translate(50,0)');
  
subsvg.append('rect')
    .attr("width", 20)
    .attr("height", 20)
    .on("click", clickedsmall)
    .style('fill','white')
    .style('cursor','pointer')
    .attr('transform','translate(50,25)');

subsvg.append('text')
  .attr('transform','translate(60,15)')
  .attr('text-anchor','middle')
  .text('+')
  .style('cursor','pointer')
  .on("click", clickedbig);

subsvg.append('text')
  .attr('transform','translate(60,40)')
  .attr('text-anchor','middle')
  .text('—')
  .style('cursor','pointer')
  .on("click", clickedsmall);
  
  

     
let k = 1;
var root;
var georoot; 
var groups = svg.append('g');
var countArray = [];
d3.json('Spain.json', function(error,root) {
  if(error)
    return  console.error(error);
  console.log(root);
  
  georoot = topojson.feature(root,root.objects.Spain);
  console.log(georoot);  
 
  var regionGroup = [];
  for(let i in georoot.features) {
    let region = georoot.features[i].properties.region;
    let flag = true;
    for(let j in regionGroup) {
      if (region === regionGroup[j]) {flag = false;}
    }
  }

  for(let i in georoot.features) {
    let count = georoot.features[i].properties.provnum_ne;
    if(count === 0) {
      georoot.features[i].color = 1;
    } else if(count === 8){
      georoot.features[i].color = 2;
    } else if(count === 16){
      georoot.features[i].color = 3;
    } else if(count === 7 || count === 10 || count === 17 || count === 6){
      georoot.features[i].color = 4;
    } else if(count === 1){
      georoot.features[i].color = 5;
    } else if(count === 5){
      georoot.features[i].color = 6;
    } else {
      georoot.features[i].color = 7;
    }
  }
  
  for(let i in georoot.features) {
    let name = georoot.features[i].properties.name;
    georoot.features[i].name = name;
  }
  /*
  countArray = [0,0,0,0,0,0,0]; 
  */
  for(let i in georoot.features) {
    if(georoot.features[i].properties.name === 'Las Palmas') {georoot.features.splice(i,1);}
    if(georoot.features[i].properties.name === 'Santa Cruz de Tenerife') {georoot.features.splice(i,1);}
    if(georoot.features[i].properties.name === 'Ceuta') {georoot.features.splice(i,1);}
  }
  

  
  show = groups//.attr('id','states')
    .selectAll('path')
    .data(georoot.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill',function(d,i) {
      return color(d.color) 
    })
    .style('cursor','pointer')
    .on('click',clicked)
	.on('mouseover',over);

  /* 
  groups.append("path")
      .datum(topojson.mesh(root, root.objects.Spain, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path)
      .on('mouseover',over);
  */
});
let j = 0;
let z = 0;
function clickedout(d) {
projection.translate([width/2,height/2]);

  projection.scale(2500);
  initScale = 2500;
  d3.selectAll('path').remove();
	k = 1;
  show = groups.selectAll('path')
    .data(georoot.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill',function(d,i) {
	  if(!d.color) {++z;}
      return color(d.color); 
    })
    .style('cursor','pointer')
    .on('click',clicked)
	.on('mouseover',over);
    //.call(zoom);

 
  groups.transition()
      .duration(750)
      .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + k + ")")
      .style("stroke-width", 1 + "px");
  d3.select('#back').remove();
  d3.select('#backrect').remove();

}

function clicked(d) {
  console.log(d.properties.latitude + '  ' + d.properties.longitude);
  colorNow = d.color;
  projection.scale(2500);
  d3.selectAll('path').remove();
  let features = [];
  for(let i in georoot.features) {
	if(georoot.features[i].color == d.color) {
	  features.push(georoot.features[i]);
	}	
  }
  
  show = groups.selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill',function(d,i) {
      return color(d.color) 
    })
    //.on('click',clicked)
	.on('mouseover',overin)
    .call(zoom);

	
	
  var x, y;

  if (d && centered !== d || countArray[d.color - 1] <= 2) {
    var centroid = path.centroid(d);
    x = local[d.color - 1][0];
    y = local[d.color - 1][1];
    k = 2;
    centered = d;
  }
  else{
    x = local[d.color - 1][0];
    y = local[d.color - 1][1];
    k = 2;
    centered = null;
  }

  groups.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      //.attr("transform", "scale(" + k + ")translate(" + 0 + "," + 0 + ")")
      .style("stroke-width", 1.5 / k + "px");
      
  subsvg.append('rect')
    .attr('id','back')
    .attr("width", 70)
    .attr("height", 30)
    .on("click", clickedout)
    .style('cursor','pointer')
    .style('fill','white')
    .attr('transform','translate(0,500)');
    
  subsvg.append('text')
    .attr('id','backrect')
    .attr('transform','translate(35,520)')
    .text('返回')
    .style('cursor','pointer')
    .attr('text-anchor','middle')
    .on("click", clickedout);

}

function over(d) {
  let color = d.color
  groups.selectAll("path")
    .style("opacity", '0.1');
  
  groups.selectAll("path")
    .filter(function(d){return (d.color === color)})
    .style("opacity", '1');
	
  let moveX = d3.mouse(this)[0];
  let moveY = d3.mouse(this)[1];
  d3.selectAll('.myrect').remove();
  d3.selectAll('.showinrect').remove();
  svg.append('rect')
    .attr('width','100')
	.attr('height','30')
	.attr('fill','pink')
	.attr('class','myrect')
	.attr('x',moveX + 0)
	.attr('y',moveY + 40);
  svg.append('text')
    .attr('x',moveX + 50)
	.attr('y',moveY + 60)
	.style('text-anchor','middle')
	.attr('class','showinrect')
	.text(d.color);   
}

function overin(d) {
  let name = d.name;
  groups.selectAll("path")
    .style("opacity", '0.1');
  
  groups.selectAll("path")
    .filter(function(d){return (d.name === name)})
    .style("opacity", '1');
	
  let moveX = d3.mouse(this)[0];
  let moveY = d3.mouse(this)[1];
  d3.selectAll('.myrect').remove();
  d3.selectAll('.showinrect').remove();
  svg.append('rect')
    .attr('width','100')
	.attr('height','30')
	.attr('fill','pink')
	.attr('class','myrect')
	.attr('x',moveX )
	.attr('y',moveY );
  svg.append('text')
    .attr('x',moveX + 50)
	.attr('y',moveY + 20)
	.style('text-anchor','middle')
	.attr('class','showinrect')
	.text(d.name);   
}


function out(d) {
  d3.selectAll('.myrect').remove();
  d3.selectAll('.showinrect').remove();


}
  
function outb(d) {
  d3.selectAll('.myrect').remove();
  d3.selectAll('.showinrect').remove();
  groups.selectAll("path")
    .style("opacity", '1');
}

function clickedbig(s) {

  /*
  k += 0.2;
  //groups.selectAll('path')
  groups.transition()
      .duration(750)
      .attr("transform", "scale(" + k + ")")
  */

  //svg.attr('transform','scale(1.5,1.5)');

  initScale *= 1.2

  projection.scale(initScale);
  show.attr('d',path)
  .call(zoom);
  
}

function clickedsmall() {
  initScale /= 1.2

  projection.scale(initScale);
  show.attr('d',path)
  .call(zoom);
  
}


    
/*
  let hereName = '';
  let hereRegion = '';
  if(d) {
    if(d.hasOwnProperty('properties')){hereName = d.properties.name;  hereRegion = d.properties.region; console.log(d.properties.name);console.log(d.properties.provnum_ne)};
  }
  if(!d) {
    groups.selectAll("path")
      .style("opacity", '1');
  }
  let color = d.color;
  let name = d.properties.name;
  groups.selectAll("path")
    .style("opacity", '1');
  
  groups.selectAll("path")
    .filter(function(d){return (d.color !== color)})
    .style("opacity", '0.1');
     
  countArray[d.color - 1] += 1;
    console.log(countArray);
    
  if(countArray[d.color - 1] > 1) {
    groups.selectAll("path")
      .filter(function(d){return (d.name != name && d.color === color)})
      .style("opacity", '0.65');

  }

  for(let i in countArray) {
    if(i != (d.color - 1) && countArray[i] !== 0) {
      countArray[i] = 0;
    }
  }
  console.log(countArray);
  let a = d3.selectAll('.proname').remove();

  
  let title;
  if( !== d && countArray[d.color - 1] === 1) {
    title = svg.append('text')
      .attr('font-size','25px')
      .attr('class','proname')
      .attr('transform','translate(400,400)')
      .text(d.color);
      
  } else{
    title = svg.append('text')
    .attr('font-size','25px')
    .attr('class','proname')
    .attr('transform','translate(400,430)')
    .text(hereName);
  }


  var x, y, k;

  if (d && centered !== d || countArray[d.color - 1] <= 2) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  }
  else{
    console.log(countArray[d.color - 1]);
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    countArray[d.color - 1] = 0;
    d3.selectAll('.proname').remove();
      groups.selectAll("path")
      .style("opacity", '1');

  }

 
  groups.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
 */ 





