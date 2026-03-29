# frozen_string_literal: true

class Highlight < PhlexComponent
  prop :highlight, Object, :positional
  prop :recommendations, Array

  def view_template
    render BulmaPhlex::Message.new(@highlight.title, color: @highlight.color, class: "highlight") do
      div(class: "content") do
        img(src: "images/#{@highlight.logo}", class: "highlight-logo", alt: @highlight.logo_alt)
        markdownify(@highlight.description)
      end

      if @highlight.show_recommendations
        div(class: "recommendations", data: carousel_data_attributes) do
          @recommendations.each_with_index do |rec, index|
            render_recommendation(rec, !index.zero?)
          end
        end
      end
    end
  end

  private

  def carousel_data_attributes
    { controller: "carousel", carousel_item_selector_value: ".recommendation" }
  end

  def render_recommendation(rec, hidden)
    div(class: "content recommendation mb-0", hidden:) do
      blockquote(class: "py-0") do
        p(class: "is-italic") { rec.text.strip }
        p { "#{rec.name}, #{rec.role}" }
      end
    end
  end
end
