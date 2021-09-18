# Conflict App

This project creates a Google App Script to be used in a Google Sheet to highlight rows that are in conflict with each other.

## Overview

I created a Google Sheet where the data in each row describes properties of an art class being taught (i.e. course date, time, course duration, art project being taught, etc.). I needed a fast way to report the classes that have a scheduling conflict.

Scheduling conflicts exist when **all** the following criteria are met:

- The courses occur on the same course date.
- The courses are offered at overlapping times.
- The courses have at least one art tool in common.

The next sections describe the steps to setup this project and code.

### Step 1: Data Worksheet

![pic of data worksheet](./media/data-worksheet.png)

Create a new Google Sheet. Name the default _worksheet_ **Data**. Add the following columns:

- Timestamp
- Course Date
- Start Time
- Duration
- Class
- Art Project

All fields are **required**.

> **TIP:** _It's best to have a Google Form dump the values into this sheet to control data integrity._

### Step 2: Tools Worksheet

![pic of tools worksheet](./media/tools-worksheet.png)

Add a second _worksheet_ and name it **Tools**. Add the following columns:

- Projects
- Tools

The **Projects** column will hold all available choices that cells in the **Art Project** column of the **Data** worksheet have. The cells in **Tools** column will be comma separated values that list the tools required for the cooresponding project.

### Step 3: Run the Program

![pic of menu](./media/show-conflicts.png)

From the menu, select `Apps -> Show Conflicts`.

### Conflicts Report

![pic of conflict report](./media/conflict-report.png)

Rows with the same highlight color are in conflict.

## Development

### Install

```
$ git clone https://github.com/dtjv/conflict-app.git && cd conflict-app/
$ npm install
```

### Test

```
$ npm test
```

### Coverage

```
$ npm run coverage
```

### Build

```
$ npm run build
```

The build peforms these two tasks:

1. Strips all source files of `require()` and `module.exports` statements and then concatenates them into `dist/code.gs`.
1. Converts `README.md` to `about.html` via [Pandoc](http://pandoc.org/), using a template for better presentation.

The build result:

```
dist
├── docs
│   └── about.html
└── js
    └── code.gs
```

> Since the build removes all `require` and `module.exports` statements, code must not reference something required that **won't** exist when all files are concatenated. So, you can't `var utils = require('utils');` and then use `utils.flatten()`, because the `utils` require statement will be stripped and `utils` will be undefined.
>
> So care was taken to name all functions and export them in one statement, and the stripping of the export statements would leave functions accessible in the concatenated file.

### Deploy

Run the build, then copy and paste `code.gs` and `about.html` to the files in the script editor of the Google Sheet. (The script editor is found under _Tools -> Script editor_ on the Google Sheet UI).

> **Remember, the Google Sheet this code resides in must have worksheets named 'Data' and 'Tools'.**

## Learn More...

For more information,

- See the <a href='https://github.com/dtjv/conflict-app' target='_parent'>source</a>.
- Email [David Valles](mailto:davidtjvalles@gmail.com).

## License

MIT © David Valles
