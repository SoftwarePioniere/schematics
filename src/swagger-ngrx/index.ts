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
    let useNgrxManager = (options.useNgrxManager != undefined && options.useNgrxManager == 'true') ? true : false;

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
        responseparams = parseParamsForResponse(options.responseparams);
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
            apiIsUsed: apiIsUsed,
            useNgrxManager: useNgrxManager
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
            result.push(' public ' + parsePropertyName(paramValueArray[0]) + ':' + paramValueArray[1] + ' ');
        } else {
            // Model
            if (paramArray[param].trim() == 'string' || paramArray[param].trim() == 'number' || paramArray[param].trim() == 'integer' || paramArray[param].trim() == 'Date' || paramArray[param].trim() == 'Blob') {
                result.push('public ' + parsePropertyName(paramArray[param]) + ': ' + paramArray[param]);
            } else if (!paramArray[param].includes('array')) {
                result.push('public ' + parsePropertyName(paramArray[param]) + ': api.' + paramArray[param]);
            } else {
                result.push('public payload: ' + paramArray[param]);
            }

        }
    }
    return result.join(', ');
}

export function parseParamsForResponse(params: string) {
    let result: Array<string> = [];
    let paramArray = params.split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type
            result.push(' public ' + parsePropertyName(paramValueArray[0]) + ':' + paramValueArray[1] + ' ');
        } else {
            // Model
            if (paramArray[param].trim() == 'string' || paramArray[param].trim() == 'number' || paramArray[param].trim() == 'integer' || paramArray[param].trim() == 'Date' || paramArray[param].trim() == 'Blob') {
                result.push('public payload: ' + paramArray[param]);
            } else if (!paramArray[param].includes('array')) {
                result.push('public payload: api.' + paramArray[param]);
            } else {
                let paramString = paramArray[param]
                result.push('public payload: ' + paramString.charAt(0).toUpperCase() + paramString.slice(1));
            }

        }
    }
    return result.join(', ');
}

export function parseParamsToVariableNames(params: string) {
    let result: Array<string> = [];
    let paramArray = params.replace(/\?/gi, '').split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type
            result.push('x.' + parsePropertyName(paramValueArray[0]));
        } else {
            // Model
            result.push('x.' + parsePropertyName(paramArray[param]));
        }
    }
    return result.join(', ');
}

export function genrateIdentifierString(params: string) {
    let result: Array<string> = [];
    let paramArray = params.replace(/\?/gi, '').split(',');
    for (let param in paramArray) {
        let paramValueArray = paramArray[param].split(':');
        if (paramValueArray.length > 1) {
            // variablename:type alles nur kein Date
            if(paramArray[param].trim() !== 'Date') {
                result.push('x.' + parsePropertyName(paramValueArray[0]));
            }
        } else {
            // Model
            result.push('x.' + parsePropertyName(paramArray[param]));
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

export function parsePropertyName(propertyName: string) {
    let newPropertyName = propertyName.substr(0, 1).toLowerCase() + propertyName.substr(1, propertyName.length);
    newPropertyName = newPropertyName.replace('-', '');
    newPropertyName = newPropertyName.replace('_', '');

    let nameBlacklist = [
        // JavaScript Objects, Properties, and Methods
        'Number', 'String', 'Array',
        // 'Date', 'eval', 'function', 'hasOwnProperty', 'Infinity', 'isFinite', 'isNaN', 'isPrototypeOf', 'length', 'Math', 'NaN', 'name',  'Object', 'prototype',  'toString', 'undefined', 'valueOf',
        // JavaScript Reserved Words
        'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'
    ];
    const searchResult = nameBlacklist.find(x => x.toLowerCase() === propertyName.toLowerCase());

    if(searchResult){
        // return newPropertyName + 'Payload';
        return 'payload';
    }
    return newPropertyName;
}
