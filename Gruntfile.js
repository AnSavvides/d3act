"use strict";

module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);

    var pkgConfig = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: pkgConfig,

        webpack: {
            options: {
                entry: "./src/components/Chart.js",
                output: {
                    path: "./dist/",
                    filename: "dist.js",
                },
                stats: {
                    colors: true,
                    modules: true,
                    reasons: true,
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: "babel-loader"
                        }
                    ]
                },
            },
            dist: {
                cache: false
            }
        },

        watch: {
            scripts: {
                files: ["./src/components/*.js"],
                tasks: ["build"],
                options: {
                    atBegin: true
                }
            }
        },

        eslint: {
            target: ["./src/components/*.js"],
        }

    });

    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("lint", ["eslint"]);

    grunt.registerTask("build", ["webpack", "eslint"]);

};