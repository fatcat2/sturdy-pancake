import React, { useState, useCallback } from "react";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import {
  Row,
  Col,
  Typography,
  Input,
  Table,
  Card,
  List,
  Button,
  Tag,
  Empty,
  Spin,
} from "antd";
import type { TableColumnType } from "antd";
import { CURRENT_YEAR, START_YEAR } from "./constants";

const { Title, Text } = Typography;
const { Search } = Input;

interface SearchResult {
  first_name: string;
  middle_name: string;
  last_name: string;
  dept: string;
}

interface SalaryRecord {
  year: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  dept: string;
  group: string;
  comp: number;
}

interface SelectedEmployee {
  first_name: string;
  last_name: string;
  middle_name: string;
  dept: string;
}

interface ComparisonRow {
  key: string;
  name: string;
  dept: string;
  group: string;
  [yearKey: string]: string | number | undefined;
}

const SalaryComparison: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<
    SelectedEmployee[]
  >([]);
  const [comparisonData, setComparisonData] = useState<ComparisonRow[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    if (!value || value.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await axios.get("/data/compare/search", {
        params: { query: value, year: CURRENT_YEAR },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  }, []);

  const addEmployee = useCallback(
    (employee: SearchResult) => {
      const already = selectedEmployees.some(
        (e) =>
          e.first_name === employee.first_name &&
          e.last_name === employee.last_name &&
          e.middle_name === employee.middle_name
      );
      if (!already) {
        setSelectedEmployees((prev) => [...prev, employee]);
      }
      setSearchResults([]);
    },
    [selectedEmployees]
  );

  const removeEmployee = useCallback((index: number) => {
    setSelectedEmployees((prev) => prev.filter((_, i) => i !== index));
    setComparisonData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fetchComparison = useCallback(async () => {
    if (selectedEmployees.length === 0) return;

    setLoading(true);
    try {
      const results: ComparisonRow[] = [];
      let allYears: number[] = [];

      for (const emp of selectedEmployees) {
        const response = await axios.get("/data/compare", {
          params: { first_name: emp.first_name, last_name: emp.last_name },
        });

        const { data, years } = response.data;
        if (years.length > allYears.length) {
          allYears = years;
        }

        const row: ComparisonRow = {
          key: `${emp.first_name}-${emp.last_name}-${emp.middle_name}`,
          name: `${emp.first_name}${emp.middle_name ? " " + emp.middle_name : ""} ${emp.last_name}`,
          dept: "",
          group: "",
        };

        const records: SalaryRecord[] = data;
        const matchingRecords = records.filter(
          (r) =>
            r.first_name === emp.first_name &&
            r.last_name === emp.last_name
        );

        for (const record of matchingRecords) {
          row[`year_${record.year}`] = record.comp;
          row.dept = record.dept;
          row.group = record.group;
        }

        // Calculate overall change
        const sortedYears = matchingRecords
          .map((r) => r.year)
          .sort((a, b) => a - b);
        if (sortedYears.length >= 2) {
          const firstYear = sortedYears[0];
          const lastYear = sortedYears[sortedYears.length - 1];
          const firstComp = matchingRecords.find(
            (r) => r.year === firstYear
          )?.comp;
          const lastComp = matchingRecords.find(
            (r) => r.year === lastYear
          )?.comp;
          if (firstComp && lastComp) {
            row.change = Math.round((lastComp - firstComp) * 100) / 100;
            row.changePercent = Math.round(((lastComp - firstComp) / firstComp) * 10000) / 100;
          }
        }

        results.push(row);
      }

      setAvailableYears(allYears.sort((a, b) => a - b));
      setComparisonData(results);
    } catch (error) {
      console.error("Comparison error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployees]);

  const yearColumns: TableColumnType<ComparisonRow>[] = availableYears.map(
    (yr) => ({
      title: String(yr),
      dataIndex: `year_${yr}`,
      key: `year_${yr}`,
      render: (value: number | undefined) =>
        value != null ? (
          <CurrencyFormat
            value={value}
            displayType="text"
            thousandSeparator
            prefix="$"
          />
        ) : (
          <Text type="secondary">--</Text>
        ),
      sorter: (a: ComparisonRow, b: ComparisonRow) =>
        ((a[`year_${yr}`] as number) || 0) -
        ((b[`year_${yr}`] as number) || 0),
    })
  );

  const columns: TableColumnType<ComparisonRow>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left" as const,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "dept",
      key: "dept",
      width: 200,
    },
    ...yearColumns,
    {
      title: "Total Change",
      dataIndex: "change",
      key: "change",
      render: (value: number | undefined, record: ComparisonRow) => {
        if (value == null) return <Text type="secondary">--</Text>;
        const pct = record.changePercent as number;
        return (
          <span>
            <CurrencyFormat
              value={Math.abs(value)}
              displayType="text"
              thousandSeparator
              prefix={value >= 0 ? "+$" : "-$"}
            />
            <br />
            <Text type={value >= 0 ? "success" : "danger"}>
              ({value >= 0 ? "+" : ""}
              {pct.toFixed(1)}%)
            </Text>
          </span>
        );
      },
      sorter: (a: ComparisonRow, b: ComparisonRow) =>
        ((a.change as number) || 0) - ((b.change as number) || 0),
    },
  ];

  return (
    <Row>
      <Col xs={24} xl={{ span: 18, offset: 3 }}>
        <div style={{ marginBottom: "20px" }}>
          <Title>Salary Comparison</Title>
          <Text>
            Search for employees and compare their salaries across years (
            {START_YEAR}-{CURRENT_YEAR}).
          </Text>
          <br />
          <Text type="secondary">
            Note: Results may be inaccurate if multiple employees share the same
            name. This tool also does not account for name changes.
          </Text>
        </div>

        <Card
          title="Search Employees"
          style={{ marginBottom: "20px" }}
        >
          <Search
            placeholder="Search by name (e.g. John Smith)..."
            onSearch={handleSearch}
            enterButton
            allowClear
            style={{ marginBottom: "16px" }}
            loading={searching}
          />

          {searchResults.length > 0 && (
            <List
              bordered
              size="small"
              dataSource={searchResults}
              style={{ marginBottom: "16px" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      size="small"
                      onClick={() => addEmployee(item)}
                    >
                      Add
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={`${item.first_name}${item.middle_name ? " " + item.middle_name : ""} ${item.last_name}`}
                    description={item.dept}
                  />
                </List.Item>
              )}
            />
          )}

          {selectedEmployees.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <Text strong style={{ marginRight: "8px" }}>
                Selected:
              </Text>
              {selectedEmployees.map((emp, idx) => (
                <Tag
                  key={`${emp.first_name}-${emp.last_name}-${idx}`}
                  closable
                  onClose={() => removeEmployee(idx)}
                  style={{ marginBottom: "4px" }}
                >
                  {emp.first_name} {emp.last_name}
                </Tag>
              ))}
            </div>
          )}

          <Button
            type="primary"
            onClick={fetchComparison}
            disabled={selectedEmployees.length === 0}
            loading={loading}
          >
            Compare Salaries
          </Button>
        </Card>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        )}

        {!loading && comparisonData.length > 0 && (
          <Card title="Comparison Results">
            <Table
              bordered
              columns={columns}
              dataSource={comparisonData}
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </Card>
        )}

        {!loading &&
          comparisonData.length === 0 &&
          selectedEmployees.length > 0 && (
            <Card>
              <Empty description='Click "Compare Salaries" to see results' />
            </Card>
          )}
      </Col>
    </Row>
  );
};

export default SalaryComparison;
