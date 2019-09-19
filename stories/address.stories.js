import React from 'react';
import { storiesOf } from '@storybook/react';
import { AddressSelector } from '../components';
import addressDoc from '../components/AddressSelector/README.md';
import DemoContainer from '../tools/DemoContainer';
import { Icon, Form, Button, Row } from 'antd';
import axios from '../http';

const FormItem = Form.Item;

@Form.create()
class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedItems: []
    }
  }

  componentDidMount() {
    this.initGroups();
  }

  handleSearch = (params) => {
    return axios.get('/api/v1/base/areas/search', {
      params
    });
  }

  handleSearchGroup = (params) => {
    return axios.get('/api/v1/base/areas/group', {
      params
    })
  }

  initGroups = async () => {
    let { groups } = this.state;
    let resGroup = await this.handleSearchGroup({ type: 1 });
    if (resGroup.errorCode === 0) {
      groups = resGroup.data.map((g) => {
        if (g.code == '0') {
          g.maxLevel = 4;
        } else if (g.code == '1') {
          g.maxLevel = 1;
        } else {
          g.maxLevel = 2;
        }
        return g;
      });
    }
    this.setState({ groups });
  }

  handleChange = (selectedItems) => {
    console.log(selectedItems);
    this.setState({
      selectedItems
    });
  }

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      console.log('values--->', values);
    });
  };

  handleClear = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { groups } = this.state;

    let test = [
      {
        code: "130600",
        groupCode: "0",
        id: 54,
        level: 3,
        name: "保定市",
        parentCode: "130000",
      },
      {
        code: "130602",
        groupCode: "0",
        id: null,
        level: 4,
        name: "竞秀区",
        parentCode: "130600",
      }
    ]

    return (
      <DemoContainer>
        <div>
          <FormItem label="地址">
            {
              form.getFieldDecorator('address')(
                <AddressSelector
                  type={1}
                  topTabData={groups}
                  onSearch={this.handleSearch}
                  onChange={this.handleChange}
                  placeholder="请选择地址"
                  addonAfter={<Icon type="ellipsis" />}
                  style={{ width: 500 }}
                  hint="温馨提示：支持中文、拼音或首字母，如：西安 或 XA"
                  colSpan={8}
                />
              )
            }
          </FormItem>
          <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: 12 }}>提交</Button>
          <Button type="primary" onClick={this.handleClear}>重置</Button>
        </div>
      </DemoContainer>
    )
  }
}
storiesOf('Address', module)
  .add('AddressSelector',
    () => <Demo1 />,
    { notes: addressDoc }
  )