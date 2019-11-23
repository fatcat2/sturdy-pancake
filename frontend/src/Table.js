import React from 'react';
import axios from "axios";
import ReactTable from "react-table";


function toCurrency(numberString) {
	if(isNaN(numberString)){
		return numberString;
	}
    let number = parseFloat(numberString);
    return "$" + number.toLocaleString('USD');
}

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


class Table extends React.Component{

	state = {
		year: 2018,
		data: [{"last_name": "Aasand", "first_name": "Hardin", "middle_name": "", "dept": "FW - 2Engl Ling", "group": "Faculty", "comp": 123924.12}, ]

	};

	handleChange = id => event => {
		this.setState({ [id]: event.target.value });
	};

	componentDidMount() {
		console.log("mounted")
		axios.get("/react_data/2018").then(res => {
			console.log(res.data);
			this.setState({
				data: res.data["data"]
			})
		});
	}

	render(){
		return (
			<ReactTable
				data={this.state.data}
				columns={columns}
				defaultPageSize={10}
				className="-striped -highlight"
				/>
		);
	}
}

export default Table;