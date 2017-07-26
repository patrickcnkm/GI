import d3 from 'd3';
import { formatDate } from '../javascripts/modules/dates';

require('./dashboardContract.css');


function dashboardContractVis(slice, payload) {
  const selector = '#abc';  //***    means my own code
  const div = d3.select(/*slice.*/selector);
  div.html('');
  //const fd = slice.formData;
  //const json = payload.data;
  
  const width = /*slice.width()*/800;
  const height = /*slice.height()*/450;
  
  const svg = div.append('svg')
  .attr('width', width)
  .attr('height', height);
  
  //need to get these from other ways(ex : json)
  const mainTitle = 'Total Sales'; 
  const subTitle = 'Sales vs. Target';  
  const realSales = 500000;
  const targetSales = 600000;
  
  const g = svg.append('g');
  //print the maintitle
  const main = g.append('text')
  .style('font-size', '25px')
  .style('text-anchor', 'start')
  .style('font-weight', 'bold')
  .attr('transform', 'translate(5,20)')
  .text(mainTitle);
  //print the subtitle
  const sub = g.append('text')
  .style('font-size', '13px')
  .style('text-anchor', 'start')
  .attr('transform', 'translate(135,20)')
  .text(subTitle);
  
  //print the rect		
  const rect = g.append('rect')
  .attr('height',60)
  .attr('width',340)
  .attr('x',130)
  .attr('y',200);			
  //Judge the color of the rect	
  if (realSales < targetSales) {
	rect.attr('fill', 'red');
  } else {
	rect.attr('fill', 'green');
  }	
  
  //print the realsale's value
  const realText = g.append('text')
  .attr('class', 'title')
  .attr('transform', 'translate('+ 300 +', '+ 160 + ')')
  .style('font-size', '75px')
  .style('text-anchor', 'middle')
  .text('$' + toThousands(realSales));
  
  //print the contract between realsale and targetsales's value
  const countTitle = g.append('text')
  .attr('class', 'title')
  .attr('transform', 'translate('+ 300 +', '+ 240 + ')')
  .style('font-size', '35px')
  .style('text-anchor', 'middle')
  .style('fill', 'white');
  
  const contract = realSales - targetSales;
  
  const percent = Math.round((Math.abs(contract) / targetSales).toFixed(2) * 100);	
  if (contract < 0) {
	countTitle.text('\u25BC' + '$' + toThousands(Math.abs(contract)) + '(' + percent +'%)');
  }
  else {
	countTitle.text('\u25B2' + '$' + toThousands(Math.abs(contract)) + '(' + percent+'%)');
  }	
  

//}

/**
the quartile formatter
num : the number need to be formatted
return : the formatted number(String)
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

module.exports = dashboardContractVis;