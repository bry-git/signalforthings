import dotenv from "dotenv";
import {Controller} from "./Controller";
import {Scheduler} from "./Scheduler";
import {logger} from "./Util/util";
import {Component} from "./globals";
import * as fs from "fs";


const App = () => {
    dotenv.config();

    if(!fs.existsSync(`${process.env.LOGFILE}`)) {
        fs.open(`${process.env.LOGFILE}`, 'w', (err) => {
            if(err) logger(Component.Error, "error creating logfile", err)
        })
    }

    const controller: Controller = new Controller();
    controller.run();

    const crontab = new Scheduler();
    crontab.ipWatchdog()

    logger(Component.Main, "signal for things has started")
}

App()

