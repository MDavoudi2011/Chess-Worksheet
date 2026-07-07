import React, { useRef } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  Tooltip,
  Box,
  CircularProgress,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MenuIcon from '@mui/icons-material/Menu';
import GridViewIcon from '@mui/icons-material/GridView';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import { useWorksheetStore } from '../../store/useWorksheetStore';
import { pdf } from '@react-pdf/renderer';
import { WorksheetPdf } from '../WorksheetPdf/WorksheetPdf';

interface HeaderProps {
  onDrawerToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const { questions, worksheetTitle, setWorksheetTitle, itemsPerPage, setItemsPerPage, exportToJson, importFromJson } = useWorksheetStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importFromJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrint = async () => {
    try {
      setIsExporting(true);
      const doc = <WorksheetPdf settings={{ title: worksheetTitle, layout: itemsPerPage }} questions={questions} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${worksheetTitle || 'جزوه'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ zIndex: 1100, borderRadius: 4, border: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
      <Toolbar sx={{ py: 1.5, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        
        <Stack direction="row" sx={{ width: { xs: '100%', md: 'auto' }, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              کاربرگ‌ساز شطرنج
            </Typography>
          </Box>
        </Stack>

        <TextField
          variant="outlined"
          size="small"
          placeholder="عنوان جزوه"
          value={worksheetTitle}
          onChange={(e) => setWorksheetTitle(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', md: 400 }, width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: { xs: '100%', md: 'auto' }, flexWrap: 'wrap', justifyContent: 'center' }}> 
          <Tooltip title={itemsPerPage === 4 ? "تغییر به ۱ سوال در صفحه" : "تغییر به ۴ سوال در صفحه"}>
            <Button
              variant="outlined"
              onClick={() => setItemsPerPage(itemsPerPage === 4 ? 1 : 4)}
              startIcon={itemsPerPage === 4 ? <GridViewIcon /> : <CropPortraitIcon />}
              sx={{ borderRadius: 3 }}
            >
              چیدمان
            </Button>
          </Tooltip>

          <input
            type="file"
            accept=".json"
            style={{ display: 'none', width: 0, height: 0, position: 'absolute' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <Tooltip title="بارگذاری فایل JSON">
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ borderRadius: 3 }}
            >
              بارگذاری
            </Button>
          </Tooltip>

          <Tooltip title="ذخیره پروژه در JSON">
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={exportToJson}
              sx={{ borderRadius: 3 }}
            >
              خروجی JSON
            </Button>
          </Tooltip>

          <Tooltip title="تولید و دانلود PDF">
            <span>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                disabled={isExporting}
                startIcon={
                  isExporting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PictureAsPdfIcon />
                  )
                }
                onClick={handlePrint}
                sx={{ borderRadius: 3, fontWeight: 'bold', minWidth: '130px' }}
              >
                {isExporting ? 'در حال خروجی...' : 'خروجی PDF'}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};