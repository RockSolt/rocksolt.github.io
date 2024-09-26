module ViewHelpers
  def optional_link(link, &block)
    content = view.capture(&block)
    return content if link.nil?

    "<a href='#{link}'>#{content}</a>".html_safe
  end
end

Bridgetown::RubyTemplateView::Helpers.include ViewHelpers
