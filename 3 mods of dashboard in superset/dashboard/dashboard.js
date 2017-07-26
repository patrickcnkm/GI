import d3 from 'd3';
import iopctrl from 'iopctrl';

require('./dashboard.css');

function dashboard(slice, payload) {
  const width = slice.width();
  const height = slice.height();
   
  const sale = 5000000;
  const target = 6000000;
  // contrast between realsales and targetsales
  const compare = sale - target;
  // calculation of the percent
  const percent = Math.round((Math.abs(compare) / target).toFixed(2) * 100);
  // create new div 
  const div = d3.select(slice.selector)
  .style('text-align', 'center');
  // reset
  div.html('');
  // set the svg
  const svg = div.append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color","#E5E5E5");
  
  // the content of the title
  const mainText = "Product " + "A";
  const subText = "Sales vs. Target";
  
  // show the title
  const mainTitle = svg.append("text")
  .style("font-size","25px")
  .style("text-anchor","start")
  .style("font-weight","bold")
  .attr("transform", "translate(5,20)")
  .text(mainText);  
  const subTitle = svg.append("text")
  .style("font-size","15px")
  .style("text-anchor","start")
  .attr("transform", "translate(130,20)")
  .text(subText);

  // show the digit of realsales 
  const saleTitle = svg.append("text")
  .attr("transform", "translate("+ 0.5 * width +","+ 0.85 * height + ")")
  .style("font-size","40px")
  .style("text-anchor","middle")
  .text("$"+toThousands(sale));
  
  // set the contract content of the real and the target sales  
  const countTitle = svg.append("text")
  .attr("class", "counttitle")
  .style("font-size","25px")
  .style("text-anchor","middle")
  .attr("transform", "translate("+ 0.5 * width +"," + 0.95 * height + ")");
  
  // show the contract content of the real and the target sales  
  if (compare < 0) {
	countTitle.text("\u25BC"+"$"+toThousands(Math.abs(target-sale))+"("+ percent +"%)");
  } else {
    countTitle.text("\u25B2"+"$"+toThousands(Math.abs(target-sale))+"("+ percent +"%)");
  }
  // judge the color of the contract content 
  if (sale <= target * 0.75) {
	countTitle.style("fill","red");
  } else if (sale > target * 0.75 && sale < target) {
	countTitle.style("fill","yellow");
  } else {
	countTitle.style("fill","green");
  }
  
  // set the dashboard
  const gauge = iopctrl.arcslider()
  .radius(height * 0.3)
  .bands([
	{"domain": [target, target*1.5], "span":[0.95, 1] , "class": "fault"},
	{"domain": [target*0.75, target], "span": [0.95, 1] , "class": "warning"},
	{"domain": [0, target*0.75], "span": [0.95, 1] , "class": "ok"}
  ])
  .events(false)
  .indicator(iopctrl.defaultGaugeIndicator);
  
  // set the axis of the dashboard
  gauge.axis()
  .orient('in')
  .normalize(true)
  .ticks(12, 'M')
  .tickSubdivide(4)
  .tickSize(15, 8, 15)
  .tickPadding(10)
  .tickValues([0, target*0.25, target*0.5, target*0.75, target,
    target*1.25, target*1.5])
  .tickFormat(function(d) {
	return Formatter(d);
  })
  .scale(d3.scale.linear()
    .domain([0.0, target*1.5])
    .range([-3*Math.PI/4, 3*Math.PI/4])
  );
  
  // show the dashboard
  const segDisplay = iopctrl.segdisplay();   
  svg.append('g')
  .attr('class', 'gauge')
  .attr('transform', 'translate(' + 0.5 * width + ',' + 0.5 * height + ')')
  .style('background-color', 'gray')
  .call(gauge);	 
  gauge.value(sale);  
  // fix the position of every parts of the dashboard
  const arc = d3.select('.arc')
  .attr('transform', 'translate(0,0)');  
  const band = d3.selectAll('.band')
  .attr('transform', 'translate(0,0)');    
  const indicator = d3.select('.indicator')
  .attr('transform', 'translate(0,0)');  
  const axis = d3.select('.axis')
  .attr('transform', 'translate(0,0)');
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
the formatter
num : the number need to be formatted(use m,k to replace the 1,000,000 or 1,000)
return : the formatted number(string)
*/
function Formatter(num) {	
  if (num <= 10000) return num;
  if (num < 1000000) return (num / 1000).toFixed(0) + 'K';
  return (num / 1000000).toPrecision(2) + 'M';
}

module.exports = dashboard;