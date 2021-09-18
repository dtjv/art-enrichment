/**
 * The top level router. Adds menu items and establishes top-level controllers.
 */
function onOpen() {
  SpreadsheetApp
    .getUi()
    .createMenu('Apps')
    .addItem('Show Conflicts', 'showConflicts')
    .addItem('Run Update Projects', 'runUpdate')
    .addItem('About Art Enrichment', 'showAbout')
    .addToUi();
}

/**
 * A controller that highlights conflicts in spreadsheet.
 */
function showConflicts() {
  new ConflictApp().run();
}

/**
 * A controller that syncs the list of projects to a drop-down field's choice list on a form.
 */
function runUpdate() {
  new UpdateApp().run();
}

/**
 * A controller that displays the application's documentation.
 */
function showAbout() {
  var html = HtmlService
    .createHtmlOutputFromFile('about')
    .setWidth(900)
    .setHeight(500)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp
    .getUi()
    .showModalDialog(html, 'About Art Enrichment');
}
