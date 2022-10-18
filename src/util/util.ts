import {ApplicationConfig, Component, MessageRequest} from "../globals";
import * as fs from "fs";
import yaml from "js-yaml"

export const getConfig = (): ApplicationConfig => {
    try {
        let config: ApplicationConfig
        try {
            config = yaml.load(fs.readFileSync(`${__dirname}/application.yml`, "utf-8")) as ApplicationConfig
        } catch (error) {
            console.log(Component.Error, `${dateFormatter()} could not find config file at ${__dirname}/application.yml`)
            try {
                config = yaml.load(fs.readFileSync(`${__dirname}/../application.yml`, "utf-8")) as ApplicationConfig
            } catch(error) {
                console.log(Component.Error, `${dateFormatter()} could not find config file at ../application.yml`, error)
                process.exit()
            }
        }
        if(!config.signal.registered_number || (!config.integrations.http && !config.integrations.kafka)) {
            throw new Error("invalid application.yml configuration. neither integrations nor signal.registered_number can be null")
        }
        return config
    } catch (error) {
        console.log(Component.Error, `${dateFormatter()} unable to get application.yml`, error)
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