
"use strict"; // Added to make the code more JSLint compliant
//structure the puzzle	
window.onload = function()
{
    //shows the size of x and y position of the blank space respectively
    var spacey = "300px";
    var spacex = "300px";
	
    //capture the array of divs in the puzzle area
    var puzzleArea = document.querySelectorAll("div#puzzlearea div");
    
    //capture the shuffle button
    var shuffButton = document.getElementById("shufflebutton");
    

    var validMoves= new Array();

    for(var i=0;i<puzzleArea.length;i++){
        //attach puzzle piece class to each div element in the puzzle area
        puzzleArea[i].classList.add("puzzlepiece");
        

        // Used to arrange the pieces into a grid formation
        puzzleArea[i].style.left = (i % 4 * 100) + "px";
        puzzleArea[i].style.top = (parseInt(i / 4) * 100) + "px";

        // Uses the X AND Y coordinates to position the image on the squares
		puzzleArea[i].style.backgroundPosition = "-" + puzzleArea[i].style.left + " " + "-" + puzzleArea[i].style.top;
			
    }
			
}