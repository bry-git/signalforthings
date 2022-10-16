import {Service} from "../Service";
import {ApplicationConfig, Component} from "../globals";
import {Logger} from "../util/Logger";

export class KafkaConsumer {
    private service: Service
    private logger: Logger

    constructor(config: ApplicationConfig, service: Service, logger: Logger) {
        this.service = service
        this.logger = logger
        this.logger.out(Component.KafKaConsumer, "configured")
    }

    //TODO
}