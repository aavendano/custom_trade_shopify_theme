const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['assets/custom.js'],
    bundle: true,
    outfile: 'assets/twicpics-bundle.js',
    loader: { '.css': 'css' },
}).catch(() => process.exit(1));
