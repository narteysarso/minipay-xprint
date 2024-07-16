import { Table } from "antd";

const columns = [
    {
      title: 'Service Name',
      dataIndex: 'service_name',
      key: 'service_name',
    },
    {
      title: 'Print Color',
      dataIndex: 'print_color',
      key: 'print_color',
    },
    {
      title: 'Paper Size',
      dataIndex: 'paper_size',
      key: 'paper_size',
    },
    {
      title: 'Sheet Cost',
      dataIndex: 'sheet_cost',
      key: 'sheet_cost',
    },
  ];
  
export default function Services(){
    return(
        <Table
            columns={columns}
            size="small"
        />
    )
}