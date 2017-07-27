
/**
This is a part of the dashboard which is the upper-left part of it.
*/

const width = 600;
const height = 400;
// The data

// The svg 
var mod1; 

// The title	
const mainTitle = 'Total Sales' 
const subTitle = 'Sales vs. Target'

/** 
Get the data from form
return: null
*/
const totalSale = 10000;   
const totalTarget = 15000;




/** 
Get the data from form
totalSale and totalTarget: For now, the data is from the form. In the future,the data is from the database.
return: null
*/

  var body = d3.select('body')
    .style('text-align', 'center')
    .style('font-weight', 'normal');

  mod1 = body
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#E5E5E5');

  // Show the main and sub title
  var ltTitle1 = mod1.append('text')
    .style('font-size', '25px')
    .style('text-anchor', 'start')
    .style('font-weight', 'bold')
    .attr('transform', 'translate(5,20)')
    .text(mainTitle);
	
  var ltTitle2 = mod1.append('text')
    .style('font-size', '15px')
    .style('text-anchor', 'start')
    .attr('transform', 'translate(140,20)')
    .style('font-weight', 'normal')
    .text(subTitle);	

  // Show the totalSale
  var title = mod1.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate('+ 300 +', '+ 160 + ')')
    .style('font-size', '75px')
    .style('text-anchor', 'middle')
    .text('$'+toThousands(totalSale));

  //set the rect		
  var rect = mod1.append('rect')
    .attr('height',60)
    .attr('width',340)
    .attr('x',130)
    .attr('y',200);
			
  //Judge the color of the rect	
  if (totalSale < totalTarget) {
	rect.attr('fill', 'red');
  } else {
	rect.attr('fill', 'green');
  }	

  //caluation of the difference
  var contract = totalSale - totalTarget;	
	
  //show the difference
  var countTitle = mod1.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate('+ 300 +', '+ 240 + ')')
    .style('font-size', '35px')
    .style('text-anchor', 'middle')
    .style('fill', 'white');	
				
  //caluation of the percent				
  var percent = Math.round((Math.abs(contract)/totalTarget).toFixed(2) * 100);	
  if (contract < 0) {
	countTitle.text('\u25BC'+'$'+toThousands(Math.abs(totalTarget - totalSale))+'('+ percent +'%)');
  }
  else {
	countTitle.text('\u25B2'+'$'+toThousands(Math.abs(totalTarget - totalSale))+'('+ percent+'%)');
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