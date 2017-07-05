import d3 from 'd3';


function contrast(slice, payload) {
  const div = d3.select(slice.selector)
  .style('text-align', 'center');

  // set the title content
  const mainText = 'Total Sales' ;
  const subText = 'Sales vs. Target';
  
  const totalSale = 500000;
  const totalTarget = 600000;
 
  const width = slice.width();
  const height = slice.height();
  
  // set the svg
  const svg = div
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background-color', '#E5E5E5');
 
   //set tht main and sub title  
  const mainTitle = svg.append('text')
  .style('font-size', '25px')
  .style('text-anchor', 'start')
  .style('font-weight', 'bold')
  .attr('transform', 'translate(5,20)')
  .text(mainText);	
  const subTitle = svg.append('text')
  .style('font-size', '15px')
  .style('text-anchor', 'start')
  .attr('transform', 'translate(140,20)')
  .style('font-weight', 'normal')
  .text(subText);
	
  // set the rect which use the color to show the result of the contrast		
  const rect = svg.append('rect')
  .attr('height',0.15 * height)
  .attr('width',0.6 * width)
  .attr('x',0.2 * width)
  .attr('y',0.5 * height);
  
  var contract = totalSale - totalTarget;
  
  // judge the color of the rect	
  if (contract < 0) {
	rect.attr('fill', 'red');
  } else {
	rect.attr('fill', 'green');
  }	
	
  // show the totalSales
  const totalSaleShow = svg.append('text')
  .attr('class', 'title')
  .attr('transform', 'translate('+ 0.5 * width + ', '+ 0.45 * height + ')')
  .style('font-size', '75px')
  .style('text-anchor', 'middle')
  .text('$'+toThousands(totalSale));
  
  const countTitle = svg.append('text')
  .attr('class', 'title')
  .attr('transform', 'translate('+ 0.5 * width+', '+ 0.6 * height + ')')
  .style('font-size', '35px')
  .style('text-anchor', 'middle')
  .style('fill', 'white');
  
  // caluation of the percent				
  const percent = Math.round((Math.abs(contract)/totalTarget).toFixed(2) * 100);
  
  // show the result of contract
  if (contract < 0) {
	countTitle.text('\u25BC'+'$'+toThousands(Math.abs(totalTarget - totalSale))+'('+ percent +'%)');
  }
  else {
	countTitle.text('\u25B2'+'$'+toThousands(Math.abs(totalTarget - totalSale))+'('+ percent+'%)');
  }  
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

module.exports = contrast;