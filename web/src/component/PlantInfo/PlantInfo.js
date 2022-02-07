import React, { useState } from 'react';
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'
import './PlantInfo.css';




// Table taken from https://react-table.tanstack.com/docs/examples/sorting
// Use that documentation as refernce when expanding
export default function PlantInfo() {
    const columns = React.useMemo(
    () => [
      {
        Header: 'Plant Information',
        columns: [
          {
            Header: 'Header 1',
            accessor: 'firstName',
          },
          {
            Header: 'Header 2',
            accessor: 'lastName',
          },
          {
            Header: 'Header 3',
            accessor: 'info1',
          }
        ],
      }
    ],
    []
  )
      const data = React.useMemo(
      () => [
        {
          firstName: 'Hello',
          lastName: 'World',
          info1: 'test',
        },
        {
          firstName: 'react-table',
          lastName: 'rocks',
          info1: 'test',
        },
        {
          firstName: 'whatever',
          lastName: 'you want',
          info1: 'test',
        },
      ],
      []
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable(
        {
          columns,
          data,
        },
        useSortBy
      )

      // We don't want to render all 2000 rows for this example, so cap
      // it at 20 for this use case
      const firstPageRows = rows.slice(0, 20)

    return (
        <div className="plantInfo">
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
                  {firstPageRows.map(
                    (row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
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
