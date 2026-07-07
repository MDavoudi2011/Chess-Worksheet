import { useState } from 'react';
import { Box } from '@mui/material';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { PrintLayout } from './components/PrintLayout/PrintLayout';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Box sx={{ '@media print': { display: 'none' }, height: '100vh', display: 'flex', flexDirection: 'column', p: { xs: 2, lg: 3 }, gap: { xs: 2, lg: 3 }, bgcolor: 'background.default' }}>
        <Header onDrawerToggle={() => setMobileOpen(!mobileOpen)} />
        <Box sx={{ 
          flexGrow: 1, 
          display: { xs: 'flex', lg: 'grid' }, 
          flexDirection: 'column', 
          gridTemplateColumns: { lg: '1fr 1fr auto' }, 
          overflow: 'hidden', 
          gap: { xs: 2, lg: 3 } 
        }}>
          <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <Editor />
        </Box>
      </Box>
      <PrintLayout />
    </>
  );
}

export default App;
