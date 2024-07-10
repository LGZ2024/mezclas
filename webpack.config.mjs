import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default ({ mode }) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    target: 'node',
    mode,
    node: { global: true }, // Agregamos esta opción para habilitar la compatibilidad con Node 16
    entry: './src/app.mjs',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.mjs',
      chunkFormat: 'module',
    },
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // Agrega reglas adicionales para cargar otros tipos de archivos
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
    },
    devtool: isDevelopment ? 'source-map' : false,
    cache: true,
  };
};