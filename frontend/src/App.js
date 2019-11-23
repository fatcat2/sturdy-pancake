import React from 'react';
import { Menu, Icon, Typography, Divider, PageHeader, Row, Col } from 'antd';
import './App.css';
import axios from "axios";

import "react-table/react-table.css";
import Table from "./Table"

const { SubMenu } = Menu;
const { Title, Paragraph, Text } = Typography;


class App extends React.Component{
    state = {
    year: 2018,
    data: {}
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  componentDidMount() {
  }

  render(){
    console.log("Helo");
    axios.get("localhost:5000/data/2018")
      .then(data => console.log(data))
      .catch(err => console.log(err))
      .finally(console.log("uwu"));
    // send the request
    return (
      <div><br />
          <Row>
          <Col xs={{span: 24, offset: 1}} sm={{span: 4, offset: 2}} md={{span: 6, offset: 3}} lg={{span: 8, offset:4}} xl={{span:20, offset: 2}}>
            <Title>
              pu-salary-guide
            </Title>
          </Col>
        </Row>,
        <Row>
        <Col xs={{span: 24, offset: 1}} sm={{span: 4, offset: 2}} md={{span: 6, offset: 3}} lg={{span: 8, offset:4}} xl={{span: 20, offset: 2}}>
            <Table />
          </Col>
        </Row>
      </div>
    );
  }
    
}

export default App;
