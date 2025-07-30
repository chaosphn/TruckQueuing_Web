import React, { useEffect, useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber } from '../../services/http-service';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, RefreshCcw, Trash, MousePointer2 } from 'lucide-react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { dateFormatParser } from '../../services/date-service';
import Typography from '@mui/material/Typography';
import DataDetailDialog from '../detail-dialog/dialog';
import { Button } from '@mui/material';

const TruckDataDialog = ({ open, data, mode, type, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [ queueData, setQueueData ] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectionRow, setSelectionRow] = useState(null);
  const [ openDataDialog, setOpenDataDialog ] = useState(false);

  useEffect(() => {
    console.log(mode, type, data);
    if(data){
      setQueueData(data);
    }
    if(mode === 'order' && data && data.length > 0){
      setSelectionRow(data[0]);
      setOpenDataDialog(true);
    } 
  }, [data]);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    //console.log('Confirmed:', { activeTab, plateNumber, orderNumber });
    closeDialog();
  };

  const handleSave = async () => {

  };

  const handleRowSelect = (selection) => {
    const selectedRows= queueData.find(row => row.ID === selection.ID);
    if (selectedRows) {
      setSelectionRow(selection);
      setOpenDataDialog(true);
      console.log('🚀 Selected Row:', selectedRows);
    }
  };

  const handleSelectedRowAction = (row) => {
    // Your action with selected row
    console.log('🔥 Do something with:', row);
  };

  const handleReloadData = async () => {
    console.log(data, mode, type);
    if(mode === 'plate'){
      const plateHead = data[0].FontLicense ?? '';
      const plateTail = data[0].RearLicense ?? '';
      const result = await getDatabyPlateNumber(plateHead, plateTail);
      if(result && result.length > 0){
        console.log(result);
        setQueueData(result);
      } else {
        alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั้ง');
      }
    } else if(mode === 'order'){
      const orderNumber = data[0].Code ?? '';
      const result = await getDatabyOrder(orderNumber);
      if(result && result.length > 0){
        console.log(result);
        setQueueData(result);
      } else {
        alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั้ง');
      }
    } else {
      alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั้ง');
    }
  };

  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: 'Code', headerName: 'เลขออเดอร์', flex: 0.3, resizable: true },
    { field: 'DateArrival', headerName: 'วันที่', flex: 0.4, resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" style={{ color: 'var(--textSecondary)', fontSize: 14, paddingTop: 8 }}>
          {dateFormatParser(new Date(params.value), 'dd-MM-yyyy HH:mm')}
        </Typography>  
      )
    },
    { field: 'Carrier', headerName: 'บริษัท', flex: 0.4, resizable: true },
    // { field: 'FontLicense', headerName: 'ทะเบียนหัว', flex: 0.3, resizable: true },
    // { field: 'RearLicense', headerName: 'ทะเบียนหาง', flex: 0.3, resizable: true },
    // { field: 'Driver1', headerName: 'ชื่อคนขับ', flex: 0.5, resizable: true },
    { field: 'DestinationName', headerName: 'ปลายทาง', flex: 1, resizable: true },
    { field: 'dawda', headerName: 'Action', flex: 0.2, resizable: true,
      renderCell: (params) => (
        <Button startIcon={ <MousePointer2 /> } variant='contained' size='small' color="info" onClick={() => handleRowSelect(params.row)}>เลือก</Button>
      )
    },
  ];

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full mx-auto flex flex-col justify-center gap-4 p-8  scale-110">
        {/* SEARCH SECTION*/}
        <div className='w-full flex justify-between items-center'>
          <Typography sx={{ mb: 0, fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'underline' }}>
            กรุณาเลือกออเดอร์
          </Typography>
          <div className='flex items-center gap-4'>
            <Typography sx={{ mb: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
              ทะเบียนหัว : { queueData[0]?.FontLicense || plateHeadNumber }
            </Typography>
            <Typography sx={{ mb: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
              ทะเบียนหาง : { queueData[0]?.RearLicense || plateTailNumber }
            </Typography>
          </div>
        </div>  
        {/* TABLE SECTION*/}
        <div className='min-h-72'>
          <div className="border-box w-full h-full">   
              <Paper sx={{ width: '100%', maxWidth: '100%' }}>
                <DataGrid
                  sx={{ minHeight: 300 }}
                  getRowId={(row) => row.ID}
                  rows={  
                    queueData.filter(x => x.FontLicense.includes(plateHeadNumber))
                      .filter(x => x.RearLicense.includes(plateTailNumber))
                        .filter(x => x.Code.includes(orderNumber))
                    }
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  getRowHeight={() => 40}
                />
              </Paper>
          </div>
        </div> 
        {/* BUTTON SECTION*/}
        <div className="rounded-b-xl flex justify-between space-x-4 mt-12">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>
          <button
            onClick={handleReloadData}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>รีโหลด</span>
            <span><RefreshCcw className="w-5 h-5 text-white" /></span>
          </button>
        </div>       
      </div>
      <DataDetailDialog open={openDataDialog} data={selectionRow} mode={mode} type={type} 
        onClose={() => {
          setOpenDataDialog(false);
          setSelectionRow(null);
        }} 
        onSave={() => {
          setOpenDataDialog(false);
          onClose();
        }}
      ></DataDetailDialog>
    </div>
  );
};

export default TruckDataDialog;