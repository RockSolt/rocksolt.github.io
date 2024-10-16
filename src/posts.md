---
layout: default
title: Posts
---

<section class="section">
  <% collections.posts.resources.each do |post| %>
    <a href="<%= post.relative_url %>" class="">
    <article class="box post-summary">
      <h1 class="title is-4"><%= post.data.title %></h1>
      <h1 class="subtitle is-6"><%= post.data.subtitle %></h1>
      <p><%= post.data.og_description || post.data.description %></p>
    </article>
    </a>
  <% end %>
</section>
