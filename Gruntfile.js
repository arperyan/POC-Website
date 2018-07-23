module.exports = function(grunt) {
  var port = grunt.option('port') || 3000;
	var base = grunt.option('base') || '.';
  grunt.initConfig({
    includes: {
      js:{
        files:[{
          src: ['main.js'],
          dest: 'public/build/',
          cwd: 'public/src/js'
        }]
      },
      html:{
        files:[{
          src: ['index.html', 'pipeline.html', 'client-planning.html', 'cross-selling.html'],
          dest: 'public/build/',
          cwd: 'public/src/views'
        }]
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "public/build/app.css": "public/src/less/main.less" // destination file and source file
        }
      }
    },
    watch: {
      clientscript: {
        files: ['public/src/less/**/*.less','public/src/js/**/*.js','public/src/views/**/*.html','server.js'], // which files to watch
        tasks: ['includes', 'babel', 'less'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      serverscript:{
        files: ['server/**/*.js'], // which files to watch
        tasks: ['includes', 'babel', 'express'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      views: {
        files: ['public/src/views/**/*.html'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    },
    express: {
			prod: {
				options: {
					script: "server.js"
				}
			}
		},
    babel: {
  		options: {
  			sourceMap: false,
  			presets: ['babel-preset-es2015']
  		},
  		dist: {
  			files: {
  				'public/build/app.js': 'public/build/main.js'
  			}
  		}
  	},
    uglify:{
      options : {
        beautify : false,
        mangle   : true,
        compress: true
      },
      build: {
        files: [
          {
            'public/build/app.min.js': ['public/build/app.js']
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('default', ['less', 'includes', 'babel', 'express', 'watch' ] );
};
