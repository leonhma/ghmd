import postcss from "rolllup-plugin-postcss"
import ts from "rollup-plugin-ts";

export default {
    plugins: [
        postcss({
            extract: false,
            modules: true,
            use: ['sass'],
        }),
        ts({})
    ]
}
