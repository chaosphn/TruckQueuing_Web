import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

function NotFoundDialog({ opens, onSave }) {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleClose = () => {
    onSave(false);
  };

  return (
    <Dialog 
      open={opens} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={true}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {/* ยืนยันการดำเนินการ */}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' ,gap: 1 }}>
          <Typography sx={{ mb: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            ไม่พบข้อมูลการค้นหา
          </Typography>
          <Typography sx={{ mb: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            กรุณาตรวจสอบอีกครั้ง
          </Typography>
          <Button 
            onClick={handleClose} 
            color="info"
            variant="contained"
            size='large'
            sx={{ mt: 2, fontSize: '1.5rem', px: 8, py: 2 }}
          >
            ตกลง
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        
      </DialogActions>
    </Dialog>
  );
}

export default NotFoundDialog;