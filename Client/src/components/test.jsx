import React, { useState, useEffect } from "react";
export default function FetchApiRequest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("result: ", result);
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching the data. Please try again later."
        );
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>API Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {data.map((dt) => {
            return (
              <Country
                name={dt.name.comon}
                capital={dt.capital}
                flag={dt.flags.png}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
const Country = ({ name, capital, flag }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{capital}</p>
      <img src={flag} alt={name} />
    </div>
  );
};
