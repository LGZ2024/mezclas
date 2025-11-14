import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import nodeExternals from 'webpack-node-externals'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default ({ mode }) => {
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'

  return {
    target: 'node',
    mode,
    node: { global: true }, // Agregamos esta opción para habilitar la compatibilidad con Node 16
    entry: './src/app.mjs',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.mjs',
      chunkFormat: 'module',
      libraryTarget: 'module', // Añade esta línea
      clean: true // Limpia el directorio de salida antes de compilar
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true // Añade soporte para top-level await
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
                  targets: { node: 'current' },
                  modules: false
                }]
              ]
            }
          }
        },
        // Agrega reglas adicionales para cargar otros tipos de archivos
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.cjs', '.mjs', '.ejs'],
      fullySpecified: false // Importante para módulos ES
    },
    externals: [nodeExternals({
      importType: 'module' // Asegura que las importaciones sean de módulos
    })],
    optimization: {
      minimize: isProduction
    },
    stats: {
      errorDetails: true
    },
    devtool: isDevelopment ? 'source-map' : false,
    cache: true
  }
}
