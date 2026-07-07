import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Box } from '@mui/material';
import { putPiece, removePiece, movePiece, fenToArray } from '../../utils/fenUtils';

interface BoardEditorProps {
  fen: string;
  onChange: (fen: string) => void;
  orientation: 'white' | 'black';
}

export const BoardEditor: React.FC<BoardEditorProps> = ({
  fen,
  onChange,
  orientation,
}) => {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const handleSquareClick = (square: string) => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1], 10);
    const board = fenToArray(fen);
    const clickedPiece = board[rank]?.[file];

    if (clickedPiece) {
      setSelectedPiece(clickedPiece);
    } else if (selectedPiece) {
      const newFen = putPiece(fen, square, selectedPiece);
      onChange(newFen);
    }
  };

  const handleSquareRightClick = (square: string) => {
    const newFen = removePiece(fen, square);
    onChange(newFen);
  };

  const handleDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    const pStr = piece[0] === 'w' ? piece[1].toUpperCase() : piece[1].toLowerCase();
    const newFen = movePiece(fen, sourceSquare, targetSquare, pStr);
    onChange(newFen);
    setSelectedPiece(null);
    return true;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%' }} dir="ltr">
        <Chessboard
          id="editor-board"
          position={fen}
          onPieceDrop={handleDrop as any}
          onSquareClick={handleSquareClick as any}
          onSquareRightClick={handleSquareRightClick as any}
          boardOrientation={orientation}
          dropOffBoardAction="trash"
          customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px rgba(79, 70, 229, 0.5)' }}
        />
      </Box>
    </Box>
  );
};
