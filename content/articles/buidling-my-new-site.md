+++

title = "My experience building and deploying this site with Hugo, Gulp, Wercker and Amazon Web Services"
Description = "This tutorial walks through my process of building and deploying a website with Hugo, Gulp, Wercker and Amazon Web Services S3."
Author = "Dan Bahrami"
date = "2016-02-27T12:33:24+01:00"
publishdate = "2016-02-05"
slug = "building-and-deploying-websites-with-hugo-gulp-wercker-aws"
resources = [
    "https://www.smashingmagazine.com/2016/03/getting-disconnected-shallow-interaction-design-deeper-human-experiences/",
    "http://google.com",
    "https://blah.com"
]

+++

[Hugo][link-hugo] is a free and open-source static site generator (SSG) with a beautifully simple setup process, a command line interface and several killer features which I'll cover in this tutorial. I am going to take you through the entire process of building a production website with Hugo, using [GulpJS][link-gulp] as an asset pipeline, and finally deploying to [Amazon Web Services][link-aws] with an automation tool called [Wercker][link-wercker].

[link-hugo]: https://gohugo.io
[link-gulp]: http://gulpjs.com/
[link-aws]: https://aws.amazon.com/s3/
[link-wercker]: http://wercker.com/

<!--more-->


## Why hugo?

When looking for a platform for my personal site the idea of a static site genorator really appealed to me. I wanted a basic, content driven site with very few requirements.

1. Lightning fast page responses
2. A delightful content editing and publishing experience
3. A delightful development experience
4. A simple and maintainable code-base
5. Solid security (Wordpress I'm looking at you!)

By just hosting static asset files (html, css, js and images) instead of an entire database driven platform like Wordpress I get speed, security and cost benefits. So I was quickly sold on an SSG.

But why Hugo? Well to be honest, I haven't got much experience with any SSG and I had to pick one. Hugo seemed to have a growing community and it felt lightweight compared to most other established SSGs I could find. Also the [documentation][link-hugo-docs] is pretty good so I ran with it and have enjoyed my experience so far.

[link-hugo-docs]: https://gohugo.io/overview/introduction/


## What you will need

I will assume that you are comfortable using the command line, I will be demonstrating commands on the Mac Terminal. A basic knowledge of Javascript and SCSS will be helpful but not essential. I will also assume that you have [GIT][link-git] and [Homebrew][link-homebrew] installed on your machine. If not, they are both simple installs so just follow the links. Now let's get started.

[link-git]: https://git-scm.com/downloads
[link-homebrew]: http://brew.sh/


## Git init

The first thing we want to do is set up a local git repo in a new directory which will contain our site. I keep all my sites in a folder `~/Code` so I'll make a new directory there and initialise a local git repo by running the following in the command line...

```
mkdir ~/Code/MySite
cd ~/Code/MySite
git init
```


## Installing Hugo

If you have Homebrew installed then you can install hugo by running

```
brew install hugo
```
If you don't then the [Hugo docs][link-hugo-docs] explain how to install it manually. And while you're there, the docs are an excellent resource so you'll do well to just read them start to finish.

[link-hugo-docs]: https://gohugo.io/overview/installing/

Now you have the Hugo executable installed in your path, you can create a new Hugo site in the current directory by running

```
hugo new site .
```

If you list your directory contents (`ls`) you should now see that Hugo has setup a basic directory structure for you and added a config file.

```
archetypes   config.toml   content   data   layouts   static
```

That's it. 5 directories and a config file... simple!


## Building the site

Now is the time to stop and think about the structure of your site. The structure of mine is very simple, I have one type of content - an article. A single article needs content but also the following bits of metadata.

- A title
- A URL
- An author
- A published date
- A description for SEO
- A list of resources (always give credit!)

Apart from that, I only need a home page that lists my latest articles and that's it.


### Adding content

Let's add our first article. To add content you use Hugo's `new` command followed by a file path. Hugo stores all your content in the `/content` directory so the file path you give it will be relative to that.

```
hugo new article/my-first-article.md
```

This will add a new markdown file at `content/article/my-first-article.md`, if you open it up you should see that it already contains some boilerplate.

```
+++
date = "2016-02-28T19:55:25Z"
draft = true
title = "my first article"

+++
```

Everything that sits between the plus symbols is the metadata for our article, Hugo calls this '[front matter][link-hugo-front-matter]'. If you're interested the default format of front matter is [TOML][link-toml] but you can use JSON or [YAML][link-yaml] too. You can add as much front matter as you need for your requirements and below the front matter is where you write the article content.

[link-hugo-front-matter]: https://gohugo.io/content/front-matter/
[link-toml]: https://github.com/toml-lang/toml
[link-yaml]: http://www.yaml.org/start.html


### Archetypes

You can define the boilerplate that Hugo creates by default for any content type by adding an [archetype][link-hugo-archetypes]. I know that every article will have the same metadata fields so an archetype will save me having to repeat the process of adding it each time.

[link-hugo-archetypes]: https://gohugo.io/content/archetypes/

```
touch archetypes/article.md
```

Then I'll add the content I want...

```
+++
Author = "Dan Bahrami"
Description = ""
resources = []
slug = ""

+++
```

Now let's try adding a new article and see if it works.

```
hugo new article/my-second-article.md
```

And you'll see that Hugo has created a new article with our custom boilerplate. Let's add some phoney content.

```
+++
Author = "Dan Bahrami"
Description = ""
date = "2016-02-28T20:32:57Z"
resources = []
slug = ""
title = "my second article"

+++

[Lorem ipsum](http://www.lipsum.com/) dolor sit amet, consectetur adipiscing elit.
```

### Content structure

By default the URL structure of your site will echo the structure of your content folder. So this article would have the relative path `/article/my-second-article/`. There are ways to configure this but I won't go into that now. If you need to configure your URLs then check the docs.


### A note about markdown

Until now I had never really taken much of an interest in Markdown, preferring to write in HTML, but wow have I been enjoying it. I am using an app called [Byword][link-byword] and the writing experience is so clean. Although there is a bit of lag with the syntax highlighting sometimes it is in general a great tool.

[link-byword]: https://bywordapp.com/


### Compiling a Hugo website

Now we have content but not a website so next comes the compiling stage. To get Hugo to compile just run...

```
hugo
```

Well that was fast! You should get some output telling you how many pages Hugo has created for us and if you have a look at the directory structure you'll find a new public directory. This is where hugo places the compiled output.

```
ls public/
404.html   article   index.html   index.xml   sitemap.xml

ls public/article/
index.html   index.xml   my-first-article   my-second-article
```

It seemed like everything worked but not quite. By default the `hugo` command swallows any warning messages, I Don't know why but there you go. We can see what's really going on by adding a `--verbose` flag.

```
hugo --verbose
```

Hmm that doesn't look good. Since I first discovered that Hugo hides these warnings by defualt I have always used the `--verbose` flag. Hugo is complaining that it can't find layouts for our articles, home page and 404 page.

### Single layout

### Home page layout

### Hugo server

## Building a Gulp pipeline

## Cache busting

## Extra touches
### Syntax highlighting with Pygments
### Adding Disqus comments
### Google analytics

## Setting up Wercker

## Setting up AWS S3