import React, { useState } from "react";
import { getAllQueueData, getBaysData } from "../services/http-service";
import { QueueContext } from "./AppContext";

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [bayData, setBayData] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);

  const updateQueueData = async () => {
    const result = await getAllQueueData();
    //console.log(result)
    if(result && result.length > 0){
        setQueue(result);
    }
  };

  const updateBayData = async () => {
    const result = await getBaysData();
    //console.log(result)
    if (result && result.MeterDashboard) {
      setBayData(result.MeterDashboard);
    }
    if(result && result.WaitQueue){
      setWaitingQueue(result.WaitQueue);
    }
  };

  return (
    <QueueContext.Provider value={{ queue, updateQueueData, bayData, waitingQueue, updateBayData }}>
      {children}
    </QueueContext.Provider>
  );
};
