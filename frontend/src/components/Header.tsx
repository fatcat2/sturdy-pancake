import React from "react";
import { Row, Col, Typography, Input, Tooltip } from "antd";
import { Dropdown } from "semantic-ui-react";
import { YEAR_OPTIONS, CURRENT_YEAR } from "../constants";
import { YearChangeEvent, SearchEvent } from "../types";

const { Title } = Typography;
const { Search } = Input;

interface HeaderProps {
  onYearChange: (e: any, v: YearChangeEvent) => void;
  onSearch: (e: SearchEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({ onYearChange, onSearch }) => {
  return (
    <div className="App-header" style={{ marginBottom: "20px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title>
            Purdue Salary Guide for{" "}
            <Tooltip placement="right" title={"Click me to change the year!"}>
              <Dropdown
                inline
                options={YEAR_OPTIONS}
                defaultValue={String(CURRENT_YEAR)}
                onChange={onYearChange}
              />
            </Tooltip>
          </Title>
        </Col>
        <Col>
          <Search
            placeholder="Enter keywords ..."
            onChange={onSearch}
            style={{ width: 200 }}
          />
        </Col>
      </Row>
    </div>
  );
};
