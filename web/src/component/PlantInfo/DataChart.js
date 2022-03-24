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

    const [lightLevelKey, setLightLevelKey] = useState("light_level");
    const changeLightLevelKey = () => {
      if (lightLevelKey == "")
        setLightLevelKey("light_level");
      else
        setLightLevelKey("");
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

    return (
        <div>
          <Button onClick={changeDissolvedSolidsKey}>Toggle Dissolved Solids</Button>
          <Button onClick={changeLightLevelKey}>Toggle Light Level</Button>
          <Button onClick={changePressureKey}>Toggle Pressure</Button>
          <Button onClick={changeTemperatureKey}>Toggle Temperature</Button>
          <Button onClick={changeHumidityKey}>Toggle Humidity</Button>
          <Button onClick={changeLeavesKey}>Toggle Leaves</Button>
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
                    <Line dataKey={lightLevelKey}
                        stroke="red" activeDot={{ r: 8 }} />
                    <Line dataKey={pressureKey}
                        stroke="yellow" activeDot={{ r: 8 }} />
                    <Line dataKey={temperatureKey}
                        stroke="blue" activeDot={{ r: 8 }} />
                    <Line dataKey={humidityKey}
                        stroke="green" activeDot={{ r: 8 }} />
                    <Line dataKey={leavesKey}
                        stroke="orange" activeDot={{ r: 8 }} />

                </LineChart>
          </ResponsiveContainer>

        </div>
    )
}
