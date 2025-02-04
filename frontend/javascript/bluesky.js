import { AppBskyEmbedExternal, AppBskyEmbedImages, RichText } from '@atproto/api'

export async function fetchReplies({ userId, postId }) {
  const uri = `at://${userId}/app.bsky.feed.post/${postId}`
  const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${uri}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  const data = await response.json()
  return flattenReplies(data.thread.replies).map(normalizeBskyReply)
}

function flattenReplies(nestedReplies) {
  return nestedReplies.flatMap((reply) => {
    const { replies, ...parent } = reply
    return [parent, ...flattenReplies(replies || [])]
  })
}

function normalizeBskyReply(reply) {
  return {
    id: reply.post.cid,
    parentId: reply.post.record.reply?.parent.cid || null,
    account: buildAccount(reply.post.author),
    createdAt: reply.post.record.createdAt,
    content: buildContent(reply),
    mediaAttachments: buildMediaAttachments(reply.post.embed),
    card: buildCardData(reply.post.embed),
  }
}

function buildAccount(author) {
  return {
    avatar: author.avatar,
    displayName: author.displayName,
    url: `https://bsky.app/profile/${author.handle}`,
    acct: author.handle,
  }
}

function buildContent(reply) {
  const rt = new RichText({
    text: reply.post.record.text,
    facets: reply.post.record.facets,
  })

  const text = []

  for (const segment of rt.segments()) {
    if (segment.isMention()) {
      text.push(`
        <a className="text-blue-500" href="https://bsky.app/profile/${segment.mention?.did}">
          ${segment.text}
        </a>`,
      )
    }
    else if (segment.isLink()) {
      text.push(`
        <a className="text-blue-500" href=${segment.link?.uri}>
          ${segment.text}
        </a>`,
      )
    }
    else if (segment.isTag()) {
      text.push(`<span className="text-blue-500">${segment.text}</span>`)
    }
    else {
      text.push(segment.text.split('\n').join('<br>'))
    }
  }

  return text.join(' ')
}

function buildMediaAttachments(embed) {
  if (!embed) {
    return null
  }
  else if (AppBskyEmbedImages.isView(embed)) {
    return embed.images.map(buildImage)
  }
  else if (AppBskyEmbedExternal.isView(embed) && shouldBeRenderedAsImage(embed)) {
    return [buildImageFromExternal(embed.external)]
  }
}

function buildImage(image) {
  return {
    type: 'image',
    src: image.thumb,
    alt: image.alt,
  }
}

function buildImageFromExternal(external) {
  return {
    type: 'image',
    src: external.thumb,
    alt: external.description,
  }
}

function buildCardData(embed) {
  if (!AppBskyEmbedExternal.isView(embed) || shouldBeRenderedAsImage(embed)) {
    return null
  }

  const external = embed.external

  return {
    image: external.thumb,
    title: external.title,
    description: external.description,
    url: external.uri,
  }
}

function shouldBeRenderedAsImage(embed) {
  return embed?.external?.description.startsWith('ALT:')
}
