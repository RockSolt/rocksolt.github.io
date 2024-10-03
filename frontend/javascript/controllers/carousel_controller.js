import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    itemSelector: String,
    activeClass: { type: String, default: 'active' },
    delay: { type: Number, default: 8 }
  }
  connect() {
    this.currentIndex = 0
    this.slides = this.element.querySelectorAll(this.itemSelectorValue)
    this.slideCount = this.slides.length
    setInterval(this.next.bind(this), this.delayValue * 1000)
  }

  next() {
    const nextIndex = this.calculateNextIndex()

    this.toggleHidden(this.currentIndex)
    this.toggleHidden(nextIndex)

    this.currentIndex = nextIndex
  }

  calculateNextIndex() {
    const next = this.currentIndex + 1
    if (next == this.slideCount) {
      return 0
    } else {
      return next
    }
  }

  toggleHidden(index) {
    const slide = this.slides[index]
    slide.hidden = !slide.hidden
  }
}
