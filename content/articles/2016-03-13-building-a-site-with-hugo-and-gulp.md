+++

title = "Building a production website with Hugo and GulpJS"
Description = "This tutorial walks through my process of building a static website with Hugo and using Gulp as an asset pipeline for CSS, JS and images."
Author = "Dan Bahrami"
date = "2016-02-27T12:33:24+01:00"
publishdate = "2016-03-13"
slug = "building-a-production-website-with-hugo-and-gulp-js"
resources = [
    "https://gohugo.io/",
    "http://atchai.com/blog/the-cms-is-dead-long-live-hugo-wercker-proseio-and-cloudfront/",
    "https://www.smashingmagazine.com/2015/11/static-website-generators-jekyll-middleman-roots-hugo-review/"
]

+++

[Hugo][link-hugo] is a free and open-source static site generator (SSG) with a beautifully simple setup process, a command line interface and several killer features which I'll cover in this tutorial. I am going to take you through the entire process of building a production website with Hugo, using [GulpJS][link-gulp] as an asset pipeline for CSS, JS and images.

[link-hugo]: https://gohugo.io
[link-gulp]: http://gulpjs.com/

<!--more-->


## Why Hugo?

When looking for a platform for my personal site the idea of a static site generator really appealed to me. I wanted a basic, content driven site with very few requirements.

1. Lightning fast page responses
2. A delightful content editing and publishing experience
3. A delightful development experience
4. A simple and maintainable code-base
5. Solid security (Wordpress I'm looking at you!)

By just hosting static asset files (html, css, js and images) instead of an entire database driven platform like Wordpress you get speed, security and cost benefits. So I was quickly sold on an SSG.

But why Hugo? Well to be honest, I haven't got much experience with any SSG and I had to pick one. Hugo seemed to have a growing community and it felt lightweight compared to most other established SSGs I could find. Also the [documentation][link-hugo-docs] is pretty good so I ran with it and have enjoyed my experience so far.

[link-hugo-docs]: https://gohugo.io/overview/introduction/


## What you will need

I will assume that you are comfortable using the command line, I will be demonstrating commands on the Mac Terminal. A basic knowledge of Javascript and SCSS will be helpful but not essential. I will also assume that you have [Homebrew][link-homebrew], [NodeJS][link-node] and [npm][link-npm] installed on your machine. If not, just follow the links, they are all relatively easy to install.

[link-homebrew]: http://brew.sh/
[link-node]: https://nodejs.org/
[link-npm]: https://www.npmjs.com/


## Installing Hugo

The first thing to do is set up  a new directory to contain our site. I keep all my sites in a folder `~/Code` so I'll make a new directory there.

```
mkdir ~/Code/MySite
cd ~/Code/MySite
```

Next install Hugo with Homebrew.

```
brew install hugo
```
If you don't have Homebrew then the [Hugo docs][link-hugo-docs] explain how to install it manually. And while you're there, the docs are an excellent resource so you'll do well to just read them start to finish.

[link-hugo-docs]: https://gohugo.io/overview/installing/

Now you have the Hugo executable installed in your path, you can create a new Hugo site in the current directory by running

```
hugo new site .
```

If you list your directory contents you should now see that Hugo has setup a basic directory structure for you and added a config file.

```
ls
archetypes   config.toml   content   data   layouts   static
```

That's it. 5 directories and a config file... simple!


## Building the site

Now is the time to stop and think about the structure of your site. The structure of mine is very simple, I have one type of content - an article. A single article needs content and a few bits of metadata.

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
hugo new articles/my-first-article.md
```

This will add a new markdown file at `/content/articles/my-first-article.md`, if you open it up you should see that it already contains some boilerplate.

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

You can define the boilerplate that Hugo creates by default for any content type by adding an [archetype][link-hugo-archetypes]. In my case I know that every article will have the same metadata fields so an archetype will save me having to repeat the process of adding them each time.

[link-hugo-archetypes]: https://gohugo.io/content/archetypes/

```
touch archetypes/articles.md
```

Then I'll add the front matter I want...

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
hugo new articles/my-second-article.md
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

By default the URL structure of your site will echo the structure of your content folder. So with a root URL of `http://example.com` this article would have the URL `http://example.com/articles/my-second-article/`. There are ways to configure how Hugo handles URLs but it's outside the scope of this tutorial.


### A note about markdown

Until now I had never really taken much of an interest in Markdown, preferring to write in HTML, but wow have I been enjoying it. I am using an app called [Byword][link-byword] and the writing experience is so clean. Although there is a bit of lag with the syntax highlighting sometimes it is in general a great tool.

[link-byword]: https://bywordapp.com/


### Compiling a Hugo website

Now we have content but not a website so next comes the compiling stage. To get Hugo to compile just run...

```
hugo
```

Well that was fast! You should get some output telling you how many pages Hugo has created for us and if you have a look at the directory structure you'll find a new `public/` directory. This is where hugo places the compiled output.

```
ls public/
404.html   articles   index.html   index.xml   sitemap.xml

ls public/articles/
index.html   index.xml   my-first-article   my-second-article
```

It seemed like everything worked but not quite. The `hugo` command swallows any warning messages when it compiles, perhaps someone with more Hugo experience can explain that decision but to me it seems odd. We can see what's really going on by adding a `--verbose` flag.

```
hugo --verbose
```

Hmm that doesn't look good. Since I first discovered that Hugo hides these warnings by default I have always used the `--verbose` flag. Hugo is complaining that it can't find a layout for articles, the home page and 404 page. That is probably because they don't exist yet.


### Single layout

Those familiar with Wordpress should know what a single layout is responsible for. It's for defining the layout of a single piece of content, in this case an article. However unlike Wordpress, layouts in Hugo are HTML files. For Hugo to recognise a single layout for articles it must have the file path `/layouts/articles/single.html`.

```
touch layouts/articles/single.html
```

And in that file we'll stub out a basic layout.

{{<highlight html>}}
<!DOCTYPE html>
<html>
<head>
    <title>{{ .Title }}</title>
    <meta charset="UTF-8">
    <meta name="description" content="{{ .Description }}">
</head>
<body>
    <main>
        <article>
            <h1>{{ .Title }}</h1>
            {{ .Content }}
        </article>
    </main>
</body>
<html>
{{</highlight>}}

You'll notice that, although the layout is mostly html there are some strange tags inside double curly braces. Anyone familiar with other templating engines like [Smarty][link-smarty] or Laravel's [Blade][link-blade] will recognise the syntax. Inside curly braces you have access to tools and logic that Hugo templates provide. In all cases in the layout above we are accessing variables in the article scope.

[link-smarty]: http://www.smarty.net
[link-blade]: https://laravel.com/docs/5.1/blade

When Hugo compiles, for each article it will use this layout, replace the variables in curly braces with the article title and content and output it as a static html file.

Scope in Hugo took me a little while to understand but `{{ . }}` is the current scope and then we can access properties of that scope, so the scope in this case references an article object that has a Title and Content property. I found the [variables][link-hugo-variables] page in the Hugo docs helpful here.

[link-hugo-variables]: https://gohugo.io/templates/variables/


### Home page layout

Now we need a home page layout. For the purposes of this tutorial we will just have a list of articles, each with a summary and a link to the full article. The home page layout will need the file path `/layouts/index.html`.

```
touch layouts/index.html
```

Here is the layout contents...

{{<highlight html>}}
<!DOCTYPE html>
<html>
<head>
    <title>{{ .Title }}</title>
    <meta charset="UTF-8">
    <meta name="description" content="{{ .Description }}">
</head>
<body>
    <main>
        {{ range first 10 .Data.Pages }}
        {{ if eq .Type "articles" }}
            <article>
                <h1>
                    <a href="{{ .Permalink }}">
                        {{ .Title }}
                    </a>
                </h1>
                {{ .Summary }}
                <a href="{{ .Permalink }}">
                    Read the full article
                </a>
            </article>
        {{ end }}
        {{ end }}
    </main>
</body>
<html>
{{</highlight>}}

OK, that's a bit more complicated than the previous layout, so let's have a look at what is happening. It's all ok until we get to the line...

```
{{ range first 10 .Data.Pages }}
```

 There is a lot going on in this line and I will explain from right to left.

`.Data.Pages` is a list containing all the pages and content on our site. It will contain all our articles but also any other static pages like a contact or about me page.

`first` is a helper function that Hugo provides that slices a number of items from a list. It accepts an integer and a list as arguments. So the return value of `first 10 .Data.Pages` is the first 10 items in `.Data.Pages`. Because of the way the list is ordered this will be the 10 most recent pages of our site.

`range` is a GO function for iterating through lists. So all together this line is starting a foreach loop and iterating over the latest 10 pages in our site. Everything between this line and the last `{{ end }}` will be executed on on each iteration.

Now remember `.Data.Pages` doesn't only contain our articles but all static pages and any content from other content types too. As we only want to display a list of articles here we need to check the page type. So that is what the next line is doing.

```
{{ if eq .Type "articles" }}
```

`eq` is a GO function that accepts two arguments, tests their equality and returns true or false. Because we are inside a foreach loop the scope is the current page being iterated so we are checking that the current page's type is equal to "articles" and if so executing everything from here to the first `{{ end }}`.

The rest is fairly simple, we are laying out what a single listing for an article should look like in the list.


### 404 layout

The 404 layout can be whatever you want but I won't bother making one now, lets just create an empty file to appease Hugo's compiler.

```
touch layouts/404.html
```


### Hugo server

Now if we go back to the command line and ask Hugo to compile our site we should get a better result.

```
hugo --verbose
```

Awesome! But hey, do I really need to go back to my command line and compile Hugo to see every small change take effect? That doesn't seem like a very delightful development experience. But Hugo has us covered.

Hugo comes with a local server and live reload out of the box so that we can make changes to our files and see the updates immediately in the browser without having to reload the page or anything. Having set up live reload on a [ReactJS][link-react] project before with [Webpack][link-webpack] I was a bit nervous when I read "live reload" in the Hugo docs because, although it's a great feature to have when developing a site, it took a load of time, sweat, blood and boilerplate to get it working properly.

[link-react]: https://facebook.github.io/react/
[link-webpack]: https://webpack.github.io/

With Hugo it's a single terminal command...

```
hugo server --watch --verbose
```

When you run the command make sure to read the output. The penultimate line will say something like `Web Server is available at http://127.0.0.1:1313/`. Copy and paste the URL into a browser and you should see your site's homepage. Now try making a change to the content of one of your articles and see the magic of live reload.

A quick note - when Hugo compiles it doesn't do a great job at clearing out old files from your public folder so if you want to be extra careful wipe your public folder before each compile or before running Hugo server.

```
rm -rf public/
```

The site is looking good!!! Well actually, no it looks terrible. Let's add some styling.


## The static directory

When Hugo first created our site it added 5 directories to our root. We have already seen what `archetypes/`, `content/`, and `layouts/` are used for. We now have an extra directory `public/` that contains the final compiled output of our site. Let's have a look at the `static/` directory.

It is very simple... anything that you put in the `static/` directory, Hugo will copy byte for byte into the `public/` folder when it compiles. Which is fine for our static assets like CSS stylesheets, Javascript files and images.

So just to demonstrate let's add some styles to the home page. First create a file `static/css/main.css`.

```
touch static/css/main.css
```

I'll add some ridiculous style just to see that the CSS is taking effect on our page.

{{<highlight css>}}
body {
    background: #FF0000;
}
{{</highlight>}}

And now we just need to include the styles in the head of our home page html.

{{<highlight html>}}
...
<head>
    <title>{{ .Title }}</title>
    <meta charset="UTF-8">
    <meta name="description" content="{{ .Description }}">
    <link rel="stylesheet" href="/css/main.css" />
</head>
...
{{</highlight>}}

Now run Hugo server and see if it worked. Just as a note, instead of typing out `--watch --verbose` every time you can shorten it to `-wv`.

```
hugo server -wv
```

Woaaah! Red. And if you take a look in your public folder you'll see Hugo has copied `static/css/main.css` to `public/css/main.css` exactly as we wanted.

So that is the basic mechanism for how you can add assets to a Hugo site. But personally I don't want to build all my assets by hand in the `static/` folder, I want to build a maintainable code base using Sass and have Gulp compile my output. That's modern web development, compilers all the way down.


## Building a Gulp pipeline

I'm going to assume you know about Gulp so I won't explain the principle. I'm going to setup Gulp to compile my SCSS into a production ready state. I also want to make sure that when I deploy a new version of my CSS that browsers download the new version instead of using the version they have previously cached (also known as cache busting). For good measure I am also going to implement cache busting for any JS files and images.

The end result we want is a set of compiled assets to be placed in the `static/` directory for Hugo to use in it's compile step. This will be Gulp's output destination so we need a directory to keep our pre-processed working files. I like to keep mine in a `src/` directory. I will also create separate directories inside for SCSS, JS and images.

```
mkdir -p src/{scss,js,images}
```


### Installing Gulp

OK, first thing's first, initialise an NPM project in your root project directory.

```
npm init -y
```

Now we need to install the `gulp` and `gulp-sass` npm packages, I also find autoprefixing to be really helpful so let's install `gulp-autoprefixer` too.

```
npm install --save-dev gulp gulp-sass gulp-autoprefixer
```


### Creating tasks in gulpfile.js

Now we need to tell Gulp what to do by creating a gulpfile.

```
touch gulpfile.js
```

At the very top of the file we need to require our dependencies.

{{<highlight js>}}
var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer")
{{</highlight>}}

Underneath the require statements we need to build our tasks. The first will compile all our .scss files and output them to the `static/` directory, the second will watch the file system for changes and run the compile when it sees a change. With these 2 tasks you can modify your styles and gulp will compile them in the background and output the compiled CSS to the `static/` directory, if you're running Hugo server in watch mode then Hugo will also see this as a change and live reload your browser.... awesome!

The tasks...

{{<highlight js>}}
// Compile SCSS files to CSS
gulp.task("scss", function () {
    gulp.src("src/scss/**/*.scss")
        .pipe(sass({
            outputStyle : "compressed"
        }))
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(gulp.dest("static/css"))
})

// Watch asset folder for changes
gulp.task("watch", ["scss"], function () {
    gulp.watch("src/scss/**/*", ["scss"])
})
{{</highlight>}}

I find it easier to set my watch task as the default task so that I can just type `gulp` into the command line. We'll do that at the bottom of our gulpfile.

{{<highlight js>}}
// Set watch as default task
gulp.task("default", ["watch"])
{{</highlight>}}

Now in the command line you can run...

```
gulp
```

And all your SCSS files will be compiled.


### SCSS folder structure

I won't go into much depth about how I structure my SCSS but I highly recommend reading [The Sass Guidelines][link-sass-guidelines] by Hugo Giraudel, in which he lays out the 7-1 pattern for large Sass projects. I've found in the past that, even on small projects, having this structure really helps me navigate around my styles.

[link-sass-guidelines]: http://sass-guidelin.es/#architecture

For now though let's just create a file called `main.scss`.

```
touch src/scss/main.scss
```

And we'll add that beautiful body color, maybe with a bit of scss power to prove it's working...

{{<highlight css>}}
$red : "#FF0000";

body {
    background: $red;
}
{{</highlight>}}


## Cache busting

For cache busting we will add an automatically generated hash of the file to the filename of every static asset. With this method, when a file changes a new hash will be generated but unchanged files will have the same hash... the name of the file is an artifact of the contents. This means browsers will only have to redownload files when they have been modified.

There are three parts to this method. First you need to configure gulp to add hashes to the names of all files it processes. Then you need to store a map relating the original file names to the new hashed filenames. Finally, you need to change any reference of the old asset file in your html to the new hashed file...

{{<highlight html>}}
<link rel="stylesheet" href="css/main.css" />
{{</highlight>}}

Needs to become...

{{<highlight html>}}
<link rel="stylesheet" href="css/main-{{ hash }}.css" />
{{</highlight>}}


### Step 1: Hashing with Gulp

We need to install two more npm packages `gulp-hash` and `del`.

```
npm install --save-dev gulp-hash del
```

We can use `gulp-hash` to hash our files and generate the hash map, and as Gulp will be generating a new filename each time a file changes we need to delete the old file because it will not be overwritten. that's where `del` comes in.

OK, let's update our gulp tasks to add hashing. First we need to require `gulp-hash` and `del`.

{{<highlight js>}}
var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del")
{{</highlight>}}

Then add hashing to our gulp task pipeline.

{{<highlight js>}}
// Compile SCSS files to CSS
gulp.task("scss", function () {

    //Delete our old css files
    del(["static/css/**/*"])
    
    //compile hashed css files
    gulp.src("src/scss/**/*.scss")
        .pipe(sass({
            outputStyle : "compressed"
        }))
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(hash())
        .pipe(gulp.dest("static/css"))
})
{{</highlight>}}

For good measure let's include tasks to hash images and JS files too...

{{<highlight js>}}
// Hash images
gulp.task("images", function () {
    del(["static/images/**/*"])
    gulp.src("src/images/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/images"))
})

// Hash javascript
gulp.task("js", function () {
    del(["static/js/**/*"])
    gulp.src("src/js/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/js"))
})
{{</highlight>}}

And let's update the watch task to include the new "images" and "js" tasks...

{{<highlight js>}}
// Watch asset folder for changes
gulp.task("watch", ["scss", "images", "js"], function () {
    gulp.watch("src/scss/**/*", ["scss"])
    gulp.watch("src/images/**/*", ["images"])
    gulp.watch("src/js/**/*", ["js"])
})
{{</highlight>}}

Now if you run Gulp and check in the `static/css/` directory you should see that it is hashing your stylesheet to something like `main-9b407fcb.css`. It's working, but how do our html layouts know which file it needs to be looking for? For this we can use the last unknown Hugo directory `data/`.


### Step 2: Data files

The `data/` directory is for storing site data. You can add data files in TOML, YAML or JSON and Hugo will make that data accessible in a global variable `.Site.Data`. So if we can create a data structure that maps the original asset filenames to the latest hashed filenames we can make that globally accessible by putting it in a data file.

Fortunately `gulp-hash` has a built in method `hash.manifest` that will generate a mapping in JSON for us. If we add this to all our tasks the final `gulpfile.js` will look like this...

{{<highlight js>}}
// Compile SCSS files to CSS
gulp.task("scss", function () {
    del(["static/css/**/*"])
    gulp.src("src/scss/**/*.scss")
        .pipe(sass({outputStyle : "compressed"}))
        .pipe(autoprefixer({browsers : ["last 20 versions"]}))
        .pipe(hash())
        .pipe(gulp.dest("static/css"))
        //Create a hash map
        .pipe(hash.manifest("hash.json")
        //Put the map in the data directory
        .pipe(gulp.dest("data/css")
})

// Hash images
gulp.task("images", function () {
    del(["static/images/**/*"])
    gulp.src("src/images/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/images"))
        .pipe(hash.manifest("hash.json")
        .pipe(gulp.dest("data/images")
})

// Hash javascript
gulp.task("js", function () {
    del(["static/js/**/*"])
    gulp.src("src/js/**/*")
        .pipe(hash())
        .pipe(gulp.dest("static/js"))
        .pipe(hash.manifest("hash.json")
        .pipe(gulp.dest("data/js")
})

// Watch asset folder for changes
gulp.task("watch", ["scss", "images", "js"], function () {
    gulp.watch("src/scss/**/*", ["scss"])
    gulp.watch("src/images/**/*", ["images"])
    gulp.watch("src/js/**/*", ["js"])
})
{{</highlight>}}

Once again run gulp. Now look in the data directory...

```
ls data/
css/    images/    js/

ls data/css/
hash.json
```

And in `hash.json` you will find something like...

{{<highlight json>}}
{"main.css":"main-9b407fcb.css"}
{{</highlight>}}

Excellent now all that's left to do is update our html layouts to query the new data file.


### Step 3: Using data in layouts

As I mentioned before, our new hash map should now be accessible as a global variable in Hugo layouts `.Site.Data`.  Within that you can access specific data files by appending their filepath. So our hash map is accessible at `.Site.Data.css.hash`.

So in our layouts, instead of directly referencing the file `/css/main.css` we need to do a lookup...

The css link tag originally looked like this...

{{<highlight html>}}
<link rel="stylesheet" href="/css/main.css" />
{{</highlight>}}

Will now look like this...

{{<highlight html>}}
<link rel="stylesheet" href="/css/{{ index .Site.Data.css.hash "main.css" }}" />
{{</highlight>}}

`index` is a Go built-in function that accepts a map and an index and returns the value of the map with the given index. So here we are asking Hugo to give us the value in `.Site.Data.css.hash` that has the index `"main.css"`... which of course is the filename of the hashed asset file.


## Final build

Ok, so with all that done my development process looks like this. Open up 2 tabs in the command line. The first running...

```
hugo server -wv
```

and the second...

```
gulp
```

I have `http://localhost:1313` open in my browser watching the updates take shape on the fly. And when i'm ready to do my final build before deploy I wipe my `public/` directory and run a gulp build and a hugo build...

```
rm -rf public
hugo
gulp
```

And that's it. Site built. Thanks Hugo, thanks Gulp.

-----------------------------------------------


## Extra touches

There is a lot I haven't covered in this tutorial, like [partial templates][link-partial-templates], or [shortcodes][link-shortcodes], or the actual deployment process (by the way I am using AWS to host this site). But I thought I'd cover a few more little bits that might be helpful.

[link-partial-templates]: https://gohugo.io/templates/partials/
[link-shortcodes]: https://gohugo.io/extras/shortcodes/


### Syntax highlighting with Pygments

I love syntax highlighting, and Hugo has it built right in. In fact, you may have noticed that my HTML, CSS and JS code blocks are coloured nicely in this tutorial. Hugo uses the Python based [Pygments library][link-pygments] internally but you really don't need to worry about that.

[link-pygments]: http://pygments.org/

Here is what my markdown looks like when I want some of my code to be syntax highlighted...

```
{ {<highlight js>} }

var foo = "English men"
var bar = "bar"

function getJoke(foo, bar) {
    return
        "two " + foo + " walk into a " + bar
}

{ {</highlight>} }
```

{{<note>}}
The actual syntax used does not have a space between the two curly braces but If I type it correctly Hugo thinks I'm asking it to do it's highlighting thing. so use `{{ }}` instead of `{ { } }`.
{{</note>}}

The result...

{{<highlight js>}}

var foo = "English men"
var bar = "bar"

function getJoke(foo, bar) {
    return
        "two " + foo + " walk into a " + bar
}

{{</highlight>}}

By default Pygments uses the classic monokai colour scheme and inlines styles into the HTML. If, like me, you prefer to have a bit more control over your styles you can set Pygments to use CSS classes instead of inline the styles by adding this to your `config.toml` file...

```
pygmentsuseclasses = true
```

Then you must create your own styles for the output classes. I did find [this repository by Richard Leland][link-pygments-styles] that contains the CSS files for all of Pygments default styles which is a great starting point.

[link-pygments-styles]: https://github.com/richleland/pygments-css


### Adding Disqus comments

Of course one issue with a static site is that they aren't really set up for user interaction. Since you only have HTML files you have no endpoint for posting forms to or anything like that. This is a problem if you want comments on your blog like I do. Hugo does however include a quick way to set up the 3rd party [Disqus][link-disqus] comments.

[link-disqus]: https://disqus.com/

Firstly you need to go to the Disqus website, register an accound and create a channel. Disqus will give you a shortname for your channel. Add this shortname to your `config.toml` like this...

```
disqusShortname = "YOUR_DISQUS_SHORTNAME"
```

And then in your layouts add the following line wherever you want your comments to be...

```
{ { template "_internal/disqus.html" . } }
```

{{<note>}}
again, remove the spaces between the curly braces
{{</note>}}


### .gitignore

One problem with having all these build processes going on in the background is that they generate a lot of files, when combined with version control this causes lots of commit noise for files that are just artifacts of the actual source code. To help you here I thought I'd share my .gitignore file with you...

```
node_modules/
data/**/hash.*
static/
public/
```

This catches all the following build artifacts.

- nmp packages
- all our hash maps
- our `static/` directory because thanks to Gulp this just an artifact of our `src/` directory
- the public folder

And that's it. Thanks for reading, this is my first ever tutorial and probably full of holes so please let me know if you want me to correct anything or if there's any key bits of information I have missed.