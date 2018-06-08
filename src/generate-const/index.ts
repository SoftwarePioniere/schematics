import {
    Rule,
    apply,
    chain,
    mergeWith,
    template,
    url
} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';

interface constant {
    name: string,
    value: string
}

export default function (options: any): Rule {
    // let constants = options.constants.split(',');
    let constants: any = [];
    let tmp = options.constants.split(',');
    tmp.forEach(function (x:any) {
        let constString = x.split(':');
        if(constString.length>1){
            // name and value is set
            constants.push(<constant>{name: strings.underscore(constString[0]).toUpperCase().replace(/\./gi,'_'), value: constString[1]})
        }else{
            // only value is set
            constants.push(<constant>{name: strings.underscore(constString[0]).toUpperCase().replace(/\./gi,'_'), value: constString[0]})
        }
    });


    return chain([
        mergeWith(apply(url('./files'), [
            template({
                classify: strings.classify,
                dasherize: strings.dasherize,
                underscore: strings.underscore,
                titel: options.titel,
                targetpath: options.targetpath,
                namespace: options.namespace,
                constants: constants
            }),
        ])),
    ]);
}