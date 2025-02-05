import React, { useEffect, useState, ChangeEvent } from "react";
import "./App.css";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { BrowserView, MobileView } from "react-device-detect";

import { Dropdown } from "semantic-ui-react";

import {
  Row,
  Col,
  Menu,
  Table,
  Typography,
  Input,
  Tooltip,
  Layout,
} from "antd";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import About from "./About";
import Ranges from "./Ranges";

import "antd/dist/reset.css";

const { Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

const yearOptions = [
  {
    key: "2024",
    text: "2024",
    value: "2024",
  },
  {
    key: "2023",
    text: "2023",
    value: "2023",
  },
  {
    key: "2022",
    text: "2022",
    value: "2022",
  },
  {
    key: "2021",
    text: "2021",
    value: "2021",
  },
  {
    key: "2020",
    text: "2020",
    value: "2020",
  },
  {
    key: "2019",
    text: "2019",
    value: "2019",
  },
  {
    key: "2018",
    text: "2018",
    value: "2018",
  },
  {
    key: "2017",
    text: "2017",
    value: "2017",
  },
  {
    key: "2016",
    text: "2016",
    value: "2016",
  },
  {
    key: "2015",
    text: "2015",
    value: "2015",
  },
  {
    key: "2014",
    text: "2014",
    value: "2014",
  },
  {
    key: "2013",
    text: "2013",
    value: "2013",
  },
  {
    key: "2012",
    text: "2012",
    value: "2012",
  },
  {
    key: "2011",
    text: "2011",
    value: "2011",
  },
];

type Salary = {
  key: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  dept: string;
  group: string;
  comp: number;
  description: string;
};

type DepartmentFilter = {
  text: string;
  value: string;
};

type GroupFilter = {
  text: string;
  value: string;
};

const defaultSalary: Salary = {
  key: 1,
  last_name: "Aasand",
  first_name: "Hardin",
  middle_name: "",
  dept: "FW - 2Engl Ling",
  group: "Faculty",
  comp: 123924.12,
  description:
    "Hardin Aasand in the department of FW - 2Engl Ling and in employee group Faculty was paid 123924.12 last year.",
};

const defaultEnglishFilter: DepartmentFilter = {
  text: "FW - 2Engl Ling",
  value: "FW - 2Engl Ling",
};

const defaultMoneyFilter: DepartmentFilter = { text: "Money", value: "Money" };

const defaultGroupFilter: GroupFilter = {
  text: "Faculty",
  value: "Faculty",
};

function App() {
  const [year, setYear] = useState<number>(2024);
  const [data, setData] = useState<Salary[]>([defaultSalary]);
  const [yearData, setYearData] = useState<Salary[]>([defaultSalary]);
  const [departmentFilters, setDepartmentFilters] = useState<
    DepartmentFilter[]
  >([defaultEnglishFilter, defaultMoneyFilter]);
  const [groupFilters, setGroupFilters] = useState<GroupFilter[]>([
    defaultGroupFilter,
  ]);
  const [filtered, setFiltered] = useState([]);
  const [filterAll, setFilterAll] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  const [current, setCurrent] = useState("");

  const onYearChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(event.target.value));
    setLoading(true);
    axios.get(`/data/${event.target.value}`).then((res) => {
      setData(res.data["data"]);
      setYearData(res.data["data"]);
      setDepartmentFilters(res.data["departments"]);
      setGroupFilters(res.data["groups"]);
      setLoading(false);
    });
  };

  useEffect(() => {
    const getInitialData = async () => {
      const res = await axios.get("/data/2024");
      setData(res.data["data"]);
      setYearData(res.data["data"]);
      setDepartmentFilters(res.data["departments"]);
      setGroupFilters(res.data["groups"]);
      setLoading(false);
    };

    getInitialData();
  }, [year]);

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    var keywords = event.target.value.toLowerCase();

    const filteredEvents = yearData.filter(
      ({ first_name, last_name, dept, group }) => {
        first_name = first_name.toLowerCase();
        last_name = last_name.toLowerCase();

        let name = first_name + " " + last_name;

        dept = dept.toLowerCase();
        group = group.toLowerCase();
        let description = dept + " " + group;

        return name.includes(keywords) || description.includes(keywords);
      },
    );

    setData(filteredEvents);
  };

  const columns = [
    {
      dataIndex: "last_name",
      key: "last_name",
      title: "Last Name",
      sorter: (a: Salary, b: Salary) => {
        return a.last_name.localeCompare(b.last_name);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "first_name",
      key: "first_name",
      title: "First Name",
      sorter: (a: Salary, b: Salary) => {
        return a.first_name.localeCompare(b.first_name);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "middle_name",
      key: "middle_name",
      title: "Middle Name",
      sorter: (a: Salary, b: Salary) => {
        return a.middle_name.localeCompare(b.middle_name);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "dept",
      key: "dept",
      title: "Department",
      filters: departmentFilters,
      onFilter: (value: string, record: Salary) => {
        return record.dept.indexOf(value) === 0;
      },
      sorter: (a: Salary, b: Salary) => {
        return a.dept.localeCompare(b.dept);
      },
      sortDirections: ["ascend", "descend"],
      render: (text: string) => text.replace(/&amp;/g, "&"),
    },
    {
      dataIndex: "group",
      key: "group",
      title: "Employee Group",
      filters: groupFilters,
      onFilter: (value: string, record: Salary) => {
        return record.group.indexOf(value) === 0;
      },
      sorter: (a: Salary, b: Salary) => {
        return a.group.localeCompare(b.group);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "comp",
      key: "comp",
      title: "Compensation",
      render: (text: number) => (
        <CurrencyFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      ),
      sorter: (a: Salary, b: Salary) => a.comp - b.comp,
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend"],
    },
  ];

  let mobile_columns = [
    {
      dataIndex: "last_name",
      key: "last_name",
      title: "Last Name",
      sorter: (a: Salary, b: Salary) => {
        return a.last_name.localeCompare(b.last_name);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "first_name",
      key: "first_name",
      title: "First Name",
      sorter: (a: Salary, b: Salary) => {
        return a.first_name.localeCompare(b.first_name);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      dataIndex: "comp",
      key: "comp",
      title: "Compensation",
      render: (text: number) => (
        <CurrencyFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      ),
      sorter: (a: Salary, b: Salary) => a.comp - b.comp,
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend"],
    },
  ];

  return (
    <Router>
      <Menu
        mode="horizontal"
        theme="dark"
        onClick={(e: any) => setCurrent(e.key)}
        selectedKeys={[current]}
      >
        <div>
          <Menu.Item key="home">
            <a href="/">pu-salary-guide</a>
          </Menu.Item>
        </div>
      </Menu>
      <Content>
        <br />
        <br />
        <div>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/viz"></Route>
            <Route path="/ranges">
              <Ranges />
            </Route>
            <Route path="/">
              <div className="App-header">
                <Row>
                  <Col>
                    <Title>
                      Purdue Salary Guide for{" "}
                      <Tooltip
                        placement="right"
                        title={"Click me to change the year!"}
                      >
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
                <Col xs={24} xl={{ span: 18, offset: 3 }}>
                  <section>
                    <header class="header">
                      <Search
                        placeholder="Enter keywords ..."
                        onChange={this.handleSearchOnChange}
                        style={{ width: 200 }}
                      />
                    </header>
                    <BrowserView>
                      <Table
                        bordered
                        loading={this.state.loading}
                        columns={columns}
                        dataSource={this.state.data}
                      ></Table>
                    </BrowserView>
                    <MobileView>
                      <Table
                        bordered
                        loading={this.state.loading}
                        columns={mobile_columns}
                        dataSource={this.state.data}
                        expandedRowRender={(record) => (
                          <p style={{ margin: 0 }}>{record.long_text}</p>
                        )}
                        size="small"
                      ></Table>
                    </MobileView>
                  </section>
                </Col>
              </Row>
            </Route>
          </Switch>
        </div>
      </Content>
      <div style={{ textAlign: "center" }}>
        <Link to="/about">About</Link> | Maintained by{" "}
        <a href="https://twitter.com/ryanjengchen">@ryanjengchen</a>.
      </div>
    </Router>
  );
}

export default App;
