import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Button, Typography, Drawer, IconButton, useTheme, useMediaQuery, Paper } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useWorksheetStore } from '../../store/useWorksheetStore';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const { questions, selectedQuestionId, selectQuestion, addQuestion, removeQuestion, reorderQuestions } = useWorksheetStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  const handleSelect = (id: string) => {
    selectQuestion(id);
    if (isMobile) onClose();
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', p: 2, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>لیست سوالات</Typography>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, mr: -1, pr: 1, minHeight: 0, overflowX: 'hidden' }}>
        {mounted && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="worksheet-sidebar">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          // حذف عرض ۱۰۰٪ دستی و سپردن محاسبه عرض به خود کتابخانه
                          style={provided.draggableProps.style} 
                        >
                          <SidebarItem
                            question={question}
                            index={index}
                            isSelected={question.id === selectedQuestionId}
                            onSelect={handleSelect}
                            onDelete={removeQuestion}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<AddCircleOutlinedIcon />}
        onClick={() => {
          addQuestion();
          if (isMobile) onClose();
        }}
        sx={{ py: 1.5, flexShrink: 0, borderRadius: 3, fontWeight: 'bold' }}
      >
        افزودن سوال جدید
      </Button>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 340, borderRadius: '24px 0 0 24px' },
        }}
      >
        {sidebarContent}
      </Drawer>
      <Paper
        elevation={0}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column', // چیدمان درست محتوای داخلی
          flex: 1, 
          maxWidth: '100%', // دقیقاً ۵۰ درصد فضای در دسترس را می‌گیرد
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        {sidebarContent}
      </Paper>
    </>
  );
};