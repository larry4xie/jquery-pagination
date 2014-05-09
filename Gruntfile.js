module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            pagination: {
                options: {
                    preserveComments: false,
                    report: "gzip"
                },
                files: {
                    "dist/jquery.pagination.min.js": "src/jquery.pagination.js"
                }
            }
        }
    });

    // load
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // task
    grunt.registerTask('default', ['uglify:pagination']); // default
};