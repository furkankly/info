# info

A node script to show system stats. To run:

```
npm install
npm run info --prefix `path/to/folder/info` -- (--memory | --cpu | --network)
```

Args:

```
--memory (System memory)
--cpu (Available processing units and average load)
--network (Available network interfaces)
```

Defaults to show everything if not specified.
