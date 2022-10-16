import {getConfig} from "./util/util";
import {ApplicationConfig, Component} from "./globals";
import {HttpController} from "./integrations/HttpController";
import {SqliteDataSource} from "./persistence/SqliteDataSource";
import {Service} from "./Service";
import {KafkaConsumer} from "./integrations/KafkaConsumer";
import {NullDataSource} from "./persistence/NullDataSource";
import {Scheduler} from "./Scheduler";
import {Logger} from "./util/Logger";


const App = () => {
    /**
     * configure app per application.yml
     */
    const config: ApplicationConfig = getConfig()

    var dataSource = new NullDataSource()
    var service: Service
    var controller: HttpController
    var consumer: KafkaConsumer
    var scheduler: Scheduler

    var logger = new Logger(config)

    if(!!config.persistence) {
        if(!!config.persistence.sqlite) dataSource = new SqliteDataSource(config)
        if(!!config.persistence.lowdb) dataSource = new NullDataSource()
    }
    service = new Service(config, dataSource, logger)
    scheduler = new Scheduler(config, service, logger)
    if(!!config.integrations.http) {
        controller = new HttpController(config, service, logger)
    }
    if(!!config.integrations.kafka) {
        consumer = new KafkaConsumer(config, service, logger)
    }
    logger.out(Component.Main, "signal for things has started")
}

App()

