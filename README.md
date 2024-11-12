# Rockridge Solutions

This is the source of [the Rockridge Solutions website](https://rockridgesolutions.com/). It is built using
[the Bridgetown Static Site generator](https://www.bridgetownrb.com/docs/). It is published using GitHub
Pages (with the domain host pointing to the Pages site).

## Site Architecture

There are three markdown pages at the root of the `src` folder that represent pages in the generated website:
- index.md: The home page.
- posts.md: Available though not linked from anywhere. The plan is to add a link to the navigation bar when there
            are more entries.
- about.md: This should either be removed or have content built. It is currently the Bridgetown default. There are
            no links to this page.

## Layouts

The layouts are `erb` files and translate pretty closely to Rails. The `default` layout is the parent of the other
layouts.

### Default

The parent layout renders the head and navigation bar via partials, then wraps the yield in a `main` element.

(There is a footer, but there is nothing in the partial.)

### Home

The landing page layout is pretty custom and only used once. The "highlights" on the right and the "member profiles" at the bottom are both generated from a data file and a partial.

### Posts

This loops through all the posts and shows a box for each post with the following info from the post's metadata:
- title
- subtitle
- og_description (which falls back to description)

### Post

The post layout shows the title and subtitle, then yields the post content inside a box.

## Creating a New Post

Each post should have the following metadata:
- title
- subtitle
- date (not yet used)
- categories (must be "posts", it's part of the url)
- description: This is used in the head element for SEO purposes.

The following metadata are optional:
- og_description: This is used for the social media preview as well as the posts index page. If not
  defined, this falls back to description.
- og_image: Also for the social media preview, falls back to the postcard (defined in the site metadata).
- conversation_link: When present, a link to `ruby.social` will be added to the bottom of the post. It is
  two steps, but the post should be announced on mastodon, then that link should be added here. This enables
  comments to be added (if someone has a mastodon login). In theory, that could allow discussion of the post
  in a way that links back to it (and probably drives visibility).

The content of the entry is just markdown.


## Credits

Mail icons created by [Smashicons - Flaticon](https://www.flaticon.com/free-icons/mail)
