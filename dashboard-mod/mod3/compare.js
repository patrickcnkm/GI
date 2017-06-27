/**
This is a part of the dashboard which is the lower-left of it.
*/

const width = 600;
const height = 400;

var expensesP;
var expensesR;

var mod3L;
var mod3R;
			
/** 
Get the data from form
return: null
*/			
function getTheData() {
  if(expensesR) {
	mod3L.remove();
	mod3R.remove();
  }
  // get the data
  expensesP = d3.select('#expensesP')
    .property('value');
  expensesR = d3.select('#expensesR')
    .property('value');
  // use the function to show the painting
  show(parseInt(expensesP),parseInt(expensesR));
}

function show(expensesP, expensesR){
console.log(typeof expensesP)	
  var body = d3.select('body')
			.style('text-align','center');
  
  //left part
  mod3L = d3.select('#fp')
    .append('svg')
    .attr('width', 390)
    .attr('height', 200)
	.style('background-color','#E5E5E5');
			
  //Title
  var text = 'Expenses';
  var ltTitle = mod3L.append('text')
    .attr('class', 'lttitle1')
	.style('font-size','20px')
	.style('text-anchor','start')
	.attr('transform', 'translate(5,20)')
	.text(text);
	
  //show the data
  var title123 = mod3L.append('text')
	.attr('class', 'title')
	.attr('transform', 'translate('+ 195 +','+ 120 + ')')
	.style('font-size','55px')
	.style('text-anchor','middle')
	.text('$'+ toThousands(expensesP));
	

  //right part
  mod3R = d3.select('#sp')
    .append('svg')
    .attr('width', 200)
    .attr('height', 200)
	.style('background-color','#E5E5E5');

  //Title				
  var text2 = 'VS. Projection';
  var ltTitle = mod3R.append('text')
	.style('font-size','20px')
	.style('text-anchor','start')
	.attr('transform', 'translate(5,20)')
	.text(text2);

  //painting the arrow	
  var arrow = mod3R.append('polygon')
	.attr('points','50,100 30,100 100,30 170,100 150,100 150,170 50,170')
	.style('fill','yellow');

  //calculate the percent	
  var percent = (Math.abs(expensesR-expensesP)/expensesP);

  //show the percent	
  var ltTitle2 = mod3R.append('text')
	.style('font-size','35px')
	.style('text-anchor','middle')
	.style('fill','white')
	.attr('transform', 'translate(100,115)')
	.style('font-weight','bold');
	
  //judge the color of the arrow
  if(expensesR <= expensesP){
	arrow.style('fill','red');
  }
  else{
	arrow.style('fill','green');
  }
  ltTitle2.text((percent * 100).toPrecision(2) + '%');		
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