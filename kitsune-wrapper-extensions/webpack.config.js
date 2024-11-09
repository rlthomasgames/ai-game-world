module.exports = (env, argv) => {
    return require(`./webpack.config.${argv.mode}.js`)
}
