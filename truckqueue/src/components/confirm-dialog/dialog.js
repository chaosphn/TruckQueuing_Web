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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function ManageDialog({ opens, selectedAction, onSave, count = 0, chaeckbox = false }) {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!opens) {
      setLoading(false);
      setCountdown(0);
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
    }
  }, [opens, timer]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const handleConfirm = () => {
    if (count > 0) {
      setLoading(true);
      setCountdown(count);

      // สร้าง countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // สร้าง main timer สำหรับเสร็จสิ้นการดำเนินการ
      const mainTimer = setTimeout(() => {
        setLoading(false);
        clearInterval(countdownInterval);
        onSave(true);
      }, count * 1000);

      setTimer(mainTimer);
    } else {
      // ถ้า count = 0 ดำเนินการทันที
      onSave(true);
    }
  };

  const handleCancel = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setLoading(false);
    setCountdown(0);
    onSave(false);
  };

  const handleClose = () => {
    if (loading) {
      handleCancel();
    } else {
      onSave(false);
    }
  };

  return (
    <Dialog
      open={opens}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading} // ป้องกันการปิดด้วย ESC ขณะ loading
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        ยืนยันการดำเนินการ
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            กรุณากดตกลง เพื่อยืนยันการ {selectedAction}
          </Typography>

          {chaeckbox && (
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                label="Loading Bay Abnormal"
                sx={{ fontWeight: 'bold', mb: 1, backgroundColor: 'grey.100', paddingX: 2, borderRadius: 1 }}
              />
            </Box>
          )}

          {loading && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mt: 3,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                กำลังดำเนินการ... ({countdown} วินาที)
              </Typography>
              <Button
                onClick={handleCancel}
                color="error"
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                ยกเลิก
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          ปิด
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageDialog;