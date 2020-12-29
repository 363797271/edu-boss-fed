module.exports = {
  root: true,
  env: {
    node: true
  },
  // 插件：扩展了校验规则
  extends: [
    // eslint-plugin-vue
    'plugin:vue/essential',
    // @vue/eslint-config-standard 将 standart 校验规则集成到 ESLint
    '@vue/standard',
    // @vue/eslint-config-typescript 通过 ESLint 校验 TS
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  // 自定义编码校验规则
  rules: {
    // semi: ["error", "never"],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        // 多行接口定义类型
        multiline: {
          delimiter: 'none', // 分隔符 comma逗号 semi分号 none无
          requireLast: false // 最后一行是否要有分隔符
        }
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ]
  }
}
