export interface EmployeeData {
  key: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  dept: string;
  group: string;
  comp: number;
  long_text: string;
}

export interface FilterOption {
  text: string;
  value: string;
}

export interface ApiResponse {
  data: EmployeeData[];
  departments: FilterOption[];
  groups: FilterOption[];
}

export interface YearChangeEvent {
  value: string;
}

export interface SearchEvent {
  target: {
    value: string;
  };
}
