import React, { useRef, useEffect, useState, useContext } from 'react';
import Highlighter from 'react-highlight-words';
import { Card, Typography, Avatar, Button, Input, Space, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fakerJobData } from '../services/jobs';
import Withdraw from '../components/Withdraw';
import { JobsContext } from '../context/Jobs';

const STATE_TAG_MAP = {
  "queued": "default",
  "processing": "processing",
  "failed": "error",
  "done": "success"
}

function Jobs() {
  // const [initLoading, setInitLoading] = useState(true);
  // const [loading, setLoading] = useState(false);
  // const [errorMsg, setError] = useState(undefined);
  // const [data, setData] = useState([]);
  // const [list, setList] = useState([]);
  const {jobs, loading} = useContext(JobsContext);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, customRenderOutput = () => { }) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        customRenderOutput(text) || text
      ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      ...getColumnSearchProps('name', (text, record, index) => {
        console.log(record);
        return `${text.substring(0, 10)}...`
      }),
    },
    {
      title: 'Paper Size',
      dataIndex: 'paper_size',
      key: 'paper_size',
      fixed: 'left',
      ...getColumnSearchProps('paper_size'),
    },
    {
      title: 'Color Scheme',
      dataIndex: 'color_scheme',
      key: 'color_scheme',
      ...getColumnSearchProps('color_scheme'),

    },
    {
      title: 'Orientation',
      dataIndex: 'orientation',
      key: 'orientation',
      ...getColumnSearchProps('orientation'),
    },
    {
      title: 'Service Name',
      dataIndex: 'service_name',
      key: 'service_name',
      ...getColumnSearchProps('service_name'),
    },
    {
      title: 'Print Cost (CELO)',
      dataIndex: 'print_cost',
      key: 'print_cost',
      ...getColumnSearchProps('print_cost'),
      sorter: (a, b) => a.print_cost - b.print_cost,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      fixed: "right",
      ...getColumnSearchProps('status', (text) => {

        return <Tag color={STATE_TAG_MAP[text]}>{text}</Tag>
      }),
    },
  ];

  return (
    <Card
      title={<div style={{display: "flex", alignItems: "baseline", justifyContent:"space-between"}}>
        <Typography.Title level={3}>Jobs</Typography.Title>
        <Withdraw />
      </div>}
      style={{ margin: "5vh" }}
    >
      <Table loading={loading} columns={columns} dataSource={jobs} scroll={{ x: 1300 }} />;
    </Card>
  );
};

export default Jobs;
