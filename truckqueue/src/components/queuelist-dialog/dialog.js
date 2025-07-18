import React, { useEffect, useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber } from '../../services/http-service';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, RefreshCcw, Trash } from 'lucide-react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { dateFormatParser } from '../../services/date-service';
import Typography from '@mui/material/Typography';
import DataDetailDialog from '../detail-dialog/dialog';
import { order_Data } from '../../mockup/orderData';
import ManageDialog from '../confirm-dialog/dialog';
import { Button } from '@mui/material';

const QueueListDialog = ({ open, data, mode, type, bay, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [ queueData, setQueueData ] = useState(order_Data);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectionRow, setSelectionRow] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [ openDataDialog, setOpenDataDialog ] = useState(false);

  useEffect(() => {
    console.log(mode, type, data);
    if(data){
      setQueueData(data);
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
    if (selection?.ids) {
      const selectedIds = Array.from(selection.ids); 
      const selectedId = selectedIds[0];

      const selectedRows= queueData.find(row => row.ID === selectedId);
      if (selectedRows) {
        setSelectionRow(selectedRows);
        if(mode === 'cancle'){
          setSelectedAction('Cancle Queue : '+Math.abs(parseInt(selectedRows.ID)-34797));
        } else {
          setSelectedAction('Assign Queue : '+Math.abs(parseInt(selectedRows.ID)-34797));
        }
        setOpenDataDialog(true);
        console.log('🚀 Selected Row:', selectedRows);
      }
    }
  };

  const handleSelectedRowAction = (row) => {
    // Your action with selected row
    console.log('🔥 Do something with:', row);
  };

  const handleReloadData = async () => {
    console.log(data, mode, type);
    onClose();
  };

  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: 'ID', headerName: 'คิวที่', flex: 0.3, resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" style={{ color: 'var(--textSecondary)', fontSize: 14, paddingTop: 8 }}>
          {Math.abs(parseInt(params.value)-34797)}
        </Typography>  
      ) 
    },
    { field: 'Code', headerName: 'เลขออเดอร์', flex: 0.3, resizable: true },
    // { field: 'DateArrival', headerName: 'วันที่', flex: 0.4, resizable: true,
    //   renderCell: (params) => (
    //     <Typography variant="body2" style={{ color: 'var(--textSecondary)', fontSize: 14, paddingTop: 8 }}>
    //       {dateFormatParser(new Date(params.value), 'dd-MM-yyyy HH:mm')}
    //     </Typography>  
    //   )
    // },
    { field: 'Carrier', headerName: 'บริษัท', flex: 0.4, resizable: true },
    { field: 'FontLicense', headerName: 'ทะเบียนหัว', flex: 0.3, resizable: true },
    { field: 'RearLicense', headerName: 'ทะเบียนหาง', flex: 0.3, resizable: true },
    { field: 'Driver1', headerName: 'ชื่อคนขับ', flex: 0.5, resizable: true },
    { field: 'DestinationName', headerName: 'ปลายทาง', flex: 0.8, resizable: true },
  ];
  const columns2 = [
    { field: 'ID', headerName: 'คิวที่', flex: 0.3, resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" style={{ color: 'var(--textSecondary)', fontSize: 14, paddingTop: 8, textAlign: 'center' }}>
          {Math.abs(parseInt(params.value)-34797)}
        </Typography>  
      ) 
    },
    { field: 'Code', headerName: 'เลขออเดอร์', flex: 0.3, resizable: true },
    // { field: 'DateArrival', headerName: 'วันที่', flex: 0.4, resizable: true,
    //   renderCell: (params) => (
    //     <Typography variant="body2" style={{ color: 'var(--textSecondary)', fontSize: 14, paddingTop: 8 }}>
    //       {dateFormatParser(new Date(params.value), 'dd-MM-yyyy HH:mm')}
    //     </Typography>  
    //   )
    // },
    { field: 'Carrier', headerName: 'บริษัท', flex: 0.4, resizable: true },
    { field: 'FontLicense', headerName: 'ทะเบียนหัว', flex: 0.3, resizable: true },
    { field: 'RearLicense', headerName: 'ทะเบียนหาง', flex: 0.3, resizable: true },
    { field: 'Driver1', headerName: 'ชื่อคนขับ', flex: 0.5, resizable: true },
    { field: 'DestinationName', headerName: 'ปลายทาง', flex: 0.8, resizable: true },
     { field: 'dawda', headerName: 'Action', flex: 0.4, resizable: true,
      renderCell: (params) => (
        <Button startIcon={ <Trash/> } variant='contained' size='small' color='error' >ยกเลิกคิว</Button>
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
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full mx-auto flex flex-col justify-center gap-8 p-8  scale-110">
        {/* SEARCH SECTION*/}
        <div className='w-full flex justify-between items-center'>
          <div className='flex items-center gap-4 font-semibold text-xl'>
            { mode === 'cancle' ? 'Cancel Queues' : 'Queues Assign at Bay '+bay }
          </div>
          {/* <TextField
            placeholder="ค้นหาด้วยเลย Order"
            size="small"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: '250px' }}
          /> */}
        </div>  
        {/* TABLE SECTION*/}
        <div className='min-h-72'>
          <div className="border-box w-full h-full">   
              <Paper sx={{ width: '100%', maxWidth: '100%' }}>
                <DataGrid
                  sx={{ minHeight: 400 }}
                  getRowId={(row) => row.ID}
                  rows={queueData}
                  columns={ mode === 'cancle' ? columns2 : columns}
                  initialState={{ pagination: { paginationModel } }}
                  checkboxSelection={mode === 'cancle' ? false : true}
                  disableMultipleRowSelection={true}
                  disableRowSelectionOnClick={false}
                  selectionModel={selectionModel}
                  onRowSelectionModelChange={handleRowSelect}
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
          {/* <button
            onClick={handleReloadData}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>✓</span>
            <span>ยืนยัน</span>
          </button> */}
        </div>       
      </div>
      {/* <DataDetailDialog open={openDataDialog} data={selectionRow} mode={mode} type={type} 
        onClose={() => {
          setOpenDataDialog(false);
          setSelectionRow(null);
        }} 
        onSave={() => {
          setOpenDataDialog(false);
        }}
      ></DataDetailDialog> */}
      <ManageDialog opens={openDataDialog} selectedAction={selectedAction} count={0} onSave={(st) => {
        console.log('dialog result: '+st);
        setOpenDataDialog(false);
        if(st && mode == 'cancle'){
          setQueueData(queueData.filter(x => x.Code != selectionRow.Code ))
        } else {
          onClose();
        }
      }}></ManageDialog>
    </div>
  );
};

export default QueueListDialog;