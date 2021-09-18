import { UpdateApp } from './lib/update'
import { ConflictApp } from './lib/conflict'

global.onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Apps')
    .addItem('Show Conflicts', 'showConflicts')
    .addItem('Run Update Projects', 'runUpdate')
    .addItem('About Art Enrichment', 'showAbout')
    .addToUi()
}

global.showConflicts = () => {
  new ConflictApp().run()
}

global.runUpdate = () => {
  new UpdateApp().run()
}

global.showAbout = () => {
  const html = HtmlService.createHtmlOutputFromFile('about')
    .setWidth(900)
    .setHeight(500)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)

  SpreadsheetApp.getUi().showModalDialog(html, 'About Art Enrichment')
}
