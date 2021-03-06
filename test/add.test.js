const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')
const { T } = require('ramda')

test('adds the proper npm module, component example, patches a file', async t => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const addPluginComponentExample = sinon.spy()
  const patchInFile = sinon.spy()

  // mock a context
  const context = {
    ignite: { addModule, addPluginComponentExample, patchInFile },
    print: {
      warning: T,
      info: T,
      colors: { cyan: T, bold: T }
    }
  }

  await plugin.add(context)
  t.true(
    addModule.calledWith('react-native-maps', { version: '0.16.4', link: true })
  )
  t.true(
    addPluginComponentExample.calledWith('MapsExample.js.ejs', {
      title: 'Maps Example'
    })
  )
  // Gradle patching
  t.true(patchInFile.called)
  t.is(patchInFile.args[0][0], `${process.cwd()}/android/app/build.gradle`)
  t.true(patchInFile.args[0][1].insert.length > 0)
  t.true(patchInFile.args[0][1].replace.length > 0)
})
