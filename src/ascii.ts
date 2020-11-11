function ascii() {
  var s = '   +------------------------+\n';

  for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
    /* display the rank */

    if (file(i) === 0) {
      s += ' ' + '87654321'[rank(i)] + ' |';
    }

    /* empty piece */

    if (board[i] == null) {
      s += ' . ';
    } else {
      var piece = board[i].type;

      var color = board[i].color;

      var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();

      s += ' ' + symbol + ' ';
    }

    if ((i + 1) & 0x88) {
      s += '|\n';

      i += 8;
    }
  }

  s += '   +------------------------+\n';

  s += '     a  b  c  d  e  f  g  h\n';

  return s;
}
