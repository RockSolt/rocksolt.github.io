# frozen_string_literal: true

class NavigationBar < PhlexComponent
  prop :links, _Nilable(Array)

  def view_template
    render BulmaPhlex::NavigationBar.new(container: true, color: "primary", class: "has-shadow") do |navbar|
      if @links
        navbar.right do
          @links.each do |link|
            a(class: "navbar-item has-text-white has-text-weight-bold", href: link.url) { link.name }
          end
        end
      end
    end
  end
end
