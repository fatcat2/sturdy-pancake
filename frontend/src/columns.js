const columns = [
    {
        dataIndex: 'last_name',
        key: "last_name",
        title: 'Last Name',
        sorter: (a, b) => { return a.last_name.localeCompare(b.last_name)},
        sortDirections: ['ascend', 'descend']
    },
    {
        dataIndex: 'first_name',
        key: "first_name",
        title: 'First Name',
        sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
        sortDirections: ['ascend', 'descend']
    },
    {
        dataIndex: 'middle_name',
        key: "middle_name",
        title: 'Middle Name',
        sorter: (a, b) => { return a.middle_name.localeCompare(b.middle_name)},
        sortDirections: ['ascend', 'descend']
    },
    {
        dataIndex: 'dept',
        key: "dept",
        title: 'Department',
        filters: this.state.department_filters,
        onFilter: (value, record) => {
            // console.log(value, record)
            return record.dept.indexOf(value) === 0
        },
        sorter: (a, b) => { return a.dept.localeCompare(b.dept)},
        sortDirections: ['ascend', 'descend'],
        render: text => text.replace(/&amp;/g, '&')
    },
    {
        dataIndex: 'group',
        key: "group",
        title: 'Employee Group',
        filters: this.state.group_filters,
        onFilter: (value, record) => {
            return record.group.indexOf(value) === 0
        },
        sorter: (a, b) => { return a.group.localeCompare(b.group)},
        sortDirections: ['ascend', 'descend']                
    },
    {
        dataIndex: 'comp',
        key: "comp",
        title: 'Compensation',
        render: text => <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
        sorter: (a,b) =>  a.comp - b.comp ,
        defaultSortOrder: "descend",
        sortDirections: ['ascend', 'descend']

    }
];

const mobileColumns = [
    {
        dataIndex: 'last_name',
        key: "last_name",
        title: 'Last Name',
        sorter: (a, b) => { return a.last_name.localeCompare(b.last_name)},
        sortDirections: ['ascend', 'descend']
    },
    {
        dataIndex: 'first_name',
        key: "first_name",
        title: 'First Name',
        sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
        sortDirections: ['ascend', 'descend']
    },
    {
        dataIndex: 'comp',
        key: "comp",
        title: 'Compensation',
        render: text => <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />,
        sorter: (a,b) =>  a.comp - b.comp ,
        defaultSortOrder: "descend",
        sortDirections: ['ascend', 'descend']
    }
];

const yearOptions = [
    {
        key: '2019',
        text: '2019',
        value: '2019',
    },
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

export { columns, mobileColumns, yearOptions };