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
import { getLogs, addLog } from '@/lib/logger'

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

  const handleAddLog = async (logData) => {
    // Optimistic update
    const optimisticLog = {
      id: Date.now(),
      message: logData.message,
      userType: logData.userType,
      customerId: logData.customerId,
      product: logData.product,
      quantity: logData.quantity,
      result: logData.result,
      timestamp: new Date().toISOString(),
      type: getLogType(logData.message)
    }
    addOptimisticLog(optimisticLog)

    // Actual server action
    const { success, log } = await addLog(logData)
    if (!success) {
      console.error('Failed to add log')
    }
  }

  const getLogType = (message) => {
    if (message.includes('insufficient')) return 'error'
    if (message.includes('order')) return 'success'
    return 'info'
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'success': return 'default'
      case 'info': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US')
  }

  const renderLogDetails = (log) => {
    const details = []

    if (log.customerId) {
      details.push(`Customer: ${log.customerId}`)
    }
    if (log.product) {
      details.push(`Product: ${log.product}`)
    }
    if (log.quantity) {
      details.push(`Quantity: ${log.quantity}`)
    }
    if (log.result) {
      details.push(`Result: ${log.result}`)
    }

    return details.join(' | ')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {optimisticLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col space-y-2 mb-4 p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <Badge variant={getBadgeVariant(log.type)}>
                  {log.type.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {log.userType}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(log.timestamp)}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-gray-800">{log.message}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {renderLogDetails(log)}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default LogPanel