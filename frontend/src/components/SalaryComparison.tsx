import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Spin,
  Select,
  Tag,
  Button,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { EmployeeData } from "../types";
import { Header } from "./Header";
import { CURRENT_YEAR } from "../constants";
import { fetchSalaryData } from "../services/api";

interface DraggableBarProps {
  id: string;
  index: number;
  moveBar: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableBar: React.FC<DraggableBarProps> = ({
  id,
  index,
  moveBar,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "BAR",
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "BAR",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBar(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
};

interface SalaryComparisonProps {
  data: EmployeeData[];
}

const SalaryComparison: React.FC<SalaryComparisonProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [bars, setBars] = useState(() => {
    // Group data by department and calculate average salary
    const departmentSalaries = data.reduce(
      (acc, curr) => {
        if (!acc[curr.dept]) {
          acc[curr.dept] = { total: 0, count: 0 };
        }
        acc[curr.dept].total += curr.comp;
        acc[curr.dept].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>
    );

    return Object.entries(departmentSalaries).map(
      ([dept, { total, count }]) => ({
        id: dept,
        name: dept,
        salary: Math.round(total / count),
      })
    );
  });

  const handleYearChange = async (e: any, v: { value: string }) => {
    setLoading(true);
    try {
      const response = await fetchSalaryData(Number(v.value));
      setYear(Number(v.value));
      setSelectedDepartments([]);

      // Recalculate bars with new data
      const departmentSalaries = response.data.reduce(
        (acc, curr) => {
          if (!acc[curr.dept]) {
            acc[curr.dept] = { total: 0, count: 0 };
          }
          acc[curr.dept].total += curr.comp;
          acc[curr.dept].count += 1;
          return acc;
        },
        {} as Record<string, { total: number; count: number }>
      );

      setBars(
        Object.entries(departmentSalaries).map(([dept, { total, count }]) => ({
          id: dept,
          name: dept,
          salary: Math.round(total / count),
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveBar = (dragIndex: number, hoverIndex: number) => {
    const draggedBar = bars[dragIndex];
    setBars((prevBars) => {
      const newBars = [...prevBars];
      newBars.splice(dragIndex, 1);
      newBars.splice(hoverIndex, 0, draggedBar);
      return newBars;
    });
  };

  const filteredBars = bars.filter((bar) =>
    selectedDepartments.includes(bar.name)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRemoveDepartment = (dept: string) => {
    setSelectedDepartments((prev) => prev.filter((d) => d !== dept));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Header onYearChange={handleYearChange} onSearch={() => {}} />
      <Card title="Department Salary Comparison" style={{ margin: "20px" }}>
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card size="small" title="Departments">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select departments"
                    value={selectedDepartments}
                    onChange={setSelectedDepartments}
                    options={bars.map((bar) => ({
                      label: bar.name,
                      value: bar.name,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    maxTagCount="responsive"
                  />
                  {selectedDepartments.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                      >
                        Selected Departments:
                      </Typography.Text>
                      <div style={{ marginTop: 4 }}>
                        {selectedDepartments.map((dept) => (
                          <Tag
                            key={dept}
                            closable
                            onClose={() => handleRemoveDepartment(dept)}
                            style={{ marginBottom: 4 }}
                          >
                            {dept}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={18}>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={filteredBars}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Average Salary",
                      ]}
                    />
                    <Bar
                      dataKey="salary"
                      fill="#1890ff"
                      label={{
                        position: "top",
                        formatter: (value: number) => formatCurrency(value),
                        style: {
                          fontSize: 12,
                          fill: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      {filteredBars.map((bar, index) => (
                        <DraggableBar
                          key={bar.id}
                          id={bar.id}
                          index={index}
                          moveBar={moveBar}
                        >
                          <Bar
                            dataKey="salary"
                            fill="#1890ff"
                            label={{
                              position: "top",
                              formatter: (value: number) =>
                                formatCurrency(value),
                              style: {
                                fontSize: 12,
                                fill: "#000",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        </DraggableBar>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </Spin>
      </Card>
    </DndProvider>
  );
};

export default SalaryComparison;
