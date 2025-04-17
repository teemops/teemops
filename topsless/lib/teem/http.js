/*
Helper functions for API Gateway response and request handling through to Lambda.
 */
function setResponse(data) {
    //code
    return response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
            // "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(data)
    };

}

/*
Helper functions for API Gateway response and request handling through to Lambda.
 */
function setResponseFile(data, type, size, name) {
    //code
    return response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": type,
            "Content-Length": size,
            "Content-Disposition": "attachment; filename=\"" + name + "\""
        },
        body: data
    };

}

//returns a request event object that has been parsed from JSON.parse
function getRequest(event) {
    //code
    return request = {
        headers: event.headers,
        body: JSON.parse(event.body)
    };
}


function setErrorResponse(data, code = 500) {
    //code
    return response = {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*"
            // "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(data)
    };

}

module.exports = getRequest;
module.exports.req = getRequest;
module.exports.res = setResponse;
module.exports.resFile = setResponseFile;
module.exports.err = setErrorResponse;