# frozen_string_literal: true

# The Member Profile component shows the information for a partner.
class MemberProfile < PhlexComponent
  extend Literal::Properties

  prop :member, Object, :positional

  def view_template
    render BulmaPhlex::Card.new do |card|
      card.content do
        div(class: 'columns') do
          div(class: 'column') { member_picture }
          div(class: 'column is-two-thirds') { member_info }
        end
      end

      card.footer_item { linked_in_link }
      card.footer_item { github_link }
      card.footer_item { mail_link }
    end
  end

  private

  def member_picture
    picture do
      source(type: 'image/webp', srcset: "images/#{@member.picture_webp}")
      source(type: 'image/jpeg', srcset: "images/#{@member.picture}")
      img(src: "images/#{@member.picture}", alt: @member.name)
    end
  end

  def member_info
    p(class: 'title mb-2') { @member.name }
    div(class: 'content') { markdownify(@member.bio) }
  end

  def linked_in_link
    a(href: @member.linked_in, class: "card-footer-item") do
      img(src: "images/LI-In-Bug.png", class: "linked-in-logo", alt: "LinkedIn Logo")
    end
  end

  def github_link
    a(href: @member.github, class: "card-footer-item") do
      img(src: "images/github-mark.png", class: "github icon", alt: "GitHub Logo")
    end
  end

  def mail_link
    a(href: "mailto:#{@member.email}", class: "card-footer-item") do
      img(src: "images/mail.png", class: "icon", alt: "Email Icon")
    end
  end
end
