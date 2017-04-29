[![Build Status](https://travis-ci.org/philcockfield/msync.svg?branch=master)](https://travis-ci.org/philcockfield/msync)
![msync](https://cloud.githubusercontent.com/assets/185555/25552911/06c09016-2cfa-11e7-910c-a3723dff3f12.png)


A powerful toolkit for building and syncing multiple node-modules in a flexibly defined workspace.



## Install

    npm install -g msync



## Usage
Create a `sync.yaml` file to define the modules within your workspace.

```yaml
modules:
  - ./sample/*/package.json
  - ./sample/libs/*/package.json
```

Run the command line using `msync` within your workspace folder to list, sync or build the modules:

![Image](https://cloud.githubusercontent.com/assets/185555/25553885/7f7b1206-2d13-11e7-8b06-52489f9e556d.png)

![Image](https://cloud.githubusercontent.com/assets/185555/25553878/624e3fdc-2d13-11e7-9e58-76e84b286292.png)

Use the `--help` (`-h`) flag to see the options for each command, eg:

    msync sync --help

# Ignore
You can ignore file `paths` and module `names` by declaring an `ignore` block in the `sync.yaml` definition:


```yaml
ignore:
  paths:
    - ./sample/**/ignore-folder
  names:
    - 'module-4'

```




# API
All command-line options can be programatically invoked:

```js
import { ls, sync } from 'msync';
```

### ls (list)
List modules in dependency order.

```js
await ls();
await ls({ deps: 'local' });
await ls({ deps: 'all' });
```

### sync
Syncs each module's dependency tree locally.

```js
await sync();
await sync({ ignored: true });
```



## Next Steps
- `build` (Typescript)
- `build:watch`
