import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import { ServicesSettingsContext } from '../../context/ServicesSettings';
import { registerPrintCost } from '../../services/xprintjob';
import { BusinessSettingsContext } from '../../context/BusinessSettings';

const colorSchemes = ["monochrom", "color"];
const paperOrientations = ["portrait", "landscape"];
const paperSizes = [ "A2", "A3", "A4", "A5", "letter", "legal", "tabloid", "statement"];

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const generateEditCell = ({dataIndex, save, inputRef}) => {

  const printColorSelector = (<Select
    placeholder="Check supported print color scheme"
    type="text"
    style={{
      width: "100%"
    }}
    name="supported_print_color"
    rules={[{ required: true }]}
    onPressEnter={save} onBlur={save}
    ref={inputRef}
  >
    {
      colorSchemes ? colorSchemes.map((scheme, index) => <Select.Option key={index} value={scheme}>{scheme}</Select.Option>)
        : <Select.Option disabled >No Color Scheme</Select.Option>
    }


  </Select>)

  const serviceNameInput = <Input ref={inputRef} onPressEnter={save} onBlur={save} />
  const printCostInput = <Input ref={inputRef} onPressEnter={save} onBlur={save} />

  const paperSizeSelector = <Select
    placeholder="Select paper size"
    type="text"
    style={{
      width: "100%"
    }}
    name="supported_print_types"
    rules={[{ required: true }]}
    onPressEnter={save} onBlur={save}
    ref={inputRef}

  >
    {
      paperSizes ? paperSizes.map((paperSize, index) => <Select.Option key={index} value={paperSize}>{paperSize}</Select.Option>)
        : <Select.Option disabled >No Paper Sizes</Select.Option>
    }

  </Select>

  const paperOrientationSelector = <Select
    placeholder="Select paper orientation"
    type="text"
    style={{
      width: "100%"
    }}
    name="supported_orientation"
    rules={[{ required: true }]}
    onPressEnter={save} onBlur={save}
    ref={inputRef}

  >
    {
      paperOrientations ? paperOrientations.map((paperOrientation, index) => <Select.Option key={index} value={paperOrientation}>{paperOrientation}</Select.Option>)
        : <Select.Option disabled >No Paper Orientation</Select.Option>
    }

  </Select>

  const editCells = {
    "print_color": printColorSelector,
    "service_name": serviceNameInput,
    "paper_size": paperSizeSelector,
    "orientation": paperOrientationSelector,
    "sheet_cost": printCostInput
  }

  return editCells[dataIndex];
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ?   (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {generateEditCell({dataIndex, save, inputRef})}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const ServicesEditable = () => {
  const {services, saveServices, saveOnChain} = useContext(ServicesSettingsContext);
  const {spId} = useContext(BusinessSettingsContext);
  
  const [count, setCount] = useState((services[services.length - 1]?.key + 1) || 0);

  const handleDelete = (key) => {
    const newData = services.filter((item) => item.key !== key);
    saveServices(newData);
  };
  const handleSaveOnChain = (record) => {
    saveOnChain(record, spId);
  };

  const defaultColumns = [
    {
      title: 'Service Name',
      dataIndex: 'service_name',
      key: 'service_name',
      editable: true,
    },
    {
      title: 'Print Color',
      dataIndex: 'print_color',
      key: 'print_color',
      editable: true,
    },
    {
      title: 'Paper Size',
      dataIndex: 'paper_size',
      key: 'paper_size',
      editable: true,
    },
    {
      title: 'Orientation',
      dataIndex: 'orientation',
      key: 'orientation',
      editable: true,
    },
    {
      title: 'Sheet Cost (cUSD)',
      dataIndex: 'sheet_cost',
      key: 'sheet_cost',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        services.length >= 1 ? (
          <>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm> || <Popconfirm title="Save onChain?" loading onConfirm={() => handleSaveOnChain(record)}>
            <a>Save onChain</a>
          </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: count,
      service_name: `Enter services name`,
      print_color: "Select color scheme",
      paper_size: `Select paper size`,
      orientation: `Select orientation`,
      sheet_cost: `Enter Price in Celo`,
    };
    
    saveServices([...services, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...services];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    
    saveServices(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  console.log(services);
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={services}
        columns={columns}
      />
    </div>
  );
};
export default ServicesEditable;