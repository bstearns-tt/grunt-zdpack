/*
 * grunt-zdpack
 * https://github.com/bstearns-tt/grunt-zdpack
 *
 * Copyright (c) 2015 bstearns-tt
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    var cp = require('child_process')
        , f = require('util').format
        , _ = grunt.util._
        , log = grunt.log
        , verbose = grunt.verbose;

    grunt.registerMultiTask('zdpack', 'Archives a project distribution into a Zend framework .zpk file.', function() {

        var data = this.data
            , execOptions = data.options !== undefined ? data.options : {}
            , stdout = data.stdout !== undefined ? data.stdout : true
            , stderr = data.stderr !== undefined ? data.stderr : true
            , callback = _.isFunction(data.callback) ? data.callback : function () {
            }
            , exitCodes = data.exitCode || data.exitCodes || 0
            , command
            , childProcess
            , done = this.async();

        // https://github.com/jharding/grunt-exec/pull/30
        exitCodes = _.isArray(exitCodes) ? exitCodes : [exitCodes];

        if (!grunt.file.exists(data.src)) {
            log.error('Distribution does not exist. Run `grunt build` first');
            return done(false);
        }

        // Create the destination directory if it doesn't exist. Zend
        // will fall over if the --output-dir isn't there
        //
        if (!grunt.file.exists(data.dest)) {
            grunt.file.mkdir(data.dest);
        }

        // Set the command and adjust if windows platform
        //
        command = "/usr/local/zend/bin/zdpack";

        if (process.platform === 'win32') {
            verbose.writeln(f('This platform is ' + process.platform + ', changing command install location.'));
            command = "C:\\Program Files (x86)\\Zend\\ZendServer\\bin\\zdpack";
        }

        // Add the command options
        //
        command  = command + ' --output-dir=' + data.dest + ' pack ' + data.src;

        verbose.subhead(command);
        verbose.writeln(f('Expecting exit code %s', exitCodes.join(' or ')));

        childProcess = cp.exec(command, execOptions, callback);

        stdout && childProcess.stdout.on('data', function (d) {
            log.write(d);
        });
        stderr && childProcess.stderr.on('data', function (d) {
            log.error(d);
        });

        // Catches failing to execute the command at all (eg spawn ENOENT),
        // since in that case an 'exit' event will not be emitted.
        childProcess.on('error', function (err) {
            log.error(f('Failed with: %s', err));
            done(false);
        });

        childProcess.on('exit', function (code) {
            if (exitCodes.indexOf(code) < 0) {
                log.error(f('Exited with code: %d.', code));
                return done(false);
            }

            verbose.ok(f('Exited with code: %d.', code));
            done();
        });

    });

};
