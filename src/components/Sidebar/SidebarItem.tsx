import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Box, Typography, Stack, IconButton, Card, CardActionArea } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Question } from '../../types';
import { toPersianNumber } from '../../utils/persianNumbers';

interface SidebarItemProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
  dragHandleProps,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        bgcolor: isSelected ? 'primary.50' : 'background.default',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        borderRadius: 3,
        width: '100%',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'divider',
          bgcolor: isSelected ? 'primary.50' : 'action.hover',
        },
      }}
    >
      {/* Drag Handle */}
      <Box
        {...dragHandleProps}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          color: 'text.disabled',
          cursor: 'grab',
          flexShrink: 0,
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>

      {/* Clickable Area */}
      <CardActionArea onClick={() => onSelect(question.id)} sx={{ p: 1.5, flexGrow: 1, minWidth: 0, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', width: '100%', minWidth: 0 }}>
          <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', position: 'relative', bgcolor: '#fff', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 240, height: 240, transform: 'scale(0.2)', transformOrigin: 'top left', pointerEvents: 'none' }}>
              <Chessboard
                id={`preview-${question.id}`}
                position={question.fen}
                boardOrientation={question.orientation}
                arePiecesDraggable={false}
                boardWidth={240}
                showBoardNotation={false}
                animationDuration={0}
              />
            </Box>
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {question.title || `سوال ${toPersianNumber(index + 1)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {question.description || 'بدون توضیحات'}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>

      {/* Delete Button */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(question.id);
        }}
        sx={{
          mr: 1,
          flexShrink: 0,
          color: 'error.main',
          opacity: 0.6,
          '&:hover': { opacity: 1, bgcolor: 'error.50' },
        }}
      >
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
    </Card>
  );
};
