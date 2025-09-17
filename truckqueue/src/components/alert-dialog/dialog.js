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

function AlertDialog({ opens, message, onSave }) {
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
      sx={{
        '& .MuiDialog-container': {
          justifyContent: 'center', 
          alignItems: 'flex-start', 
          paddingTop: '12px', 
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'left', fontWeight: 600 }}>
        • PTTLNG Truck Queuing System
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' ,gap: 1 }}>
          <Typography sx={{ mb: 0, fontSize: '1.6rem', fontWeight: 'bold', width: '100%', textAlign: 'left' }}>
            { message }
          </Typography>
          
          <Button 
            onClick={handleClose} 
            color="info"
            variant="contained"
            size='medium'
            sx={{ mt: 2, fontSize: '1rem', px: 4, py: 1 }}
          >
            ตกลง
          </Button>
        </Box>
      </DialogContent>
      
      {/* <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        
      </DialogActions> */}
    </Dialog>
  );
}

export default AlertDialog;