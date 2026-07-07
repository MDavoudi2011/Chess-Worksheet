import React, { useState } from 'react';
import { Box, Typography, TextField, Stack, Paper, ButtonGroup, Button, Tooltip, ToggleButtonGroup, ToggleButton, IconButton, Popover } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useWorksheetStore } from '../../store/useWorksheetStore';
import { BoardEditor } from '../BoardEditor/BoardEditor';
import { updateFenTurn } from '../../utils/fenUtils';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export const Editor: React.FC = () => {
  const { questions, selectedQuestionId, updateQuestion } = useWorksheetStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const question = questions.find((q) => q.id === selectedQuestionId);

  if (!question) {
    return (
      <Box sx={{ display: { xs: 'flex', lg: 'contents' }, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, bgcolor: 'background.paper', height: '100%', minHeight: 400 }}>
          <Typography variant="h6" color="text.secondary">
            لطفا یک سوال را از منوی کناری انتخاب کنید
          </Typography>
        </Paper>
      </Box>
    );
  }

  const onChange = (updates: Partial<typeof question>) => {
    updateQuestion(question.id, updates);
  };

  const side = question.fen.split(' ')[1] || 'w';

  return (
    <Box sx={{ display: { xs: 'flex', lg: 'contents' }, flexDirection: 'column', gap: 3, flexGrow: 1, minWidth: 0 }}>
      
      {/* Settings Column */}
      <Stack spacing={3} sx={{ minWidth: 0,
         overflowY: 'auto', order: { xs: 2, lg: 1 } }}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 2.5, borderRadius: 4, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>جزئیات سوال</Typography>
          <TextField
            label="عنوان سوال"
            value={question.title}
            onChange={(e) => onChange({ title: e.target.value })}
            fullWidth
          />
          <TextField
            label="صورت سوال (توضیحات)"
            value={question.description}
            onChange={(e) => onChange({ description: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 4, flexGrow: 1, overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>تنظیمات صفحه</Typography>
            
            <Tooltip title="راهنمای ویرایش صفحه" placement="top">
              <IconButton 
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{ bgcolor: 'primary.50', color: 'primary.main', '&:hover': { bgcolor: 'primary.100' } }}
              >
                <InfoRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              slotProps={{
                paper: {
                  sx: { p: 2, mt: 1, borderRadius: 3, maxWidth: 300, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }
                }
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>راهنمای صفحه شطرنج</Typography>
              <Stack spacing={1}>
                <Typography variant="body2"><b>جابجایی:</b> مهره را بکشید و رها کنید.</Typography>
                <Typography variant="body2"><b>کپی کردن:</b> روی یک مهره کلیک کنید، سپس روی خانه‌های خالی کلیک کنید تا کپی شود.</Typography>
                <Typography variant="body2"><b>حذف کردن:</b> روی مهره کلیک راست کنید یا آن را به بیرون صفحه بکشید.</Typography>
              </Stack>
            </Popover>
          </Stack>
          
          <ButtonGroup variant="outlined" fullWidth size="medium" sx={{ borderRadius: 3 }}>
            <Tooltip title="بازگشت به چیدمان اولیه">
              <Button onClick={() => onChange({ fen: START_FEN })} startIcon={<RestartAltIcon />}>
                شروع
              </Button>
            </Tooltip>
            <Tooltip title="پاک کردن کل صفحه">
              <Button color="error" onClick={() => onChange({ fen: EMPTY_FEN })} startIcon={<DeleteSweepIcon />}>
                خالی
              </Button>
            </Tooltip>
            <Tooltip title="چرخاندن جهت صفحه">
              <Button color="success" onClick={() => onChange({ orientation: question.orientation === "white" ? "black" : "white" })} startIcon={<SwapVertIcon />}>
                چرخش
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Box>
            <Typography sx={{ mb: 1.5, fontSize: 14, fontWeight: 600, color: 'text.secondary' }}>
              نوبت حرکت
            </Typography>
            <ToggleButtonGroup
              color="primary"
              exclusive
              fullWidth
              size="medium"
              value={side}
              onChange={(_, v: "w" | "b" | null) => {
                if (!v) return;
                onChange({ fen: updateFenTurn(question.fen, v) });
              }}
              sx={{
                border: '1px solid', // ضخامت حاشیه دور کادر اصلی
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                '& .MuiToggleButton-root': {
                  border: 'none', // حذف حاشیه‌های نازک و پیش‌فرض دکمه‌ها
                  borderRadius: 0, 
                },
                '& .MuiToggleButton-root:not(:first-of-type)': {
                  borderLeft: '1px solid', // ضخامت خط جداکننده وسط دکمه‌ها
                  borderColor: 'divider',
                }
              }}
            >
              <ToggleButton value="w">سفید</ToggleButton>
              <ToggleButton value="b">سیاه</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>
      </Stack>

      {/* Board Column */}
      <Box sx={{ 
        order: { xs: 1, lg: 2 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        
        height: '100%',
      }}>
        <Paper elevation={0} sx={{ 
          height: { lg: '100%' },
          maxHeight: '100%',
          maxWidth: { lg: 'calc(100vw - 650px)' },
          aspectRatio: { xs: 'auto', lg: '1/1' },
          width: { xs: '100%', lg: 'auto' },
          p: { xs: 2, lg: 4 }, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 4,
          minHeight: { xs: 400, lg: 'auto' },
          minWidth: 0,
        
        }}>
          <BoardEditor
            fen={question.fen}
            onChange={(newFen) => onChange({ fen: newFen })}
            orientation={question.orientation}
          />
        </Paper>
      </Box>
    </Box>
  );
};
