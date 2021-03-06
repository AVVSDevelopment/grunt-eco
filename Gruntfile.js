module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly:   true,
        eqeqeq:  true,
        immed:   true,
        latedef: true,
        newcap:  true,
        noarg:   true,
        sub:     true,
        undef:   true,
        boss:    true,
        eqnull:  true,
        node:    true
      },
      globals: {},
      files: ['grunt.js', 'tasks/**/*.js']
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');  

  // Default task.
  grunt.registerTask('default', ['jshint']);

};
