import React from "react";
import { Table } from "antd";
import { BrowserView, MobileView } from "react-device-detect";
import CurrencyFormat from "react-currency-format";
import type { TableColumnType } from "antd";
import { EmployeeData, FilterOption } from "../types";

interface DataTableProps {
  loading: boolean;
  data: EmployeeData[];
  departmentFilters: FilterOption[];
  groupFilters: FilterOption[];
}

export const DataTable: React.FC<DataTableProps> = ({
  loading,
  data,
  departmentFilters,
  groupFilters,
}) => {
  const columns: TableColumnType<EmployeeData>[] = [
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
      onFilter: (value: string, record: EmployeeData) =>
        record.dept.indexOf(value) === 0,
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
      onFilter: (value: string, record: EmployeeData) =>
        record.group.indexOf(value) === 0,
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
  ];

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

  return (
    <section>
      <BrowserView>
        <Table bordered loading={loading} columns={columns} dataSource={data} />
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
            rowExpandable: (record: EmployeeData) => record.long_text !== null,
          }}
          size="small"
        />
      </MobileView>
    </section>
  );
};
