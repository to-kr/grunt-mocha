/**
 * Example Gruntfile for Mocha setup
 */

'use strict';

module.exports = function(grunt) {

  var port = 8981;

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js', ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      // If you want to watch files and run tests automatically on change
      test: {
        files: [
          'example/js/**/*.js',
          'example/test/spec/**/*.js',
          'phantomjs/*',
          'tasks/*',
          'Gruntfile.js'
        ],
        tasks: 'test'
      }
    },
    mocha: {
      // runs all html files (except test2.html) in the test dir
      // In this example, there's only one, but you can add as many as
      // you want. You can split them up into different groups here
      // ex: admin: [ 'test/admin.html' ]
      all: ['example/test/**/!(test2|testBail).html'],

      // Runs 'test/test2.html' with specified mocha options.
      // This variant auto-includes 'bridge.js' so you do not have
      // to include it in your HTML spec file. Instead, you must add an
      // environment check before you run `mocha.run` in your HTML.
      test2: {

        // Test files
        src: ['example/test/test2.html'],
        options: {
          // mocha options
          mocha: {
            ignoreLeaks: false,
            grep: 'food'
          },

          reporter: 'Spec',

          // Indicates whether 'mocha.run()' should be executed in
          // 'bridge.js'
          run: true,

          timeout: 10000
        }
      },

      // Runs the same as test2 but with URL's
      test3: {
        options: {
          // mocha options
          mocha: {
            ignoreLeaks: false,
            grep: 'food'
          },

          reporter: 'Nyan',

          // URLs passed through as options
          urls: ['http://localhost:' + port + '/example/test/test2.html'],

          // Indicates whether 'mocha.run()' should be executed in
          // 'bridge.js'
          run: true
        }
      },

      // Test using a custom reporter
      testReporter: {
        src: ['example/test/test.html', 'example/test/test2.html'],
        options: {
          mocha: {
            ignoreLeaks: false,
            grep: 'food'
          },
          reporter: './example/test/reporter/simple',
          run: true
        }
      },

      // Test log option
      testLog: {
        src: ['example/test/test.html'],
        options: {
          mocha: {
            ignoreLeaks: false,
            grep: 'food'
          },
          log: true
        }
      },

      testDest1: {
        // Test files
        src: ['example/test/test2.html'],
        dest: 'example/test/results/spec.out',
        options: {
          reporter: 'Spec',
          run: true
        }
      },

      // Same as above, but with URLS + Xunit
      testDest2: {
        options: {
          reporter: 'XUnit',

          // URLs passed through as options
          urls: ['http://localhost:' + port + '/example/test/test2.html'],

          run: true
        },
        src: [],  // we need this since we use `dest`.
        dest: 'example/test/results/xunit.out'
      },

      // Test a failing test with bail: true
      testBail: {
        src: ['example/test/testBail.html'],
        // Bail option
        options: {
          run: true,
          bail: true
        }
      },

      // This test should never run
      neverTest: {
        src: ['example/test/test.html'],
        // Bail option
        options: {
          run: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: port,
          base: '.'
        }
      }
    }
  });

  grunt.registerTask('verify-test-results', function () {
    var expected = ['spec', 'xunit'];

    expected.forEach(function (reporter) {
      var output = 'example/test/results/' + reporter + '.out';

      // simply check if the file is non-empty since verifying if the output is
      // correct based on the spec is kind of hard due to changing test running
      // times and different ways to report this time in reporters.
      if (!grunt.file.read(output, 'utf8'))
        grunt.fatal('Empty reporter output: ' + reporter);

      // Clean-up
      grunt.file.delete(output);
      grunt.log.ok('Reporter output non-empty for %s', reporter);
    });
  });

  // IMPORTANT: Actually load this plugin's task(s).
  // To use grunt-mocha, replace with grunt.loadNpmTasks('grunt-mocha')
  grunt.loadTasks('tasks');
  // grunt.loadNpmTasks('grunt-mocha');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Alias 'test' to 'mocha' so you can run `grunt test`
  grunt.task.registerTask('test', ['connect', 'mocha', 'verify-test-results']);

  // By default, lint and run all tests.
  grunt.task.registerTask('default', ['jshint', 'test']);
};
