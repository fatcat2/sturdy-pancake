import React, { useState, useEffect } from 'react';
import axios from "axios";
import { VictoryBar } from 'victory';

import {Row, Col, List, Typography, Select, Tooltip, Layout} from 'antd';
import 'antd/dist/antd.css';

import {Dropdown} from 'semantic-ui-react';

import {yearOptions} from "./dataOptions";

const { Title, Paragraph, Text } = Typography;

const { Option } = Select;

function gwaphic(props){

}

function StatsPage(props){
    const [name, setName] = useState("default");
    const [department, setDepartment] = useState(props.dept);
    const [group, setGroup] = useState(props.group);
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [year, setYear] = useState("2019");
    const [searchResults, setSearchResults] = useState([<Option value="YEET">yeet</Option>]);
    const [compensation, setCompensation] = useState(props.compensation);
    const [dataLoading, setDataLoading] = useState(true);
    const [statData, setStatData] = useState({
        "department": "Loading",
        "q1": 0,
        "q2": 1,
        "q3": 2,
        "q4": 3,
        "min": 0,
        "max": 3,
        "median": 2,
        "average": 1.25,
        "stdev": 2
    });

    const searchRequest = (query) => {
        axios.post("/search", {"year": year, "query": query})
            .then((response) => {
                console.log(response.data.results)
                setSearchResults(response.data.results.map(d => <Option key={d[1] + "/" + d[0]}>{d[1]} {d[0]}</Option>))
            })
    }

    const onChange = (e, v) => {
        setYear(v.value)
    }

    const employeeChange = (value) => {
        console.log(value)
        setSelectedEmployee(value)
    }

    const onSearchInput = (e) => {
        console.log(e.currentTarget.value)
    }

    useEffect(() => {
        searchRequest("kenji", year)
    }, []);

    console.log(name)

    return (
        <div>
            <Row>
                <Col xs={24} xl={{span: 10, offset: 7}} >
                    <Title>salary relative to department</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={24} xl={{span: 10, offset: 7}} >
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
            <Row>
                <Col xs={24} xl={{span: 10, offset: 7}} >
                    <Select
                        showSearch
                        value={"selectedEmployee"}
                        placeholder={"input search text"}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={searchRequest}
                        onChange={employeeChange}
                        style={{ width: '100%' }}
                        notFoundContent={null}
                    >
                        {searchResults}
                    </Select>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col xs={24} xl={{span: 5, offset: 7}} >
                    <section>
                        <h3>This is for {year}</h3>
                        <VictoryBar/>
                    </section>
                </Col>
                <Col xs={24} xl={{span: 5}} >
                    <section>
                        <Paragraph>LOTS OF EM</Paragraph>
                        <VictoryBar/>
                    </section>
                </Col>
            </Row>
        </div>
    )
}

export default StatsPage;
