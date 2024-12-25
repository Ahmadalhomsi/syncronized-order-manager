// components/LogPanel.jsx
"use client"

import React, { useState, useEffect, useOptimistic } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getLogs, addLog } from '@/lib/actions'

const LogPanel = () => {
  const [logs, setLogs] = useState([])
  const [optimisticLogs, addOptimisticLog] = useOptimistic(
    logs,
    (state, newLog) => [newLog, ...state]
  )

  useEffect(() => {
    const fetchLogs = async () => {
      const { success, logs: fetchedLogs } = await getLogs()
      if (success) {
        setLogs(fetchedLogs)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAddLog = async (message, userType) => {
    // Optimistic update
    const optimisticLog = {
      id: Date.now(),
      message,
      userType,
      timestamp: new Date().toISOString(),
      type: message.includes('sipariş') ? 'success' : 
            message.includes('iptal') ? 'error' : 'info'
    }
    addOptimisticLog(optimisticLog)

    // Actual server action
    const { success, log } = await addLog(message, userType)
    if (!success) {
      // Handle error - maybe show a toast notification
      console.error('Failed to add log')
    }
  }

  const getBadgeVariant = (type) => {
    switch(type) {
      case 'success': return 'default'
      case 'info': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('tr-TR')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>İşlem Logları</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {optimisticLogs.map((log) => (
            <div 
              key={log.id} 
              className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded"
            >
              <Badge variant={getBadgeVariant(log.type)}>
                {log.type.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {log.userType}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatTimestamp(log.timestamp)}
              </span>
              <span>{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default LogPanel