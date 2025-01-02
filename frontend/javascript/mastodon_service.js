export default class MastodonService {
  static async fetchReplies(postId) {
    const url = `https://ruby.social/api/v1/statuses/${postId}/context`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = await response.json()
    return data.descendants.map(normalizeMastodonReply)
  }
}

function normalizeMastodonReply(reply) {
  return {
    id: reply.id,
    parentId: reply.in_reply_to_id,
    account: {
      avatar: reply.account.avatar,
      displayName: reply.account.display_name,
      url: reply.account.url,
      acct: reply.account.acct,
    },
    createdAt: reply.created_at,
    content: reply.content,
    mediaAttachments: reply.media_attachments,
    card: reply.card,
  }
}
