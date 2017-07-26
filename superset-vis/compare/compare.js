import d3 from 'd3';
import { category21 } from '../javascripts/modules/colors';

function compare(slice, payload) {
  const expensesP = 500000;
  const expensesR = 600000;	
  
  const width = slice.width();
  const height = slice.height();
  // the title text
  const textL = 'Expenses';
  const textR = 'VS. Projection';
  
  // the basic div
  const div = d3.select(slice.selector)
  .style('text-align', 'center')
  .append('div')
  .style('position', 'relative')
  .style('margin', '0 auto')
  .style('width',width)
  .style('height',height);
  
  //reset
  div.html('');
  
  // left and right part div
  const modL = div.append('div')
  .attr('id','lp')
  .style('position', 'absolute');  
  const modR = div.append('div')
  .attr('id','rp')
  .style('position', 'absolute')
  .style('left',0.5 * width);
  
  // left svg
  const svgL = modL.append("svg")
  .attr('width', 0.5 * width - 10)
  .attr('height', height)
  .style('background-color','#E5E5E5');
  
  // show the left title  
  const titleL = svgL.append('text')
  .style('font-size','20px')
  .style('text-anchor','start')
  .attr('transform', 'translate(5,20)')
  .text(textL);
  
  // show the left data
  const expensesPShow = svgL.append('text')
  .attr('transform', 'translate('+ 0.5 *  (0.5 * width - 10)+','+ 0.6 * height + ')')
  .style('font-size','55px')
  .style('text-anchor','middle')
  .text('$'+ toThousands(expensesR));
  
  // right svg
  const svgR = modR
  .append('svg')
  .attr('width', width * 0.25)
  .attr('height', height)
  .style('background-color','#E5E5E5');
  
  // show the right title
  const titleR = svgR.append('text')
  .style('font-size','20px')
  .style('text-anchor','start')
  .attr('transform', 'translate(5,20)')
  .text(textR);
  
  // the width of right part
  const widthR = width * 0.25;
  
  // the data of arrow's painting
  const arrowPainting = 0.25 * widthR + ',' + 0.5 * height + ' ' +
  0.15 * widthR + ',' + 0.5 * height + ' ' +
  0.5 * widthR + ',' + 0.15 * height + ' ' +
  0.85 * widthR + ',' + 0.5 * height + ' ' +
  0.75 * widthR + ',' + 0.5 * height + ' ' +
  0.75 * widthR + ',' + 0.85 * height + ' ' +
  0.25 * widthR + ',' + 0.85 * height;
  
  // show the arrow  
  const arrow = svgR.append('polygon')
  .attr('points',arrowPainting);
  
  // compare the real expenses with target expense and caluation of the percent	
  const contract = expensesR - expensesP;
  const percent = Math.round((Math.abs(contract) / expensesP).toFixed(2) * 100);
  
  //set the data of right part
  const expensesRShow = svgR.append('text')
  .style('font-size','30px')
  .style('text-anchor','middle')
  .style('fill','white')
  .attr('transform', 'translate(' + 0.5 * widthR + ',' + 0.6 * height + ')')
  .style('font-weight','bold');
  
  //judge the color of arrow
  if(contract < 0) {
	arrow.style('fill','red');
  } else {
	arrow.style('fill','green');
  }
  //show the data of right part
  expensesRShow.text(percent + '%');  
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

module.exports = compare;