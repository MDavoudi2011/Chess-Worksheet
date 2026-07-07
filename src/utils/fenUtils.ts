export function updateFenTurn(fen: string, turn: 'w' | 'b'): string {
  const parts = fen.split(' ');
  if (parts.length < 2) return fen;
  parts[1] = turn;
  return parts.join(' ');
}

export function fenToArray(fen: string): string[][] {
  const [board] = fen.split(' ');
  return board.split('/').map(row => {
    const rowArr: string[] = [];
    for (const char of row) {
      if (/[1-8]/.test(char)) {
        for (let i = 0; i < parseInt(char, 10); i++) rowArr.push('');
      } else {
        rowArr.push(char);
      }
    }
    return rowArr;
  });
}

export function arrayToFen(board: string[][], restOfFen = 'w - - 0 1'): string {
  const fenRows = board.map(row => {
    let emptyCount = 0;
    let rowStr = '';
    for (const char of row) {
      if (char === '') {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        rowStr += char;
      }
    }
    if (emptyCount > 0) rowStr += emptyCount;
    return rowStr;
  });
  return `${fenRows.join('/')} ${restOfFen}`;
}

export function putPiece(fen: string, square: string, piece: string): string {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(square[1], 10);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return fen;
  
  const parts = fen.split(' ');
  const board = fenToArray(fen);
  board[rank][file] = piece;
  
  return arrayToFen(board, parts.slice(1).join(' '));
}

export function removePiece(fen: string, square: string): string {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(square[1], 10);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return fen;
  
  const parts = fen.split(' ');
  const board = fenToArray(fen);
  board[rank][file] = '';
  
  return arrayToFen(board, parts.slice(1).join(' '));
}

export function movePiece(fen: string, source: string, target: string, pieceStr?: string): string {
  const sFile = source.charCodeAt(0) - 'a'.charCodeAt(0);
  const sRank = 8 - parseInt(source[1], 10);
  const tFile = target.charCodeAt(0) - 'a'.charCodeAt(0);
  const tRank = 8 - parseInt(target[1], 10);
  
  const parts = fen.split(' ');
  const board = fenToArray(fen);
  
  const p = pieceStr || board[sRank][sFile];
  board[sRank][sFile] = '';
  board[tRank][tFile] = p;
  
  return arrayToFen(board, parts.slice(1).join(' '));
}
