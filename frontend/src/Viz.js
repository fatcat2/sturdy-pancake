import React, { useEffect, useState, forwardRef } from "react";


import { Button, Card, Divider, Group, Text, Badge, Container, Grid, Select, useMantineTheme } from '@mantine/core';

import axios from "axios"


const SelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function Salary(props) {
  const theme = useMantineTheme();

  const secondaryColor = theme.colorScheme === 'dark'
    ? theme.colors.dark[1]
    : theme.colors.gray[7];
  return (
    <Card shadow="sm" padding="sm">
      <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
        <Text weight={500}>{props.firstName} {props.lastName}</Text>
      </Group>

      <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
        Group: {props.group}
      </Text>
      <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
        Department: {props.department}</Text>
      <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
        Compensation: {props.compensation}
      </Text>

    </Card>
  )
}

const years = [
  {
    "value": 2011,
    "label": "2011"
  },

  {
    "value": 2012,
    "label": "2012"
  },
  {
    "value": 2013,
    "label": "2013"
  },
  {
    "value": 2014,
    "label": "2014"
  },
  {
    "value": 2015,
    "label": "2015"
  },
  {
    "value": 2016,
    "label": "2016"
  },
  {
    "value": 2017,
    "label": "2017"
  },
  {
    "value": 2018,
    "label": "2018"
  },
  {
    "value": 2019,
    "label": "2019"
  },
  {
    "value": 2020,
    "label": "2020"
  },
  {
    "value": 2021,
    "label": "2021"
  },
  {
    "value": 2022,
    "label": "2022"
  },

]

function Viz() {

  const [yearList, setYearList] = useState(years)
  const [year, setYear] = useState(-1);
  const [selected, setSelected] = useState();
  const [data, setData] = useState(
    [
      {
        "value": "test",
        "label": "this",
        "description": "out"
      }
    ]
  );

  const default_data = {
    "value": "chen",
    "first_name": "ryan",
    "compensation": "12312312312",
    "department": "your",
    "group": "mom"
  }

  const [selectedSalaries, setSalaries] = useState([default_data]);

  const eleven_data = {
    "value": "na",
    "label": "Search limit reached.",
    "description": "Be more specific to load more results.",
    "disabled": true
  }

  useEffect(() => {
    let mounted = true
    // axios.get(`/data/years`).then(res => {
    //   console.log(res.data)

    //   let yearData = []

    //   for (var value in res.data.years) {
    //     yearData.push({
    //       "value": res.data.years[value],
    //       "label": res.data.years[value].toString()
    //     })
    //   }

    //   if (mounted) setYearList(yearData);

    //   return () => { mounted = false }
    // });

    let mounted2 = true
    if (year != -1) {

    }

  }, [])

  const onYearChange = function (year) {
    setYear(year)
    console.log(year)
    axios.get(`/data/picker/${year}`).then(res => {
      let tmpData = res.data.data;
      tmpData.push(eleven_data);
      setData(tmpData)
      console.log(tmpData);
    });
  }

  const onInputChange = function (event) {
    setSelected(event);
    console.log(event);
  }

  const addSalary = function (event) {
    console.log("oof");
    setSalaries([...selectedSalaries, selected]);
    console.log(selectedSalaries);
  }


  const theme = useMantineTheme();

  const secondaryColor = theme.colorScheme === 'dark'
    ? theme.colors.dark[1]
    : theme.colors.gray[7];

  var salaryColumns = selectedSalaries.map(function (salary) {
    return <Salary key={salary.compensation+salary.last_name} firstName={salary.first_name} lastName={salary.last_name} group={salary.group} department={salary.dept} compensation={salary.comp}/>
  });

  return (
    <>
      <Container>

        <h1>compare salaries</h1>
        <Grid>
          <Grid.Col span={4}>
            <Select
              label="1. Pick the year"
              placeholder="Pick one"
              data={yearList}
              onChange={onYearChange}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Select
              label="2. Pick the employee"
              placeholder="Pick one"
              searchable
              clearable
              itemComponent={SelectItem}
              data={data}
              onChange={onInputChange}
              limit={10}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button variant="filled" fullWidth color="yellow" radius="lg" onClick={addSalary}>Generate Summary</Button>
          </Grid.Col>
          <Grid.Col span={12}>
            <Divider />
          </Grid.Col>
          <Grid.Col span={12}>
            <h2>selected employees</h2>
          </Grid.Col>
          <Grid.Col span={4}>
            { salaryColumns }
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default Viz;
