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
               Department: {props.department}
               Compensation: {props.compensation}
            </Text>

         </Card>
   )
}

function Viz() {

   const [yearList, setYearList] = useState([{ "value": 2011, "label": "2011" }])
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
   const [selectedSalaries, setSalaries] = useState();

   const eleven_data = {
      "value": "na",
      "label": "Search limit reached.",
      "description": "Be more specific to load more results.",
      "disabled": true
   }

   useEffect(() => {
      let mounted = true
      axios.get(`/data/years`).then(res => {
         console.log(res.data)

         let yearData = []

         for (var value in res.data.years) {
            yearData.push({
               "value": res.data.years[value],
               "label": res.data.years[value].toString()
            })
         }


         console.log(yearData)

         if (mounted) setYearList(yearData);

         return () => { mounted = false }
      });

      let mounted2 = true
      if (year != -1) {

      }

   }, [])

   const onYearChange = function (year) {
      setYear(year)
      console.log(year)
      axios.get(`/data/picker/${year}`).then(res => {
         console.log(res.data)
         let tmpData = res.data.data;
         tmpData.push(eleven_data);
         setData(tmpData)
      });
   }

   const onInputChange = function (event) {
      setSelected(event)
   }

   const addSalary = function () {

   }


   const theme = useMantineTheme();

   const secondaryColor = theme.colorScheme === 'dark'
      ? theme.colors.dark[1]
      : theme.colors.gray[7];

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
                  <Button variant="filled" fullWidth color="yellow" radius="lg" onClick={addSalary}>Add</Button>
               </Grid.Col>
               <Grid.Col span={12}>
                  <Divider />
               </Grid.Col>
               <Grid.Col span={12}>
                  <h2>Selected employees</h2>
               </Grid.Col>
               <Grid.Col span={4}>
                  <Salary firstName={"Ryan"} lastName={"Chen"} compensation={123456} />
               </Grid.Col>
            </Grid>
         </Container>
      </>
   )
}


export default Viz;