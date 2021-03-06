var exec = require('child_process').exec;
var targetpath = "pages";
var postfix = "-ui";
var schematicCollection = "@softwarepioniere/schematics";


// ARGV
var x = process.argv.slice(2);
if(x.length>0){
    targetpath = x[0];
}
if(x.length>1){
    postfix = x[1];
}
if(x.length>2){
    schematicCollection = x[2];
}

function generateUiActions(targetpath, postfix) {
    if (targetpath) {
        console.log('Start search uiActionFiles (*' + postfix + '.json) in path:  ' + targetpath );
        exec('schematics ' + schematicCollection + ':generate-actions --sourcepath=' + targetpath + ' --postfix=' + postfix + ' --debug=false', function (error, stdout, stderr) {
            if(stdout){
                console.info(stdout + '... ' + targetpath + ' done! 💪\n');
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

function build(targetpath, postfix) {
    console.log('targetpath:', targetpath);
    console.log('postfix:', postfix);
    console.log('schematicCollection:', schematicCollection);

    if(schematicCollection == "."){
        console.log("running build...");
        exec('npm run build', function (error, stdout, stderr) {
            if (error) {
                console.log(error + '...failed! 💩\n');
            } else {
                console.log("... build finished! 💪\n");
                generateUiActions(targetpath, postfix);
            }
        });
    }else{
        generateUiActions(targetpath, postfix);
    }
}

build(targetpath, postfix);