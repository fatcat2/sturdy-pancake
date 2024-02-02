import React from "react";
import axios from "axios";
import ReactTable from "react-table";

import {
  Button,
  Card,
  Divider,
  Group,
  Text,
  Badge,
  Container,
  Grid,
  Select,
  useMantineTheme,
} from "@mantine/core";

const columns = [
  {
    accessor: "last_name",
    Header: "Last Name",
  },
  {
    accessor: "first_name",
    Header: "First Name",
  },
  {
    accessor: "middle_name",
    Header: "Middle Name",
  },
  {
    accessor: "dept",
    Header: "Department",
  },
  {
    accessor: "group",
    Header: "Employee Group",
  },
  {
    accessor: "comp",
    Header: "Compensation",
  },
];

class Table extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      year: props.year,
      data: [
        {
          last_name: "Aasand",
          first_name: "Hardin",
          middle_name: "",
          dept: "FW - 2Engl Ling",
          group: "Faculty",
          comp: 123924.12,
        },
      ],
    };
  }

  handleChange = (id) => (event) => {
    this.setState({ [id]: event.target.value });
  };

  componentDidMount() {
    axios.get(`/data/2023`).then((res) => {
      console.log(res.data);
      this.setState({
        data: res.data["data"],
      });
    });
  }

  render() {
    return (
      <>
        <Container>
          <Grid>
            <Grid.Col span={8}>
              <ReactTable
                data={this.state.data}
                columns={columns}
                defaultPageSize={10}
                className="-striped -highlight"
              />
            </Grid.Col>
          </Grid>
        </Container>
      </>
    );
  }
}

export default Table;
