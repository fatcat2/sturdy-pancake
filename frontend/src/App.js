import React from 'react';
import { Container, Grid, Header, Dropdown, Input, Icon } from 'semantic-ui-react'
import './App.css';
import axios from "axios";
import {
  BrowserView,
  MobileView,
} from "react-device-detect";

import "react-table/react-table.css";
import ReactTable from "react-table";

const modbile_columns = [
	{
		accessor: 'last_name',
		Header: 'Last Name'
	},
	{
		accessor: 'first_name',
		Header: 'First Name'
	},
	// {
	// 	accessor: 'middle_name',
	// 	Header: 'Middle Name'
	// },
	// {
	// 	accessor: 'dept',
	// 	Header: 'Department'
  //   },
	// {
	// 	accessor: 'group',
	// 	Header: 'Employee Group'
	// },
	{ 
		accessor: 'comp',
		Header: 'Compensation'
	}
];

const columns = [
	{
		accessor: 'last_name',
		Header: 'Last Name'
	},
	{
		accessor: 'first_name',
		Header: 'First Name'
	},
	{
		accessor: 'middle_name',
		Header: 'Middle Name'
	},
	{
		accessor: 'dept',
		Header: 'Department'
    },
	{
		accessor: 'group',
		Header: 'Employee Group'
	},
	{ 
		accessor: 'comp',
		Header: 'Compensation'
	}
];

const yearOptions = [
  {
    key: '2018',
    text: '2018',
    value: '2018',
  },
  {
    key: '2017',
    text: '2017',
    value: '2017',
  },
  {
    key: '2016',
    text: '2016',
    value: '2016',
  },
  {
    key: '2015',
    text: '2015',
    value: '2015',
  },
  {
    key: '2014',
    text: '2014',
    value: '2014',
  },
  {
    key: '2013',
    text: '2013',
    value: '2013',
  },
  {
    key: '2012',
    text: '2012',
    value: '2012',
  },
  {
    key: '2011',
    text: '2011',
    value: '2011',
  }
]

class App extends React.Component{
  constructor(props){
    
    console.log("asdf")
    super(props);
    this.state = {
      year: 2018,
      data: [{"last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12}, ],
      filtered: [],
      filterAll: '',
    }
    this.onChange = (e, v) => {
      this.setState({year: v.value});
      axios.get(`/react_data/${v.value}`).then(res => {
        // console.log(res.data);
        this.setState({
          data: res.data["data"]
        })
      });
      console.log(v.value)
    }
    this.filterAll = this.filterAll.bind(this);
  }

  componentDidMount() {
		console.log("mounted")
		console.log(`/react_data/${this.state.year}`)
		axios.get(`/react_data/${this.state.year}`).then(res => {
			console.log(res.data);
			this.setState({
				data: res.data["data"]
			})
		});
	}

  onFilteredChange(filtered) {
    // console.log('filtered:',filtered);
    // const { sortedData } = this.reactTable.getResolvedState();
    // console.log('sortedData:', sortedData);

    // extra check for the "filterAll"
    if (filtered.length > 1 && this.state.filterAll.length) {
      // NOTE: this removes any FILTER ALL filter
      const filterAll = '';
      this.setState({ filtered: filtered.filter((item) => item.id !== 'all'), filterAll })
    }
    else
      this.setState({ filtered });
  }

  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: 'all', value: filterAll }];
    // NOTE: this completely clears any COLUMN filters
    this.setState({ filterAll, filtered });
  }


  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render(){
    return (
      <div class="App-header">
        <Container>
          <br />
          <Grid divided='vertically'>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header size='huge'>purdue salary guide</Header>
                <Header>
                  Showing purdue salary data from {' '}
                  <Dropdown
                    inline
                    options={yearOptions}
                    defaultValue={yearOptions[0].value}
                    onChange = {this.onChange}
                  />
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <BrowserView>
                  <ReactTable
                    data={this.state.data}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    filterable
                    defaultSorted={[
                      {
                        id: "comp",
                        desc: true
                      }
                    ]}
                    />
                </BrowserView>
                <MobileView>
                <ReactTable
                    data={this.state.data}
                    columns={modbile_columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    filterable
                    defaultSorted={[
                      {
                        id: "comp",
                        desc: true
                      }
                    ]}
                    />
                </MobileView>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
    
}

export default App;
