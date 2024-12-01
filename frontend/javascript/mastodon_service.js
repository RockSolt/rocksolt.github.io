export default class MastodonService {
  static async fetchReplies(postId) {
    const url = `https://ruby.social/api/v1/statuses/${postId}/context`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return response.json()
  }
}
