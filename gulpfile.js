const gulp = require("gulp");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const strip = require("gulp-strip-comments");
const inject = require("gulp-inject");
const del = require("del");

async function clean(){
	const paths = await del(["dist/node/**", "dist/web/**"])
	console.log("Deleted old files/directories:\n", paths.join("\n"));
}

function nodeify(){
	return gulp.src("templates/node.js")
		.pipe(inject(gulp.src("src/*.js"), {
			starttag: "/* inject:js */",
			endtag: "/* endinject */",
			transform: function(filepath, file){
				return file.contents.toString("utf-8");
			}
		}))
		.pipe(strip())
		.pipe(rename("quasar.js"))
		.pipe(gulp.dest("dist/node/"));
}

function webify(){
	return gulp.src("templates/web.js")
		.pipe(inject(gulp.src("src/*.js"), {
			starttag: "/* inject:js */",
			endtag: "/* endinject */",
			transform: function(filepath, file){
				return file.contents.toString("utf-8");
			}
		}))
		.pipe(strip())
		.pipe(rename("quasar-web.js"))
		.pipe(gulp.dest("dist/web/"))
		// .pipe(uglify())
		// .pipe(rename({extname: ".min.js"}))
		// .pipe(gulp.dest("dist/web/"));
}

exports.build = gulp.series(clean, nodeify, webify);