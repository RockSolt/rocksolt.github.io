import { Controller } from '@hotwired/stimulus'
import BulmaMediaObjectBuilder from '../bulma_media_object_builder'
import MastodonService from '../mastodon_service'

export default class extends Controller {
  static values = {
    postId: String,
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
    try {
      const replies = await MastodonService.fetchReplies(this.postIdValue)
      this.buildComments(replies)
    }
    catch (error) {
      console.error(error.message)
    }
  }

  buildComments(replies) {
    const parentNodes = { [this.postIdValue]: this.element }

    replies.forEach((reply) => {
      const [comment, mediaContent] = BulmaMediaObjectBuilder.build(document, reply)
      parentNodes[reply.id] = mediaContent

      parentNodes[reply.parentId].appendChild(comment)
    })
  }
}
