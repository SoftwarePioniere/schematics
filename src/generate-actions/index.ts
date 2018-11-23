import {
    Rule,
    Tree,
    SchematicContext,
    FileEntry,
    chain,
    template,
    url,
    apply,
    mergeWith,
    MergeStrategy
} from '@angular-devkit/schematics';
import {strings} from "@angular-devkit/core";

function gen(options: any, src: FileEntry): Rule {
    var rule: Rule;
    var fileContent = JSON.parse(src.content.toString());
    var filePath = src.path.split('/');
    var targetPath = src.path.replace(filePath[filePath.length - 1], '');

    //-ui -actions => .ui .actions
    var newPostfix = options.postfix.replace('-','.');
    // xxx-ui.json => xxx.ui.json
    var filename = filePath[filePath.length - 1].replace(options.postfix, newPostfix);
    var filenameSplit = filename.split('.');
    // xxx.ui.json => xxx.ui
    var newFilename = filename.replace('.' + filenameSplit[filenameSplit.length -1], '');
    rule = mergeWith(apply(url('./files'), [
        template({
            classify: strings.classify,
            dasherize: strings.dasherize,
            underscore: strings.underscore,
            camelize: strings.camelize,

            INDEX: options.index,
            targetpath: targetPath,
            fileContent: fileContent,
            filename: newFilename
        })
    ]),MergeStrategy.AllowOverwriteConflict);
    return rule;
}

export default function (options: any): Rule {
    return chain([
        (tree: Tree, _context: SchematicContext) => {
            var rules: Rule[] = [];
            tree.getDir(options.sourcepath).visit((_, filePath) => {
                if (filePath != null) {

                    if (!filePath.path.endsWith(options.postfix + '.json')) {
                        return;
                    }

                    if (!filePath.path) {
                        return;
                    }

                    var rule = gen(options, filePath);
                    rules = rules.concat(rule);
                }
            });
            const rule = chain(rules);
            return rule(tree, _context);
        }
    ]);
}