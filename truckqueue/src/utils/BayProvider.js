import React, { useState } from "react";
import { getAllQueueData, getBaysData } from "../services/http-service";
import { BayContext, QueueContext } from "./AppContext";

export const BayProvider = ({ children }) => {
  const [bayData, setBayData] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);

  const updateBayData = async () => {
    const result = await getBaysData();
    console.log(result)
    if (result && result.MeterDashboard) {
      setBayData(result.MeterDashboard);
    }
    if(result && result.WaitQueue){
      setWaitingQueue(result.WaitQueue);
    }
  };

  return (
    <BayContext.Provider value={{ bayData, waitingQueue, updateBayData }}>
      {children}
    </BayContext.Provider>
  );
};
