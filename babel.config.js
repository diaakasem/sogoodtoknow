module.exports = {
    "presets": [
        ["@babel/env", {
            "targets": ["last 2 versions"]
        }]
    ],
    "plugins": [
        "@babel/plugin-syntax-bigint",
        ["@babel/plugin-transform-runtime", { "corejs": 2}],
        "@babel/plugin-transform-arrow-functions",
        ["@babel/plugin-transform-async-to-generator", {
            "module": "bluebird",
            "method": "coroutine"
        }]
    ]
};
