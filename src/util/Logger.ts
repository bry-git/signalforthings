import {ApplicationConfig, Component} from "../globals";
import {dateFormatter} from "./util";
import fs from "fs";

export class Logger{
    private filename: any
    private path: any
    private writeDisk: any
    private config: any

    constructor(config: ApplicationConfig) {
        this.config = config

        if(!!this.config.logging) {
            this.writeDisk = true
            this.filename = (!!this.config.logging.filename) ? this.config.logging.filename : "signalforthings.log"
            this.path = (!!this.config.logging.location) ? this.config.logging.location : "."

            /**
             * open or create logfile
             */
            if(!fs.existsSync(`${this.path}`)) {
                fs.open(`${this.filename}`, 'w', (err) => {
                    if(err) this.out(Component.Error, "error creating logfile", err)
                })
            }
        } else {
            this.writeDisk = false
        }
    }

    /**
     * logs to the stdout of the PID that runs signalforthings while also writing to a file specified by application.yml
     * @param component the class making use of the logger function
     * @param message the message to log
     * @param object the optional object to log
     */
    public async out(component: Component, message: string | null, object?: any) {
            if(object) {
                const logMessage = `${component} ${dateFormatter()} - ${message}` + JSON.stringify(object)
                console.log(`${component} ${dateFormatter()} -`, message, object)
                if(this.writeDisk) await fs.appendFile(`${this.path + this.filename}`, logMessage + '\n', () => {})
            }
            else {
                const logMessage = `${component} ${dateFormatter()} - ${message}`
                console.log(logMessage)
                if(this.writeDisk) await fs.appendFile(`${this.path + this.filename}`, logMessage + '\n', () => {})
            }
    }

    public async rotateLog(): Promise<any> {}
}