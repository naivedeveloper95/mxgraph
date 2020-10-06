var ghpages = require('gh-pages');
var path = require('path');
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var del = require('del');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var packageJson = require('./package');

gulp.task('clean:dist', function(cb) {
    return del(['dist'], cb);
});

gulp.task('usemin', function() {
    return gulp.src('./index.html')
        .pipe(usemin())
        .pipe(gulp.dest('dist/'));
});

gulp.task('webpack', function() {
    return new Promise(function(resolve, reject) {
        webpack({
            entry: './dist/' + packageJson.name + '.js', // mxGraphJS.js 该文件是gulp-usemin先产生的.主要用于拼接所有js文件
            output: {
                path: './dist/',
                filename: packageJson.name + '.js',
                library: 'mx',
                libraryTarget: 'umd'
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        screw_ie8: true,
                        warnings: false
                    },
                    mangle: {
                        screw_ie8: true
                    },
                    output: {
                        comments: false,
                        screw_ie8: true
                    }
                })
            ]
        }).run(function() {
            resolve();
        });
    });
});

gulp.task('dist', function() {
    runSequence('clean:dist', 'usemin', 'webpack', function() {
        console.log('dist success!');
    });
});


// deploy to gh-pages branch
gulp.task('deploy', function() {
    ghpages.publish(path.join(__dirname, './'), {
        src: ['package.json', 'README.md', 'dist/*'],
        logger: function(message) {
            console.log(message);
        }
    }, function(err) {
        console.log(err);
    });
});
