import {ApplicationConfig, Component, MessageRequest} from "../globals";
import * as fs from "fs";
import yaml from "js-yaml"
import {config} from "dotenv";


export const getConfig = (): ApplicationConfig => {
    let config
        try {
            config = yaml.load(fs.readFileSync(`${__dirname}/../application.yml`, "utf-8")) as ApplicationConfig
            if(!config.signal.registered_number || (!config.integrations.http && !config.integrations.kafka)) {
                throw new Error("invalid application.yml configuration. neither integrations nor signal.registered_number can be null")
            }
            return config
        } catch(error) {
        console.log(Component.Error, "unable to get application.yml", error)
        console.log(config)
        process.exit()
    }
}

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

export const isValidRequest = (m: MessageRequest): boolean => {
    if (((!m.sender) || (m.sender === 'undefined'))
        || ((!m.recipient) || (m.recipient === 'undefined'))
        || ((!m.message) || (m.message === 'undefined'))) {
        return false
    }
    return true
}