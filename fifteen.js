/* 								Extra Features Added to be marked
       - Multiple backgrounds:
          Added  a checkboxes to allow the user to enable or disable the change of background. If the user selects the change picture checkbox, then the picture of the puzzle is changed to 
        currently any 1 of the 4 added background pictures before being shuffled.
        
       - Ability to slide multiple puzzleArea at once:
          Added a checkbox to allow the user to enable or disable beginners level. If this level is enable,
          the user can move any piece of the puzzle they desire.
       
*/
"use strict"; 
window.onload = function()
{
    //shows the size of x and y position of the blank space respectively
    var blankX = '300px'; 
    var blankY = '300px';
    
	var puzzleArea;
	var shufflebutton;
	var validMoves= new Array();
	
	var changePicChkBoxlabel;
	var changePicChkBox;
	var beginModeChkBoxlabel;
	var beginModeChkBox;

	checkBoxSetUp();

    puzzleArea = document.querySelectorAll("div#puzzlearea div");

	shufflebutton = document.getElementById("shufflebutton");
	
	initializeGrid();
	shufflebutton.onclick = shufflePieces;
	
	// Used to initialize the validMoves array with possible moves
	checkMoveValid();


	// All function definitions below

	// Used to initialize the grid when the game first starts
	function initializeGrid()
	{
		//For loop aranges puzzle in grids and set event handlers
		for (var i=0; i<puzzleArea.length; i++)
		{
			// Assigns the puzzlepiece css class styling to each of the pieces 
			puzzleArea[i].className = "puzzlepiece";

			// Used to arrange the pieces into a grid formation
			puzzleArea [i].style.left = (i % 4 * 100) + "px";
			puzzleArea [i].style.top = (parseInt(i / 4) * 100) + "px";

			// Evaluates to "-XXX px -YYY px" to position the image on the puzzleArea  using X and Y coordinates
			puzzleArea [i].style.backgroundPosition = "-" + puzzleArea [i].style.left + " " + "-" + puzzleArea [i].style.top;

			// Used to move a piece if it can be moved when clicked
			puzzleArea [i].onclick = function()
			{
				// If easy mode is enabled, then it allows the user to move 
				// any piece to the empty space 
				if (beginModeChkBox.checked) 
				{
					MovePieces(parseInt(this.innerHTML-1));
				}
				else 
				{
					// Code to check if the piece can be moved
					if (isValidMove(this.style.left, this.style.top))
					{
						MovePieces(parseInt(this.innerHTML-1));
					}				
				}
			};
			

			// Used to show the user if a piece can be moved when hovered
			// by changing the colour of the piece
			puzzleArea [i].onmouseover = function()
			{
				if (beginModeChkBox.checked) 
				{
					this.classList.add("movablepiece");
				}
				else 
				{
					// Code to check if the piece can be moved
					if (isValidMove(this.style.left, this.style.top))
					{
						this.classList.add("movablepiece");
					}
				}
			};

			// Used to revert the colour of the piece back to default 
			// when the user's cursor leaves the piece
			puzzleArea [i].onmouseout = function()
			{
				this.classList.remove("movablepiece");
			};
		}
	}

	// Function used to shuffle pieces on the grid when called
	function shufflePieces() 
	{
		var rndNum;
		
		// Changes the picture before randomizing if changePicChkBox is true
		if (changePicChkBox.checked) 
			{
				changePic();
			}
		
		// This loop moves the pieces randomly 150 times when executed
		for (var i = 0; i < 150; i++) 
		{
			// Used to randomly select a piece to move from the valid moves array
			rndNum = Math.floor(Math.random() * validMoves.length);

			for (var x = 0; x < puzzleArea .length; x++)
			{
				if ((validMoves[rndNum][0] === parseInt(puzzleArea [x].style.left)) && 
					(validMoves[rndNum][1] === parseInt(puzzleArea [x].style.top)))
				{
					// When the piece is found, it is moved and the valid moves are
					// recalculated for another iteration of randomly selected movements
					switchPieces(parseInt(puzzleArea [x].innerHTML-1));
					checkMoveValid();	
					break; 
				}
			}
		}
	}

	function MovePieces(puzzlePiece)
	{
		var posX = puzzleArea [puzzlePiece].style.left;
	  	var posY = puzzleArea [puzzlePiece].style.top;	  	
	  	var xFinished = (puzzleArea [puzzlePiece].style.left === blankX); 
	  	var yFinished = (puzzleArea [puzzlePiece].style.top === blankY);
	  	
	  	var movement = setInterval(MovePiece, 1); 

		function MovePiece() 
		{
			if ((xFinished) && (yFinished))
			{
				blankX = posX;
				blankY = posY;
				clearInterval(movement);
				checkMoveValid();
				checkWin();
			} 
			else 
			{
				// Move X 
				if (!(xFinished))
				{
					if (parseInt(puzzleArea [puzzlePiece].style.left) < parseInt(blankX))
					{
						puzzleArea [puzzlePiece].style.left = ((parseInt(puzzleArea [puzzlePiece].style.left) + 10) + 'px');
					}
					else
					{
						puzzleArea [puzzlePiece].style.left = ((parseInt(puzzleArea [puzzlePiece].style.left) - 10) + 'px');	
					}

					// Checks if the X coordinates have reached its destination
					if (puzzleArea [puzzlePiece].style.left === blankX)
					{
						xFinished = true;
					}
				}

				// Move Y 
				if (!(yFinished))
				{
					if (parseInt(puzzleArea [puzzlePiece].style.top) < parseInt(blankY))
					{
						puzzleArea [puzzlePiece].style.top = ((parseInt(puzzleArea [puzzlePiece].style.top) + 10) + 'px');
					}
					else
					{
						puzzleArea [puzzlePiece].style.top = ((parseInt(puzzleArea [puzzlePiece].style.top) - 10) + 'px');	
					}

					// Checks if the Y coordinates have reached its destination
					if (puzzleArea [puzzlePiece].style.top === blankY)
					{
						yFinished = true;
					}
				}
			}
		}
	}


	function switchPieces(puzzlePiece)
	{
		// Swap X positions
		var temp = puzzleArea [puzzlePiece].style.left;
		puzzleArea [puzzlePiece].style.left = blankX;
		blankX = temp;

		// Swap Y positions
		temp = puzzleArea [puzzlePiece].style.top;
		puzzleArea [puzzlePiece].style.top = blankY;
		blankY = temp;
	}

	// Checks in a clockwise manner for all the valid moves in relation to the position of the empty space

	function checkMoveValid()
	{
		// Converted the position of the empty space variables
		// to integers to be able to easily manipulate them later
		var tempX = parseInt(blankX);
		var tempY = parseInt(blankY);

		// Resets the array and clears the previous valid moves
		validMoves = new Array();

		// Check Up
		// Check if there's a piece above the empty space
		if (tempY != 0)
		{
			validMoves.push([tempX, tempY - 100]);
		}

		// Check Right
		// Check if there's a piece to the right of the empty space
		if (tempX != 300)
		{
			validMoves.push([tempX + 100, tempY]);
		}

		// Check Down 
		// Checks if there's a piece below the empty space
		if (tempY != 300)
		{
			validMoves.push([tempX, tempY + 100]);
		}

		// Check Left
		// Checks if there's a piece to the left of the empty space
		if (tempX != 0)
		{
			validMoves.push([tempX - 100, tempY]);
		}
	}

	// Checks the validMoves array for the puzzle piece's X and Y position passed 
	// as an argument and sees if the piece is a valid move then returns true or false
	function isValidMove(pieceX, pieceY)
	{
		pieceX = parseInt(pieceX);
		pieceY = parseInt(pieceY);

		for (var i = 0; i < validMoves.length; i++)
		{
			if ((validMoves[i][0] === pieceX) && (validMoves[i][1] === pieceY))
			{
				return true;
			}
		}
		return false;	
	}

	// Checks if the puzzle pieces are in the correct positions 
	// to prompt the user that they have won the game
	function checkWin() 
	{
		var win = true;

		// Checks if the empty space is in the bottom right corner.
		// If not, then the for loop doesn't bother waste time executing
		if ((blankX === "300px") && (blankY === "300px")) 
		{
			for (var i = 0; i < puzzleArea .length; i++) 
			{
				if ((puzzleArea [i].style.left !== (parseInt((i % 4) * 100) + "px")) &&
					(puzzleArea [i].style.top !== (parseInt((i / 4) * 100) + "px")))
				{
					win = false;
					break;
				}
			}
			if (win) 
			{
				gameWon();
			}
		}
	}

	// This prompts the user that they have won the game. Fancy game-winning 
	// graphics, effects and animations to be added later.
	function gameWon()
	{
		alert("Congratulations, you have Won this level");
	} 

	// Used to randomly change the applied background picture
	function changePic() 
	{
		var listOfPics = ["2 Zelda.jpg","neymar-injury.jpg","familyguy.jpg","4 Mario.jpg"];
		var currentPic = puzzleArea [0].style.backgroundImage.slice(5, -2); // Sliced to remove 'url("")' from it
		var rndNum = Math.floor(Math.random() * listOfPics.length);

		// Used to set a default picture to go back to whenever the page is refreshed.
		if (currentPic.length === 0)
		{
			currentPic = "2 Zelda.jpg";
		}
		
		// Used to prevent the random number from pointing at the current picture 	
		if (currentPic === listOfPics[rndNum]) 
		{
			// Runs until the rndNum points to a different pic
			while (currentPic === listOfPics[rndNum]) 
			{
				rndNum = Math.floor(Math.random() * listOfPics.length);	
			}
		}

		// Applies the new pic to each square
		for (var x = 0; x < puzzleArea.length; x++)
		{
			puzzleArea[x].style.backgroundImage = "url('" + listOfPics[rndNum] +"')";
		}
		
	}

	//use to set up checkBox
	function checkBoxSetUp()
	{
		// Creates the text label for the checkbox
		changePicChkBoxlabel = document.createElement('label');
		changePicChkBoxlabel.htmlFor = "changePicChkBox1";
		changePicChkBoxlabel.appendChild(document.createTextNode('Change picture when shuffled'));

		//Creates the checkbox
		changePicChkBox = document.createElement("input");
	    changePicChkBox.type = "checkbox";
	    changePicChkBox.id = "changePicChkBox1";	
		document.getElementById("controls").appendChild(changePicChkBoxlabel);
		document.getElementById("controls").appendChild(changePicChkBox);

		// Creates the text label for the checkbox
		beginModeChkBoxlabel = document.createElement('label');
		beginModeChkBoxlabel.htmlFor = "changePicChkBox1";
		beginModeChkBoxlabel.appendChild(document.createTextNode("Beginner's Level"));

		//Creates the checkbox
		beginModeChkBox = document.createElement("input");
	    beginModeChkBox.type = "checkbox";
	    beginModeChkBox.id = "easyModeChkBox1";	
		document.getElementById("controls").appendChild(beginModeChkBoxlabel);
		document.getElementById("controls").appendChild(beginModeChkBox);
	}
};



