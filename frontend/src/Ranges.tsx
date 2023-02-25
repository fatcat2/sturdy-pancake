import React, { useEffect, useState, forwardRef } from "react";


import { Button, Card, Divider, Group, Text, Badge, Container, Grid, Select, useMantineTheme } from '@mantine/core';

import axios from "axios"

import { useReactTable } from '@tanstack/react-table'

export interface YearRangeData {
   year: string;
   data: string[][];
}

function Ranges() {
   const [yearRangeData, setYearRangedata] = useState({
year: "2021",
data: [["Department","min","average","max"]]
   })

   return (
      <>
         
      </>
   )
}

export default Ranges;
