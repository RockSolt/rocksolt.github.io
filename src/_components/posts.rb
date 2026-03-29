# frozen_string_literal: true

class Posts < PhlexComponent
  prop :posts, Array, :positional

  def view_template
    section(class: "section") do
      @posts.each do |post|
        a(href: post.relative_url) { post_summary(post.data) }
      end
    end
  end

  private

  def post_summary(data)
    article(class: "box post-summary mb-2") do
      render BulmaPhlex::Level.new do |level|
        level.left do
          div { render BulmaPhlex::Title.new(data.title, size: 4, subtitle: data.subtitle) }
        end
        level.right { div(class: "is-size-7") { "#{data.date.strftime('%B %e, %Y')} by Todd Kummer"  } }
      end

      p { data.og_description || data.description }
    end
  end
end
