"use client"

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const LogPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simulated log generation for demonstration
    const simulateLogs = () => {
      const newLogs = [
        {
          id: Date.now(),
          message: "Müşteri 1 (premium), Product 1'den 10 adet sipariş verdi.",
          type: "success"
        },
        {
          id: Date.now() + 1,
          message: "Müşteri 2 (normal), Product 2'den 50 adet sipariş verdi.",
          type: "info"
        },
        {
          id: Date.now() + 2,
          message: "Müşteri 4'ün siparişi stok yetersizliğinden iptal edildi.",
          type: "error"
        }
      ];

      setLogs(prevLogs => [...prevLogs, ...newLogs].slice(-10));
    };

    const logInterval = setInterval(simulateLogs, 5000);
    return () => clearInterval(logInterval);
  }, []);

  const getBadgeVariant = (type) => {
    switch(type) {
      case 'success': return 'default';
      case 'info': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>İşlem Logları</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded"
            >
              <Badge variant={getBadgeVariant(log.type)}>
                {log.type.toUpperCase()}
              </Badge>
              <span>{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogPanel;