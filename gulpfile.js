import gulp from "gulp";
import del from "del";
// import typescriptGulp from "gulp-typescript";
import typescriptRollup from "rollup-plugin-typescript2";
import { rollup } from "rollup";
// import merge from "merge2";
import typedoc from "gulp-typedoc";
import strip from "gulp-strip-comments";
import terser from "gulp-terser";
import rename from "gulp-rename";

function cleanBuild() {
	return del(["build/**"]);
}

// async function buildES() {
// 	const result = gulp.src("src/**/*.ts")
// 		.pipe(typescriptGulp.createProject("tsconfig.json", {
// 			declaration: true
// 		})());
// 	return merge([
// 		result.dts.pipe(gulp.dest("build/types")),
// 		result.js.pipe(gulp.dest("build/quasar"))
// 	]);
// }

function buildIIFE() {
	return rollup({
		input: "src/index.ts",
		plugins: [
			typescriptRollup({
				tsconfig: "tsconfig.json",
				tsconfigOverride: {
					compilerOptions: {
						declaration: false,
					}
				},
				check: false
			})
		]
	}).then(bundle => bundle.write({
		file: "./build/quasar-web.js",
		format: "iife",
		name: "Quasar"
	}));
}

// export const build = gulp.series(cleanBuild, buildES, buildIIFE);

// export function watch() {
// 	return gulp.watch("src/**/*.ts", build);
// }

function cleanDist() {
	return del(["dist/**"]);
}

function distES() {
	return gulp.src("build/quasar/**/*.js")
		.pipe(gulp.dest("dist/quasar"));
}

function distTypes() {
	return gulp.src("build/types/**/*.d.ts")
		.pipe(gulp.dest("dist/types"));
}

function distIIFE() {
	return gulp.src("build/quasar-web.js")
		.pipe(strip({
			safe: true
		}))
		.pipe(gulp.dest("dist"))
		.pipe(terser())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(gulp.dest("dist"));
}

export const dist = gulp.series(cleanDist, distES, distTypes, distIIFE);

export function docs() {
	return gulp.src("src/quasar.ts")
		.pipe(typedoc({
			name: "Quasar",
			out: "docs/typedoc",
			json: "docs/typedoc.json",
			sort: ["static-first", "source-order"],
			excludeProtected: true
		}));
}
