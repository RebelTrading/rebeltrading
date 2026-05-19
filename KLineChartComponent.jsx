import { useEffect, useRef } from 'react';
import { init, dispose } from 'klinecharts';

export const KLineChart = ({ symbol }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // 1. Initialize
    const chart = init(chartRef.current);
    
    // 2. Set symbol and indicator config
    chart.setSymbol({ ticker: symbol });
    chart.createIndicator('MACD');
    chart.createIndicator('RSI');

    // 3. Data Loader: This is how we fetch from your Beelink server
    chart.setDataLoader({
      getBars: async ({ callback }) => {
        try {
          const response = await fetch(`http://192.168.0.66:8000/api/prices?symbol=${symbol}`);
          const data = await response.json();
          // Assuming your API returns an array formatted for the library
          callback(data);
        } catch (err) {
          console.error("Data Load Error:", err);
          callback([]); // Return empty to avoid crashes
        }
      }
    });

    // 4. Cleanup on unmount
    return () => {
      dispose(chartRef.current);
    };
  }, [symbol]); // Re-runs when the symbol (BTC/ETH/etc) changes

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};
