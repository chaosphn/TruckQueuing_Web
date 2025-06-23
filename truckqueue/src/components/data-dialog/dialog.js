import React, { useEffect, useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber } from '../../services/http-service';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, RefreshCcw } from 'lucide-react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { dateFormatParser } from '../../services/date-service';
import Typography from '@mui/material/Typography';
import DataDetailDialog from '../detail-dialog/dialog';

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
      const selectedIds = Array.from(selection.ids); // Convert Set to array
      const selectedId = selectedIds[0]; // Only one row since single selection

      const selectedRows= queueData.find(row => row.ID === selectedId);
      if (selectedRows) {
        setSelectionRow(selectedRows);
        setOpenDataDialog(true);
        console.log('🚀 Selected Row:', selectedRows);
      }
    }
  };

  const handleSelectedRowAction = (row) => {
    // Your action with selected row
    console.log('🔥 Do something with:', row);
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
    { field: 'FontLicense', headerName: 'ทะเบียนหัว', flex: 0.3, resizable: true },
    { field: 'RearLicense', headerName: 'ทะเบียนหาง', flex: 0.3, resizable: true },
    { field: 'Driver1', headerName: 'ชื่อคนขับ', flex: 0.5, resizable: true },
    { field: 'DestinationName', headerName: 'ปลายทาง', flex: 0.8, resizable: true },
  ];

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full mx-auto flex flex-col justify-center gap-8 px-4 py-6">
        {/* SEARCH SECTION*/}
        <div className='w-full flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <TextField
              placeholder="ค้นหาทะเบียนหัว"
              size="small"
              value={plateHeadNumber}
              onChange={(e) => setPlateHeadNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ width: '250px' }}
            />
            <TextField
              placeholder="ค้นหาทะเบียนหาง"
              size="small"
              value={plateTailNumber}
              onChange={(e) => setPlateTailNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '250px' }}
            />
          </div>
          <TextField
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
          />
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
                  checkboxSelection
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
        <div className="rounded-b-xl flex justify-between space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>รีโหลด</span>
            <span><RefreshCcw className="w-5 h-5 text-white" /></span>
          </button>
        </div>       
      </div>
      <DataDetailDialog open={openDataDialog} data={selectionRow} onClose={() => {
        setOpenDataDialog(false);
        setSelectionRow(null);
      }}></DataDetailDialog>
    </div>
  );
};

export default TruckDataDialog;