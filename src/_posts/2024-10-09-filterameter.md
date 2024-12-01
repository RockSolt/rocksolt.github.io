---
layout: post
title: "Filterameter"
subtitle: "Simplify and Speed Up Development of Rails Controllers"
date: 2024-10-09
categories: posts
description: |
  Handling filter parameters for index endpoints in Rails controllers can often be a repetitive and error-prone task. The Filterameter
  gem aims to simplify this process by providing a declarative way to define search filters. In this post, we’ll explore how Filterameter
  can help you write cleaner and more maintainable code.
mastodon_account: "@toddkummer"
mastodon_id: 113313040222917964
---

Handling filter parameters for index endpoints in Rails controllers can often be a repetitive and error-prone task. The [Filterameter gem](https://github.com/RockSolt/filterameter) aims to simplify this process by providing a declarative way to define filters. In this post, we'll explore how Filterameter can help you write cleaner and more maintainable code.

### The Problem with Traditional Filtering

Consider the following typical controller action:

```ruby
def index
  @films = Films.all
  @films = @films.where('name like ?', Film.sanitize_sql_like("%#{params[:name]}%")) if params[:name]
  @films = @films.joins(:film_locations).merge(FilmLocations.where(location_id: params[:location_id])) if params[:location_id]
  @films = @films.directed_by(params[:director_id]) if params[:director_id]
  @films = @films.written_by(params[:writer_id]) if params[:writer_id]
  @films = @films.acted_by(params[:actor_id]) if params[:actor_id]
  @films = @films.where('rating >= ?', rating_min) if params[:rating_min]
end
```

The approach has several drawbacks:

- **Redundancy:** Each filter requires a separate conditional statement.
- **Maintainability**: The logic can become hard to follow, especially with many filters.
- **Readability**: There is not a clear list of available filters.

### Introducing Filterameter

Filterameter addresses these issues by allowing you to declare filters in a more concise and readable manner. Here's how you can rewrite the above example using Filterameter:

```ruby
class FilmsController < ApplicationController
  filter :name, partial: true
  filter :location_id, association: :film_locations
  filter :director_id, name: :directed_by
  filter :writer_id, name: :written_by
  filter :actor_id, name: :acted_by

  def index
    @films = build_query_from_filters
  end
end
```

### Key Features

#### Declarative Filters

With Filterameter, you can declare filters at the top of your controller, making it clear what filters are available:

```ruby
filter :name, partial: true
filter :location_id, association: :film_locations
filter :director_id, name: :directed_by
filter :writer_id, name: :written_by
filter :actor_id, name: :acted_by
```

#### Matching Strings

Searching for partial matches (SQL's `like`) is a common task and easy with Filterameter:

```ruby
filter :name, partial: true
```

#### Association Support

Filterameter supports filtering through associations, making it easy to filter records based on related models:

```ruby
filter :location_id, association: :film_locations
```

#### Custom Filter Names

You can also specify custom method names for filters, allowing you to use names that make sense to the request rather than having to expose the model details:

```ruby
filter :director_id, name: :directed_by
```

#### Ranges and Comparisons

Filter by a minimum, maximum, or range:

```ruby
filter :rating, range: true
```

#### Push Complex Logic to Scopes

When an attribute or nested attribute isn't enough, there's no need for yet another way to write queries, just use a scope. No need to specify that a scope is in use, Filterameter figures that out:

```ruby
filter :director_id, name: :directed_by

# models/film.rb
def self.directed_by(director_id)
  joins(:directing_credits).merge(DirectingCredit.where(person_id: director_id))
end
```

#### Toggleable Filters

Sometimes a checkbox is used to toggle a filter on and off. In that case the parameter value (true or false) is used to determine whether or not a scope should be applied:

```ruby
filter :recent

# models/film.rb
scope :recent, -> { where('release_year > ?', Time.zone.now.year - 10) }
```

#### Validate Query Parameters

Familiar with [ActiveRecord validations](https://guides.rubyonrails.org/active_record_validations.html)? You can use those against query parameters:

```ruby
filter :release_year, validates: { numericality: { only_integer: true, greater_than: 1_900, less_than: 2_100 } }
```

#### Sorting

When an attribute is declared as a filter, it is also sortable by default. Non-filterable fields can also be declared sortable:

```ruby
sort :by_created_at
```

#### ActiveRecord Query

Filterameter leverages ActiveRecord to build queries, so there is no need to learn a new syntax. Additionally, the
`build_query_from_filters` method can take a starting query as an argument, which can be helpful for
includes or authorization restrictions.

```ruby
@films = build_query_from_filters(Films.includes(film_locations: :location))
```

#### Validating Declarations

Typos are real, but they won't make it past your test suite. A single test for each controller will validate your
declarations.

```ruby
# rspec
expect(WidgetsController.declarations_validator).to be_valid

# minitest
validator = WidgetsController.declarations_validator
assert_predicate validator, :valid?, -> { validator.errors }
```


### Conclusion

Filterameter provides a powerful and flexible way to handle filter parameters in Rails controllers. By using declarative filters, you can reduce boilerplate code, improve readability, and make your controllers easier to maintain. If you frequently deal with complex filtering logic, Filterameter is definitely worth a look.

Check out the [Filterameter GitHub repository](https://github.com/RockSolt/filterameter) for all the details.
