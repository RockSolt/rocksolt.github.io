# frozen_string_literal: true

class PageTitle < PhlexComponent
  prop :title, String
  prop :subtitle, _Nilable(String)
  prop :byline, _Nilable(String)

  def view_template
    render BulmaPhlex::Hero.new(size: "small") do
      render BulmaPhlex::Level.new do |level|
        level.left do
          div do
            p(class: "title has-text-white") { @title.html_safe }
            p(class: "subtitle has-text-white") { @subtitle&.html_safe }
          end
        end

        level.right { p(class: "is-italic has-text-white") { @byline } } unless @byline.nil?
      end
    end
  end
end
