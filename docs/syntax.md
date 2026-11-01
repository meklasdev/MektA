# MektA project format

The current desktop product manages project records and local workspace state. The historical .mek compiler remains in the repository for compatibility, but it is not required to use MektA Studio.

## Legacy commands

~~~bash
node cli/index.js dev
node cli/index.js build path/to/file.mek
~~~

New product features should be implemented as typed React modules in the desktop workspace, not as large monolithic generated files.
