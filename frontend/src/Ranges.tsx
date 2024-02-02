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
  departments: CampusDepartmentSalaryRange[] | null;
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

interface CampusDepartmentProps {
  campusDepartmentData: CampusDepartmentSalaryRange[] | null;
}

interface CampusGroupProps {
  campusGroupData: CampusGroupSalaryRange[];
}

interface CombinedProps {
  combinedData: CombinedSalaryRange[];
}

interface RangeProps {
  rangeData: RangeData;
  isLoading: boolean;
}

function Ranges() {
  const [year, setYear] = useState<string | null>("2021");
  const [loading, setLoading] = useState<boolean>(true);
  const [rangeData, setRangeData] = useState<RangeData | null>({
    departments: [],
    groups: [],
    combined: [],
  });
  useEffect(() => {
    axios
      .get<RangeData>(`http://192.168.10.202:5100/data/ranges/${year}`)
      .then((response) => {
        setRangeData(response.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [year]);
  return (
    <>
      <Container>
        <Title order={1}>Salary ranges</Title>
        <Text>
          Ranges are taken from the spreadsheet, sorted by employee group.
          Values are calculated by taking out any compensation values lower than
          $15,000.
        </Text>
        <Select
          label="Pick the year you would like to view:"
          placeholder="Pick one"
          data={[
            { value: "2011", label: "2011" },
            { value: "2012", label: "2012" },
            { value: "2013", label: "2013" },
            { value: "2014", label: "2014" },
            { value: "2015", label: "2015" },
            { value: "2016", label: "2016" },
            { value: "2017", label: "2017" },
            { value: "2018", label: "2018" },
            { value: "2019", label: "2019" },
            { value: "2020", label: "2020" },
            { value: "2021", label: "2021" },
            { value: "2022", label: "2022" },
          ]}
          onChange={setYear}
        />
        <Grid>
          <Grid.Col span={12}>
            <RangeTabs rangeData={rangeData!} isLoading={loading}/>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

function RangeTabs(props: RangeProps) {
  return (
    props.isLoading ? 
    <Text>LOADING LOLLLL</Text> :
    <>
      <Tabs defaultValue={"first"}>
        <Tabs.List grow>
          <Tabs.Tab value="first">Campus and department</Tabs.Tab>
          <Tabs.Tab value="second">Campus and employee group</Tabs.Tab>
          <Tabs.Tab value="third">
            Campus, department and employee group
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">
          <CampusDepartmentTable
            campusDepartmentData={props.rangeData!.departments}
          />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <CampusGroupTable campusGroupData={props.rangeData!.groups} />
        </Tabs.Panel>
        <Tabs.Panel value="third">
          <CombinedTable combinedData={props.rangeData!.combined} />
        </Tabs.Panel>
      </Tabs>
      </>
  );
}

function CampusDepartmentTable(props: CampusDepartmentProps) {
  const table = useReactTable({
    data: props.campusDepartmentData!,
    columns: campusDepartmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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

function CampusGroupTable(props: CampusGroupProps) {
  const table = useReactTable({
    data: props.campusGroupData!,
    columns: campusGroupColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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

function CombinedTable(props: CombinedProps) {
  const table = useReactTable({
    data: props.combinedData!,
    columns: CombinedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
