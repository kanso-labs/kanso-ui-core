# kanso-ui-core

[![License][license-shield]][license] [![Build][build-shield]][build-workflow]
[![Test][test-shield]][test-workflow] [![Coverage][coverage-shield]][codecov]

The design data Kanso UI's two component libraries share.
[`@kanso-labs/kanso-ui`](https://github.com/kanso-labs/kanso-ui) draws it on the
web and
[`@kanso-labs/react-native-kanso-ui`](https://github.com/kanso-labs/react-native-kanso-ui)
on iOS and Android.

The package is data and types only. Both libraries build from it and bundle what
they read, so an app installs one of them rather than this.

The package has not been released yet.

## Development

Install with the Node version in `.tool-versions`:

```bash
mise exec node@"$(awk '/^nodejs/{print $2}' .tool-versions)" -- npm install
```

| Task   | Command                 |
| ------ | ----------------------- |
| Test   | `npm test`              |
| Lint   | `npm run lint`          |
| Build  | `npm run build`         |
| Verify | `npm run package:check` |

## License

[MIT](LICENSE.md)

[build-shield]:
  https://img.shields.io/github/actions/workflow/status/kanso-labs/kanso-ui-core/build.yaml?branch=main&label=Build
[build-workflow]:
  https://github.com/kanso-labs/kanso-ui-core/actions/workflows/build.yaml
[codecov]: https://codecov.io/gh/kanso-labs/kanso-ui-core
[coverage-shield]:
  https://img.shields.io/codecov/c/github/kanso-labs/kanso-ui-core?label=Coverage
[license]: ./LICENSE.md
[license-shield]: https://img.shields.io/github/license/kanso-labs/kanso-ui-core
[test-shield]:
  https://img.shields.io/github/actions/workflow/status/kanso-labs/kanso-ui-core/test.yaml?branch=main&label=Test
[test-workflow]:
  https://github.com/kanso-labs/kanso-ui-core/actions/workflows/test.yaml
