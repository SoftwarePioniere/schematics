let exec = require('child_process').exec;
let fs = require('fs');
let rimraf = require('rimraf');
const makeDir = require('make-dir');
let request = require('request');
let targetpath = "client-ngrx";
let isDev = false;
let schematicCollection = "@softwarepioniere/schematics";
let sourceConfig = "swagger-sources.json";

let xurl = process.env.xurl;
console.log(':: xurl:', xurl);

// ARGV
let x = process.argv.slice(2);
if (x.length > 0) {
    schematicCollection = x[0];
}
if (x.length > 1) {
    sourceConfig = x[1];
}

const generateIndex = function (targetpath, clientname) {
    console.log('generateIndex', targetpath, clientname);

    // generate index for client
    exec('schematics ' + schematicCollection + ':generate-index --sourcepath=src/' + targetpath + '/' + clientname + ' --debug=false', function (error, stdout, stderr) {
        console.log('Generate ' + clientname + ' index.ts')
        if (stdout) {
            console.info(stdout + '... ' + clientname + ' done! 💪\n');
        }

        if (stderr) {
            console.error(stderr + '💩\n');
        }

        if (error) {
            console.error(error + '... failed! 💩\n');
            throw error;
        }
    });

}

const generateGetCallbacks = function (api, clientname, callbacks) {
    console.log('generateGetCallbacks', clientname);

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

            let requestParams = [];
            let responseParams = [];
            // let method = api.paths[variable].get.operationId.substr(3, api.paths[variable].get.operationId.length);
            let method = api.paths[variable].get.operationId;
            let group = api.paths[variable].get.tags[0];

            if (api.paths[variable].get.parameters != undefined) {
                if (isDev) {
                    console.log('\n' + variable);

                    // REQUEST
                    console.log('****** REQUEST PARAMS ******');
                }
                for (param in api.paths[variable].get.parameters) {
                    // Change integer => number
                    let valType = (api.paths[variable].get.parameters[param].type == 'integer') ? 'number' : api.paths[variable].get.parameters[param].type;
                    valType = (valType == 'string' && api.paths[variable].get.parameters[param].format == 'date-time') ? 'Date' : valType;
                    if (api.paths[variable].get.parameters[param].in == 'path') {
                        let required = (api.paths[variable].get.parameters[param].required) ? "" : "?";
                        let defaultValue = (api.paths[variable].get.parameters[param].default !== undefined) ? " = " + api.paths[variable].get.parameters[param].default : "";
                        let param1 = api.paths[variable].get.parameters[param].name + required + ':' + valType + defaultValue;

                        let result = param1.split('[');
                        if (result.length > 1) {
                            let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                            if(paramString.endsWith('= '))
                            {
                                paramString += null;
                            }
                            requestParams.push(paramString);
                            if (isDev) {
                                console.log(paramString + ' (in path)');
                            }
                        } else {
                            if(param1.endsWith('= '))
                            {
                                param1 += null;
                            }
                            requestParams.push(param1);
                            if (isDev) {
                                console.log(param1 + ' (in path)');
                            }
                        }
                    } else if (api.paths[variable].get.parameters[param].in == 'query') {
                        let required = (api.paths[variable].get.parameters[param].required) ? "" : "?";
                        let defaultValue = (api.paths[variable].get.parameters[param].default !== undefined) ? " = " + api.paths[variable].get.parameters[param].default : "";
                        let param1 = api.paths[variable].get.parameters[param].name + required + ':' + valType + defaultValue;

                        let result = param1.split('[');
                        if (result.length > 1) {
                            let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                            if(paramString.endsWith('= '))
                            {
                                paramString += null;
                            }
                            requestParams.push(paramString);
                            if (isDev) {
                                console.log(paramString + ' (in query)');
                            }
                        } else {
                            if(param1.endsWith('= '))
                            {
                                param1 += null;
                            }
                            requestParams.push(param1);
                            if (isDev) {
                                console.log(param1 + ' (in path)');
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
                        let type = api.paths[variable].get.responses[param].schema.type;

                        let result = type.split('[');
                        if (result.length > 1) {
                            let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                            if(paramString.endsWith('= '))
                            {
                                paramString += null;
                            }
                            responseParams.push(paramString);
                            if (isDev) {
                                console.log(paramString);
                            }
                        } else {
                            if(type.endsWith('= '))
                            {
                                type += null;
                            }
                            responseParams.push(type);
                            if (isDev) {
                                console.log(type);
                            }
                        }

                    } else if (api.paths[variable].get.responses[param].description == 'Success' && api.paths[variable].get.responses[param].schema != undefined && api.paths[variable].get.responses[param].schema.$ref != undefined) {
                        let ref = api.paths[variable].get.responses[param].schema.$ref.replace('#/definitions/', '');
                        let result = ref.split('[');
                        if (result.length > 1) {
                            let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                            if(paramString.endsWith('= '))
                            {
                                paramString += null;
                            }
                            responseParams.push(paramString);
                            if (isDev) {
                                console.log(paramString);
                            }
                        } else {
                            if(ref.endsWith('= '))
                            {
                                ref += null;
                            }
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
                console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '" --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '" --group="' + group + '" --actiontype=query --debug=false');
            }

            let x = {
                clientname: clientname,
                method: method,
                requestParams: requestParams,
                responseParams: responseParams,
                targetpath: targetpath,
                group: group,
                actiontype: 'query'
            };

            callbacks.push(x);

        }
    }
}

const generatePostCallbacks = function (api, clientname, callbacks) {
    console.log('generatePost', clientname);
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
            let requestParams = [];
            let responseParams = [];
            // let method = api.paths[variable].post.operationId.substr(4, api.paths[variable].post.operationId.length);
            let method = api.paths[variable].post.operationId;
            let group = api.paths[variable].post.tags[0];

            if (api.paths[variable].post.parameters != undefined) {
                if (isDev) {
                    console.log('\n' + variable);

                    // REQUEST
                    console.log('****** REQUEST PARAMS ******');
                }
                for (param in api.paths[variable].post.parameters) {
                    // PARAMS IN: path
                    if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'path') {
                        let param1 = api.paths[variable].post.parameters[param].name + ':' + api.paths[variable].post.parameters[param].type;
                        let result = param1.split('[');
                        if (result.length > 1) {
                            let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                            requestParams.push(paramString);
                            if (isDev) {
                                console.log(paramString + ' (PATH)');
                            }
                        } else {
                            requestParams.push(param1);
                            if (isDev) {
                                console.log(param1 + ' (PATH)');
                            }
                        }

                    }

                    // PARAMS IN: body
                    if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'body') {
                        if (api.paths[variable].post.parameters[param].schema.$ref != undefined) {
                            let param1 = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                            let result = param1.split('[');
                            if (result.length > 1) {
                                let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                                requestParams.push(paramString);
                                if (isDev) {
                                    console.log(paramString + ' (BODY)');
                                }
                            } else {
                                requestParams.push(param1);

                                if (isDev) {
                                    console.log(param1 + ' (BODY)');
                                }
                            }
                        } else {
                            // keine Referenz zu einem Model vorhanden, evtl. ist es nur ein String oder ähnliches
                            requestParams.push(api.paths[variable].post.parameters[param].schema);
                            console.log(api.paths[variable]);
                        }
                    }

                    // PARAMS IN: formData
                    if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'formData') {
                        if (api.paths[variable].post.parameters[param].schema && api.paths[variable].post.parameters[param].schema.$ref != undefined) {
                            let param1 = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                            let result = param1.split('[');
                            if (result.length > 1) {
                                let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                                requestParams.push(paramString);
                                if (isDev) {
                                    console.log(paramString + ' (formData)');
                                }
                            } else {
                                requestParams.push(param1);

                                if (isDev) {
                                    console.log(param1 + ' (formData)');
                                }
                            }
                        } else if(api.paths[variable].post.parameters[param].type) {
                            // keine Referenz zu einem Model vorhanden, evtl. ist es nur ein String oder ähnliches
                            if(api.paths[variable].post.parameters[param].type == 'file'){
                                requestParams.push('Blob');
                                console.log(api.paths[variable]);
                            } else {
                                requestParams.push(api.paths[variable].post.parameters[param].type);
                                console.log(api.paths[variable]);
                            }
                        }
                    }

                    // PARAMS IN: header
                    if (api.paths[variable].post.parameters[param] != undefined && api.paths[variable].post.parameters[param].in == 'header') {
                        if (api.paths[variable].post.parameters[param].schema && api.paths[variable].post.parameters[param].schema.$ref != undefined) {
                            let param1 = api.paths[variable].post.parameters[param].schema.$ref.replace('#/definitions/', '');
                            let result = param1.split('[');
                            if (result.length > 1) {
                                let paramString = result[0] + result[1].substr(0, result[1].length - 1);
                                requestParams.push(paramString);
                                if (isDev) {
                                    console.log(paramString + ' (header)');
                                }
                            } else {
                                requestParams.push(param1);

                                if (isDev) {
                                    console.log(param1 + ' (header)');
                                }
                            }
                        } else if(api.paths[variable].post.parameters[param].type) {
                            // keine Referenz zu einem Model vorhanden, evtl. ist es nur ein String oder ähnliches
                            if(api.paths[variable].post.parameters[param].type == 'file'){
                                requestParams.push('Blob');
                                console.log(api.paths[variable]);
                            } else {
                                requestParams.push(api.paths[variable].post.parameters[param].type);
                                console.log(api.paths[variable]);
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
                        let type = api.paths[variable].post.responses[param].schema.type;
                        responseParams.push(type);
                        if (isDev) {
                            console.log(type);
                        }
                    } else if (api.paths[variable].post.responses[param].description == 'Success' && api.paths[variable].post.responses[param].schema != undefined && api.paths[variable].post.responses[param].schema.$ref != undefined) {
                        let ref = api.paths[variable].post.responses[param].schema.$ref.replace('#/definitions/', '');
                        responseParams.push(ref);
                        if (isDev) {
                            console.log(ref);
                        }
                    }
                }
            }

            // RUN SCHEMATICS
            if (isDev) {
                console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '"  --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '"  --group="' + group + '" --actiontype=command --debug=false' );
            }

            let x = {
                clientname: clientname,
                method: method,
                group: group,
                requestParams: requestParams,
                responseParams: responseParams,
                targetpath: targetpath,
                group: group,
                actiontype: 'command'
            };

            callbacks.push(x);

        }

    }
}


function schematicsExec(parms, i, total, cb, useNgrxManager = false) {
    console.log('schematicsExec', parms, i, total);

    let clientname = parms.clientname;
    let method = parms.method;
    let group = parms.group;
    let requestParams = parms.requestParams;
    let responseParams = parms.responseParams;
    let targetpath = parms.targetpath;
    let actiontype = parms.actiontype;

    // RUN SCHEMATICS
    if (isDev) {
        console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '" --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '" --group="' + group + '" --actiontype="' + actiontype + '" --debug=false --useNgrxManager=' + useNgrxManager.toString());
    }

    exec('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '"  --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '" --group="' + group + '" --actiontype=' + actiontype + '  --debug=false --useNgrxManager=' + useNgrxManager.toString(), function (error, stdout, stderr) {
        if (stdout) {
            console.info(stdout + '... done! 💪\n');
        }

        if (error) {
            console.error(error + '...failed! 💩\n -- try Again')
            schematicsExecAgain(parms, i, total, cb, useNgrxManager);
        }
        else{

            if (stderr) {
                console.error(stderr + '💩\n');
            }

            if (isDev) {
                console.log("_____________________________________________________________________");
            }

            cb(error, "finished: " + clientname + ' / ' + method + ' / ' + group + '/' + actiontype );

        }


    });

    // cb();
}


function schematicsExecAgain(parms, i, total, cb, useNgrxManager = false) {
    console.log('schematicsExec', parms, i, total);

    let clientname = parms.clientname;
    let method = parms.method;
    let group = parms.group;
    let requestParams = parms.requestParams;
    let responseParams = parms.responseParams;
    let targetpath = parms.targetpath;
    let actiontype = parms.actiontype;

    // RUN SCHEMATICS
    if (isDev) {
        console.log('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '" --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '" --group="' + group + '" --actiontype="' + actiontype + '" --debug=false --useNgrxManager=' + useNgrxManager.toString());
    }

    exec('schematics ' + schematicCollection + ':swagger-ngrx --clientname="' + clientname + '"  --method="' + method + '" --service="' + group + '" --requestparams="' + requestParams.join(',').replace(/\?/g, '') + '"  --responseparams="' + responseParams.join(',').replace(/\?/g, '') + '" --targetpath="' + targetpath + '" --group="' + group + '" --actiontype="' + actiontype + '"  --debug=false --useNgrxManager=' + useNgrxManager.toString(), function (error, stdout, stderr) {
        if (stdout) {
            console.info(stdout + '... done! 💪\n');
        }

        if (error) {
            console.error(error + '...failed! 💩\n')
        }

        if (stderr) {
            console.error(stderr + '💩\n');
        }

        if (isDev) {
            console.log("_____________________________________________________________________");
        }

        cb(error, "finished: " + clientname + ' / ' + method + ' / ' + group + '/' + actiontype );
    });

    // cb();
}


function generateClient(clientname, url, useNgrxManager) {
    console.log('generateClient', clientname, url);
    url = url.replace('{{XURL}}', xurl);

    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let api = JSON.parse(body);

            // const indexGen = function( targetpath, clientname, ) ;

            let callbacks = new Array();

            generatePostCallbacks(api, clientname, callbacks, useNgrxManager);
            generateGetCallbacks(api, clientname, callbacks, useNgrxManager);

            let total = callbacks.length;
            console.log('total callbacks: ', total);

            let fin = 0;

            let callFinished = function (err, infotext) {
                if (err) {
                    console.error(err);
                    throw err;
                }

                fin++;
                console.log('finished: ', fin, infotext);
                if (total == fin) {
                    console.log('alle finished');
                    generateIndex(targetpath, clientname);
                }
            }

            let i = 1;
            callbacks.forEach(parms => {
                console.log("durchgang", i, "/", total);
                schematicsExec(parms, i, total, callFinished, useNgrxManager);
                i++;
            });
        }
    });
}


function readSwaggerSources() {
    console.log('readSwaggerSources');
    let file = fs.readFile(sourceConfig, "utf8", function (err, data) {
        if (err)
        {
            console.error(err);
            throw err;
        }

        let clients = JSON.parse(data);

        data = data.split("\n");
        console.log('Start generate: please wait ...');

        for (let client in clients) {

            let clientname = clients[client].name;
            let path = 'src/' + targetpath + '/' + clientname;
            console.log('creating folder', path);

            makeDir(path).then(createdPath => {
                console.log("... folder " + createdPath + " created! 💪");

                generateClient(clientname, clients[client].url, clients[client].useNgrxManager);
            });



        }
    });
}

function build() {
    console.log('build');
    if (schematicCollection == ".") {
        console.log("running build...");
        exec('npm run build', function (error, stdout, stderr) {
            if (error) {
                console.log(error + '...failed! 💩\n');
                throw error;
            } else {
                console.log("... build finished! 💪\n");
                readSwaggerSources();
            }
        });
    } else {
        readSwaggerSources();
    }
}

function removeTargetpath() {
    console.log('removeTargetpath');
    console.log("Delete folder " + targetpath + "...");
    rimraf('src/' + targetpath, function (error, stdout, stderr) {
        if (error) {
            console.log(error + '... failed! 💩')
            throw error;
        } else {
            console.log("... folder " + targetpath + " deleted! 💪");

            makeDir('src/' + targetpath).then(path => {
                console.log("... folder " + path + " created! 💪");

                build();
            });


        }
    });
}

removeTargetpath();
