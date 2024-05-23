import "./App.css";
import React, { useState } from "react";
import queries from "./components/queries";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleButtonClick = (buttonText) => {
    setText(buttonText);
  };

  const handleSubmit = async () => {
    const sparqlQuery = text;
    console.log("Querying SPARQL endpoint:", sparqlQuery);

    const endpointUrl = "http://localhost:8080/sparql";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
      },
      body: sparqlQuery,
    };

    try {
      const response = await fetch(endpointUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Query results:", data);
      // Parse the results into usable table data
      if (data.head && data.results) {
        const vars = data.head.vars || [];
        const bindings = data.results.bindings || [];

        const results = bindings.map((binding) => {
          let row = {};
          vars.forEach((variable) => {
            row[variable] = binding[variable] ? binding[variable].value : "";
          });
          return row;
        });

        setHeaders(vars);
        setQueryResults(results);
      }
    } catch (error) {
      console.error("Error querying SPARQL endpoint:", error.message);
    }
  };

  return (
    <>
      <div className='App'>
        <h1>Dota 2 Match Analysis</h1>

        <div>
          {queries.map((q, index) => (
            <button key={index} onClick={() => handleButtonClick(q.query)}>
              {q.label}
            </button>
          ))}
        </div>

        <textarea
          rows={20}
          cols={40}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>

        {headers.length > 0 && (
          <table className='query-table'>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default App;
