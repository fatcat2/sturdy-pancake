import React, { useEffect, useState } from "react";

import {
  Text,
  Container,
  Grid,
  Select,
  Tabs,
  Table,
  Title,
} from "@mantine/core";

import axios from "axios";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

var CurrencyFormat = require("react-currency-format");
type YearRangeData = {
  year: string;
  data: string[][];
};

type CampusDepartmentSalaryRange = {
  campus: string;
  department: string;
  minSalary: number;
  averageSalary: number;
  maxSalary: number;
  count: number;
};

type CampusGroupSalaryRange = {
  campus: string;
  group: string;
  minSalary: number;
  averageSalary: number;
  maxSalary: number;
};

type CombinedSalaryRange = {
  campus: string;
  group: string;
  department: string;
  minSalary: number;
  averageSalary: number;
  maxSalary: number;
};

type RangeData = {
  departments: CampusDepartmentSalaryRange[];
  groups: CampusGroupSalaryRange[];
  combined: CombinedSalaryRange[];
};

type RangeReponse = {
  data: RangeData;
};

const campusDepartmentColumnHelper =
  createColumnHelper<CampusDepartmentSalaryRange>();

const campusGroupColumnHelper = createColumnHelper<CampusGroupSalaryRange>();

const combinedColumnHelper = createColumnHelper<CombinedSalaryRange>();

interface TableData {
  year: number;
}

function Ranges() {
  return (
    <>
      <Container>
        <Title order={1}>Salary ranges</Title>
        <Text>
          Ranges are taken from the spreadsheet, sorted by employee group.
          Values are calculated by taking out any compensation values lower than
          $15,000.
        </Text>
        <Grid>
          <Grid.Col span={12}>
            <Tabs defaultValue={"first"}>
              <Tabs.List grow>
                <Tabs.Tab value="first">Campus and department</Tabs.Tab>
                <Tabs.Tab value="second">Campus and employee group</Tabs.Tab>
                <Tabs.Tab value="third">
                  Campus, department and employee group
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="first">
                <CampusDepartmentTable year={2011} />
              </Tabs.Panel>
              <Tabs.Panel value="second">
                <CampusGroupTable year={2011} />
              </Tabs.Panel>
              <Tabs.Panel value="third">
                <CombinedTable year={2011} />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

function CampusDepartmentTable(props: TableData) {
  const campusDepartmentColumns = [
    campusDepartmentColumnHelper.accessor("campus", {
      cell: (info) => info.getValue(),
      header: () => <span>Campus</span>,
      footer: (info) => info.column.id,
    }),
    campusDepartmentColumnHelper.accessor("department", {
      cell: (info) => info.getValue(),
      header: () => <span>Department</span>,
      footer: (info) => info.column.id,
    }),
    campusDepartmentColumnHelper.accessor("minSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Minimum compensation</span>,
      footer: (info) => info.column.id,
    }),
    campusDepartmentColumnHelper.accessor("averageSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Average compensation</span>,
      footer: (info) => info.column.id,
    }),
    campusDepartmentColumnHelper.accessor("maxSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),

      header: () => <span>Maximum compensation</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const defaultDataCampusDepartment: CampusDepartmentSalaryRange[] = [
    {
      campus: "WL",
      department: "Men's Football",
      minSalary: 563.69,
      averageSalary: 261004.182926829,
      maxSalary: 5101030.58,
      count: 0,
    },
  ];

  const [campusDepartmentData, setCampusDepartmentData] = useState([
    ...defaultDataCampusDepartment,
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get<RangeData>("http://192.168.10.202:5100/data/ranges/2021")
      .then((response) => {
        console.log(response.data);
        setCampusDepartmentData(response.data.departments);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const table = useReactTable({
    data: campusDepartmentData,
    columns: campusDepartmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
        alt="Loading spinner"
      />
    </>
  ) : (
    <>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function CampusGroupTable(props: TableData) {
  const campusGroupColumns = [
    campusGroupColumnHelper.accessor("campus", {
      cell: (info) => info.getValue(),
      header: () => <span>Campus</span>,
      footer: (info) => info.column.id,
    }),
    campusGroupColumnHelper.accessor("group", {
      cell: (info) => info.getValue(),
      header: () => <span>Group</span>,
      footer: (info) => info.column.id,
    }),
    campusGroupColumnHelper.accessor("minSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Minimum compensation</span>,
      footer: (info) => info.column.id,
    }),
    campusGroupColumnHelper.accessor("averageSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Average compensation</span>,
      footer: (info) => info.column.id,
    }),
    campusGroupColumnHelper.accessor("maxSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),

      header: () => <span>Maximum compensation</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const defaultDataCampusGroup: CampusGroupSalaryRange[] = [
    {
      campus: "WL",
      group: "Men's Football",
      minSalary: 563.69,
      averageSalary: 261004.182926829,
      maxSalary: 5101030.58,
    },
  ];

  const [campusGroupData, setCampusGroupData] = useState([
    ...defaultDataCampusGroup,
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get<RangeData>("http://192.168.10.202:5100/data/ranges/2021")
      .then((response) => {
        console.log(response.data);
        setCampusGroupData(response.data.groups);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const table = useReactTable({
    data: campusGroupData,
    columns: campusGroupColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
        alt="Loading spinner"
      />
    </>
  ) : (
    <>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function CombinedTable(props: TableData) {
  const CombinedColumns = [
    combinedColumnHelper.accessor("campus", {
      cell: (info) => info.getValue(),
      header: () => <span>Campus</span>,
      footer: (info) => info.column.id,
    }),
    combinedColumnHelper.accessor("group", {
      cell: (info) => info.getValue(),
      header: () => <span>Group</span>,
      footer: (info) => info.column.id,
    }),
    combinedColumnHelper.accessor("department", {
      cell: (info) => info.getValue(),
      header: () => <span>Group</span>,
      footer: (info) => info.column.id,
    }),
    combinedColumnHelper.accessor("minSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Minimum compensation</span>,
      footer: (info) => info.column.id,
    }),
    combinedColumnHelper.accessor("averageSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),
      header: () => <span>Average compensation</span>,
      footer: (info) => info.column.id,
    }),
    combinedColumnHelper.accessor("maxSalary", {
      cell: (info) => (
        <CurrencyFormat
          value={info.getValue()}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      ),

      header: () => <span>Maximum compensation</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const defaultDataCombined: CombinedSalaryRange[] = [
    {
      campus: "WL",
      group: "Men's Football",
      department: "Men's Football",
      minSalary: 563.69,
      averageSalary: 261004.182926829,
      maxSalary: 5101030.58,
    },
  ];

  const [campusCombinedData, setCampusCombinedData] = useState([
    ...defaultDataCombined,
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get<RangeData>("http://192.168.10.202:5100/data/ranges/2021")
      .then((response) => {
        console.log(response.data);
        setCampusCombinedData(response.data.combined);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const table = useReactTable({
    data: campusCombinedData,
    columns: CombinedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading ? (
    <>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
        alt="Loading spinner"
      />
    </>
  ) : (
    <>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Ranges;
