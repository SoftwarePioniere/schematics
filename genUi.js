var exec = require('child_process').exec;
var fs = require('fs');
var request = require('request');
var targetpath = "ngrx-client";
var clientFilesToGenerate = new Array();
var isDev = false;
