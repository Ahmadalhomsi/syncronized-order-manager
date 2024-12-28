// lib/actions.js
"use server"

import fs from 'fs/promises'
import path from 'path'

const LOG_FILE_PATH = path.join(process.cwd(), 'data', 'logs.json')

async function ensureDirectory() {
    const dir = path.join(process.cwd(), 'data')
    try {
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir, { recursive: true })
    }
}

async function readLogs() {
    try {
        await ensureDirectory()
        const data = await fs.readFile(LOG_FILE_PATH, 'utf8')
        return JSON.parse(data)
    } catch {
        return []
    }
}

function determineLogType(message) {
    if (message.includes('sipariş')) return 'success'
    if (message.includes('iptal')) return 'error'
    return 'info'
}

export async function addLog(message, userType) {
    try {
        const logs = await readLogs()

        const newLog = {
            id: Date.now(),
            message,
            userType,
            timestamp: new Date().toISOString(),
            type: determineLogType(message)
        }

        logs.push(newLog)
        const trimmedLogs = logs.slice(-100) // Keep last 100 logs

        await fs.writeFile(LOG_FILE_PATH, JSON.stringify(trimmedLogs, null, 2))
        return { success: true, log: newLog }
    } catch (error) {
        console.error('Error adding log:', error)
        return { success: false, error: error.message }
    }
}

export async function getLogs() {
    try {
        const logs = await readLogs()
        return { success: true, logs }
    } catch (error) {
        console.error('Error fetching logs:', error)
        return { success: false, logs: [], error: error.message }
    }
}

/*

// Example usage in any component
"use client"
import { addLog } from '@/lib/logger'

export default function SomeComponent() {
  const handleAction = async () => {
    // Direct server action call
    await addLog("Yeni sipariş oluşturuldu", "Customer")
  }
  
  return (
    <button onClick={handleAction}>
      Add Log
    </button>
  )
}

*/