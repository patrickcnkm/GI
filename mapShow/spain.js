var width = 960;
var height = 600;
var centered;
var projection = d3.geo.mercator()
  .center([-1,40])
  .scale(2500)
  .translate([width/2, height/2]);
  
var path = d3.geo.path()
  .projection(projection);
  
var color = d3.scale.category10();


var svg  = d3.select('body').style('text-align','center')
  .append('svg')
  .attr('width',width)
  .attr('height',height);
  
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);
    
var groups = svg.append('g');
var countArray = [];
d3.json('Spain.json', function(error,root) {
  if(error)
    return  console.error(error);
  console.log(root);
  
  var georoot = topojson.feature(root,root.objects.Spain);
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
  
  countArray = [0,0,0,0,0,0,0]; 
  
  for(let i in georoot.features) {
    if(georoot.features[i].properties.name === 'Las Palmas') {georoot.features.splice(i,1);}
    if(georoot.features[i].properties.name === 'Santa Cruz de Tenerife') {georoot.features.splice(i,1);}
    if(georoot.features[i].properties.name === 'Ceuta') {georoot.features.splice(i,1);}
  }
  
  console.log(georoot.features);
  groups//.attr('id','states')
    .selectAll('path')
    .data(georoot.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill',function(d,i) {
      return color(d.color) 
    })
    .on('click',clicked);
    
  groups.append("path")
      .datum(topojson.mesh(root, root.objects.Spain, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
  
});



function clicked(d) {
  let hereName = '';
  let hereRegion = '';
  if(d) {
    if(d.hasOwnProperty('properties')){hereName = d.properties.name;  hereRegion = d.properties.region; console.log(d.properties.name);/*console.log(d.properties.provnum_ne)*/};
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
  if(centered !== d && countArray[d.color - 1] === 1) {
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

  /*
  groups.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
  */
}
  





