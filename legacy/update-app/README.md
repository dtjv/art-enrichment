# Update App

[![build status](https://travis-ci.org/dtjv/update-app.svg?branch=master)](https://travis-ci.org/dtjv)   [![Coverage Status](https://coveralls.io/repos/github/dtjv/update-app/badge.svg?branch=master)](https://coveralls.io/github/dtjv/update-app?branch=master)

A <a href='https://developers.google.com/apps-script/', target='_parent'>Google App Script</a>. Used in Google Sheets to set the choices in a Google Form list field to values in a spreadsheet's column. The app uses it's own spreadsheet to process multiple configurations detailing the source columns and target fields. 

## Overview 

I have numerous Google Forms that each contains list-type fields. I need a way to quickly update the choices in those list-type fields without having to manually edit each Google Form.

The next sections describe the steps to setup this project and code.

### Step 1: Configuration Worksheet

![pic of configuration worksheet](./media/config-worksheet.png)


Create a new Google Sheet. Name the default *worksheet* **Configuration**. Next, add the following columns.

* Spreadsheet ID
* Worksheet
* Columns
* Form ID
* Field

#### Spreadsheet ID

Put the spreadsheet ID of the spreadsheet that holds the worksheet with the list of data you want as choices in a field.

You can get the ID from the url of the spreadsheet. In the example below, `1VGnrcAYxfaJfr1dILRxf85TeZCyBAlL4LdX36-cxgwM` is the ID.

```
https://docs.google.com/spreadsheets/d/1VGnrcAYxfaJfr1dILRxf85TeZCyBAlL4LdX36-cxgwM/edit#gid=617843502
```

#### Worksheet

The name of the worksheet in the spreadsheet mentioned above.

#### Column 

Use the column **letter** to identify which column in the worksheet(mentioned above) contains the values you want as choices in a field.

> **The program assumes this worksheet has a header row, so the program will pull column values starting at row 2.**

#### Form ID

Put the ID of the target form in this column. The ID can be obtained via the form's url.

#### Field

The field name is what Google calls the *Question Title*. Put the complete value of the *Question Title*, including spaces and punctuation, in this column.

## Step 2: Run the Program

![pic of menu](./media/run-update.png)

From the menu, select `Apps -> Run Update`.

## Development

### Install

```
$ git clone https://github.com/dtjv/update-app.git && cd update-app/
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
1. Converts `README.md` to `about.html` via <a href='http://pandoc.org/', target='_parent'>pandoc</a>, using a template for better presentation.

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

Run the build, then copy and paste `code.gs` and `about.html` to the files in the script editor of the Google Sheet. (The script editor is found under *Tools -> Script editor* on the Google Sheet UI).

> **Remember, the Google Sheet this code resides in must have a worksheet named 'Configuration'.**

## Learn More... 

For more information, 

* See the <a href='https://github.com/dtjv/update-app' target='_parent'>source</a>.
* Email [David Valles](mailto:davidtjvalles@gmail.com).

## License

MIT © David Valles
