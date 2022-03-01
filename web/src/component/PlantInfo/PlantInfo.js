import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'
import { getToken, getXSRF, getRefresh } from './../util/JWTHelper';
import { Button } from 'react-bootstrap';
import CardTable from './CardTable.js';
import './PlantInfo.css';

const env = require('./../../env/env.json');

async function getData() {
    return await fetch(env.APIURL + '/plantData/getAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
    })
    .then(res => res.json())
    .then(json => { return json;})


}





// Table taken from https://react-table.tanstack.com/docs/examples/sorting
// Use that documentation as refernce when expanding
export default function PlantInfo() {
    const [loadingData, setLoadingData] = useState(true);
    const columns = React.useMemo(
    () => [
      {
        Header: 'Plant Information',
        columns: [
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'Date',
            accessor: 'date',
          },
          {
            Header: 'CO2',
            accessor: 'co2_level',
          },
          {
            Header: 'PH',
            accessor: 'pH_level',
          },
          {
            Header: 'Pressure',
            accessor: 'pressure',
          },
          {
            Header: 'Soil Moisture',
            accessor: 'soil_moisture',
          },
          {
            Header: 'Temperature',
            accessor: 'temperature',
          },
          {
            Header: 'Picture Path',
            accessor: 'picture_path',
          }
        ],
      }
    ],
    []);

    const [sendCardData, setSendCardData] = useState([]);
    const [card1style, setCard1Style] = useState("hiddenCard1");
    const showCard1 = (cd) => {
      console.log("clicked");
      setCard1Style("revealedCard1");
      setSendCardData(cd);
    }
    const hideCard1 = () => {
        setCard1Style("hiddenCard1");
    }

    const [data, setData] = useState([]);
    useEffect(() => {
        async function load() {
            var data = await getData();
            console.log(data.data);
            setData(data.data);
            // you tell it that you had the result
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow}
        = useTable({columns, data}, useSortBy);

      const firstPageRows = rows.slice(0, 20)
      console.log(getData());

    return (

        <div className="plantInfo">
            <div id={card1style}>
                <CardTable cardData={sendCardData} hideCard={hideCard1}></CardTable>
            </div>
            <p>Plant Info Table</p>
            <table {...getTableProps()} >
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          {/* Add a sort direction indicator */}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {firstPageRows.map(
                    (row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} onClick={() => showCard1(row.original)}>
                          {row.cells.map(cell => {
                            return (
                              <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            )
                          })}
                        </tr>
                      )}
                  )}
                </tbody>
            </table>
        </div>
    )
}
