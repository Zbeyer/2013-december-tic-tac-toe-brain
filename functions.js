//Zbeyer - Tic Tac Toe Brain
//  1/1/2014
//  If you beat this brain please email the repro steps to zachary@zbeyer.com

var BOARD_WIDTH = 3;
var BOARD_HEIGHT = 3;
var WIN_LENGTH = 3;
var DIFFICULTY = 0;    //depth of lookaheads : 0 means look as deeps as possible

function newBoard()
{
    var b = new Array(BOARD_WIDTH);
    for (var x = 0; x < BOARD_WIDTH; x++)
    {
        b[x] = new Array(BOARD_HEIGHT);
    }

    initializeBoard(b);

    return b;
}

function onButton(x, y, sender)
{
    if (gameOver(myBoard))
        return;

    if (placePieceOnBoard(myBoard, x, y, curPiece))
    {
        switchPiece();

    }
    sender.innerHTML = pieceAt(myBoard, x, y);
    printBoard();

    if (countRemainingMoves(myBoard) < 1)
        return;

    if (curPiece === 2)
        compMove();
}

function incDiff()
{
    DIFFICULTY++;

    printDifficulty();
}

function decDiff()
{
    DIFFICULTY--;

    if(DIFFICULTY <0 )
        DIFFICULTY = 1;

    printDifficulty();
}

function printDifficulty()
{
    var div = document.getElementById('difficultyPrint');
    div.innerHTML = "Difficulty: " + DIFFICULTY;

    if(DIFFICULTY === 0)
        div.innerHTML = div.innerHTML + " (Hardest / Slowest)";
    else if(DIFFICULTY === 1)
        div.innerHTML = div.innerHTML + " (Easiest / Fastest)";
}


function decH()
{
    BOARD_HEIGHT--;

    if(BOARD_HEIGHT <0 )
        BOARD_HEIGHT = 0;

    printHeight();

    start();
}

function incH()
{
    BOARD_HEIGHT++;

    printHeight();

    start();
}

function printHeight()
{
    var div = document.getElementById('heightPrint');
    div.innerHTML = "Height: " + BOARD_HEIGHT;
}

function decW()
{
    BOARD_WIDTH--;

    if(BOARD_WIDTH <0 )
        BOARD_WIDTH = 0;

    printWidth();

    start();
}

function incW()
{
    BOARD_WIDTH++;

    printWidth();

    start();
}

function printWidth()
{
    var div = document.getElementById('widthPrint');
    div.innerHTML = "Width: " + BOARD_WIDTH;
}

function decWin()
{
    WIN_LENGTH--;

    if(WIN_LENGTH <0 )
        WIN_LENGTH = 0;

    printWinLength();
}

function incWin()
{
    WIN_LENGTH++;

    printWinLength();
}

function printWinLength()
{
    var div = document.getElementById('winPrint');
    div.innerHTML = "winLength: " + WIN_LENGTH;
}


function printBoard()
{
    //Only print the debug output if we're running debug mode...

    var win = whoIsWinner(myBoard);
    var count = countRemainingMoves(myBoard);

    if(!debug)
        return;

    var div = document.getElementById('ticTacOutput');
    var pdiv = document.getElementById('ticTacOutputBoardPrint');
    var boardString = "<br>";
    boardString = boardString + pieceAt(myBoard, 0, 0) + "|" + pieceAt(myBoard, 1, 0) + "|" + pieceAt(myBoard, 2, 0);
    boardString = boardString + "<br>__|_|__<br>";
    boardString = boardString + pieceAt(myBoard, 0, 1) + "|" + pieceAt(myBoard, 1, 1) + "|" + pieceAt(myBoard, 2, 1);
    boardString = boardString + "<br>__|_|__<br>";
    boardString = boardString + pieceAt(myBoard, 0, 2) + "|" + pieceAt(myBoard, 1, 2) + "|" + pieceAt(myBoard, 2, 2);
    boardString = boardString + "<br>";
    pdiv.innerHTML = boardString;

    boardString = "";

    div.innerHTML = boardString;
    div.innerHTML = div.innerHTML + "<br>";
    div.innerHTML = div.innerHTML + "Turn: " + curPiece;
    div.innerHTML = div.innerHTML + "<br>";

    var count = countRemainingMoves(myBoard);
    div.innerHTML = div.innerHTML + "Moves Remaining: " + count;
    div.innerHTML = div.innerHTML + "<br>";

    if (win === 1)
        win = "Player 1 won.";
    else if (win === 2)
        win = "Player 2 won.";
    else if (count === 0)
        win = "Cats Game.";
    else
        win = "No Winner Yet.";

    div.innerHTML = div.innerHTML + win;
}

function switchPiece()
{
    if (curPiece === 1)
        curPiece = 2;
    else
        curPiece = 1;
}

function gameOver(board)
{
    //Has someone already won?
    var win = whoIsWinner(myBoard);
    if (win === 1)
        return 1;
    else if (win === 2)
        return 1;
    else
        return 0;
}


function compMove()
{
    if (gameOver(myBoard))
        return;

    if (curPiece === 1)
        return;

    //debugging tools
    calcRuns = 0;

    //Get optimal move...
    var move = calcMove(myBoard, curPiece, 0);

    var x, y;
    x = decodeMoveX(move);
    y = decodeMoveY(move);
    if (placePieceOnBoard(myBoard, x, y, curPiece))
    {
        switchPiece();
    }
    //sender.innerHTML = pieceAt(myBoard, x, y);
    printBoard();
}

function moveWouldWin(board, x, y, player)
{
    var wouldWin = 0;
    if (placePieceOnBoard(board, x, y, player))
    {
        wouldWin = (whoIsWinner(board) === player);
        removePieceOnBoard(board, x, y);
    }
    return wouldWin;
}

function lastMove(board, x, y, player)
{
    if (countRemainingMoves(board) > 1)
        return 0;

    if (placePieceOnBoard(board, x, y, player))
    {
        removePieceOnBoard(board, x, y);
        return 1;
    }
    return 0;
}

function calcMove(board, player, depth)
{
    calcRuns++; //Each time we invoke recursion we're going to bump the count

    var tempBoard = board; //.slice(0);
    var movesRemain = countRemainingMoves(tempBoard);

    //Can I win?
    for (var x = 0; x < tempBoard.length; x++)
    {
        for (var y = 0; y < tempBoard[x].length; y++)
        {
            //Can I win?
            if (moveWouldWin(tempBoard, x, y, player))
            {
                var winningMove = newWinningMove(x, y, player);
                return winningMove;
            }
        }
    }

    //Will I lose / Last move?
    for (var x = 0; x < tempBoard.length; x++)
    {
        for (var y = 0; y < tempBoard[x].length; y++)
        {
            var win = 0;
            //Will I lose?
            if (moveWouldWin(tempBoard, x, y, playerRotate(player)))
            {
                //block

                var block = newMove(x, y, player);
                if (movesRemain <= 1)
                    return block;

                if (placePieceOnBoard(tempBoard, x, y, player))
                {
                    var lastMove = calcMove(tempBoard, playerRotate(player), depth+1);
                    removePieceOnBoard(tempBoard, x, y);
                }

                block.player1Wins += winsForPlayer1(lastMove);
                block.player2Wins += winsForPlayer2(lastMove);
                //before returning block we should see if the game is over yet...
                return block;
            }
            else if (movesRemain === 1)
            {
                //Try placing piece there
                if (placePieceOnBoard(tempBoard, x, y, player))
                {
                    removePieceOnBoard(tempBoard, x, y);
                    var lastMove = newCatsMove(x, y, player);
                    return lastMove;
                }
            }
        }
    }


    if((depth >= DIFFICULTY)&&(DIFFICULTY>0))
    {
        for (var x = 0; x < tempBoard.length; x++)
        {
            for (var y = 0;y < tempBoard[x].length; y++)
            {
                if (legalMove(tempBoard, x, y, player))
                        return newMove(x, y, player);   //return generic move
            }
        }
    }


    var moves = [];
    var p1WinCount = 0;
    var p2WinCount = 0;

    for (var x = 0; x < tempBoard.length; x++)
    {
        for (var y = 0; y < tempBoard[x].length; y++)
        {
            //If move is legal
            if (legalMove(tempBoard, x, y, player))
            {
                var move = newMove(x, y, player);
                moves = addMoveToMoves(move, moves); // possible moves

                if (!legalMove(tempBoard, x, y, player))
                    continue;

                //Look ahead
                if (placePieceOnBoard(tempBoard, x, y, player))
                {
                    var lastMove = calcMove(tempBoard, playerRotate(player), depth+1);

                    removePieceOnBoard(tempBoard, x, y);

                    if ((winsForPlayer1(lastMove) <= 0) && (winsForPlayer2(lastMove) <= 0))
                        continue;
                    //bump wins & losses
                    move.player1Wins += winsForPlayer1(lastMove);
                    move.player2Wins += winsForPlayer2(lastMove);

                    p1WinCount += winsForPlayer1(lastMove);
                    p2WinCount += winsForPlayer2(lastMove);
                    if(debug)
                        console.log("POne Wins: " + p1WinCount + "PTwo Wins: " + p2WinCount);
                }
            }
        }
    }

    //Determine which are best for me...
    var bestMove = moves[0];
    var bestMoves = [];

    moves.forEach(function (entry)
    {
        if (player === 1)
        {
            if (entry.player2Wins < bestMove.player2Wins)
                bestMove = entry;
            else if ((entry.player2Wins === bestMove.player2Wins) && (entry.player1Wins > bestMove.player1Wins))
                bestMove = entry;
        }
        else
        {
            if (entry.player1Wins < bestMove.player1Wins)
                bestMove = entry;
            else if ((entry.player1Wins === bestMove.player1Wins) && (entry.player2Wins > bestMove.player2Wins))
                bestMove = entry;
        }
    });

    moves.forEach(function (entry)
    {
        if (player === 1)
        {
            if ((entry.player2Wins === bestMove.player2Wins) && (entry.player1Wins >= bestMove.player1Wins))
                addMoveToMoves(entry, bestMoves);
        }
        else
        {
            if ((entry.player1Wins === bestMove.player1Wins) && (entry.player2Wins >= bestMove.player2Wins))
                addMoveToMoves(entry, bestMoves);
        }
    });

    bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

    bestMove.player1Wins = p1WinCount;
    bestMove.player2Wins = p2WinCount;

    return bestMove;
}

function initializeBoard(board)
{
    for (var x = 0; x < board.length; x++)
    {
        for (var y = 0; y < board[x].length; y++)
        {
            board[x][y] = 0;
        }
    }
}

function removePieceOnBoard(board, x, y)
{
    board[x][y] = 0;

    updateUI(board, x, y);
}



function encodeMove(x, y, p1Wins, p2Wins, player, tieCount, gameOver)

{
    //return (((x << 4) + y) + willWin<<8);
    var encodedMove = {
        x: x,
        y: y,
        player1Wins: p1Wins,
        player2Wins: p2Wins,
        player: player,
        tieCount: tieCount,
        gameOver: gameOver
    };

    return encodedMove;
}


function decodeMoveX(move)
{
    return move.x;
}

function decodeMoveY(move)
{
    return move.y;
}

function decodeMoveWillWin(move, player)
{
    return (move.willWin === 1) && (move.player === player);
}

function decodeMoveplayer(move)
{
    return move.player;
}

function decodeMoveTurnCount(move)
{
    return move.turnCount;
}


function playerRotate(player)
{
    if (player === 1)
        player = 2;
    else
        player = 1;

    return player;
}

function decodeMoveWillLose(move, player)
{
    return (move.willWin === 1) && (move.player === playerRotate(player));
}


//  Button ID's will use bit manipulation to store their X & Y coordinates in ID
function encodeMaskedMove(x, y)
{
    return ((x << 8) + y);
}

function maskedX(move)
{
    return (move >> 8);
}

function maskedY(move)
{
    return move & 0xFF;
}


function placePieceOnBoard(board, x, y, type)
{
    if (board[x][y] === 1)
        return 0;

    if (board[x][y] === 2)
        return 0;

    board[x][y] = type; //place piece at x, y


    updateUI(board, x, y);

    //Zbeyer -> This is a hack, clean this up later...
    gameOverUI();   //Should not be using global

    return type;

}

function updateUI(board, x, y)
{
    var id = encodeMaskedMove(x, y)
        .toString();
    var button = document.getElementById(id);
    button.innerHTML = pieceAt(board, x, y);

    if (board[x][y] === 1)
        button.style.color = "FF0000";
    else if (board[x][y] === 2)
        button.style.color = "0000FF";
    else
        button.style.color = "000000";
}

function gameOverUI()
{
    var bg = document.getElementById('body');
    var color = ""; //Clear color?

    var count = countRemainingMoves(myBoard);
    theWinningPlayer = whoIsWinner(myBoard);
    if(!theWinningPlayer && !count)
    {
        theWinningPlayer = -1;    //Tie game

    }

    if(theWinningPlayer === 0)
        color = "";     //  Game not over
    else if (theWinningPlayer === 1)
        color = "FF0000";   //X's won
    else if (theWinningPlayer === 2)
        color = "0000FF";   //O's won
    else
        color = "FFFF00";   //tie game
    document.body.style.background = color;
 }

function placeXOnBoard(board, x, y)
{
    placePieceOnBoard(board, x, y, 1); //place X at x, y
}

function placeYOnBoard(board, x, y)
{
    placePieceOnBoard(board, x, y, 2); //place O at x, y
}

function pieceAt(board, x, y)
{
    var p = board[x][y];
    if (p === 1)
        return "X";

    if (p === 2)
        return "O";

    return "_";
}

function widthOfBoard(board)
{
    return board.length;
}

function heightOfBoard(board)
{
    if (!widthOfBoard(board))
        return 0;

    return board[0].length;
}

function countRemainingMoves(board)
{
    var h, w;
    w = widthOfBoard(board);
    if (!w)
        return 0;

    h = heightOfBoard(board);

    var count = 0;
    for (var x = 0; x < w; x++)
    {
        for (var y = 0; y < h; y++)
        {
            if (!board[x][y])
                count++;
        }
    }
    return count;
}

function whoIsWinner(board)
{
    var player = 1;
    var win = winner(board, player, WIN_LENGTH);
    if (win)
        return win;

    player = 2;
    win = winner(board, player, WIN_LENGTH);
    if (win)
        return win;

    return 0;
}

function winnerFromPiece(board, x, y)
{
    return winner(board, board[x][y], WIN_LENGTH);
}

function winner(board, player, winLength)
{
    for (var x = 0; x < board.length; x++)
    {
        for (var y = 0; y < board[x].length; y++)
        {
            if (board[x][y] === 'undefined')
                continue;

            if (board[x][y] === 0)
                continue;

            var count = 0;
            //Horizontal
            while (board[x + count][y] === player)
            {
                count++;
                if (count === winLength)
                    return player;


                if (x + count >= board.length)
                    break;
            }

            //Vertical
            count = 0;
            while (board[x][y + count] === player)
            {
                count++;
                if (count === winLength)
                    return player;

                if (y + count >= board.length)
                    break;
            }

            //Diagonal Down
            count = 0;
            while (board[x + count][y + count] === player)
            {
                count++;
                if (count === winLength)
                    return player;

                if (x + count >= board.length)
                    break;
                if (y + count >= board[x + count].length)
                    break;
            }

            //Diagonal UP
            count = 0;
            while (board[x + count][y - count] === player)
            {
                count++;
                if (count === winLength)
                    return player;

                if (x + count >= board.length)
                    break;
                if (y - count < 0)
                    break;
            }
        }
    }

    //If we get here, player did not win...
    return 0;
}

function addMoveToMoves(move, moves)
//Store possible move in an array of moves
{
    moves[moves.length] = move;
    return moves;
}

function winsForPlayerInMove(move, player)
//Return the win count of given player for move
{
    if (player === 1)
        return move.player1Wins;
    return move.player2Wins;
}

function winsForPlayer1(move)
//Return the P1 wincount
{
    return move.player1Wins;
}

function winsForPlayer2(move)
//Return the p2 wincount
{
    return move.player2Wins;
}

function newMove(x, y, player)
//Generate a move with no wins, tie, and the game is not over
{
    //Zbeyer -> this should be cleaned up...
    return encodeMove(x, y, 0, 0, player, 0, 0);
}

function newCatsMove(x, y, player)
//Generate a move that indicates a tie
{
    var move = newMove(x, y, player);
    move.tieCount = 1;
    move.gameOver = 1;
    return move;
}

function newWinningMove(x, y, player)
//Generate move with a win for a given player
{
    var move = newMove(x, y, player);
    move = bumpWinCountForPlayer(move, player);
    move.gameOver = 1;
    return move;
}

function bumpWinCountForPlayer(move, player)
{
    if (player === 1)
        move.player1Wins++;
    if (player === 2)
        move.player2Wins++;
    return move;
}

function legalMove(board, x, y, player)
//Can the player make this move?
{
    if (placePieceOnBoard(board, x, y, player))
    {
        removePieceOnBoard(board, x, y);
        return 1;
    }
    else
        return 0;
}

function strongerMove(bestMove, move, player)
//Determine which of 2 moves is better
{
    if (typeof bestMove === 'undefined')
        return move;

    //Should never hit this state...
    if (typeof move === 'undefined')
        return bestMove;

    //if current "best"-move wont win but new move will -> Return winning move
    if ((decodeMoveWillWin(move, player)) && (!decodeMoveWillWin(bestMove, player)))
        return move;

    //if current "best"-move will lose but new move wont->
    if ((!decodeMoveWillLose(move, player)) && (decodeMoveWillLose(bestMove, player)))
        return move;

    if (move.turnCount > bestMove.turnCount)
    {
        if(debug)
            console.log("Found a faster move");
        if (decodeMoveWillWin(move, player))
            return move;
    }

    return bestMove;
}