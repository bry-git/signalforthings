import {Component, MessageRequest} from "../globals";
import * as fs from "fs";

/**
 * returns a date string that looks like '8-31-2022-8:12:11PM'
 */
export const dateFormatter = () => {
    const d = new Date()
        .toLocaleString()
        .replace(",", "-")
        .split(" ").join('')
        .replace("/", "-")
        .replace("/", "-")
    return d
}

/**
 * logs to the stdout of the PID that runs signalforthings while also writing to a file specified by process.env.LOGFILE
 * @param component the class making use of the logger function
 * @param message the message to log
 * @param object the optional object to log
 */
export const logger = async (component: Component, message: string | null, object?: any) => {
    if(object) {
        const logMessage = `${component} ${dateFormatter()} - ${message}` + JSON.stringify(object)
        console.log(`${component} ${dateFormatter()} -`, message, object)
        await fs.appendFile(`${process.env.LOGFILE}`, logMessage + '\n', () => {})
    }
    else {
        const logMessage = `${component} ${dateFormatter()} - ${message}`
        console.log(logMessage)
        await fs.appendFile(`${process.env.LOGFILE}`, logMessage + '\n', () => {})
    }
}

export const isValidRequest = (m: MessageRequest): boolean => {
    if (((!m.sender) || (m.sender === 'undefined'))
        || ((!m.recipient) || (m.recipient === 'undefined'))
        || ((!m.message) || (m.message === 'undefined'))) {
        return false
    }
    return true
}