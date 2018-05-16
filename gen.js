var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request');


function generateClient(clientname, url) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var api = JSON.parse(body);


            console.log("\n------------")
            console.log("GET")
            console.log("------------")
            for (variable in api.paths) {
                if (api.paths[variable].get != undefined) {
                    console.log(api.paths[variable].get);
                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].get.operationId.substr(3, api.paths[variable].get.operationId.length);
                    var method = api.paths[variable].get.operationId;
                    var group = api.paths[variable].get.tags[0];

                    if (api.paths[variable].get.parameters != undefined) {
                        console.log('\n' + variable);

                        // REQUEST
                        console.log('****** REQUEST PARAMS ******');
                        for (param in api.paths[variable].get.parameters) {
                            if (api.paths[variable].get.parameters[param].in == 'path') {
                                var param = api.paths[variable].get.parameters[param].name + ':' + api.paths[variable].get.parameters[param].type;
                                requestParams.push(param);
                                console.log(param + ' (PATH)');
                            }
                        }
                    }

                    // RESPONSE
                    console.log('****** RESPONSE PARAMS ******');
                    if (api.paths[variable].get.responses != undefined) {
                        for (param in api.paths[variable].get.responses) {
                            if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].get.responses[param].schema.type;
                                console.log(type);
                                responseParams.push(type);
                            } else if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].get.responses[param].schema.$ref.replace('#/definitions/', '');
                                console.log(ref);
                                responseParams.push(ref);
                            }
                        }
                    }

                    // RUN SCHEMATICS
                    console.log('schematics .:swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=ngrx-client --group=' + group + ' --actiontype=query --debug=false');
                    exec('schematics .:swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=ngrx-client --group=' + group + ' --actiontype=query --debug=false', function (error, stdout, stderr) {
                        if (error) {
                            console.log(error);
                        }
                    });
                    console.log("_____________________________________________________________________");
                }
            }


            console.log("\n------------")
            console.log("POST")
            console.log("------------")
            for (variable in api.paths) {
                if (api.paths[variable].post != undefined) {
                    console.log(api.paths[variable].post);
                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].post.operationId.substr(4, api.paths[variable].post.operationId.length);
                    var method = api.paths[variable].post.operationId;
                    var group = api.paths[variable].post.tags[0];

                    if (api.paths[variable].post.parameters != undefined) {
                        console.log('\n' + variable);

                        // REQUEST
                        console.log('****** REQUEST PARAMS ******');
                        for (param in api.paths[variable].post.parameters) {

                            if (api.paths[variable].post.parameters[param].in == 'path') {
                                var param = api.paths[variable].post.parameters[param].name + ':' + api.paths[variable].get.parameters[param].type;
                                requestParams.push(param);
                                console.log(param + ' (PATH)');
                            }
                            if (api.paths[variable].post.parameters[param].in == 'body') {
                                var param = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                                requestParams.push(param);
                                console.log(param + ' (BODY)');
                            }
                        }


                    }
                    // RESPONSE
                    console.log('****** RESPONSE PARAMS ******');
                    if (api.paths[variable].post.responses != undefined) {
                        for (param in api.paths[variable].post.responses) {
                            if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].post.responses[param].schema.type;
                                console.log(type);
                                responseParams.push(type);
                            } else if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].post.responses[param].schema.$ref.replace('#/definitions/', '');
                                console.log(ref);
                                responseParams.push(ref);
                            }
                        }
                    }


                    // RUN SCHEMATICS
                    console.log('schematics .:swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=ngrx-client  --group=' + group + ' --actiontype=command --debug=false');
                    exec('schematics .:swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + '  --targetpath=ngrx-client  --group=' + group + ' --actiontype=command --debug=false', function (error, stdout, stderr) {
                        if (error) {
                            console.log(error);
                        }
                    });
                    console.log("_____________________________________________________________________");
                }
            }

        }
    });
}

var file = fs.readFile('swagger-sources.json', "utf8", function (err, data) {
    if (err) throw err;

    var clients = JSON.parse(data);

    data = data.split("\n");
    for (var client in clients) {
        generateClient(clients[client].name, clients[client].url);
        console.log(clients[client]);
    }
});