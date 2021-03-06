const {
  FuseBox,
  Sparky,
  HTMLPlugin,
  JSONPlugin,
  SassPlugin,
  CSSPlugin,
  PostCSSPlugin,
  EnvPlugin,
  // QuantumPlugin,
  WebIndexPlugin,
  UglifyJSPlugin
} = require('fuse-box');
const TypeHelper = require('fuse-box-typechecker').TypeHelper;
const path = require('path');
const del = require('del');
const express = require('express');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([{
  name: 'release',
  type: Boolean,
  defaultOption: false,
  defaultValue: false
}, 
{
  name: 'open',
  type: Boolean,
  defaultValue: false
}, 
{
  name: 'dev',
  type: Boolean,
  defaultValue: false
} 
]);

const RELEASE = options.release;
const CACHE = options.dev ? true : !options.release;

const basePath = 'app';
const distPath = 'public';

console.log(options, {
  RELEASE,
  CACHE
});

const moduleList = [{
    name: '_loader',
    entry: 'index.ts'
  }, // HMR and FuseBox
  {
    name: 'core',
    entry: 'index.tsx'
  }
];

const fuseBoxConfig = {
  homeDir: 'app',
  output: `${distPath}/app/$name.js`,
  tsConfig: 'tsconfig.json',
  log: true,
  debug: true,
  experimentalFeatures: true,
  cache: CACHE,
  sourceMaps: !RELEASE ? {
    inline: true,
    sourceRoot: "/app",
    project: true,
    vendor: true
  } : false,
  plugins: [
    EnvPlugin({
      NODE_ENV: RELEASE ? "production" : "development"
    }),
    WebIndexPlugin({
      title: 'TEST',
      template: path.join(basePath, 'template.html'),
      target: `../index.html`,
      path: basePath
    })
    /* RELEASE && QuantumPlugin({
       uglify: true
     }),*/
  ]

};
const fuse = FuseBox.init(fuseBoxConfig);

Sparky.task("build-watch", () => {
  moduleList.forEach((module) => {
    const name = module.name;
    console.log(module);

    const bundle = fuse.bundle(`${name}`)
      .plugin(JSONPlugin())
      .plugin([
        SassPlugin({
          omitSourceMapUrl: RELEASE,
          // outFile: path.resolve(distPath), // needs to be empty to be in the same folder as created css file
          // sourceMapEmbed: true,
          // outFile: 'test.css',
          sourceMap: true,
          outputStyle: 'compressed',
          // sourceMap: `${distPath}/test.css.map`,
          /* macros: {
          importer: true,
            '$homeDir': `${basePath}/assets/sass/`
          } */
        }),
        // Disabled because SourceMaps options in PostCSSPlugin not working right now
        /*RELEASE && PostCSSPlugin({
          plugins: [autoprefixer],
          sourceMaps: false
        }),*/
        CSSPlugin({
          inject: /* RELEASE ? false: */ file => `/${basePath}/${file}`,
          outFile: file => `${distPath}/${basePath}/${file}`
        }),
      ])
      .plugin('.html',
        /* GulpPlugin([
          (file) => g.translate(translatePluginConfig).import({
            missingContentHandling: 'warn',
            importFilePath: `languages/import/${platform.id}.${language}.translation.json`
          }),
          (file) => !RELEASE ? g.util.noop(file) : g.htmlmin({
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            conservativeCollapse: true,
            removeComments: true
          }),
        ]), */
        HTMLPlugin(),
        RELEASE && UglifyJSPlugin()
      )
      .shim(Object.assign({}, fuseBoxConfig.shim || {}, module.shim || {}))
      .target('browser')
      .instructions(`> ${name}/${module.entry}`);
    if (!RELEASE) {
      bundle
        .cache(CACHE)
        .watch('app/**')
        .hmr();
    }
  });
  fuse.dev({
    root: false,
    open: options.open
  }, server => {
    const dist = path.resolve(distPath);
    const app = server.httpServer.app;
    app.use(require('compression')());

    if (!RELEASE) {
      app.use(`/app`, express.static(path.join('app')));
      app.use(`/node_modules`, express.static(path.resolve('node_modules')));
    }
    app.use(`/`, express.static(path.join(dist)));
    app.get("/", function (req, res) {
      const file = path.join('./public', "index.html");
      console.log(file);
      res.sendFile(file);
    });
  })

  fuse
    .run();
});


Sparky.task("type-watch", () => {
  return new Promise((resolve, reject) => {
    const checker = TypeHelper({
      basePath: basePath,
      name: 'Watch Async TypeCheck',
      tsConfig: '../tsconfig.json',
      tsLint: '../tslint.json',
    });
    const errors = checker[RELEASE ? 'runSync' : 'runWatch']('./');
    if (errors) {
      return reject(new Error('type-watch error occured: ' + errors + ''));
    }
    return resolve();
  });
});

Sparky.task("clean-cache", () => {
  return del(['.fuse-box']);
});

Sparky.task("clean-builds", () => {
  return del(distPath);
});

Sparky.task("watch", ["type-watch", "build-watch"].map((item) => !RELEASE ? "&" + item : item), () => {});

Sparky.task("default", ["&clean-cache", "&watch"], () => {});
