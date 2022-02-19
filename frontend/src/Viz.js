import React, { useEffect, useState, forwardRef } from "react";


import { Button, Card, Divider, Group, Text, Badge, Container, Grid, Select, useMantineTheme, TextInput, Table, Checkbox } from '@mantine/core';

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

function Viz() {

   const [yearList, setYearList] = useState([{"value": 2011, "label": "2011"}])
   const [year, setYear] = useState(-1);
   let elements = [{
      "value": "na",
      "label": "Search limit reached.",
      "description": "Be more specific to load more results.",
      "disabled": true
   }];

   let test = elements.map((element) => (
      <tr key={element.label}>
        <td>{element.label}</td>
        <td>{element.description}</td>
        <td><Checkbox size="lg" id={element.labe}/></td>
      </tr>
    ));
  
   const [data, setData] = useState(test
   );

   const eleven_data = {
      "value": "na",
      "label": "Search limit reached.",
      "description": "Be more specific to load more results.",
      "disabled": true
   }

   const [searchData, setSearchData] = useState([eleven_data])

   useEffect(() => {
      let mounted = true
      axios.get(`/data/years`).then(res => {
         console.log(res.data)

         let yearData = []

         for(var value in res.data.years){
            yearData.push({
               "value": res.data.years[value],
               "label": res.data.years[value].toString()
            })
         }


         console.log(yearData)

         if (mounted) setYearList(yearData);

         return () => {mounted = false}
      });

      let mounted2 = true
      if(year != -1) {
         
      }

   }, [])

   const onYearChange = function(year) {
      setYear(year)
      console.log(year)
      axios.get(`/data/picker/${year}`).then(res => {
         let tmpData = res.data.data.map((element) => (
            <tr key={element.label}>
              <td>{element.label}</td>
              <td>{element.description}</td>
            </tr>
          ));
        
         setData(tmpData);
      });
   }

   const onInputChange = function(event) {
      let query = event.currentTarget.value;
      const params = {
         "query": query
      };

      axios.get(`/data/picker/${year}`, {params}).then(res => {
         let tmpData = res.data.data.map((element) => (
            <tr key={element.label}>
              <td>{element.label}</td>
              <td>{element.description}</td>
            </tr>
          ));
        
         setData(tmpData);
      })
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
               <TextInput
                     label="2. Search an employee"
                     placeholder="Search one"
                     onChange={onInputChange}
                  />
               </Grid.Col>
               <Grid.Col span={12}>
               <Button variant="filled" fullWidth color="yellow" radius="lg">Add</Button>
               </Grid.Col>
               <Grid.Col span={12}>
                  <Table highlightOnHover>
                     <thead>
                     <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Select</th>
                     </tr>
                     </thead>
                     <tbody>{data}</tbody>
                  </Table>
               </Grid.Col>
               <Grid.Col span={12}>
               <Divider />
               </Grid.Col>
               <Grid.Col span={12}>
               <h2>Selected employees</h2>
               </Grid.Col>
               <Grid.Col span={12}>
               <Card shadow="sm" padding="sm">
                  <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                     <Text weight={500}>Norway Fjord Adventures</Text>
                     <Badge color="pink" variant="light">
                        On Sale
                     </Badge>
                  </Group>

                  <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                     With Fjord Tours you can explore more of the magical fjord landscapes with tours and
                     activities on and around the fjords of Norway
                  </Text>

                  <Button variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                     Book classic tour now
                  </Button>
                  </Card>
               </Grid.Col>
            </Grid>
         </Container>
      </>
   )
}


export default Viz;