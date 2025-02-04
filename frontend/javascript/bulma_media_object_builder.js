// This class is responsible for building the HTML structure for a single comment
// using the Bulma media object component.
//
// The structure (element: class) of a comment is as follows:
//    article: media
//      figure: media-left
//      div: media-content
//        div: content
export default class BulmaMediaObjectBuilder {
  static build(document, reply) {
    return (new BulmaMediaObjectBuilder(document, reply)).build()
  }

  constructor(document, reply) {
    this.document = document
    this.reply = reply
  }

  build() {
    const commentContainer = this.createElementWithClasses('article', ['media'])
    commentContainer.appendChild(this.buildMediaLeft(this.reply.account.avatar))
    const mediaContent = this.buildMediaContent(this.reply)
    commentContainer.appendChild(mediaContent)

    return [commentContainer, mediaContent]
  }

  createElementWithClasses(element, classes) {
    const el = this.document.createElement(element)
    el.classList.add(...classes)

    return el
  }

  buildMediaLeft(avatarUrl) {
    const mediaLeft = this.createElementWithClasses('figure', ['media-left'])

    const avatarImage = this.createElementWithClasses('p', ['image', 'is-48x48'])
    mediaLeft.appendChild(avatarImage)

    const img = this.createElementWithClasses('img', ['is-rounded'])
    img.src = avatarUrl
    img.alt = 'User Avatar'
    avatarImage.appendChild(img)

    return mediaLeft
  }

  buildMediaContent(reply) {
    const mediaContent = this.createElementWithClasses('div', ['media-content'])
    const content = this.createElementWithClasses('div', ['content'])

    content.appendChild(this.buildUserInfo(reply.account, reply.createdAt))
    content.insertAdjacentHTML('beforeend', reply.content)

    const facets = this.createElementWithClasses('div', ['pre'])
    facets.textContent = JSON.stringify(reply.facets, null, 2)
    content.appendChild(facets)

    // Insert media attachments (images, videos, etc.)
    if (reply.mediaAttachments && reply.mediaAttachments.length > 0) {
      content.appendChild(this.buildMediaContainer(reply.mediaAttachments))
    }
    else if (reply.card) {
      content.appendChild(this.buildCardForLink(reply.card))
    }

    mediaContent.appendChild(content)

    return mediaContent
  }

  buildCardForLink(cardData) {
    const card = this.createElementWithClasses('div', ['card', 'link-preview-card'])

    if (cardData.image) {
      const cardImage = this.createElementWithClasses('div', ['card-image'])
      cardImage.innerHTML = `<img src="${cardData.image}" alt="${cardData.title}">`
      card.appendChild(cardImage)
    }

    const cardContent = this.createElementWithClasses('div', ['card-content'])
    const cardMedia = this.createElementWithClasses('div', ['media'])
    const cardMediaContent = this.createElementWithClasses('div', ['media-content'])

    const host = this.createElementWithClasses('p', ['subtitle', 'is-6'])
    host.textContent = cardData.provider_name || (new URL(cardData.url)).hostname
    cardMediaContent.appendChild(host)

    const title = this.createElementWithClasses('p', ['title', 'is-5'])
    title.textContent = cardData.title
    cardMediaContent.appendChild(title)

    if (cardData.description) {
      title.classList.add('mb-1')
      const description = this.document.createElement('p')
      description.textContent = cardData.description
      cardMediaContent.appendChild(description)
    }
    cardMedia.appendChild(cardMediaContent)
    cardContent.appendChild(cardMedia)
    card.appendChild(cardContent)

    return card
  }

  buildUserInfo(account, createdAt) {
    const userInfo = this.createElementWithClasses('div', ['grid', 'mb-2'])

    const name = this.createElementWithClasses('div', ['cell'])
    name.innerHTML
      = `<span class="has-text-weight-bold">${account.displayName}</span> <br> 
         <a href="${account.url}" target="_blank" class="has-text-dark has-text-weight-medium is-size-6">@${account.acct}</a>`
    userInfo.appendChild(name)

    const dateElement = this.createElementWithClasses('div', ['cell', 'has-text-right'])
    dateElement.textContent = new Date(createdAt).toLocaleDateString()
    userInfo.appendChild(dateElement)

    return userInfo
  }

  buildMediaContainer(mediaAttachments) {
    const mediaContainer = this.createElementWithClasses('div', ['media-content'])
    const grid = this.createElementWithClasses('div', ['grid'])
    mediaContainer.appendChild(grid)

    mediaAttachments.forEach((media) => {
      let mediaElement
      if (media.type === 'image') {
        mediaElement = this.createElementWithClasses('img', ['image'])
        mediaElement.src = media.preview_url || media.src // TODO: normalize these
        mediaElement.alt = media.alt
      }
      else if (media.type === 'video') {
        mediaElement = this.document.createElement('video')
        mediaElement.src = media.url
        mediaElement.controls = true
      }
      const cell = this.createElementWithClasses('div', ['cell'])
      cell.appendChild(mediaElement)
      grid.appendChild(cell)
    })

    return mediaContainer
  }
}
