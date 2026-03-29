# frozen_string_literal: true

module Layouts
  class Home < Default
    def view_template
      page_title

      section(class: "section columns") do
        div(class: "column is-three-fifths-desktop is-half-tablet") do
          the_story_of_software
        end
        div(class: "column is-two-fifths-desktop is-half-tablet") do
          highlights
        end
      end

      section(class: "section columns") do
        member_profiles
      end
    end

    private

    def the_story_of_software
      article(class: "box") do
        h1(class: "title is-4") { resource.title }
        picture do
          source(type: "image/webp", srcset: resource.image_webp)
          source(type: "image/jpeg", srcset: resource.image)
          img(src: resource.image, alt: resource.image_alt)
        end
        div(class: "content") { raw @content }
      end
    end

    def highlights
      data.highlights.each do |highlight|
        render Highlight.new(highlight, recommendations: data.recommendations)
      end
    end

    def member_profiles
      data.members.each do |member|
        div(class: "column") { render MemberProfile.new(member) }
      end
    end
  end
end
