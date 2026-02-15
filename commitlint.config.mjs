/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one of these values
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style (formatting, semicolons, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or fixing tests
        "build", // Build system or external dependencies
        "ci", // CI/CD configuration
        "chore", // Maintenance tasks
        "revert", // Reverting a previous commit
      ],
    ],
    // Subject must not be empty
    "subject-empty": [2, "never"],
    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],
    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],
    // Type must not be empty
    "type-empty": [2, "never"],
    // Subject max length
    "subject-max-length": [2, "always", 100],
  },
};
