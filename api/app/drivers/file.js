
const fs = require("fs");

function init() {

}
/**
 * Reads file string
 * 
 * @param {*} fileName 
 */
function read(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(
            fileName,
            'utf8',
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
    })
}

/**
 * Returns lines as an array
 * 
 * @param {*} fileName Name of file
 */
async function readLines(fileName) {
    try {
        const fileStream = await read(fileName);
        if (fileStream.length == 0) {
            return null;
        }
        return fileStream.split("\n");
    } catch (e) {
        throw e
    }
}

/**
 * Returns line based on pointer number
 * 
 * @param {*} fileName Name of file
 * @param {*} pointer File line number
 */
async function readLine(fileName, pointer = 0) {
    try {
        const line = await readLines(fileName);
        return line[pointer];
    } catch (e) {
        throw e
    }
}

/**
 * Output to file (replace all file content)
 * 
 * @param {*} content 
 * @param {*} fileName 
 */
async function write(content, fileName) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(
            fileName,
            content,
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
    })
}

/**
 * Updates config file value (assuming it is in json format)
 * in the config directory
 * Example:
 * const success=await updateConfigItem('region', 'ap-southeast-1', '../app/config/config.json')
 * @param {*} value 
 * @param {*} configFile 
 * @returns Promise<any>
 */
async function updateConfigItem(name, value, fileName) {
    try {
        const fileStream = await read(fileName);
        var jsonBuffer = JSON.parse(fileStream);
        jsonBuffer[name] = value;
        var content = JSON.stringify(jsonBuffer, null, 4);
        const updateFile = await write(content, fileName);
        return true;
    } catch (e) {
        throw e;
    }

}
/**
 * Gets config file value as object (type is variable)
 * in the config directory
 * Example:
 * const success=await getConfigItem('region', '../app/config/config.json')
 * @param {*} name 
 * @param {*} fileName 
 * @returns object
 */
async function getConfigItem(name, fileName) {
    try {
        const fileStream = await read(fileName);
        var jsonBuffer = JSON.parse(fileStream);

        return jsonBuffer[name];
    } catch (e) {
        throw e;
    }

}

module.exports = init;
module.exports.read = read;
module.exports.readLines = readLines;
module.exports.readLine = readLine;
module.exports.write = write;
module.exports.updateConfig = updateConfigItem;
module.exports.getConfig = getConfigItem;

