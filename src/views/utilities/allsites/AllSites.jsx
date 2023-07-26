import { DatePicker, Space, Select, Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Tooltip } from '@material-ui/core';
import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import './allsites.scss';
import { FileImageOutlined, FilePdfOutlined, FileExcelOutlined, FileZipOutlined } from '@ant-design/icons';
import { gridSpacing } from 'store/constant';
import { Popconfirm } from 'antd';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { QuestionCircleOutlined } from '@ant-design/icons';
import axiosNew from '../../../api/axiosNew';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const AllSites = () => {
  const [users, setUsers] = useState([]);

  const onMenuClick = async (e) => {
    const { key } = e;

    switch (key) {
      case '1':
        // Download Chart
        // Implement the logic to download the chart here
        break;
      case '2':
        // Download PDF
        // Implement the logic to download the PDF here
        break;
      case '3':
        // Download Excel
        // Implement the logic to download the Excel file here
        break;
      case '4':
        // Download Excel
        // Implement the logic to download the Excel file here
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: '1',
      label: 'Chart',
      icon: <FileImageOutlined />
    },
    {
      key: '2',
      label: 'PDF',
      icon: <FilePdfOutlined />
    },
    {
      key: '3',
      label: 'Excel',
      icon: <FileExcelOutlined />
    },
    {
      key: '4',
      label: 'CSV',
      icon: <FileZipOutlined />
    }
  ];

  // API DELETE DATA SITE

  const deleteAccount = async (id) => {
    try {
      const token = localStorage.getItem('access_token');

      const res = await axiosNew.delete('/site', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        data: {
          id: `${id}`
        }
      });

      //   console.log('deleted clicked');
      if (res.status === 200) {
        toast.success('Deleted Successfuly.');
        getApi();
      } else {
        toast.error('Failed to delete user, please try again.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // API GET DATA SITE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.16.25.50:8080/ngasal/report/monthly/2/2023/darat/raw/', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Add a unique 'id' property to each row using uuid
        const usersWithIds = response.data.map((user) => ({
          ...user,
          id: uuidv4() // Generate a unique id using uuid
        }));

        console.log(usersWithIds);
        setUsers(usersWithIds);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const columnSites = [
    {
      field: 'no',
      headerName: 'No',
      width: 70
    },
    { field: 'site', headerName: 'Name Site', flex: 3 },
    { field: 'bandwidth', headerName: 'BW Usage', flex: 1 },
    { field: 'device', headerName: 'Device Connected', flex: 1 }

    // ini contoh kalo pengen dapetin value dari 2 row di jadikan satu
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) => `${params.row.name || ''} ${params.row.lastName || ''}`
    // }
  ];

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (rowData) => {
        return (
          <>
            <div className="cellAction">
              <Tooltip title="Edit" arrow>
                <div className="viewButtonOperator">
                  <DriveFileRenameOutlineIcon className="viewIcon" onClick={() => showModalEdit(rowData.id)} />
                </div>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <div>
                  <Popconfirm
                    className="cellAction"
                    title="Delete Site"
                    description="Are you sure to delete this site?"
                    onConfirm={() => deleteAccount(rowData.id)}
                    icon={
                      <QuestionCircleOutlined
                        style={{
                          color: 'red'
                        }}
                      />
                    }
                  >
                    <div className="deleteButtonOperator">
                      <DeleteForeverOutlinedIcon />
                    </div>
                  </Popconfirm>
                </div>
              </Tooltip>
            </div>
          </>
        );
      }
    }
  ];

  // INI UNTUK PEMBUATAN NOMOR URUT SECARA OTOMATIS
  const addIndex = (array) => {
    if (!Array.isArray(array)) {
      return [];
    }

    return array.map((item, index) => {
      item.no = index + 1;
      return item;
    });
  };

  return (
    <>
      <MainCard>
        <Grid item xs={12} className="gridButton">
          <div className="containerHeadSites">
            <h2>JakWifi All Usage</h2>
          </div>
        </Grid>
        <div className="dateContainer">
          <div className="dateLeft">
            <Select
              className="selectSites"
              showSearch
              placeholder="Select Site"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
            <Space direction="vertical">
              <Dropdown.Button
                menu={{
                  items,
                  onClick: onMenuClick
                }}
              >
                Downloads
              </Dropdown.Button>
            </Space>
          </div>
          <Space size={12} className="dateRight">
            <DatePicker picker="month" format="MM/YYYY" />
          </Space>
        </div>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} id="chartContainer">
            <DataGrid
              columns={columnSites.concat(actionColumn)}
              rows={addIndex(users)}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10, 50, 100]}
            />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default AllSites;
