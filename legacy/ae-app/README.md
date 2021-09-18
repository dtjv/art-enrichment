# Art Enrichment

## Overview

The Art Enrichment(AE) program offers art courses for each grade (K-8) throughout the school year. AE coordinators schedule each course they plan to teach and submit their schedule to the AE chairperson. It is the task of the AE chairperson to identify and notify AE coordinators of scheduling conflicts.

This application addresses the following needs:

1. Provides a consistent interface to control the quality of course schedule information
2. Provide a repository to store schedule information
3. Automate the process of identifying and reporting schedule conflicts

## Google Form

A Google Form is used by AE coordinators to submit a course schedule to the AE chairperson. One submission per course.

## Google Sheet

A Google Sheet holds 3 worksheets and 2 programs.

#### Data Worksheet

Responses (or submissions of) the Google Form are stored in this worksheet.

#### Tools Worksheet

A master list of projects and their cooresponding tools are stored in this worksheet.

#### Configuration Worksheet

The configuration that maps a column values to a list-type field's choices are stored here.

#### Conflicts Program

This program will run through the form response data (stored in the **Data** worksheet) and highlight the courses that are in conflict. *(A course is a row in the sheet)*.

Schedule conflicts meet **all** the criteria below:

* The courses occur on the same course date.
* The courses are offered at overlapping times.
* The courses have at least one tool in common.

To run, select from the menu:

    Apps -> Show Conflicts

For more detail, visit: <a href='https://github.com/dtjv/conflict-app/blob/master/README.md' target='_parent'>Conflict App</a>.

#### Update Projects Program

This program processes the configurations listed in the **Configuration** worksheet.

To run, select from the menu:

    Apps -> Run Update Projects

For more detail, visit: <a href='https://github.com/dtjv/update-app/blob/master/README.md' target='_parent'>Update App</a>.

## Development

This repo has one source file, `app.js` that is simply the menu definition for the *Conflict Program*, *Update Program* and *About* page.

This project is mainly used to pull down the *js-utils*,  *conflict-app* and *update-app* repos and build one deployment file.

### Build

The build defined in `gulpfile.js` pulls source files from *js-utils*,  *conflict-app* and *update-app* repos, strips them all of `require()` and `module.exports` statements and then concatenates them into `dist/code.gs`. 

It also converts `README.md` to `about.html` via <a href='http://pandoc.org/', target='_parent'>pandoc</a>, using a template for better presentation.

To build, issue the following from the project root directory: 

```
$ npm run build
```

All production code will be in the `./dist` folder.

### Deploy

Run the build, then copy and paste `code.gs` and `about.html` to the files in the script editor of the Google Sheet. 

> **Remember, the Google Sheet this code resides in must have worksheets named 'Data', 'Tools' and 'Configuration'.**

## License

MIT © David Valles
