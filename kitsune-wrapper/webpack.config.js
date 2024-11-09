module.exports = (env, argv) => {
    if(!argv.mode){
        return require(`./webpack.config.development.js`)
    }
    return require(`./webpack.config.${argv.mode}.js`)
}
