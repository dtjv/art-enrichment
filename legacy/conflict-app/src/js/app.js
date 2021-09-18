/**
 * The top level router. Adds menu items and establishes top-level controllers.
 */
function onOpen() {
  SpreadsheetApp
    .getUi()
    .createMenu('Apps')
    .addItem('Show Conflicts', 'showConflicts')
    .addItem('About', 'showAbout')
    .addToUi();
}

/**
 * A controller that highlights conflicts in spreadsheet.
 */
function showConflicts() {
  new ConflictApp().run();
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
    .showModalDialog(html, 'About Conflict App');
}
