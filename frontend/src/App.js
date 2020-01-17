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

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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

function About(){
  return (
  <p>
    This is an online database containing salary information for Purdue employees for the fiscal years of 2011 through 2018. Anyone who got paid by Purdue and was not a student is in this database, along with the amount compensated. The data is provided by Purdue University through their Public Records office. Salary information at public universities is public information and is able to be requested through the university's public records division. Student compensation is not listed in here due to FERPA restrictions. If you're interested in looking at the code and source data, hit up the GitHub repo. Excel sheets containing the salary data can be found in the GitHub repo. You can get the JSON for a specific year by submitting a HTTP request to https://salary.ryanjchen.com/data/"insert year". Example: 2018 data can be found at https://salary.ryanjchen.com/data/2018. Requests for additional functionality can be directed to ryanjchen2@gmail.com.
  </p>
  )
}

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
        console.log(res.data);
        this.setState({
          data: res.data["data"]
        })
      });
      console.log(v.value)
    }
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
  
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render(){
    return (
      <Router>
      <div class="App-header">
        <Container>
          <br />
          <Grid divided='vertically'>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header size='huge'>purdue salary guide</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Switch>
                  <Route path="/about">
                    <About />
                  </Route>
                  <Route path="/">
                    <Header>
                      Showing purdue salary data from {' '}
                      <Dropdown
                        inline
                        options={yearOptions}
                        defaultValue={yearOptions[0].value}
                        onChange = {this.onChange}
                      />
                    </Header>
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
                  </Route>
                </Switch>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <p style={{"text-align": "center"}}><a href="/about">About</a> | Created and maintained by <a href="https://twitter.com/ryanjengchen">@ryanjengchen</a>.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      </Router>
    );
  }
    
}

export default App;
