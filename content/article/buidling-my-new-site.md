+++

title = "My experience building and deploying this site with Hugo, Gulp, Wercker and Amazon Web Services"
Description = "This tutorial walks through my process of building and deploying a website with Hugo, Gulp, Wercker and Amazon Web Services S3."
Author = "Dan Bahrami"
date = "2016-02-27T12:33:24+01:00"
publishdate = ""
Tags = [
    "Hugo",
    "Gulp",
    "AWS",
    "Wercker"
]
slug = "building-and-deploying-websites-with-hugo-gulp-wercker-aws"
Resources = []

+++

[Hugo][link-hugo] is a free and open-source static site generator with a beautifully simple setup process, a command line interface and several powerful features which I'll cover in this tutorial. It is aimed at people with some development experience who don't want to go through the hassle of building a complicated network stack just to output some html.

In this tutorial I am going to take you through the entire process of building a website with Hugo, using [GulpJS][link-gulp] as an asset pipeline, and finally deploying to [Amazon Web Services][link-aws] with an automated tool called [Wercker][link-wercker].

[link-hugo]: https://gohugo.io
[link-gulp]: http://gulpjs.com/
[link-aws]: https://aws.amazon.com/s3/
[link-wercker]: http://wercker.com/

<!--more-->

## Why hugo (or any static site genorator)?

Like many self taught web devs I started my career with Wordpress so, when I came to build my personal blog, Wordpress was my default idea. But over time I have come to see how many comprimises platforms like Wordpress have to make, all the extra baggage that they carry and ultimately how cumbersome they are (Sorry Wordpress fans) and not to mention how easy it is to find security flaws!!! So here's what I wanted...

1. Lightning fast page responses
2. Maintainability
3. A nice content editing and publishing experience
4. Not to worry about spammers hacking my site
5. And last but not least... simplicity. ahhhhhh

...Enter Hugo.

### The upsides

Hugo provides a light weight templating engine to build the layout of your site so you have tools like partial templates, iteration, variables. You can write all your content in nice, clean Markdown. When you're done you just tell hugo to compile it and the output is a set of pure HTML, CSS, JS and whatever other assets you want. Pop them up online and you're done (sort of).

Your server no longer needs a database because it is just serving static content and there is no compile step at runtime so there are huge performance benefits. All your blog posts and pages are just text files so you can use your editor of choice and you even get version control for your content.

The structure of a Hugo site is compact and clear so it's easy to maintain a project and Hugo even throws in a local server with Live Reload for free so you can see your changes take effect as you write... sign me up!

### The downsides

Static sites have their limitations. Want a highly interactive UI? how about a shop? Do you want your users to be able to log into your site? well... you can't.

Also, you get no dashboard for less tech-savvy contributors.

These are no problem for me but they might be for you.

## What you will need

I will assume that you are comfortable using the command line, I will be demonstrating commands on the Mac Terminal. A basic knowledge of Javascript and SCSS will be helpful but not essential. I will also assume that you have [GIT][link-git] and [Homebrew][link-homebrew] installed on your machine. If not, they are both simple installs so just follow the links. Now let's get started.

[link-git]: https://git-scm.com/downloads
[link-homebrew]: http://brew.sh/

## Git init

The first thing we want to do is set up a local git repo in a new directory which will contain our site. I keep all my sites in a folder `~/Code` so I'll make a new directory there and initialise a local git repo by running the following in the command line...

{{< highlight bash >}}
mkdir ~/Code/MySite
cd ~/Code/MySite
git init
{{< /highlight >}}

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

{{< highlight bash >}}
archetypes   config.toml   content   data   layouts   static
{{< /highlight >}}

That's it. 5 directories and a config file... simple

## Building the site

Now is the time to stop and think about the structure of your site. The structure of mine is very simple, I have one type of content - an article. A single article needs content but also the following bits of metadata.

- A title
- A URL
- An author
- A published date
- A description for SEO
- A list of tags or keywords
- A list of resources (always give credit!)

Apart from that, I only need a home page that lists my latest articles and that is it.

### Adding content

Let's add our first article. To add content Hugo gives us another command.

```
hugo new article/my-first-article.md
```

This will add a new markdown file at `content/article/my-first-article.md` and if you open it up you should see that it already has some base content.

```
+++
date = "2016-02-28T19:55:25Z"
draft = true
title = "my first article"

+++
```

### Archetypes

### A note about markdown

### Single layout

### Home page layout

## Building a Gulp pipeline

## Cache busting

## Extra touches
### Syntax highlighting with Pygments
### Adding Disqus comments
### Google analytics

## Setting up Wercker

## Setting up AWS S3