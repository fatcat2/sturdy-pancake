import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Row, Col, Table, Typography, Input, Tooltip } from 'antd';
import { BrowserView, MobileView } from "react-device-detect";
import CurrencyFormat from 'react-currency-format';
import {Dropdown} from 'semantic-ui-react';

import {yearOptions} from "./dataOptions";

const { Title } = Typography;
const { Search } = Input;

function SalaryGuide(props){
    const [year, setYear] = useState("2019");
    const [data, setData] = useState([{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ]);
    const [yearData, setYearData] = useState([{ "key": 1, "last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12, "description": "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year."}, ])
    const [departmentFilters, setDepartmentFilters] = useState([{"text": "FW - 2Engl Ling", "value": "FW - 2Engl Ling"}, {"text": "Money", "value": "Money"}]);
    const [groupFilters, setGroupFilters] = useState([{"text": "Faculty", "value": "Faculty"}]);
    const [filtered, setFiltered] = useState([]);
    const [filterAll, setFilterAll] = useState("");
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const columns = [
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
            filters: departmentFilters,
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
            filters: groupFilters,
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
    
    const mobileColumns = [
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

    useEffect(() => {
        axios.get(`/data/${year}`).then(res => {
            setData(res.data["data"]);
            setYearData(res.data["data"]);
            setDepartmentFilters(res.data["departments"]);
            setGroupFilters(res.data["groups"]);
            setLoading(false);
        });
    }, []);

    const onChange = (e, v) => {
        setYear(v.value);
        setLoading(true);
        axios.get(`/data/${v.value}`).then(res => {
            setData(res.data["data"]);
            setYearData(res.data["data"]);
            setDepartmentFilters(res.data["departments"]);
            setGroupFilters(res.data["groups"]);
            setLoading(false);
        });
    }

    const handleSearchOnChange = (searchText) => {
        var keywords = searchText.target.value.toLowerCase().split(" ");

        const filteredEvents = yearData.filter(({ firstName, lastName, department, group }) => {
            firstName = firstName.toLowerCase();
            lastName = lastName.toLowerCase();        
            department = department.toLowerCase();
            group = group.toLowerCase();    

            var match = false;
            
            for(var word in keywords){
                match = match ||
                (firstName.indexOf(keywords[word]) === 0) ||
                (lastName.indexOf(keywords[word]) === 0) ||
                (department.includes(keywords[word])) ||
                (group.includes(keywords[word]))
            }
            return match;
        });
    
        setData(filteredEvents);
    };

    return (
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
                                    onChange={onChange}
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
                            onChange={handleSearchOnChange}
                            style={{ width: 200 }}
                        />
                        </header>
                        <BrowserView>
                            <Table
                                bordered 
                                loading={loading}
                                columns={columns}
                                dataSource={data}
                            >
                            </Table>
                        </BrowserView>
                        <MobileView>
                            <Table
                                bordered
                                loading={loading}
                                columns={mobileColumns}
                                dataSource={data}
                                expandedRowRender={record => <p style={{ margin: 0 }}>{record.long_text}</p>}
                                size="small"
                                onRow = {
                                    (record) => ({
                                        onClick: () => {
                                            this.selectRow(record);
                                        },
                                    })
                                }
                            >
                            </Table>
                        </MobileView>
                    </section>
                </Col>
            </Row>
        </div>
    );
}

export default SalaryGuide;