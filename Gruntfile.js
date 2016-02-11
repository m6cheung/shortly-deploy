module.exports = function(grunt) {    
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js',
      },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/dist/shortly-deploy.min.js' : ['public/dist/shortly-deploy.js']
        }
      }
    },

    eslint: {
      target: ['public/dist/shortly-deploy.min.js']
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
    gitadd: {
        task: {
          options: {
            all: true
          }
        }
      },
    gitcommit: {
      your_target: {
        options: {
          message: 'Commit through grunt!'
          // cwd: "/Volumes/  /shortly-deploy"
        }
      }
    },
    gitpush: {
        your_target: {
          options: {
            remote: 'live',
            branch: 'master'
            // Target-specific options go here. 
          }
        }
      },
    shell: {
      prodServer: {
        command: 'ssh root@104.236.180.200'
      }
    }
  });
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['build', 'gitchange', 'shell', 'server-dev' ]); //this starts the server
    } else {
      grunt.task.run(['build', 'shell', 'server-dev' ]);
    }
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['mochaTest', 'concat', 'uglify', 'cssmin', 'eslint']);
  grunt.registerTask('gitchange', ['gitadd', 'gitcommit','gitpush']);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('local')) {
      grunt.task.run(['build', 'server-dev' ]);
      // add your production server task here
      //call build
      //find a way to git add commit and push
      //ssh nodeman into server
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

};
