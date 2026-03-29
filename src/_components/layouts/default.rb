# frozen_string_literal: true

module Layouts
  class Default < PhlexComponent
    prop(:content, Phlex::SGML::SafeValue) { |value| safe(value) }

    def around_template
      doctype

      html(lang: site.locale) do
        render Head.new

        body(class: "#{resource.layout} postcard") do
          render NavigationBar.new(links: site.menu[resource.layout])

          main(class: "main container") { super }

          render Footer.new
        end
      end
    end

    def view_template
      page_title
      block_given? ? yield(@content) : raw(@content)
    end

    private

    def page_title
      render PageTitle.new(title: site.title, subtitle: site.tagline)
    end

    def page_title_with_byline
      render PageTitle.new(title: site.title, subtitle: site.tagline,
        byline: "#{resource.date.strftime('%B %e, %Y')} by Todd Kummer")
    end
  end
end
