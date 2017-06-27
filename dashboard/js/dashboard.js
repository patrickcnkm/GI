/**
The code is used to show the contrast between actual sales and target sales. 
The page can be divide into two parts. 
The left half section shows the summary and the contrast of the data. 
The upper-left section shows the contract between the total sales and the target sales.
And the lower-left section shows expenses, profit and margin profit between real and target.
The right half section shows the most important four products' sales.
In all section, we use the different color to show the situation of the contract of the real and the target.
If the real is better than the target, the color will be green. On the contrary, it will be red.
*/


// The width and height of the right half section
const rWidth = 300;
const rHeight = 290;
// The width and height of the upper-left section
const tWidth = 400;
const tHeight = 290;
// The width and height of the lower-left's left half's section
const lBWidth = 290;
const lBHeight = 90;
// The width and height of the lower-left's right half's section
const rBWidth = 100;
const rBHeight = 90;

// Build four svg of the right half section
var svgMT = d3.select('#mt')
  .append('svg')
    .attr('width', rWidth)
    .attr('height', rHeight)
	.attr('class', 'rboard');		
var svgRT = d3.select('#rt')
  .append('svg')
    .attr('width', rWidth)
    .attr('height', rHeight)
			  .attr('class', 'rboard');			
var svgMB = d3.select('#mb')
  .append('svg')
    .attr('width', rWidth)
    .attr('height', rHeight)
	.attr('class', 'rboard');		
var svgRB = d3.select('#rb')
  .append('svg')
    .attr('width', rWidth)
    .attr('height', rHeight)
	.attr('class', 'rboard');
// Put them in an array		
var svgR = [svgMT, svgRT, svgMB, svgRB]; 

// Build a svg of the upper-left section
var svgLT = d3.select('#lt')
  .append('svg')
	.attr('width', tWidth)
	.attr('height', tHeight)
	.attr('class', 'lboard');
			
// build three svg of the lower-left section's left section	
var svgLBL1 = d3.select('#lbl1')
  .append('svg')
	.attr('width', lBWidth)
	.attr('height', lBHeight)
	.attr('class', 'board');			
var svgLBL2 = d3.select('#lbl2')
  .append('svg')
	.attr('width', lBWidth)
	.attr('height', lBHeight)
	.attr('class', 'LBLboard');			
var svgLBL3 = d3.select('#lbl3')
  .append('svg')
	.attr('width', lBWidth)
	.attr('height', lBHeight)
	.attr('class', 'LBLboard');			
var svgLBL = [svgLBL1, svgLBL2, svgLBL3];
			
// build three svg of the lower-left section's right section		
var svgLBR1 = d3.select('#lbr1')
  .append('svg')
    .attr('width', rBWidth)
	.attr('height', rBHeight)
	.attr('class', 'LBLboard');
			
var svgLBR2 = d3.select('#lbr2')
  .append('svg')
	.attr('width', rBWidth)
    .attr('height', rBHeight)
	.attr('class', 'board');
			
var svgLBR3 = d3.select('#lbr3')
  .append('svg')
	.attr('width', rBWidth)
	.attr('height', rBHeight)
	.attr('class', 'board');
			
var svgLBR = [svgLBR1, svgLBR2, svgLBR3];
			
			
// Use json and start painting the dashboard
d3.json('json/svt.json', function(error, root) {
  if (error) {
	  throw error;
  }
  // Get the origin and compute data  
  var countAll = count(root);
  
  // Use the different method to show the data of the different section
  func(root, 0, countAll);
  func(root, 1, countAll);
  func(root, 2, countAll);
  func(root, 3, countAll);
  
  textR(root, 0, countAll);
  textR(root, 1, countAll);
  textR(root, 2, countAll);
  textR(root, 3, countAll);
  
  textLT(root, countAll);
  
  textLBL(root, 0, countAll);
  textLBL(root, 1, countAll);
  textLBL(root, 2, countAll);
  
  textLBR(root, 0, countAll);
  textLBR(root, 1, countAll);
  textLBR(root, 2, countAll);
})

// The drawing of the dashborad which in the right half section
function func(root, ord, countAll) {
  // Get the data of real sales
  var sale = root.children[0].children[ord].size;
  // Get the data of target sales
  var target = root.children[1].children[ord].size;
  // Translate the data into the number that the axis will use
  var saleU = (sale / 1000000).toFixed(1);
  var targetU = (target / 1000000).toFixed(1);
	
  // Make the dashboard，and set the scale
  var gauge = iopctrl.arcslider()
      .radius(100)
	  .bands([
		{'domain': [targetU, targetU*1.5], 'span':[0.95, 1] , 'class': 'fault'},
		{'domain': [targetU*0.75, targetU], 'span': [0.95, 1] , 'class': 'warning'},
		{'domain': [0, targetU*0.75], 'span': [0.95, 1] , 'class': 'ok'}
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
  svgR[ord].append('g')
    .attr('class', 'gauge')
	.attr('transform', 'translate(0,0)')
    .style('background-color', 'gray')
	.call(gauge);	 
  gauge.value(saleU);	
}

/**
the text of the right half section
root : the data
ord : the ordinal of the section
countAll: the calculated data
return: null 
*/
function textR(root,ord,countAll) {
  var sale = root.children[0].children[ord].size;	
  var target = root.children[1].children[ord].size;
  var percent = (Math.abs(target-sale)/target).toFixed(2)*100;
  // The name of product
  var productName = ['A', 'B', 'C', 'D'];
  var mainTitle = 'Product ' + productName[ord];
  var subTitle = 'Sales vs. Target';
	
  // show the name of product
  var ltTitle1 = svgR[ord].append('text')
	.style('font-size', '12px')
	.style('text-anchor', 'middle')
	.attr('transform', 'translate(35,20)')
	.text(mainTitle);
	
  // show the name of title
  var ltTitle2 = svgR[ord].append('text')
	.style('font-size', '8px')
	.style('text-anchor', 'middle')
	.attr('transform', 'translate(95,20)')
	.text(subTitle);
	
  // show the real sales
  var title = svgR[ord].append('text')
    .attr('transform', 'translate('+ 150 +', '+ 250 + ')')
	.style('font-size', '25px')
	.style('text-anchor', 'middle')
    .text('$'+toThousands(sale));
	
  // the difference of the real and the target
  var countTitle = svgR[ord].append('text')
    .attr('class', 'counttitle')
	.style('font-size', '16px')
	.style('text-anchor', 'middle')
	.attr('transform', 'translate('+ 150 +', ' + 275 + ')');
	
  // show the text
  var contract = sale - target;
  // the percent of the difference of the real and the target
  if (contract < 0) {
    countTitle.text('\u25BC'+'$'+toThousands(Math.abs(target-sale))+'('+ percent +'%)');
  }
  else {
	countTitle.text('\u25B2'+'$'+toThousands(Math.abs(target-sale))+'('+ percent +'%)');
  }
	
  // show the color of the text of the difference of the real and the target
  if (sale <= target * 0.75) {
	countTitle.style('fill', 'red');
  }else if (sale > target * 0.75 && sale <= target) {
	countTitle.style('fill', 'yellow');
  }else {
	countTitle.style('fill', 'green');
  }
}

/**
The text of the upper-left section
root : the data
countAll: the calculated data
return: null 
*/
function textLT(root, countAll) {
  var mainTitle = 'Total Sales' 
  var subTitle = 'Sales vs. Target'
  
  // get the data
  var totalSale = countAll.totalSale;
  var totalTarget = countAll.totalTarget;

  // Set the background rect	
  var rect = svgLT.append('rect')
	.attr('height', 60)
	.attr('width', 340)
	.attr('x', 30)
	.attr('y', 175);
	
  // judge the color of the rect					
  if (totalSale < totalTarget) {
	rect.attr('fill', 'red');
  } else {
	rect.attr('fill', 'green');
  }
  
  // show the main and sub title
  var ltTitle1 = svgLT.append('text')
    .attr('class', 'lttitle1')
	.style('font-size', '12px')
	.style('text-anchor', 'middle')
	.attr('transform', 'translate(35,20)')
	.text(mainTitle);
  var ltTitle2 = svgLT.append('text')
    .attr('class', 'lttitle1')
	.style('font-size', '8px')
	.style('text-anchor', 'middle')
	.attr('transform', 'translate(100,20)')
	.text(subTitle);
	
  // show the total sales
  var title = svgLT.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate('+ 200 +', '+ 140 + ')')
	.style('font-size', '65px')
	.style('text-anchor', 'middle')
    .text('$'+toThousands(totalSale));
	
  // calculate the difference
  var contact = totalSale - totalTarget;	
	
  //show the difference
  var countTitle = svgLT.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate('+ 200 +', '+ 220 + ')')
	.style('font-size', '35px')
	.style('text-anchor', 'middle')
    .style('fill', 'white');	
  // calculate the percent and show it 
  var percent = (Math.abs(totalTarget - totalSale)/totalTarget).toFixed(2) * 100;	
  if (contact < 0) {
	countTitle.text('\u25BC'+'$'+toThousands(Math.abs(totalTarget - totalSale))+'('+ percent +'%)');
  }
  else {
	countTitle.text('\u25B2'+'$'+toThousands(Math.abs(totalTarget - totalSale))+ percent +'%)');
  }
}

/**
the text in the left part of the lower-left section
root : the data
ord : the ordinal of the section
countAll: the calculated data
return: null 
*/
function textLBL(root, ord, countAll) {
  // title
  var text = ['Expenses', 'Profit', 'Profit Margin'] 
  var ltTitle = svgLBL[ord].append('text')
	.style('font-size', '12px')
	.style('text-anchor', 'start')
	.attr('transform', 'translate(5,20)')
	.text(text[ord]);
	
  // set the placeholder of the title
  var title123 = svgLBL[ord].append('text')
    .attr('class', 'title')
    .attr('transform', 'translate('+ 145 +', '+ 60 + ')')
	.style('font-size', '30px')
	.style('text-anchor', 'middle');
	
  // get the data
  var expensesP = countAll.expensesP;
  var totalSale = countAll.totalSale;
  var margin = ((totalSale - expensesP)/expensesP*100).toPrecision(2);
  // put the data in tan array
  var data = [expensesP,(totalSale-expensesP),margin];
	
  // show the text
  if (ord <= 1) {
	title123.text('$'+ toThousands(data[ord]));
  }else {
	title123.text(data[ord] + '%')
  }	
}

/**
the text of the right part of the lower-left section
root : the data
ord : the ordinal of the section
countAll: the calculated data
return: null 
*/
function textLBR(root, ord, countAll) {
  var text = ['VS. Projection', 'VS. Target', 'VS. Target']
  var ltTitle = svgLBR[ord].append('text')
    .attr('class', 'lttitle1')
	.style('font-size', '12px')
	.style('text-anchor', 'start')
	.attr('transform', 'translate(5,20)')
	.text(text[ord]);
	
  // paint the arrow by the svg
  var arrow = svgLBR[ord].append('polygon')
	.attr('points', '30,50 20,50 50,30 80,50 70,50 70,70 30,70')
	.style('fill', 'yellow');
	// get the data			
  var expensesR = countAll.expensesR; 	
  var expensesP = countAll.expensesP; 	
  var totalTarget = countAll.totalTarget; 
  var totalSale = countAll.totalSale;	
  var profitP = countAll.profitP;	
  var profitR = countAll.profitR;	
  var marginR = countAll.marginR;
  var marginP = countAll.marginP;
	
  // calculate the percent of the three section
  var percent1 = (Math.abs(expensesR-expensesP) / expensesP);	
  var percent2 = (Math.abs(profitR-profitP) / profitR);	
  var percent3 = (Math.abs(marginR-marginP) / marginR);
	
  var ltTitle2 = svgLBR[ord].append('text')
    .attr('class', 'lttitle1')
	.style('font-size', '14px')
	.style('text-anchor', 'middle')
	.style('fill', 'white')
	.attr('transform', 'translate(50,55)')
	.style('font-weight', 'bold');
	
  // show the text by the ordinal of the section
  if (ord == 0) {
	if (expensesR > expensesP) {
	  arrow.style('fill', 'red');
	}
	else {
	  arrow.style('fill', 'green');
	}
	  ltTitle2.text((percent1*100).toPrecision(2) + '%');		
	}
	
  if (ord == 1) {
	if (profitR > profitP) {
	  arrow.style('fill', 'red');
  }
  else {
	arrow.style('fill', 'green');
  }
	ltTitle2.text((percent2*100).toPrecision(2) + '%');		
  }
  if (ord == 2) {
	if (marginR > marginP) {
	  arrow.style('fill', 'red');
	}
	else {
	  arrow.style('fill', 'green');
	}
	  ltTitle2.text((percent3*100).toPrecision(2) + '%');		
	}	
}

// the calulation of the data
function count(root) {
  // real expenses
  var expensesRC = root.children[2].children[0].size; 
  // target expenses
  var expensesPC = root.children[2].children[1].size; 
   
  // calculate the total target sales
  var totalTargetC = 0;
  for(var i = 0; i <= root.children[1].children.length - 1; i++) {
	var number = parseInt(root.children[1].children[i].size);
	totalTargetC += number;
  }
  // calculate the total real sales
  var totalSaleC = 0;
  for(var i = 0; i <= root.children[0].children.length - 1; i++) {
	var number = parseInt(root.children[0].children[i].size);
	totalSaleC += number;
 }
 
  // The target profit
  var profitPC = totalTargetC  - expensesPC;	
  // The real profit
  var profitRC = totalSaleC - expensesRC;
  // The real margin profit
  var marginRC = profitRC / expensesRC;
  // The target margin profit
  var marginPC = profitPC / expensesPC;
  
  // Put the data in an object
  var CountAll = {
	expensesR: expensesRC,
	expensesP: expensesPC,
	totalTarget: totalTargetC,
	totalSale: totalSaleC,
	profitP: profitPC,
	profitR: profitRC,
	marginR: marginRC,
	marginP: marginPC
  }	
  return CountAll;	
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
