import { Controller } from '@hotwired/stimulus'
import BulmaMediaObjectBuilder from '../bulma_media_object_builder'
import * as Mastodon from '../mastodon_service'
import * as Bluesky from '../bluesky'

export default class extends Controller {
  static values = {
    userAccount: String,
    postId: String,
    service: String,
  }

  connect() {
    const observer = new IntersectionObserver(this.loadCommentsWhenVisible.bind(this))
    observer.observe(this.element)
  }

  loadCommentsWhenVisible(entries, observer) {
    if (!entries[0].isIntersecting) return

    observer.disconnect()
    this.fetchAndBuildComments()
  }

  async fetchAndBuildComments() {
    const service = { Mastodon, Bluesky }[this.serviceValue]

    if (!service) {
      console.error(`Unknown service: ${this.serviceValue}`)
      return
    }

    try {
      const replies = await service.fetchReplies({ userId: this.userAccountValue, postId: this.postIdValue })
      this.buildComments(replies)
    }
    catch (error) {
      console.error(error.message)
    }
  }

  buildComments(replies) {
    const parentNodes = { }

    replies.forEach((reply) => {
      const [comment, mediaContent] = BulmaMediaObjectBuilder.build(document, reply)
      parentNodes[reply.id] = mediaContent

      const parent = parentNodes[reply.parentId] || this.element
      parent.appendChild(comment)
    })
  }
}
