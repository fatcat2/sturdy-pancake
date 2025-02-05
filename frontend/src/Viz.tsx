import React, { useEffect, useState, forwardRef } from "react";

import { Container, Grid } from "@mantine/core";

import { Group } from "@visx/group";
import { BoxPlot } from "@visx/stats";
import { LinearGradient } from "@visx/gradient";
import { scaleBand, scaleLinear } from "@visx/scale";
import genStats, { Stats } from "@visx/mock-data/lib/generators/genStats";
import { getSeededRandom, getRandomNormal } from "@visx/mock-data";
import { PatternLines } from "@visx/pattern";

import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useScreenSize } from "@visx/responsive";

function BoxWhisker() {
  const { width, height } = useScreenSize({ debounceTime: 150 });
  const xMax = width;
  const yMax = height - 120;

  const seededRandom = getSeededRandom(0.1);
  const randomNormal = getRandomNormal.source(getSeededRandom(0.789))(4, 3);
  const data: Stats[] = genStats(5, randomNormal, () => 10 * seededRandom());

  const x = (d: Stats) => d.boxPlot.x;
  const min = (d: Stats) => d.boxPlot.min;
  const max = (d: Stats) => d.boxPlot.max;
  const median = (d: Stats) => d.boxPlot.median;
  const firstQuartile = (d: Stats) => d.boxPlot.firstQuartile;
  const thirdQuartile = (d: Stats) => d.boxPlot.thirdQuartile;
  const outliers = (d: Stats) => d.boxPlot.outliers;

  const xScale = scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.4,
  });

  const values = data.reduce((allValues, { boxPlot }) => {
    allValues.push(boxPlot.min, boxPlot.max);
    return allValues;
  }, [] as number[]);
  const minYValue = Math.min(...values);
  const maxYValue = Math.max(...values);

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [minYValue, maxYValue],
  });

  const boxWidth = xScale.bandwidth();
  const constrainedWidth = Math.min(40, boxWidth);

  return (
    <svg width={width} height={height}>
      <LinearGradient id="statsplot" to="#8b6ce7" from="#87f2d4" />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#statsplot)"
        rx={14}
      />
      <PatternLines
        id="hViolinLines"
        height={3}
        width={3}
        stroke="#ced4da"
        strokeWidth={1}
        // fill="rgba(0,0,0,0.3)"
        orientation={["horizontal"]}
      />
      <Group top={40}>
        {data.map((d: Stats, i) => (
          <g key={i}>
            <BoxPlot
              min={min(d)}
              max={max(d)}
              left={xScale(x(d))! + 0.3 * constrainedWidth}
              firstQuartile={firstQuartile(d)}
              thirdQuartile={thirdQuartile(d)}
              median={median(d)}
              boxWidth={constrainedWidth * 0.4}
              fill="#FFFFFF"
              fillOpacity={0.3}
              stroke="#FFFFFF"
              strokeWidth={2}
              valueScale={yScale}
              outliers={outliers(d)}
            />
          </g>
        ))}
      </Group>
    </svg>
  );
}

function Viz() {
  return (
    <>
      <div style={{ width: "75%" }}>
        <BoxWhisker />
      </div>
    </>
  );
}

export default Viz;
