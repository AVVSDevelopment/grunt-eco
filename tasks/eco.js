/*
 * grunt-eco
 * https://github.com/AVVSDevelopment/grunt-eco
 *
 * Copyright (c) 2012 Gregor Martynus
 * Copyright (c) 2013 Vitaly Aminev
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  var path = require('path');
  var _ = grunt.util._;


  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('eco', 'Compile Embedded CoffeeScript Templates', function() {
    this.requiresConfig('eco');

    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = this.options({
      bare: false,
      separator: grunt.util.linefeed,
      namespace: "JST"      
    });
    
    grunt.verbose.writeflags(options, 'Options');

    var basePath;
    var srcFiles;
    var newFileDest;

    this.files.forEach(function (file) {
      var validFiles = removeInvalidFiles(file);      
      writeFile(file.dest, concatOutput(validFiles, options));            
    });
    
  });
  
  
  var removeInvalidFiles = function(files) {
    return files.src.filter(function(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    });
  };
  
  var writeFile = function (path, output) {
    if (output.length < 1) {
      warnOnEmptyFile(path);
    } else {
      grunt.file.write(path, output);
      grunt.log.writeln('File ' + path + ' created.');
    }
  };
  
  var warnOnEmptyFile = function (path) {
    grunt.log.warn('Destination (' + path + ') not written because compiled files were empty.');
  };
  
  var concatOutput = function(files, options) {
    files = files.map(function(filepath) {
      var code = grunt.file.read(filepath);
      return compileEco(code, options, filepath);
    }).join(grunt.util.normalizelf(options.separator));
    
    if (!options.bare) {
      //code for wrapping
      var wrapBefore = "(function() {\nthis."+options.namespace+" || (this."+options.namespace+" = {}); var self = this;\n";
      var wrapAfter  = "}).call(this);\nif ((typeof exports !== \"undefined\" && exports !== null) && exports){exports."+options.namespace+" = this."+options.namespace+";}";
         
      files = wrapBefore + files.replace(/if \(\!__obj\) __obj = \{\};/g, 'if (!__obj) __obj = {}; __obj.'+options.namespace+' = self.'+options.namespace) + wrapAfter;
    }
    
    return files;
  };
  
  var compileEco = function(code, options, filepath) { //src, destPath, basePath 
    options = _.clone(options);
    options = _.extend(grunt.config('eco.app'), options); 
    
    var basename = path.basename(filepath, ".eco");

    try {
      return "this."+options.namespace+"['"+basename+"'] = " + require('eco').precompile(code, options);
    } catch (e) {
      console.error(e);
      grunt.fail.warn('EcoTemplates failed to compile.');
    }
  };


};