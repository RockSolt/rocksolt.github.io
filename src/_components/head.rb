# frozen_string_literal: true

class Head < PhlexComponent
  def view_template
    head do
      meta(charset: "utf-8")
      meta(name: "viewport", content: "width=device-width, initial-scale=1.0")

      title { "#{resource.title} | #{site.title}" }

      meta(name: "description", content: resource.description)
      meta(property: "og:url", content: "https://rockridgesolutions.com")
      meta(property: "og:type", content: "website")
      meta(property: "og:site_name", content: "Rockridge Solutions")
      meta(property: "og:title", content: og_title)
      meta(property: "og:description", content: resource.og_description || resource.description)
      meta(property: "og:image", content: resource.og_image || site.og_image)

      link(rel: "stylesheet", href: (context.asset_path :css))
      link(rel: "apple-touch-icon", sizes: "180x180", href: "/images/apple-touch-icon.png")
      link(rel: "icon", type: "image/png", sizes: "32x32", href: "/images/favicon-32x32.png")
      link(rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon-16x16.png")

      script(src: (context.asset_path :js), defer: "defer")
      raw safe(context.live_reload_dev_js)
    end
  end

  private

  def og_title
    [ resource.title, resource.subtitle ].compact.reject(&:empty?).join(": ")
  end
end
