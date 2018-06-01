import {
    Rule,
    Tree,
    FileEntry
} from '@angular-devkit/schematics';


export default function (options: any): Rule {
    return (tree: Tree) => {
        var content = "";

        // Copy the update schematics to a temporary directory.
        const updateSrcs: FileEntry[] = [];
        tree.getDir(options.sourcepath).visit((_, entry) => (entry != null) ? updateSrcs.push(entry) : "");

        if (options.sourcepath.substr(0, 1) != "/") {
            options.sourcepath = "/" + options.sourcepath;
        }
        for (let src of updateSrcs) {
            var importPath = src.path.substr(options.sourcepath.length, src.path.length);
            if (importPath.endsWith('.ts')) {
                importPath = importPath.replace('.ts', '');
            }

            if (src.path != null) {
                //check if file is in the same folder
                importPath = (importPath.substr(0, 1) == "/") ? importPath : "/" + importPath;

                content += "export * from '." + importPath + "';\n";
                // console.log(importPath);
            }
        }

        tree.create(options.sourcepath + "/index.ts", content);
        return tree;
    }
}


