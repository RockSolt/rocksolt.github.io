# frozen_string_literal: true

require 'bulma-phlex'
require 'literal'
require 'active_support'

# Use the PhlexComponent as the base class. It implements `render_in`, which gets called from any
# `render` calls within Bridgetown ERB files.
#
# The following methods provide access to the bridgetown data:
#
# - site: exposes the properties from the `site_metadata.yml`
# - resource: exposes the resource front matter (technically, this is resource data)
# - data: exposes all the properties from the yaml file in the data folder, keyed by file name
#
# Method `markdownify` delegates to the Bridgetown method of the same name but handles rendering
# in a phlex-friendly manner. The call to raw + safe, which can be a security issue, only
# renders content from within the website.
class PhlexComponent < Phlex::HTML
  extend Literal::Properties

  def render_in(template_view, &)
    call(context: template_view, &).html_safe
  end

  private

  def site
    context.site.metadata
  end

  def resource
    context.data
  end

  def data
    context.site.data
  end

  def markdownify(content)
    raw safe(context.markdownify(content))
  end

  def before_template
    comment { "Before #{self.class.name}" }
    super
  end
end
