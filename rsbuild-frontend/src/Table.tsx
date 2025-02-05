import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';

type Salary = {
  key: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  dept: string;
  group: string;
  comp: number;
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
  last_name: 'Aasand',
  first_name: 'Hardin',
  middle_name: '',
  dept: 'FW - 2Engl Ling',
  group: 'Faculty',
  comp: 123924.12,
};

const defaultEnglishFilter: DepartmentFilter = {
  text: 'FW - 2Engl Ling',
  value: 'FW - 2Engl Ling',
};

const defaultMoneyFilter: DepartmentFilter = { text: 'Money', value: 'Money' };

const defaultGroupFilter: GroupFilter = {
  text: 'Faculty',
  value: 'Faculty',
};

const columnHelper = createColumnHelper<Salary>();

function Table() {
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
  const [filterAll, setFilterAll] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  const [current, setCurrent] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const columns = [
    columnHelper.accessor('first_name', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      header: 'First Name',
    }),
    columnHelper.accessor('last_name', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      header: 'Last Name',
    }),
    columnHelper.accessor('middle_name', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      header: 'Middle Name',
    }),
    ,
    columnHelper.accessor('dept', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      header: 'Department',
    }),
    ,
    columnHelper.accessor('group', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      header: 'Group',
    }),
    ,
    columnHelper.accessor('comp', {
      cell: (info) => numberFormat.format(info.getValue()),
      footer: (info) => info.column.id,
      header: 'Compensation',
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  useEffect(() => {
    axios.get(`/data/2023`).then((res) => {
      setData(res.data['data']);
    });
  }, [year]);

  return (
    <div className="max-w-full py-10 flex-row justify-items-center ">
      <table className="border border-collapse rounded-lg basis-3/4 w-5/6 border-tools-table-outline border-gray-300 table-fixed text-sm">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className=" bg-gray-100 px-5 py-5 border border-gray-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
                <td
                  key={cell.id}
                  className="justify-content-center px-5 py-5 border-gray-200 border"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-5/6 flex-row justify-items-end gap-2 py-5">
        <button
          className="border-2 rounded p-1 mx-2  hover:border-sky-500 hover:text-sky-500 cursor-pointer"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border-2 rounded p-1 mx-2  hover:border-sky-500 hover:text-sky-500 cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border-2 rounded p-1 mx-2  hover:border-sky-500 hover:text-sky-500 cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border-2 rounded p-1 mx-2  hover:border-sky-500 hover:text-sky-500 cursor-pointer"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Table;
