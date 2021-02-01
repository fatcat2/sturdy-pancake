import React from 'react';
import './App.css';
import axios from "axios";
import CurrencyFormat from 'react-currency-format';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

import {Dropdown} from 'semantic-ui-react';

import {Row, Col, Menu, Table, Typography, Input, Tooltip, Layout, Alert} from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import About from "./About"

import 'antd/dist/antd.css';

const { Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

const yearOptions = [
    {
        key: '2019',
        text: '2019',
        value: '2019',
    },
    {
        key: '2018',
        text: '2018',
        value: '2018',
    },
    {
        key: '2017',
        text: '2017',
        value: '2017',
    },
    {
        key: '2016',
        text: '2016',
        value: '2016',
    },
    {
        key: '2015',
        text: '2015',
        value: '2015',
    },
    {
        key: '2014',
        text: '2014',
        value: '2014',
    },
    {
        key: '2013',
        text: '2013',
        value: '2013',
    },
    {
        key: '2012',
        text: '2012',
        value: '2012',
    },
    {
        key: '2011',
        text: '2011',
        value: '2011',
    }
]


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            year: 2019,
            data: [{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ],
            year_data: [{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ],
            department_filters: [{"text": "FW - 2Engl Ling", "value": "FW - 2Engl Ling"}, {"text": "Money", "value": "Money"}],
            group_filters: [{"text": "Faculty", "value": "Faculty"}],
            filtered: [],
            filterAll: '',
            loading: true,
            alertVisible: true
        }

        

        this.onChange = (e, v) => {
            this.setState({year: v.value});
            this.setState({loading: true});
            axios.get(`/data/${v.value}`).then(res => {
                this.setState({
                    data: res.data["data"],
                    year_data: res.data["data"],
                    department_filters: res.data["departments"],
                    group_filters: res.data["groups"],
                    loading: false
                })
            });
        }
    }

    

    componentDidMount() {
        axios.get(`/data/${this.state.year}`).then(res => {
            this.setState({
                data: res.data["data"],
                year_data: res.data["data"],
                department_filters: res.data["departments"],
                group_filters: res.data["groups"],
                loading: false
            })
        });
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };

    handleSearchOnChange = searchText => {
        var keywords = searchText.target.value.toLowerCase().split(" ");

        const filteredEvents = this.state.year_data.filter(({ first_name, last_name, dept, group }) => {
            first_name = first_name.toLowerCase();
            last_name = last_name.toLowerCase();        
            dept = dept.toLowerCase();
            group = group.toLowerCase();    

            var match = false;
            
            for(var word in keywords){
                match = match ||
                (first_name.indexOf(keywords[word]) === 0) ||
                (last_name.indexOf(keywords[word]) === 0) ||
                (dept.includes(keywords[word])) ||
                (group.includes(keywords[word]))
            }

            return match;
        });
    
        this.setState({
          data: filteredEvents
        });
    };


    

    render(){
        let columns = [
            {
                dataIndex: 'last_name',
                key: "last_name",
                title: 'Last Name',
                sorter: (a, b) => { return a.last_name.localeCompare(b.last_name)},
                sortDirections: ['ascend', 'descend']
            },
            {
                dataIndex: 'first_name',
                key: "first_name",
                title: 'First Name',
                sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
                sortDirections: ['ascend', 'descend']
            },
            {
                dataIndex: 'middle_name',
                key: "middle_name",
                title: 'Middle Name',
                sorter: (a, b) => { return a.middle_name.localeCompare(b.middle_name)},
                sortDirections: ['ascend', 'descend']
            },
            {
                dataIndex: 'dept',
                key: "dept",
                title: 'Department',
                filters: this.state.department_filters,
                onFilter: (value, record) => {
                    return record.dept.indexOf(value) === 0
                },
                sorter: (a, b) => { return a.dept.localeCompare(b.dept)},
                sortDirections: ['ascend', 'descend'],
                render: text => text.replace(/&amp;/g, '&')
            },
            {
                dataIndex: 'group',
                key: "group",
                title: 'Employee Group',
                filters: this.state.group_filters,
                onFilter: (value, record) => {
                    return record.group.indexOf(value) === 0
                },
                sorter: (a, b) => { return a.group.localeCompare(b.group)},
                sortDirections: ['ascend', 'descend']                
            },
            {
                dataIndex: 'comp',
                key: "comp",
                title: 'Compensation',
                render: text => <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
                sorter: (a,b) =>  a.comp - b.comp ,
                defaultSortOrder: "descend",
                sortDirections: ['ascend', 'descend']
        
            }
        ];

        let mobile_columns = [
            {
                dataIndex: 'last_name',
                key: "last_name",
                title: 'Last Name',
                sorter: (a, b) => { return a.last_name.localeCompare(b.last_name)},
                sortDirections: ['ascend', 'descend']
            },
            {
                dataIndex: 'first_name',
                key: "first_name",
                title: 'First Name',
                sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
                sortDirections: ['ascend', 'descend']
            },
            {
                dataIndex: 'comp',
                key: "comp",
                title: 'Compensation',
                render: text => <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
                sorter: (a,b) =>  a.comp - b.comp ,
                defaultSortOrder: "descend",
                sortDirections: ['ascend', 'descend']
            }
        ];

        const handleClose = () => {
            this.setState({alertVisible: false});
        };

        return (
            <Router>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark">
                    <Menu.Item key="home">
                        <a href="/">
                        pu-salary-guide
                        </a>
                    </Menu.Item>
                </Menu>
                <Content>
                <br /><br/>
                <div>
                    <Switch>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/">
                            <div className="App-header">
                                <Row>
                                    <Col>
                                        <Title>
                                            Purdue Salary Guide for { ' ' }
                                            <Tooltip placement="right" title={"Click me to change the year!"}>
                                                <Dropdown
                                                    inline
                                                    options={yearOptions}
                                                    defaultValue={yearOptions[0].value}
                                                    onChange={this.onChange}
                                                />
                                            </Tooltip>
                                        </Title>
                                    </Col>
                                </Row>
                            </div>
                        <Row>
                            <Col xs={24} xl={{span: 18, offset: 3}} >
                                <section>
                                    <header class="header">
                                    <Search
                                        placeholder="Enter keywords ..."
                                        onChange={this.handleSearchOnChange}
                                        style={{ width: 200 }}
                                    />
                                    </header>
                                    <BrowserView>
                                        <Table bordered 
                                        loading={this.state.loading} columns={columns} dataSource={this.state.data}>
                                        </Table>
                                    </BrowserView>
                                    <MobileView>
                                        <Table bordered
                                            loading={this.state.loading}
                                            columns={mobile_columns}
                                            dataSource={this.state.data}
                                            expandedRowRender={record => <p style={{ margin: 0 }}>{record.long_text}</p>}
                                            size="small"
                                        >
                                        </Table>
                                    </MobileView>
                                </section>
                            </Col>
                        </Row>
                        </Route>
                    </Switch>
                </div>
                </Content>
                <div style={{textAlign: "center", position: "sticky", bottom: "0"}}>
                    <Link to="/about">About</Link> | Maintained by <a href="https://twitter.com/ryanjengchen">@ryanjengchen</a>.
                </div>
            </Router>
        );
    }

}

export default App;
