
import {File} from "multer";

export interface MessageRequest {
    sender: string
    recipient: string
    message: string
    attatchmentName?: string
    file?: File
    attatchmentStoragePath?: string
    tag?: string
}

export interface Message {
    id: number
    sender: string
    recipient: string
    message: string
    attatchmentName?: string | undefined
    attachmentStoragePath?: string | undefined
    tag?: string | undefined
    timestamp: number
}

export interface ExecaObject {
    command: string
    escapedCommand: string
    exitCode: number
    stdout: string
    stderr: string
    failed: boolean
    timedOut: boolean
    isCancelled: boolean
    killed: boolean
}

export const enum Component {
    Main = "⚙️ [main]:",
    Scheduler = "⏰ [scheduler]:",
    Controller = "⚡️ [controller]:",
    Service = "🔌 [service]:",
    Repository = "💽 [repository]",
    Error = "🤯 [ERROR]:"
}


