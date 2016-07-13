var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        thirdparty: [
            'mousetrap',
            'pixi.js'
        ],

        app: './app/app.ts',
        tests: './tests.js'
    },
    output: {
        filename: './build/[name].js',
        //pathinfo: true
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.ts', '.js',]
    },
    plugins: [
        // remove 3rd patry from app and tests bundles
        new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['app'] }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['tests'] }),

        // Add minification
        //new webpack.optimize.UglifyJsPlugin(),
    ],
    externals: {
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint"
            }
        ],
        loaders: [
            // this is required to apply typescript compilation
            { test: /\.ts$/, loader: 'ts' },

            // this is required to embed css
            { test: /\.css$/, loader: 'style!css' },

            // this is required to embed images as dataUri
            { test: /\.(png|jpe?g|gif)$/, loader: 'url?limit=100000' },

            // this is required to build pixi.js and might be useful for project as well
            { test: /\.json$/, loader: 'json' }
        ],

        // The errors I encountered were all like:
        //
        // ERROR in ./~/pixi.js/src/core/renderers/webgl/filters/FXAAFilter.js
        // Module not found: Error: Cannot resolve module 'fs' in /Users/michael/Projects/webpack-pixi/node_modules/pixi.js/src/core/renderers/webgl/filters
        // @ ./~/pixi.js/src/core/renderers/webgl/filters/FXAAFilter.js 3:9-22
        //
        // Here, webpack is telling us it doesn't recognize the "fs" module. pixi.js
        // is using node's fs module to read files from the file system and they're
        // expecting people to use Browserify/brfs in order to make this work in
        // browsers. They could be much better about this, and we could go and bother
        // them to write more portable code. But then we'd have to wait for them to
        // cut a new release before we can use their stuff. Isn't there anything we
        // can do in the meantime? Can we somehow use the brfs transform?
        //
        // Webpack lets us use postLoaders to specify a module loader that runs after
        // all other module loaders. In this case, we can use Browserify's brfs
        // transform as a final build step. Here, we restrict this loader to files in
        // the node_modules/pixi.js directory so it won't slow us down too much.
        postLoaders: [
            {
                include: path.resolve(__dirname, 'node_modules/pixi.js'),
                //loader: 'transform?brfs'
                loader: 'transform/cacheable?brfs'
            }
        ]
    }
}
