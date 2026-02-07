import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import type { TableColumnType } from "antd";
import type { Key } from "react";
import "./App.css";
import About from "./About";
import { CURRENT_YEAR, YEAR_OPTIONS } from "./constants";

const { Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

interface EmployeeData {
  key: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  dept: string;
  group: string;
  comp: number;
  long_text: string;
}

interface FilterOption {
  text: string;
  value: string;
}

const mobileColumns: TableColumnType<EmployeeData>[] = [
  {
    dataIndex: "last_name",
    key: "last_name",
    title: "Last Name",
    sorter: (a: EmployeeData, b: EmployeeData) =>
      a.last_name.localeCompare(b.last_name),
    sortDirections: ["ascend", "descend"] as const,
  },
  {
    dataIndex: "first_name",
    key: "first_name",
    title: "First Name",
    sorter: (a: EmployeeData, b: EmployeeData) =>
      a.first_name.localeCompare(b.first_name),
    sortDirections: ["ascend", "descend"] as const,
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
    sorter: (a: EmployeeData, b: EmployeeData) => a.comp - b.comp,
    defaultSortOrder: "descend",
    sortDirections: ["ascend", "descend"] as const,
  },
];

const App = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState<EmployeeData[]>([]);
  const [yearData, setYearData] = useState<EmployeeData[]>([]);
  const [departmentFilters, setDepartmentFilters] = useState<FilterOption[]>(
    []
  );
  const [groupFilters, setGroupFilters] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState("home");
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  useEffect(() => {
    fetchData(CURRENT_YEAR);
  }, []);

  const fetchData = async (selectedYear: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/data/${selectedYear}`);
      setData(response.data.data);
      setYearData(response.data.data);
      setDepartmentFilters(response.data.departments);
      setGroupFilters(response.data.groups);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e: any, v: any) => {
    setYear(v.value);
    fetchData(v.value);
  };

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchOnChange = useCallback((searchText: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = searchText.target.value.toLowerCase();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const filteredEvents = yearData.filter(
        ({ first_name, last_name, dept, group }) => {
          const name = `${first_name.toLowerCase()} ${last_name.toLowerCase()}`;
          const description = `${dept.toLowerCase()} ${group.toLowerCase()}`;
          return name.includes(keywords) || description.includes(keywords);
        }
      );
      setData(filteredEvents);
    }, 300);
  }, [yearData]);

  const handleExpand = (expanded: boolean, record: EmployeeData) => {
    if (expanded) {
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const columns: TableColumnType<EmployeeData>[] = useMemo(() => [
    {
      dataIndex: "last_name",
      key: "last_name",
      title: "Last Name",
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.last_name.localeCompare(b.last_name),
      sortDirections: ["ascend", "descend"] as const,
    },
    {
      dataIndex: "first_name",
      key: "first_name",
      title: "First Name",
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.first_name.localeCompare(b.first_name),
      sortDirections: ["ascend", "descend"] as const,
    },
    {
      dataIndex: "middle_name",
      key: "middle_name",
      title: "Middle Name",
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.middle_name.localeCompare(b.middle_name),
      sortDirections: ["ascend", "descend"] as const,
    },
    {
      dataIndex: "dept",
      key: "dept",
      title: "Department",
      filters: departmentFilters,
      onFilter: (value: Key | boolean, record: EmployeeData) =>
        typeof value === "string" && record.dept.indexOf(value) === 0,
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.dept.localeCompare(b.dept),
      sortDirections: ["ascend", "descend"] as const,
      render: (text: string) => text.replace(/&amp;/g, "&"),
    },
    {
      dataIndex: "group",
      key: "group",
      title: "Employee Group",
      filters: groupFilters,
      onFilter: (value: Key | boolean, record: EmployeeData) =>
        typeof value === "string" && record.group.indexOf(value) === 0,
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.group.localeCompare(b.group),
      sortDirections: ["ascend", "descend"] as const,
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
      sorter: (a: EmployeeData, b: EmployeeData) => a.comp - b.comp,
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend"] as const,
    },
  ], [departmentFilters, groupFilters]);

  return (
    <BrowserRouter>
      <Menu
        onClick={handleClick}
        // Always leave this empty because it's fucking ugly
        selectedKeys={[]}
        mode="horizontal"
        theme="dark"
      >
        <Menu.Item key="home">
          <Link to="/">pu-salary-guide</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">About</Link>
        </Menu.Item>
      </Menu>
      <Content>
        <br />
        <br />
        <div>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route
              path="/"
              element={
                <>
                  <Row>
                    <Col xs={24} xl={{ span: 18, offset: 3 }}>
                      <div
                        className="App-header"
                        style={{ marginBottom: "20px" }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Title>
                              Purdue Salary Guide for{" "}
                              <Tooltip
                                placement="right"
                                title={"Click me to change the year!"}
                              >
                                <Dropdown
                                  inline
                                  options={YEAR_OPTIONS}
                                  defaultValue={String(CURRENT_YEAR)}
                                  onChange={handleYearChange}
                                />
                              </Tooltip>
                            </Title>
                          </Col>
                          <Col>
                            <Search
                              placeholder="Enter keywords ..."
                              onChange={handleSearchOnChange}
                              style={{ width: 200 }}
                            />
                          </Col>
                        </Row>
                      </div>
                      <section>
                        <BrowserView>
                          <Table
                            bordered
                            loading={loading}
                            columns={columns}
                            dataSource={data}
                          />
                        </BrowserView>
                        <MobileView>
                          <Table
                            bordered
                            loading={loading}
                            columns={mobileColumns}
                            dataSource={data}
                            expandable={{
                              expandedRowRender: (record: EmployeeData) => (
                                <p style={{ margin: 0 }}>{record.long_text}</p>
                              ),
                              rowExpandable: (record: EmployeeData) =>
                                record.long_text !== null,
                            }}
                            size="small"
                          />
                        </MobileView>
                      </section>
                    </Col>
                  </Row>
                </>
              }
            />
          </Routes>
        </div>
      </Content>
      <footer
        style={{
          textAlign: "center",
          padding: "20px 0",
          marginTop: "40px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <div style={{ fontSize: "16px" }}>
          <Link to="/about" style={{ fontSize: "16px", marginRight: "8px" }}>
            About
          </Link>{" "}
          | Maintained by{" "}
          <a
            href="https://ryanjchen.com"
            style={{
              fontSize: "16px",
              color: "#1890ff",
              textDecoration: "none",
            }}
          >
            Ryan Chen
          </a>
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default App;
