import React, { useState, useEffect } from "react";
import axios from "axios";

const URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false";

const EthPrice = () => {
  const [ethPrice, setEthPrice] = useState(null);
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(URL);
        // console.log(response);
        // const json = await response.json();
        setEthPrice(() => response.data ?? null);
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    // Fetch Ethereum price when the component mounts
    fetchEthPrice();

    // You can set up an interval to fetch the price periodically (e.g., every minute)
    // const interval = setInterval(fetchEthPrice, 10000); // 60000ms = 1 minute

    // Clean up the interval when the component unmounts
    // return () => clearInterval(interval);
  }, []);
  return ethPrice;
};

export default EthPrice;
