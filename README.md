# list-gui

![Node.js CI](https://github.com/airenas/list-gui/workflows/Node.js%20CI/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/airenas/list-gui/badge.svg?branch=main)](https://coveralls.io/github/airenas/list-gui?branch=main)

List Transcription GUI for intelektika.lt

Web component for transcription GUI. Tested with node >= v10.16.3, npm >= 6.14.10

## Prepare env

```bash
    make init
```

## Build

```bash
    make build
```

The result will be ready at *deploy/html*.

## Pack for deploy

```bash
    make clean build && make pack
```

## Test

```bash
    make test
```


## License

Copyright © 2021, [Airenas Vaičiūnas](https://github.com/airenas), [intelektika.lt](http://intelektika.lt).
Released under the [The 3-Clause BSD License](LICENSE).

The project uses other licensed software. See [Licenses](Licenses/).
