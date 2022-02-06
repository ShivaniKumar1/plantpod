import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import './PlantInfo.css';

const columns = ["Test1", "test2", "test3"];
//const [responsive, setResponsive] = useState("vertical");
//const [tableBodyHeight, setTableBodyHeight] = useState("400px");
//const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
const testData = [
    ["testName", "test2", "asdf1234%#@!"],
    ["tast", "t2", "t3"],
    ["four", "potato", "five"],
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    //responsive,
    //tableBodyHeight,
    //tableBodyMaxHeight
  };

export default function PlantInfo() {
    return (
        <div className="plantInformation">
          <MUIDataTable
            title={"Test Table"}
            data={testData}
            columns={columns}
            options={options}
          />
        </div>
    )
}
