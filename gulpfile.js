const gulp = require("gulp");
const rename = require("gulp-rename");
const uglify = require("uglify-es");
const strip = require("gulp-strip-comments");
const inject = require("gulp-inject");
const del = require("del");
const composer = require("gulp-uglify/composer");
const minify = composer(uglify, console);
const modules = [
	"src/parser_module.js",
	"src/arithmetic_module.js",
	"src/random_module.js",
	"src/number_theory_module.js"
]

async function clean(){
	const paths = await del(["dist/node/**", "dist/web/**"])
	console.log("Deleted old files/directories:\n", paths.join("\n"));
}

function nodeify(){
	return gulp.src("templates/node.js")
		.pipe(inject(gulp.src(modules), {
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
		.pipe(inject(gulp.src(modules), {
			starttag: "/* inject:js */",
			endtag: "/* endinject */",
			transform: function(filepath, file){
				return file.contents.toString("utf-8");
			}
		}))
		.pipe(strip())
		.pipe(rename("quasar-web.js"))
		.pipe(gulp.dest("dist/web/"))
		.pipe(minify())
		.pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("dist/web/"));
}

exports.build = gulp.series(clean, nodeify, webify);