export default {
    '*.{ts,tsx,!src/services/**}': ['eslint --fix', 'prettier --write'],
    '**/*.ts?(x)!src/services/**': ['tsc --noEmit'],
};
