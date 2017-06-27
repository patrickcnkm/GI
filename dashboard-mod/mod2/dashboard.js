/**
This is a part of the dashboard which is the right-half of it.
*/

const width = 600;
const height = 400;

var sale;
var target;

var mod2;

/** 
Get the data from form
return: null
*/			
function getTheData() {
  if(sale) {
	mod2.remove();
  }
  //get the data
  sale = d3.select("#sales")
    .property("value");
  target = d3.select("#target")
    .property("value");
  //use the function to show the painting
  show(parseInt(sale),parseInt(target));
}

/** 
Get the data from form
sale and target: For now, the data is from the form. In the future,the data is from the database.
return: null
*/
function show(sale,target){	
  var body = d3.select("body")
	.style("text-align","center")

  mod2 = d3.select("#dashboard")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
	.style("background-color","#E5E5E5");
  var percent = (Math.abs(target-sale)/target).toFixed(2)*100;

  var saleU = (sale/1000000).toFixed(1);
  var targetU = (target/1000000).toFixed(1);
	
  // Make the dashboard，and set the scale
  var gauge = iopctrl.arcslider()
    .radius(130)
    .bands([
	  {"domain": [targetU, targetU*1.5], "span":[0.95, 1] , "class": "fault"},
	  {"domain": [targetU*0.75, targetU], "span": [0.95, 1] , "class": "warning"},
	  {"domain": [0, targetU*0.75], "span": [0.95, 1] , "class": "ok"}
	])
    .events(false)
    .indicator(iopctrl.defaultGaugeIndicator);
    
  // The set of axis    
  gauge.axis()
	.orient('in')
    .normalize(true)
    .ticks(12, 'M')
    .tickSubdivide(4)
    .tickSize(15, 8, 15)
    .tickPadding(10)
	.tickValues([0, targetU*0.25, targetU*0.5, targetU*0.75, targetU,
      targetU*1.25, targetU*1.5])
	.tickFormat(function(d) {
	  return millionFormatter(d);
	})
    .scale(d3.scale.linear()
      .domain([0.0, targetU*1.5])
      .range([-3*Math.PI/4, 3*Math.PI/4])
	);

  // Show and translate the dashboard 				
  var segDisplay = iopctrl.segdisplay();   
  mod2.append('g')
    .attr('class', 'gauge')
	.attr('transform', 'translate(115,0)')
    .style('background-color', 'gray')
	.call(gauge);	 
  gauge.value(saleU);

  //Text part
	
  //mainTitle
  var mainTitle = "Product " + "A";
  var ltTitle1 = mod2.append("text")
	.style("font-size","25px")
	.style("text-anchor","start")
	.style("font-weight","bold")
	.attr("transform", "translate(5,20)")
	.text(mainTitle);
	
  //subTitle
  var subTitle = "Sales vs. Target";
  var ltTitle2 = mod2.append("text")
	.style("font-size","15px")
	.style("text-anchor","start")
	.attr("transform", "translate(130,20)")
	.text(subTitle);	
	
  // show the real sales
  var title = mod2.append("text")
	.attr("class", "title")
	.attr("transform", "translate("+ 300 +","+ 325 + ")")
	.style("font-size","40px")
	.style("text-anchor","middle")
	.text("$"+toThousands(sale));
	
  // the difference of the real and the target
  var countTitle = mod2.append("text")
	.attr("class", "counttitle")
	.style("font-size","25px")
	.style("text-anchor","middle")
	.attr("transform", "translate("+ 300 +"," + 360 + ")");
	
  // the percent of the difference of the real and the target
  var compare = sale - target;
  if(compare < 0){
	countTitle.text("\u25BC"+"$"+toThousands(Math.abs(target-sale))+"("+ percent +"%)");
  }
  else{
	countTitle.text("\u25B2"+"$"+toThousands(Math.abs(target-sale))+"("+ percent +"%)");
 }
	
  // show the color of the text of the difference of the real and the target
  if(sale <= target * 0.75){
	countTitle.style("fill","red");
  }else if(sale > target * 0.75 && sale <= target){
	countTitle.style("fill","yellow");
  }else{
	countTitle.style("fill","green");}
  }

/**
the quartile formatter
num : the number need to be formatted
return : the formatted number(string)
*/
function toThousands(num) {
  var num = (num || 0).toString(), re = /\d{3}$/, result = '';
  while ( re.test(num) ) {
    result = RegExp.lastMatch + result;
    if (num !== RegExp.lastMatch) {
      result = ',' + result;
      num = RegExp.leftContext;
    } else {
      num = '';
      break;
      }
    }
  if (num) { 
  result = num + result; 
  }
  return result;
}

/**
the million formatter
num : the number need to be formatted(use m to replace the 1,000,000)
return : the formatted number(string)
*/
function millionFormatter(num) {
	var m = parseFloat(num).toFixed(1);
	return m + 'M';
}