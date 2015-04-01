module.exports = function(grunt) {
	grunt.file.defaultEnconding = 'iso-8859-1';
	grunt.file.preserveBOM = true;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Watch is the Main Purpose of the Gruntfile
		watch: {
	        less: {
            	files: 'src/less/crucio.less',
				tasks: ['less:crucio', 'cssmin']
			},
			js: {
            	files: ['src/js/*.js'],
				tasks: ['ngAnnotate:crucio', 'uglify:crucio', 'transcode:crucio']
			},
			mail_templates: {
            	files: ['src/mail-templates/*.html'],
				tasks: ['inlinecss:mail']
			},
        },
		
		// For Bower Package Installation
		shell: {
    	    exec: {
    	        command: function (greeting) {
    	            return greeting;
    	        }
    	    }
    	},
    	
    	uglify: {
			options: {
    			mangle: {
    		    	except: ['jQuery']
    			}
    		},
			crucio: {
		    	files: {
					'public/js/crucio.min.js': ['.tmp/js/pre-crucio.js']
		    	}
			},
			dep: {
		    	files: {
					'public/js/dep.min.js': ['.tmp/js/pre-dep.js']
		    	}
			},
			angular: {
		    	files: {
					'public/js/angular/angular.min.js': ['public/js/angular/angular.js']
		    	}
			}
		},
		
		// Less => CSS
        less: {
            crucio: {
                options: {
                    yuicompress: true
                },
                files: {
                    'src/css/crucio.css': 'src/less/crucio.less'
                }
            },
            bootstrap: {
                files: {
                    'public/css/bootstrap/bootstrap.css': 'src/less/bootstrap/bootstrap.less'
                }
            },
            tagmanager: {
                files: {
                    'public/css/tagmanager/tagmanager.css': 'src/less/tagmanager/tagmanager.less'
                }
            }
        },
        
        cssmin: {
			combine: {
				files: {
					'public/css/crucio.min.css': ['src/css/*/*.css', 'src/css/*.css', '!src/css/tagmanager/tagmanager.css']
				}
			}
		},
		
        ngAnnotate: {
    	    crucio: {
    	        files: {
					'.tmp/js/pre-crucio.js': ['src/js/*.js']
		    	}
    	    },
    	    dep: {
		        files: {
			        '.tmp/js/pre-dep.js': ['public/js/**/**.js', 'public/js/**.js', '!public/js/dep.min.js', '!public/js/crucio.min.js', '!public/js/angular/*.js', '!public/js/bootstrap/*.js', '!public/js/jquery/jquery.js', '!public/js/jquery-ui/*.js']
		        }
	        }
    	},
    	
    	// For Crucio.Min.JS
    	transcode: {
			options: {
				fromEncoding: 'utf8', // Source file encoding
				toEncoding: 'utf8' // Target file encoding
			},
			crucio: {
				'public/js/crucio2.min.js': 'public/js/crucio.min.js'
			}
		},
		
		// For Mail Templates
		inlinecss: {
    	    mail: {
	    	    files: [{
		    	    expand: true,
        		    cwd: 'src/mail-templates/',
        		    src: '*.html',
        		    dest: 'public/mail-templates/',
        		    ext: '.html'
        		}]
    	    }
    	}
    });

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-transcode');
	grunt.loadNpmTasks('grunt-inline-css');



	grunt.registerTask('bower', ['shell:exec:bower-installer']);
	grunt.registerTask('dep-js', ['ngAnnotate:dep', 'uglify:dep']);
	grunt.registerTask('crucio-js', ['ngAnnotate:crucio', 'uglify:crucio']);
	
	grunt.registerTask('default', ['watch']);
};