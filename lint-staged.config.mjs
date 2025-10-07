export default {
    '*': ['prettier --write'],
    '*.{ts,tsx}': ['eslint --fix'],
    '**/*.ts?(x)': () => 'tsc --noEmit',
};
