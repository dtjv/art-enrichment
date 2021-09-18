import { UpdateApp } from './libs/update'
import { ConflictApp } from './libs/conflict'

global.onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Apps')
    .addItem('Show Conflicts', 'runConflictApp')
    .addItem('Update Projects', 'runUpdateApp')
    .addToUi()
}

global.runConflictApp = () => {
  new ConflictApp().run()
}

global.runUpdateApp = () => {
  new UpdateApp().run()
}
