import { Application } from '@hotwired/stimulus'

window.Stimulus = Application.start()

import controllers from './controllers/**/*.{js,js.rb}'
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes('_controller.') || filename.includes('-controller.')) {
    const identifier = filename.replace('./controllers/', '')
      .replace(/[_-]controller\..*$/, '')
      .replace(/_/g, '-')
      .replace(/\//g, '--')

    window.Stimulus.register(identifier, controller.default)
  }
})
