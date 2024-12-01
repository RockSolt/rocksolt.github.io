import { Controller } from '@hotwired/stimulus'
import BulmaMediaObjectBuilder from '../bulma_media_object_builder'
import MastodonService from '../mastodon_service'

export default class extends Controller {
  static values = {
    postId: String,
  }

  connect() {
    console.log('Fetching replies for post:', this.postIdValue)
    this.fetchAndBuildComments()
  }

  async fetchAndBuildComments() {
    try {
      const data = await MastodonService.fetchReplies(this.postIdValue)
      this.buildComments(data.descendants)
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

      parentNodes[reply.in_reply_to_id].appendChild(comment)
    })
  }
}
