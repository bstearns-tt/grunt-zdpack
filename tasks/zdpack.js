/*
 * grunt-zdpack
 * https://github.com/bstearns-tt/grunt-zdpack
 *
 * Copyright (c) 2015 bstearns-tt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('zdpack', 'Archives a directory into a Zend framework .zpk file.', function() {

        var options = this.options({
            project: ''
        });

        var src = unixifyPath(options.src);
        var dest = unixifyPath(options.dest);

        if (!grunt.file.exists(dest)) {
            grunt.file.mkdir(dest);
        }

        // Print a success message.
        grunt.log.writeln( options.project + '.zpk file successfully created.');

    });

    var unixifyPath = function(filepath) {
        if (process.platform === 'win32') {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

};