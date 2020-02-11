import React from 'react';
import './App.css';
import axios from "axios";
import CurrencyFormat from 'react-currency-format';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

import {Dropdown} from 'semantic-ui-react';

import ReactTable from "react-table";

import {Row, Col, Menu, Icon, Table, Typography, Input, Tooltip} from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Search } = Input;
const { Title } = Typography;



// const mobile_columns = [
//     {
//         dataIndex: 'last_name',
//         key: "last_name",
//         title: 'Last Name',
//         sorter: (a, b) => { return a.last_name.localeCompare(b.first_name)},
//     },
//     {
//         dataIndex: 'first_name',
//         key: "first_name",
//         title: 'First Name',
//         sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
//     },
//     {
//         dataIndex: 'comp',
//         key: "comp",
//         title: 'Compensation',
//         render: text => <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
//         sorter: (a,b) =>  a.comp - b.comp ,
//
//     }
// ];

const menu = (
    <Menu>
        <Menu.Item key="0">
            <a href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
);

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

function About(){
    return (
        <p>
            This is an online database containing salary information for Purdue employees for the fiscal years of 2011 through 2018. Anyone who got paid by Purdue and was not a student is in this database, along with the amount compensated. The data is provided by Purdue University through their Public Records office. Salary information at public universities is public information and is able to be requested through the university's public records division. Student compensation is not listed in here due to FERPA restrictions. If you're interested in looking at the code and source data, hit up the GitHub repo. Excel sheets containing the salary data can be found in the GitHub repo. You can get the JSON for a specific year by submitting a HTTP request to https://salary.ryanjchen.com/data/"insert year". Example: 2018 data can be found at https://salary.ryanjchen.com/data/2018. Requests for additional functionality can be directed to ryanjchen2@gmail.com.
        </p>
    )
}

class App extends React.Component{
    constructor(props){

        // console.log("asdf")
        super(props);
        this.state = {
            year: 2019,
            data: [{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ],
            year_data: [{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ],
            department_filters: [{"text": "FW - 2Engl Ling", "value": "FW - 2Engl Ling"}, {"text": "Money", "value": "Money"}],
            group_filters: [{"text": "Faculty", "value": "Faculty"}],
            filtered: [],
            filterAll: '',
        }

        this.onChange = (e, v) => {
            this.setState({year: v.value});
            axios.get(`/data/${v.value}`).then(res => {
                // console.log(res.data);
                this.setState({
                    data: res.data["data"],
                    year_data: res.data["data"],
                    department_filters: res.data["departments"],
                    group_filters: res.data["groups"]
                })
            });
            // console.log(v.value)
        }
    }

    componentDidMount() {
        // console.log("mounted")
        console.log(`/data/${this.state.year}`)
        axios.get(`/data/${this.state.year}`).then(res => {
            // console.log(res.data["departments"])
            this.setState({
                data: res.data["data"],
                year_data: res.data["data"],
                department_filters: res.data["departments"],
                group_filters: res.data["groups"]
            })
        });
    }

    handleClick = e => {
        // console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    handleSearch = searchText => {
        var keywords = searchText.toLowerCase().split(" ");
        // console.log(keywords);

        const filteredEvents = this.state.year_data.filter(({ first_name, last_name }) => {
            first_name = first_name.toLowerCase();
            last_name = last_name.toLowerCase();            

            var match = false;
            
            for(var word in keywords){
                match = match || (first_name.indexOf(keywords[word]) === 0) || (last_name.indexOf(keywords[word]) === 0)
            }

            // console.log(match)

            return match;
        });
    
        this.setState({
          data: filteredEvents
        });
    
        // console.log(filteredEvents)
    };

    handleSearchOnChange = searchText => {
        var keywords = searchText.target.value.toLowerCase().split(" ");
        // console.log(keywords);

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

            // console.log(match)

            return match;
        });
    
        this.setState({
          data: filteredEvents
        });
    
        // console.log(filteredEvents)
    };


    

    render(){
        let columns = [
            {
                dataIndex: 'last_name',
                key: "last_name",
                title: 'Last Name',
                sorter: (a, b) => { return a.last_name.localeCompare(b.first_name)},
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
                    // console.log(value, record)
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

        // console.log(columns);

        return (
            <Router>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark">
                    <Menu.Item key="home">
                        pu-salary-guide
                    </Menu.Item>
                </Menu>
                <br /><br/>
                <div>
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
                        <Col xs={24} xl={18} offset={3}>
                            <section>
                                <header class="header">
                                <Search
                                    placeholder="Enter keywords ..."
                                    onChange={this.handleSearchOnChange}
                                    style={{ width: 200 }}
                                />
                                </header>
                                <BrowserView>
                                    <Table bordered columns={columns} dataSource={this.state.data}>
                                    </Table>
                                </BrowserView>
                                {/*<MobileView>*/}
                                {/*    <Table bordered*/}
                                {/*           columns={mobile_columns}*/}
                                {/*           dataSource={this.state.data}*/}
                                {/*           expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}*/}
                                {/*    >*/}
                                {/*    </Table>*/}
                                {/*</MobileView>*/}
                            </section>
                        </Col>
                    </Row>
                </div>
            </Router>
        );
    }

}

export default App;
