var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request');
var targetpath = "client-ngrx";
var clientFilesToGenerate = new Array();
var isDev = false;
var schematicCollection = "@softwarepioniere/schematics";
var sourceConfig = "swagger-sources.json";


// ARGV
var x = process.argv.slice(2);
if(x.length>0){
    schematicCollection = x[0];
}
if(x.length>1){
    sourceConfig = x[1];
}

function generateIndex(targetpath, clientname, cnt) {
    if (cnt == clientFilesToGenerate[clientname]) {
        // generate index for client
        exec('schematics ' + schematicCollection + ':generate-index --sourcepath=src/' + targetpath + '/' + clientname + ' --debug=false', function (error, stdout, stderr) {
            console.log('Generate ' + clientname + ' index.ts file for ' + clientFilesToGenerate[clientname] + ' files...')
            if(stdout){
                console.info(stdout + '... ' + clientname + ' done! 💪\n');
            }

            if(stderr){
                console.error(stderr + '💩\n');
            }

            if (error) {
                console.error(error + '... failed! 💩\n');
            }
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

            if (isDev) {
                console.log("\n------------");
                console.log("GET");
                console.log("------------");
            }
            for (variable in api.paths) {
                if (api.paths[variable].get != undefined) {
                    if (isDev) {
                        console.log(api.paths[variable].get);
                    }

                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].get.operationId.substr(3, api.paths[variable].get.operationId.length);
                    var method = api.paths[variable].get.operationId;
                    var group = api.paths[variable].get.tags[0];

                    if (api.paths[variable].get.parameters != undefined) {
                        if (isDev) {
                            console.log('\n' + variable);

                            // REQUEST
                            console.log('****** REQUEST PARAMS ******');
                        }
                        for (param in api.paths[variable].get.parameters) {
                            if (api.paths[variable].get.parameters[param].in == 'path') {
                                let param = api.paths[variable].get.parameters[param].name + ':' + api.paths[variable].get.parameters[param].type;

                                let result = param.split('[');
                                if (result.length > 1) {
                                    let paramString = result[0] + result[1].substr(0,result[1].length - 1);
                                    requestParams.push(paramString);
                                    if (isDev) {
                                        console.log(paramString + ' (PATH)');
                                    }
                                } else {
                                    requestParams.push(param);
                                    if (isDev) {
                                        console.log(param + ' (PATH)');
                                    }
                                }

                            }
                        }
                    }

                    // RESPONSE
                    if (isDev) {
                        console.log('****** RESPONSE PARAMS ******');
                    }
                    if (api.paths[variable].get.responses != undefined) {
                        for (param in api.paths[variable].get.responses) {
                            if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].get.responses[param].schema.type;

                                let result = type.split('[');
                                if (result.length > 1) {
                                    let paramString = result[0] + result[1].substr(0,result[1].length - 1);
                                    responseParams.push(paramString);
                                    if (isDev) {
                                        console.log(paramString);
                                    }
                                } else {
                                    responseParams.push(type);
                                    if (isDev) {
                                        console.log(type);
                                    }
                                }

                            } else if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].get.responses[param].schema.$ref.replace('#/definitions/', '');
                                let result = ref.split('[');
                                if (result.length > 1) {
                                    let paramString = result[0] + result[1].substr(0,result[1].length - 1);
                                    responseParams.push(paramString);
                                    if (isDev) {
                                        console.log(paramString);
                                    }
                                } else {
                                    responseParams.push(ref);
                                    if (isDev) {
                                        console.log(ref);
                                    }
                                }

                            }
                        }
                    }

                    // RUN SCHEMATICS
                    if (isDev) {
                        console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + ' --group=' + group + ' --actiontype=query --debug=false');
                    }
                    exec('schematics ' + schematicCollection + ':swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + ' --group=' + group + ' --actiontype=query --debug=false', function (error, stdout, stderr) {
                        if(stdout){
                            console.info(stdout + '... done! 💪\n');
                        }

                        if (error) {
                            console.error(error + '...failed! 💩\n')
                        }

                        if(stderr){
                            console.error(stderr + '💩\n');
                        }
                        cnt++;
                        generateIndex(targetpath, clientname, cnt);
                    });
                    if (isDev) {
                        console.log("_____________________________________________________________________");
                    }
                }
            }

            if (isDev) {
                console.log("\n------------");
                console.log("POST");
                console.log("------------");
            }
            for (variable in api.paths) {
                if (api.paths[variable].post != undefined) {
                    if (isDev) {
                        console.log(api.paths[variable].post);
                    }
                    var requestParams = [];
                    var responseParams = [];
                    // var method = api.paths[variable].post.operationId.substr(4, api.paths[variable].post.operationId.length);
                    var method = api.paths[variable].post.operationId;
                    var group = api.paths[variable].post.tags[0];

                    if (api.paths[variable].post.parameters != undefined) {
                        if (isDev) {
                            console.log('\n' + variable);

                            // REQUEST
                            console.log('****** REQUEST PARAMS ******');
                        }
                        for (param in api.paths[variable].post.parameters) {
                            if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'path') {
                                var param = api.paths[variable].post.parameters[param].name + ':' + api.paths[variable].post.parameters[param].type;
                                let result = param.split('[');
                                if (result.length > 1) {
                                    let paramString = result[0] + result[1].substr(0,result[1].length - 1);
                                    requestParams.push(paramString);
                                    if (isDev) {
                                        console.log(paramString + ' (PATH)');
                                    }
                                } else {
                                    requestParams.push(param);
                                    if (isDev) {
                                        console.log(param + ' (PATH)');
                                    }
                                }

                            }
                            if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'body') {
                                var param = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                                let result = param.split('[');
                                if (result.length > 1) {
                                    let paramString = result[0] + result[1].substr(0,result[1].length - 1);
                                    requestParams.push(paramString);
                                    if (isDev) {
                                        console.log(paramString + ' (BODY)');
                                    }
                                } else {
                                    requestParams.push(param);

                                    if (isDev) {
                                        console.log(param + ' (BODY)');
                                    }
                                }

                            }
                        }


                    }
                    // RESPONSE
                    if (isDev) {
                        console.log('****** RESPONSE PARAMS ******');
                    }
                    if (api.paths[variable].post.responses != undefined) {
                        for (param in api.paths[variable].post.responses) {
                            if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.type != undefined) {
                                var type = api.paths[variable].post.responses[param].schema.type;
                                responseParams.push(type);
                                if (isDev) {
                                    console.log(type);
                                }
                            } else if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.$ref != undefined) {
                                var ref = api.paths[variable].post.responses[param].schema.$ref.replace('#/definitions/', '');
                                responseParams.push(ref);
                                if (isDev) {
                                    console.log(ref);
                                }
                            }
                        }
                    }


                    // RUN SCHEMATICS
                    if (isDev) {
                        console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname=' + clientname + '  --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + ' --targetpath=' + targetpath + '  --group=' + group + ' --actiontype=command --debug=false');
                    }
                    exec('schematics ' + schematicCollection + ':swagger-ngrx --clientname=' + clientname + ' --method=' + method + ' --service=' + group + ' --requestparams=' + requestParams.join(',') + '  --responseparams=' + responseParams.join(',') + '  --targetpath=' + targetpath + '  --group=' + group + ' --actiontype=command --debug=false', function (error, stdout, stderr) {
                        if(stdout){
                            console.info(stdout + '... done! 💪\n');
                        }

                        if (error) {
                            console.error(error + '... failed! 💩\n')
                        }

                        if(stderr){
                            console.error(stderr + '💩\n');
                        }


                        cnt++;
                        generateIndex(targetpath, clientname, cnt);
                    });
                    if (isDev) {
                        console.log("_____________________________________________________________________");
                    }
                }
            }
        }
    });
}


function readSwaggerSources() {
    var file = fs.readFile(sourceConfig, "utf8", function (err, data) {
        if (err) throw err;

        var clients = JSON.parse(data);

        data = data.split("\n");
        console.log('Start generate: please wait ...');
        for (var client in clients) {
            generateClient(clients[client].name, clients[client].url);
            console.log(clients[client]);
        }
    });
}

function build() {
    if(schematicCollection == "."){
        console.log("running build...");
        exec('npm run build', function (error, stdout, stderr) {
            if (error) {
                console.log(error + '...failed! 💩\n');
            } else {
                console.log("... build finished! 💪\n");
                readSwaggerSources();
            }
        });
    }else{
        readSwaggerSources();
    }
}

function removeTargetpath() {
    console.log("Delete folder " + targetpath + "...");
    exec('rm -rf src/' + targetpath, function (error, stdout, stderr) {
        if (error) {
            console.log(error + '... failed! 💩')
        } else {
            console.log("... folder " + targetpath + " deleted! 💪");
            build();
        }
    });
}

removeTargetpath();