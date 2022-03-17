import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { getToken } from './../util/JWTHelper';
import { Button } from 'react-bootstrap';
import CardTable from './CardTable.js';

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
// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/v7/examples/row-selection-and-pagination
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
          }
        ],
      }
    ],
    []);

    const [data, setData] = useState([]);
    useEffect(() => {
        async function load() {
            var data = await getData();
            console.log(data);
            setData(data);
            // you tell it that you had the result
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);



    const IndeterminateCheckbox = React.forwardRef(
      ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
          resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
          <>
            <input type="checkbox" ref={resolvedRef} {...rest} />
          </>
        )
      }
    )


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        selectedFlatRows,
        state: { pageIndex, pageSize, selectedRowIds },
      }
        = useTable(
        {
          columns,
          data,
        },
        useSortBy,
        usePagination,
        hooks => {
              hooks.visibleColumns.push(columns => [
                {
                  id: 'selection',
                  // The header can use the table's getToggleAllRowsSelectedProps method
                  // to render a checkbox
                  Header: ({ getToggleAllPageRowsSelectedProps }) => (
                    <div>
                      <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                    </div>
                  ),
                  // The cell can use the individual row's getToggleRowSelectedProps method
                  // to the render a checkbox
                  Cell: ({ row }) => (
                    <div>
                      <IndeterminateCheckbox onClick={(e) => {changeChartData(e.target.checked, row.original)}}{...row.getToggleRowSelectedProps()} />
                    </div>
                  ),
                },
                ...columns,
              ])
          },
          useRowSelect,
         )


    const [sendCardData, setSendCardData] = useState([]);
    const [card1style, setCard1Style] = useState("hiddenCard1");
    const showCard1 = (cd) => {
      setCard1Style("revealedCard1");
      setSendCardData([...sendCardData, cd]);
      addCard();
    }
    const hideCard1 = () => {
       setCard1Style("hiddenCard1");
    }
    let compareCard1 = undefined;
    let compareCard2 = undefined;
    const compareCards = (cd) => {
      if (compareCard1 === undefined)
        compareCard1 = cd;
      else if (compareCard2 === undefined) {
        compareCard2 = cd;
        showCard1(cardDiff());
        compareCard1 = undefined;
        compareCard2 = undefined;
      }
      else
        console.log("You've done something wrong :( ");
    }
    const cardDiff = () => {
      let cdDiff = {
        id: "~",
        date: "~",
        co2_level: compareCard1.co2_level - compareCard2.co2_level,
        pH_level: compareCard1.pH_level - compareCard2.pH_level,
        pressure: compareCard1.pressure - compareCard2.pressure,
        soil_moisture: compareCard1.soil_moisture - compareCard2.soil_moisture,
        temperature: compareCard1.temperature - compareCard2.temperature,
        comparisonData: true
      }
      return cdDiff;
    }
    const [cards, setCards] = useState([]);
    function addCard() {
      setCards([...cards, "Sample Component"]);

    }

    const [chartData, setChartData] = useState([]);
    const changeChartData = (add, row) => {

      if (add)
      {
        console.log("row is + " + row);
        console.log(row);
        setChartData(oldArray => [...oldArray, row]);
      }
      else
      {

      }

    }

    const [pHKey, setPHKey] = useState("pH_level");
    const changePHKey = () => {
      if (pHKey == "")
        setPHKey("pH_level");
      else
        setPHKey("");
    }

    return (

        <div className="plantInfo">
            <div id={card1style}>
                {cards.map((item, i) => ( <CardTable cardData={sendCardData[i]} hideCard={hideCard1}
                  compareCard={compareCards}/> ))}
            </div>
            <p>Plant Info Table</p>

            <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
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
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()} onClick={() => showCard1(row.original)}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={changePHKey}>Toggle PH</Button>
          <ResponsiveContainer width="50%" aspect={3}>
                <LineChart data={chartData} margin={{ right: 300 }}>
                    <CartesianGrid />
                    <XAxis dataKey="date"
                        interval={'preserveStartEnd'} />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line dataKey="co2_level"
                        stroke="black" activeDot={{ r: 8 }} />
                    <Line dataKey={pHKey}
                        stroke="red" activeDot={{ r: 8 }} />
                </LineChart>
          </ResponsiveContainer>

        </div>
    )
}
