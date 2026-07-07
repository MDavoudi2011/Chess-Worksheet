import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import { useWorksheetStore } from '../../store/useWorksheetStore';
import { toPersianNumber } from '../../utils/persianNumbers';

export const PrintLayout: React.FC = () => {
  const { questions, worksheetTitle, itemsPerPage } = useWorksheetStore();

  const getGridTemplateColumns = () => {
    switch (itemsPerPage) {
      case 1: return '1fr';
      case 2: return '1fr';
      case 4: return '1fr 1fr';
      case 6: return '1fr 1fr';
      default: return '1fr 1fr';
    }
  };

  const getGridTemplateRows = () => {
    switch (itemsPerPage) {
      case 1: return '1fr';
      case 2: return '1fr 1fr';
      case 4: return '1fr 1fr';
      case 6: return '1fr 1fr 1fr';
      default: return '1fr 1fr';
    }
  };

  const pages = [];
  for (let i = 0; i < questions.length; i += itemsPerPage) {
    pages.push(questions.slice(i, i + itemsPerPage));
  }

  return (
    <Box
      sx={{
        display: 'none',
        '@media print': {
          display: 'block',
          width: '100%',
          backgroundColor: '#fff',
          '@page': {
            size: 'A4',
            margin: '0mm',
          },
        },
      }}
    >
      {pages.map((pageQuestions, pageIndex) => (
        <Box
          key={pageIndex}
          sx={{
            pageBreakAfter: 'always',
            pageBreakInside: 'avoid',
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Print Header */}
          <Box sx={{ borderBottom: '2px solid #000', pb: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{worksheetTitle}</Typography>
            <Typography variant="body1">صفحه {toPersianNumber(pageIndex + 1)} از {toPersianNumber(pages.length)}</Typography>
          </Box>

          {/* Grid of questions */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: getGridTemplateColumns(),
              gridTemplateRows: getGridTemplateRows(),
              gap: '20mm',
              flexGrow: 1,
            }}
          >
            {pageQuestions.map((q, i) => {
              const globalIndex = pageIndex * itemsPerPage + i;
              return (
                <Box key={q.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {toPersianNumber(globalIndex + 1)}. {q.title}
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '100%', maxWidth: itemsPerPage >= 4 ? '120mm' : '150mm' }}>
                      <Chessboard
                        position={q.fen}
                        boardOrientation={q.orientation}
                        arePiecesDraggable={false}
                        animationDuration={0} // Disable animation for print
                      />
                    </Box>
                  </Box>
                  {q.description && (
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#555' }}>
                      {q.description}
                    </Typography>
                  )}
                  {/* Turn indicator */}
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '1px solid #000',
                        bgcolor: q.turnToMove === 'w' ? '#fff' : '#000',
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      نوبت {q.turnToMove === 'w' ? 'سفید' : 'سیاه'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
