import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { getToken } from './../util/JWTHelper';
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
                      <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                  ),
                },
                ...columns,
              ])
          },
          useRowSelect,
         )


    return (

        <div className="plantInfo">
            <div id={card1style}>
                <CardTable cardData={sendCardData} hideCard={hideCard1}></CardTable>
            </div>
            <p>Plant Info Table</p>

            <table {...getTableProps()}>
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
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} onClick={() => showCard1(row.original)}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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


        </div>
    )
}
