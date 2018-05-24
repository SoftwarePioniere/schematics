import {
    Rule,
    Tree,
    SchematicContext,
    FileEntry,
    chain,
    template,
    url,
    apply,
    mergeWith
} from '@angular-devkit/schematics';
import {strings} from "@angular-devkit/core";

function gen(options: any, src: FileEntry): Rule {
    var rule: Rule;
    var fileContent = JSON.parse(src.content.toString());
    var filePath = src.path.split('/');
    var targetPath = src.path.replace(filePath[filePath.length - 1], '');

    rule = mergeWith(apply(url('./files'), [
        template({
            classify: strings.classify,
            dasherize: strings.dasherize,
            underscore: strings.underscore,
            camelize: strings.camelize,

            INDEX: options.index,
            targetpath: targetPath,
            fileContent: fileContent
        })
    ]));
    return rule;
}

export default function (options: any): Rule {
    return chain([
        (tree: Tree, _context: SchematicContext) => {
            var rules: Rule[] = [];
            tree.getDir(options.sourcepath).visit((_, filePath) => {
                if (filePath != null) {

                    if (!filePath.path.endsWith('-ui.json')) {
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