import {apply, chain, mergeWith, Rule, template, url,} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';


export default function (options: any): Rule {
    let actions: Array<any> = [];
    let requestparams: string = '';
    let responseparams: string = '';
    let optPayload: string = ''; // Um beim normalen Request auch noch das komplette Objekt mitgeben zu können
    let requestparamsVariableNames: string = '';
    let requestparamsVariableIdentifier: string = '';
    let responseparamsVariableNames: string = '';
    let requestparamsVariableNamesSucceed: string = '';
    let methodWithoutType: string = options.method.replace('Post', '').replace('Get', '');
    let importpath = '../';
    let method = options.method.substr(0, 1).toLowerCase() + options.method.substr(1, options.method.length);
    let group = (options.group != undefined) ? '/' + options.group : '';
    let service = options.service;
    let apiIsUsed: boolean;

    if (options.targetpath != "" && options.targetpath != undefined) {
        let folders = options.targetpath.match(/\//g);
        if (folders != null) {
            // mindestens ein Slash vorhanden
            for (let i = 0; i <= folders.length; i++) {
                importpath += '../';
            }
        } else {
            // Kein Slash vorhanden
            importpath += '../';
        }
        if (options.group != undefined && options.group != "") {
            importpath += '../';
        }
    }

    if (options.requestparams) {
        requestparams = parseParams(options.requestparams);
    }
    if (options.responseparams) {
        responseparams = parseParams(options.responseparams);
    }

    if (options.requestparams) {
        requestparamsVariableNames = parseParamsToVariableNames(options.requestparams);
        requestparamsVariableNamesSucceed = parseParamsVariableNamesSucceed(requestparamsVariableNames);
        requestparamsVariableIdentifier = genrateIdentifierString(options.requestparams);
    }
    if (options.responseparams) {
        responseparamsVariableNames = parseParamsToVariableNames(options.responseparams);
    }

    optPayload = 'public optPayload: any = null';
    apiIsUsed = apiUsed(requestparams, responseparams);

    actions.push(mergeWith(apply(url('./files'), [
        template({
            classify: strings.classify,
            dasherize: strings.dasherize,
            underscore: strings.underscore,
            camelize: strings.camelize,

            INDEX: options.index,
            clientname: options.clientname.toLowerCase(),
            method: method,
            methodWithoutType: methodWithoutType,
            requestparams: requestparams,
            responseparams: responseparams,
            optPayload: optPayload,
            requestparamsVariableIdentifier: requestparamsVariableIdentifier,
            requestparamsVariableNames: requestparamsVariableNames,
            requestparamsVariableNamesSucceed: requestparamsVariableNamesSucceed,
            responseparamsVariableNames: responseparamsVariableNames,
            targetpath: options.targetpath,
            importpath: importpath,
            actiontype: options.actiontype,
            group: group,
            service: service,
            apiIsUsed: apiIsUsed
        }),
    ])));

    return chain(actions);
}

export function parseParams(params: string) {
    let result: Array<string> = [];
    let paramArray = params.split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type
            result.push('public ' + paramArray[param]);
        } else {
            // Model
            if (paramArray[param].trim() == 'string' || paramArray[param].trim() == 'number' || paramArray[param].trim() == 'integer' || paramArray[param].trim() == 'Date') {
                result.push('public ' + paramArray[param].substr(0, 1).toLowerCase() + paramArray[param].substr(1, paramArray[param].length) + ': ' + paramArray[param]);
            } else if (paramArray[param] != 'array') {
                result.push('public ' + paramArray[param].substr(0, 1).toLowerCase() + paramArray[param].substr(1, paramArray[param].length) + ': api.' + paramArray[param]);
            } else {
                result.push('public ' + paramArray[param].substr(0, 1).toLowerCase() + paramArray[param].substr(1, paramArray[param].length) + ': Array<any>');
            }

        }
    }
    return result.join(',');
}

export function parseParamsToVariableNames(params: string) {
    let result: Array<string> = [];
    let paramArray = params.replace(/\?/gi, '').split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type
            result.push('x.' + paramValueArray[0]);
        } else {
            // Model
            result.push('x.' + paramArray[param].substr(0, 1).toLowerCase() + paramArray[param].substr(1, paramArray[param].length));
        }
    }
    return result.join(',');
}

export function genrateIdentifierString(params: string) {
    // let items = params.split(',');


    let result: Array<string> = [];
    let paramArray = params.replace(/\?/gi, '').split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type alles nur kein Date
            if(paramArray[param].trim() !== 'Date') {
                result.push('x.' + paramValueArray[0]);
            }
        } else {
            // Model
            result.push('x.' + paramArray[param].substr(0, 1).toLowerCase() + paramArray[param].substr(1, paramArray[param].length));
        }
    }

    return ' + ' + result.join(' + ').replace(/'/g, '');
}

export function parseParamsVariableNamesSucceed(params: string) {
    let check = params.match(/,/g);
    if (check != null && check.length > 0) {
        return '[' + params + ']';
    }
    return params;
}

export function apiUsed(requestParams: string, responseParams: string) {
    let checkString: string = (requestParams != null) ? requestParams : "";
    checkString += (responseParams != null) ? responseParams : "";
    return (checkString.match(/api./g) != null);
}
