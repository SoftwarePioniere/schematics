var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request');
var targetpath = "ngrx-client";
var clientFilesToGenerate = new Array();
var isDev = false;

function generateIndex(targetpath, clientname, cnt) {
    if (cnt == clientFilesToGenerate[clientname]) {
        // generate index for client
        // console.log('schematics .:generate-index --sourcepath=src/' + targetpath + '/' + clientname + ' --debug=false');
        console.log('Generate ' + clientname + ' index.ts file for ' + clientFilesToGenerate[clientname] + ' files...')
        exec('schematics .:generate-index --sourcepath=src/' + targetpath + '/' + clientname + ' --debug=false', function (error, stdout, stderr) {
            if (error) {
                console.log('...failed! 💩')
                console.log(error);
            }
            console.log('... ' + clientname + ' done! 💪')
        });
    }
}

function generateClient(clientname, url) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var api = JSON.parse(body);
            var cnt = 0;
            var cntGetPost = 0;

            for (variable in api.paths) {
                cntGetPost++;
            }
            clientFilesToGenerate[clientname] = cntGetPost;

            if(isDev){
                console.log("\n------------");
                console.log("GET");
                console.log("------------");
            }
            for (variable in api.paths) {
                if (api.paths[variable].get != undefined) {
                    if(isDev) {
                        console.log(api.paths[variable].get);
                    }

                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].get.operationId.substr(3, api.paths[variable].get.operationId.length);
                    var method = api.paths[variable].get.operationId;
                    var group = api.paths[variable].get.tags[0];

                    if (api.paths[variable].get.parameters != undefined) {
                        if(isDev) {
                            console.log('\n' + variable);

                            // REQUEST
                            console.log('****** REQUEST PARAMS ******');
                        }
                        for (param in api.paths[variable].get.parameters) {
                            if (api.paths[variable].get.parameters[param].in == 'path') {
                                var param = api.paths[variable].get.parameters[param].name + ':' + api.paths[variable].get.parameters[param].type;
                                requestParams.push(param);
                                if(isDev) {
                                    console.log(param + ' (PATH)');
                                }
                            }
                        }
                    }

                    // RESPONSE
                    if(isDev) {
                        console.log('****** RESPONSE PARAMS ******');
                    }
                    if (api.paths[variable].get.responses != undefined) {
                        for (param in api.paths[variable].get.responses) {
                            if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].get.responses[param].schema.type;
                                responseParams.push(type);
                                if(isDev) {
                                    console.log(type);
                                }
                            } else if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].get.responses[param].schema.$ref.replace('#/definitions/', '');
                                responseParams.push(ref);
                                if(isDev) {
                                    console.log(ref);
                                }
                            }
                        }
                    }

                    // RUN SCHEMATICS
                    if(isDev) {
                        console.log('schematics .:swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + ' --group=' + group + ' --actiontype=query --debug=false');
                    }
                    exec('schematics .:swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + ' --group=' + group + ' --actiontype=query --debug=false', function (error, stdout, stderr) {
                        if (error) {
                            console.log('...failed! 💩')
                            console.log(error);
                        }
                        console.log('... ' + method + ' done! 💪')
                        cnt++;
                        generateIndex(targetpath, clientname, cnt);
                    });
                    if(isDev) {
                        console.log("_____________________________________________________________________");
                    }
                }
            }

            if(isDev) {
                console.log("\n------------");
                console.log("POST");
                console.log("------------");
            }
            for (variable in api.paths) {
                if (api.paths[variable].post != undefined) {
                    if(isDev) {
                        console.log(api.paths[variable].post);
                    }
                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].post.operationId.substr(4, api.paths[variable].post.operationId.length);
                    var method = api.paths[variable].post.operationId;
                    var group = api.paths[variable].post.tags[0];

                    if (api.paths[variable].post.parameters != undefined) {
                        if(isDev) {
                            console.log('\n' + variable);

                            // REQUEST
                            console.log('****** REQUEST PARAMS ******');
                        }
                        for (param in api.paths[variable].post.parameters) {
                            if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'path') {
                                var param = api.paths[variable].post.parameters[param].name + ':' + api.paths[variable].post.parameters[param].type;
                                requestParams.push(param);
                                if(isDev) {
                                    console.log(param + ' (PATH)');
                                }
                            }
                            if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'body') {
                                var param = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                                requestParams.push(param);
                                if(isDev) {
                                    console.log(param + ' (BODY)');
                                }
                            }
                        }


                    }
                    // RESPONSE
                    if(isDev) {
                        console.log('****** RESPONSE PARAMS ******');
                    }
                    if (api.paths[variable].post.responses != undefined) {
                        for (param in api.paths[variable].post.responses) {
                            if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].post.responses[param].schema.type;
                                responseParams.push(type);
                                if(isDev) {
                                    console.log(type);
                                }
                            } else if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].post.responses[param].schema.$ref.replace('#/definitions/', '');
                                responseParams.push(ref);
                                if(isDev) {
                                    console.log(ref);
                                }
                            }
                        }
                    }


                    // RUN SCHEMATICS
                    if(isDev) {
                        console.log('schematics .:swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + '  --group=' + group + ' --actiontype=command --debug=false');
                    }
                    exec('schematics .:swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + '  --targetpath=' + targetpath + '  --group=' + group + ' --actiontype=command --debug=false', function (error, stdout, stderr) {
                        if (error) {
                            console.log('...failed! 💩')
                            console.log(error);
                        }
                        console.log('...' + method + 'done! 💪')
                        cnt++;
                        generateIndex(targetpath, clientname, cnt);
                    });
                    if(isDev) {
                        console.log("_____________________________________________________________________");
                    }
                }
            }
        }
    });
}


function readSwaggerSources() {
    var file = fs.readFile('swagger-sources.json', "utf8", function (err, data) {
        if (err) throw err;

        var clients = JSON.parse(data);

        data = data.split("\n");
        for (var client in clients) {
            generateClient(clients[client].name, clients[client].url);
            console.log(clients[client]);
        }
    });
}

function build() {
    console.log("running build...");
    exec('npm run build', function (error, stdout, stderr) {
        if (error) {
            console.log('...failed! 💩')
            console.log(error);
        } else {
            console.log("...build finished! 💪");
            readSwaggerSources();
        }
    });
}

function removeTargetpath() {
    console.log("Delete folder " + targetpath + "...");
    exec('rm -rf src/' + targetpath, function (error, stdout, stderr) {
        if (error) {
            console.log('...failed! 💩')
            console.log(error);
        } else {
            console.log("...folder " + targetpath + " deleted! 💪");
            build();
        }
    });
}

removeTargetpath();