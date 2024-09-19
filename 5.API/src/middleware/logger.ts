import pino from 'pino'

const logger = pino({
    base: {
        pid: false
    },
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

export default logger;

/**
 * Pino is a fast, lightweight, and highly configurable logger built on
 * V8's built-in JSON.stringify() function. It's a low-overhead alternative
 * to other popular loggers like Morgan and Winston.
 *
 * The "base" option removes the process ID from the log output, which is
 * not necessary for our use case.
 *
 * The "transport" option is used to customize the log output. In this case,
 * we're using the "pino-pretty" transport, which formats the log output in
 * a human-readable format. The "colorize" option is set to true, which adds
 * color to the log output.
 */