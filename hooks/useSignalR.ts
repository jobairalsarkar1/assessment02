'use client'

import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';
import { useEffect, useState } from 'react';

export const useSignalR = (url: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(url, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        skipNegotiation: false,
        withCredentials: false,
        logger: LogLevel.Warning
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    const startConnection = async () => {
      setIsConnecting(true);
      try {
        await newConnection.start();
        setConnection(newConnection);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Connection failed';
        setError(errorMsg);
        console.error('Connection error:', err);
        setTimeout(startConnection, 5000);
      } finally {
        setIsConnecting(false);
      }
    };

    newConnection.onclose((err) => {
      if (err) {
        setError(`Connection closed: ${err.message}`);
        startConnection(); // Reconnect automatically
      }
    });

    startConnection();

    return () => {
      if (newConnection.state === 'Connected') {
        newConnection.stop().catch(() => {});
      }
    };
  }, [url]);

  return { connection, error, isConnecting };
};