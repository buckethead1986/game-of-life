<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Game of Life</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="index.css">
  </head>
  <body>
      <div style='text-align: center'>
        <button class="btn btn-primary" id="start-button">Start!</button>
      </div></br>
      <div class="board"></div>
      <button id="showOptions" class="btn btn-primary">Options</button>
      <div id="options" style="display: none">
      </br>
        <h4 id='board-dimension'></h4>
      <form>
        <div class="form-group">
          <label for="board-width">Enter board width (10-100)</label>
          <input type="text" class="form-control" id="board-width" placeholder="Width">
        </div>
        <div class="form-group">
          <label for="board-height">Enter board height (10-100)</label>
          <input type="text" class="form-control" id="board-height" placeholder="Height">
        </div>
        <div class="form-group">
          <label for="live-color">Enter live cell color (by name, hex code, rgb...)</label>
          <input type="text" class="form-control" id="live-color" placeholder="Live Cell Color">
        </div>
        <div class="form-group">
          <label for="speed">Enter generation speed (in milliseconds)</label>
          <input type="text" class="form-control" id="speed" placeholder="Speed (in ms)">
        </div>
        <button type="submit" class="btn btn-primary" id="board-options-button">Submit</button>
      </form>
    </div>
  </br>

    </br>
    <div id="explanation"><h3>The Game Of Life</h3><p>This is a clone of Conways Game of Life. It's the best type of game,
      with a few simple rules for behavior, and a staggering amount of resulting complexity. Select a width and height for
       the game, which cells will start 'alive', while the rest start 'dead', click start, and see life take over.
    </p></div>
    <div id="tips">
      <h3>Tips</h3>
      <p>Try using different colors, and have them 'compete'</p>
      <p>Hold 'c' to create multiple live cells</p>
      <p>Hold 'x' to create multiple dead cells</p>
    </div>

    <script type="text/javascript" src="index.js"></script>
  </body>
</html>
