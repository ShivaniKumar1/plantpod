import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { getToken } from './../util/JWTHelper';
import { Button } from 'react-bootstrap';
import CardTable from './CardTable.js';
import DataChart from './DataChart.js';
import history from './../history/history';

const env = require('./../../env/env.json');

async function getData() {
    return await fetch(env.APIURL + '/plantData/getAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
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
            Header: 'Plant Number',
            accessor: 'plant_number',
          },
          {
            Header: 'Date',
            accessor: 'date',
          },
          {
            Header: 'Dissolved Solids',
            accessor: 'dissolved_solids',
          },
          {
            Header: 'Pressure',
            accessor: 'pressure',
          },
          {
            Header: 'Temperature',
            accessor: 'temperature',
          },
          {
            Header: 'Humidity',
            accessor: 'humidity',
          },
          {
            Header: 'Leaves',
            accessor: 'number_of_leaves',
          },
          {
            Header: 'Red Light',
            accessor: 'red_light',
          },
          {
            Header: 'Orange Light',
            accessor: 'orange_light',
          },
          {
            Header: 'Yellow Light',
            accessor: 'yellow_light',
          },
          {
            Header: 'Green Light',
            accessor: 'green_light',
          },
          {
            Header: 'Light Blue Light',
            accessor: 'light_blue_light',
          },
          {
            Header: 'Blue Light',
            accessor: 'blue_light',
          },
          {
            Header: 'Purple Light',
            accessor: 'purple_light',
          },
        ],
      }
    ],
    []);

    const [data, setData] = useState([]);
    useEffect(() => {
        async function load() {
            var data = await getData();
            setData(data);
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

        return (<input type="checkbox" ref={resolvedRef} {...rest} />)
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
                  Header: ({ getToggleAllPageRowsSelectedProps }) => (
                    <div>
                      <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                    </div>
                  ),
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
    const [cardStyle, setCardStyle] = useState("hiddenCard");
    const showCard = (cd, isCheckBox) => {
      if (isCheckBox == undefined)
      {
        setCardStyle("revealedCard");
        setSendCardData([...sendCardData, cd]);
        addCard();
      }
    }

    const [cards, setCards] = useState([]);
    function addCard() {
      setCards([...cards, "Sample Component"]);
    }

    let compareCard1 = undefined;
    let compareCard2 = undefined;
    const compareCards = (cd) => {
      if (compareCard1 === undefined)
        compareCard1 = cd;
      else if (compareCard2 === undefined) {
        compareCard2 = cd;
        showCard(cardDiff());
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
        dissolved_solids: compareCard1.dissolved_solids - compareCard2.dissolved_solids,
        pressure: compareCard1.pressure - compareCard2.pressure,
        temperature: compareCard1.temperature - compareCard2.temperature,
        humidity: compareCard1.humidity - compareCard2.humidity,
        number_of_leaves: compareCard1.number_of_leaves - compareCard2.number_of_leaves,
        red_light: compareCard1.red_light - compareCard2.red_light,
        orange_light: compareCard1.orange_light - compareCard2.orange_light,
        yellow_light: compareCard1.yellow_light - compareCard2.yellow_light,
        green_light: compareCard1.green_light - compareCard2.green_light,
        light_blue_light: compareCard1.light_blue_light - compareCard2.light_blue_light,
        blue_light: compareCard1.blue_light - compareCard2.blue_light,
        purple_light: compareCard1.purple_light - compareCard2.purple_light,
        comparisonData: true
      }
      return cdDiff;
    }

    const [chartData, setChartData] = useState([]);
    const changeChartData = (add, row) => {
      if (add)
        setChartData(oldArray => [...oldArray, row]);
      else
        setChartData(oldArray => oldArray.filter(function(i) { return i.id != row.id; }));
    }

    return (

        <div className="plantInfo">
          <div id={cardStyle}>
              {cards.map((item, i) => ( <CardTable cardData={sendCardData[i]}
                compareCard={compareCards}/> ))}
          </div>
          <div className="content2">
              <div className="header">Plant Info Table</div>
              <div className='lineBreak'/>

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
                        return <td {...cell.getCellProps()} onClick={(e) => showCard(row.original, e.target.checked)}>{cell.render('Cell')}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>

          <div className="pagination" style={{'marginTop': '15px'}}>
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
        </div>
        <br/>
        <div className="content2" style={{marginTop: '500px'}}>
          <DataChart chartData={chartData}/>
        </div>
      </div>
    )
}
