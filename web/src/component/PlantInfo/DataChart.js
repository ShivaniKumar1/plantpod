import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { getToken } from './../util/JWTHelper';
import { Button } from 'react-bootstrap';
import CardTable from './CardTable.js';
import history from './../history/history';

const env = require('./../../env/env.json');


// Table taken from https://react-table.tanstack.com/docs/examples/sorting
// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/v7/examples/row-selection-and-pagination
// Use that documentation as refernce when expanding
export default function PlantInfo({chartData}) {
    const [dissolvedSolidsKey, setDissolvedSolidsKey] = useState("dissolved_solids");
    const changeDissolvedSolidsKey = () => {
      if (dissolvedSolidsKey == "")
        setDissolvedSolidsKey("dissolved_solids");
      else
        setDissolvedSolidsKey("");
    }

    const [pressureKey, setPressureKey] = useState("pressure");
    const changePressureKey = () => {
      if (pressureKey == "")
        setPressureKey("pressure");
      else
        setPressureKey("");
    }

    const [temperatureKey, setTemperatureKey] = useState("temperature");
    const changeTemperatureKey = () => {
      if (temperatureKey == "")
        setTemperatureKey("temperature");
      else
        setTemperatureKey("");
    }

    const [humidityKey, setHumidityKey] = useState("humidity");
    const changeHumidityKey = () => {
      if (humidityKey == "")
        setHumidityKey("humidity");
      else
        setHumidityKey("");
    }

    const [leavesKey, setLeavesKey] = useState("number_of_leaves");
    const changeLeavesKey = () => {
      if (leavesKey == "")
        setLeavesKey("number_of_leaves");
      else
        setLeavesKey("");
    }

    const [redLightKey, setRedLightKey] = useState("red_light");
    const changeRedLightKey = () => {
      if (redLightKey == "")
        setRedLightKey("red_light");
      else
        setRedLightKey("");
    }

    const [orangeLightKey, setOrangeLightKey] = useState("light_level");
    const changeOrangeLightKey = () => {
      if (orangeLightKey == "")
        setOrangeLightKey("orange_light");
      else
        setOrangeLightKey("");
    }

    const [yellowLightKey, setYellowLightKey] = useState("yellow_light");
    const changeYellowLightKey = () => {
      if (yellowLightKey == "")
        setYellowLightKey("yellow_light");
      else
        setYellowLightKey("");
    }

    const [greenLightKey, setGreenLightKey] = useState("green_light");
    const changeGreenLightKey = () => {
      if (greenLightKey == "")
        setGreenLightKey("green_light");
      else
        setGreenLightKey("");
    }

    const [lightBlueLightKey, setLightBlueLightKey] = useState("light_blue_light");
    const changeLightBlueLightKey = () => {
      if (lightBlueLightKey == "")
        setLightBlueLightKey("light_blue_light");
      else
        setLightBlueLightKey("");
    }

    const [blueLightKey, setBlueLightKey] = useState("blue_light");
    const changeBlueLightKey = () => {
      if (blueLightKey == "")
        setBlueLightKey("blue_light");
      else
        setBlueLightKey("");
    }

    const [purpleLightKey, setPurpleLightKey] = useState("purple_light");
    const changePurpleLightKey = () => {
      if (purpleLightKey == "")
        setPurpleLightKey("purple_light");
      else
        setPurpleLightKey("");
    }

    return (
        <div>
          <Button onClick={changeDissolvedSolidsKey}>Toggle Dissolved Solids</Button>
          <Button onClick={changePressureKey}>Toggle Pressure</Button>
          <Button onClick={changeTemperatureKey}>Toggle Temperature</Button>
          <Button onClick={changeHumidityKey}>Toggle Humidity</Button>
          <Button onClick={changeLeavesKey}>Toggle Leaves</Button>
          <Button onClick={changeRedLightKey}>Toggle Red Light</Button>
          <br/>
          <Button onClick={changeOrangeLightKey}>Toggle Orange Light</Button>
          <Button onClick={changeYellowLightKey}>Toggle Yellow Light</Button>
          <Button onClick={changeGreenLightKey}>Toggle Green Light</Button>
          <Button onClick={changeLightBlueLightKey}>Toggle Light Blue Light</Button>
          <Button onClick={changeBlueLightKey}>Toggle Blue Light</Button>
          <Button onClick={changePurpleLightKey}>Toggle Purple Light</Button>
          <ResponsiveContainer aspect={3}>
                <LineChart data={chartData} margin={{ right: 300 }}>
                    <CartesianGrid />
                    <XAxis dataKey="date"
                        interval={'preserveStartEnd'} />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line dataKey={dissolvedSolidsKey}
                        stroke="black" activeDot={{ r: 8 }} />
                    <Line dataKey={pressureKey}
                        stroke="yellow" activeDot={{ r: 8 }} />
                    <Line dataKey={temperatureKey}
                        stroke="blue" activeDot={{ r: 8 }} />
                    <Line dataKey={humidityKey}
                        stroke="green" activeDot={{ r: 8 }} />
                    <Line dataKey={leavesKey}
                        stroke="orange" activeDot={{ r: 8 }} />

                    <Line dataKey={redLightKey}
                        stroke="red" activeDot={{ r: 8 }} />
                    <Line dataKey={orangeLightKey}
                        stroke="orange" activeDot={{ r: 8 }} />
                    <Line dataKey={yellowLightKey}
                        stroke="yellow" activeDot={{ r: 8 }} />
                    <Line dataKey={greenLightKey}
                        stroke="green" activeDot={{ r: 8 }} />
                    <Line dataKey={lightBlueLightKey}
                        stroke="#70A3CC" activeDot={{ r: 8 }} />
                    <Line dataKey={blueLightKey}
                        stroke="blue" activeDot={{ r: 8 }} />
                    <Line dataKey={purpleLightKey}
                        stroke="purple" activeDot={{ r: 8 }} />

                </LineChart>
          </ResponsiveContainer>

        </div>
    )
}
