/**
 * Custom logger for events - debug, info, alert, warning, critical etc...
 */
var file = require('./file');
const FILE_LOCATION = 'logs/';

var LOG_LEVEL;
if (process.env == 'development') {
    LOG_LEVEL = 'DEV'; //defaults to DEBUG which is dev
} else {
    LOG_LEVEL = 'WARNING'; //defaults to WARNING which is production and don't console.out debug logs
}

class LogException {
    code = 0;
    status = 0;
    message = '';
    constructor(code, status, message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
    get() {
        return {
            code: this.code,
            status: this.status,
            message: this.message
        }
    }

}

class LogType {

}

class Log {
    constructor() {

    }

    log(timestamp, content) {


        if (LOG_LEVEL == 'DEV') {
            //log out time, type and message
            console.log(time + " " + content);
        }
        file.write(JSON.stringify(content, null, 4), `${FILE_LOCATION}/error.log`);
    }
}

/**
 * Lists all statuses, codes and messages for exceptions
 * based on https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
module.exports.EXCEPTIONS = {
    generic: new LogException(
        5000,
        500,
        'GENERAL ERROR'
    ),
    forbidden: new LogException(
        4003,
        403,
        'ACCESS TO RESOURCE FORBIDDEN'
    ),
    duplicate: new LogException(
        4000,
        403,
        'DUPLICATE ENTRY ALREADY EXISTS'
    ),
    dbError: new LogException(
        5001,
        500,
        'GENERIC DATABASE ERROR'
    ),
    notFound: new LogException(
        4001,
        404,
        'RESOURCE NOT FOUND'
    ),
    missing: new LogException(
        4002,
        400,
        'MISSING PARAMETER'
    )
};

module.exports.LOG_TYPES = {
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

module.exports.error = function (exception, original) {
    var output = exception.get();
    var log = new Log();

    // //caluclate the stack trace and get line number of original error
    // var stack = new Error().stack.split("\n");
    // var line = stack[2].split(":")[1];
    // output['line'] = line;

    output['details'] = original;
    output['type'] = 'ERROR';
    output['timestamp'] = new Date().getTime();
    log.log(`${output['timestamp']} ${output['type']} ${output['details']}`);
    throw {
        error: output
    };
}

module.exports.out = function (errCode, errMsg, Type = 'DEBUG') {
    console.log(Type + ": " + errCode + " " + errMsg);
}

module.exports.setLogLevel = function (level) {
    LOG_LEVEL = level;
}
