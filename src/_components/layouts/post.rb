# frozen_string_literal: true

module Layouts
  class Post < Default
    def view_template
      page_title_with_byline

      section(class: "section") do
        article(class: "box") do
          section(class: "content") do
            raw @content
            p(class: "is-italic has-text-centered") { "#{resource.date.strftime('%B %e, %Y')} by Todd Kummer"  }
          end
          if !resource.mastodon_id.nil? || !resource.bluesky_id.nil?
            hr
            section do
              h1(class: "title") { "Comments" }
              bluesky_comments unless resource.bluesky_id.nil?
              mastodon_comments unless resource.mastodon_id.nil?
            end
          end
        end
      end
    end

    private

    def bluesky_comments
      div(
        class: "ml-5",
        data_controller: "comments",
        data_comments_service_value: "Bluesky",
        data_comments_user_account_value: resource.bluesky_account,
        data_comments_post_id_value: resource.bluesky_id
      )
      div(class: "notification is-primary is-light") do
        a(
          href: "https://bsky.app/profile/#{resource.bluesky_account}/post/#{resource.bluesky_id}",
          target: "_blank",
          class: "is-flex is-justify-content-center"
        ) do
          p(class: "my-0 mr-3") { "Continue the conversation on Bluesky" }
          img(
            src: "/images/bluesky_media_kit_logo_svgs.svg",
            class: "icon is-medium",
            alt: "Bluesky Logo"
          )
        end
      end
    end

    def mastodon_comments
      div(
        class: "ml-5",
        data_controller: "comments",
        data_comments_service_value: "Mastodon",
        data_comments_post_id_value: resource.mastodon_id
      )
      div(class: "notification is-primary is-light") do
        a(
          href: "https://ruby.social/#{resource.mastodon_account}/#{resource.mastodon_id}",
          target: "_blank",
          class: "is-flex is-justify-content-center"
        ) do
          p(class: "my-0 mr-3") { "Continue the conversation on ruby.social" }
          img(
            src: "/images/mastodon-logo-purple.svg",
            class: "icon",
            alt: "Mastodon Logo"
          )
        end
      end
    end
  end
end
