import webpack from 'webpack'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import nodeExternals from 'webpack-node-externals'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getNodeTarget = (mode) => {
  return mode === 'production' ? 'node24.0' : 'node21.6'
}

export default ({ mode }) => {
  const isProduction = mode === 'production'
  const envPath = path.resolve(process.cwd(), `.env.${mode}`)
  const envVars = dotenv.config({ path: envPath }).parsed || {}

  return {
    target: getNodeTarget(mode),
    mode,
    entry: './src/app.mjs',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.mjs',
      chunkFormat: 'module',
      libraryTarget: 'module',
      clean: true,
      environment: {
        // Solo características compatibles
        arrowFunction: true,
        const: true,
        destructuring: true,
        dynamicImport: true,
        module: true
      }
    },
    // Agregar optimizaciones para producción
    optimization: {
      minimize: isProduction,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all'
      }
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true
    },
    module: {
      rules: [
        {
          test: /\.ejs$/,
          use: 'ejs-loader'
        },
        {
          test: /\.(m?js|mjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    node: isProduction ? '24' : '21'
                  },
                  modules: false
                }]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.mjs', '.ejs'],
      fullySpecified: false
    },
    externals: [nodeExternals({
      importType: 'module'
    })],
    // Mejorar manejo de variables de entorno
    plugins: [
      new webpack.DefinePlugin({
        ...envVars,
        NODE_ENV: JSON.stringify(mode)
      })
    ]
  }
}
