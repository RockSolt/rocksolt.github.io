import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    itemSelector: String,
    activeClass: { type: String, default: 'active' }
  }
  connect() {
    this.currentIndex = 0
    this.slides = this.element.querySelectorAll(this.itemSelectorValue)
    this.slideCount = this.slides.length
    setInterval(this.next.bind(this), 5000)
  }

  next() {
    const nextIndex = this.calculateNextIndex()

    this.slides[this.currentIndex].classList.toggle(this.activeClassValue)
    this.slides[nextIndex].classList.toggle(this.activeClassValue)
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
}
