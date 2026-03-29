# frozen_string_literal: true

class Footer < PhlexComponent
  def view_template
    footer(class: "footer py-3 mt-4") do
      div(class: "content has-text-centered has-text-grey is-size-7") do
        plain "© #{Date.today.year} Rockridge Solutions"
      end
    end
  end
end
