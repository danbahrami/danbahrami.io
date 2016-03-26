+++
Author = "Dan Bahrami"
Description = "My workflow for deploying a static Hugo site to an Amazon S3 bucket with Wercker, in some places the road was unmarked and the docs were sparse."
Resources = [
    "https://gohugo.io/tutorials/automated-deployments/",
    "http://devcenter.wercker.com/docs/deploy/s3.html",
    "https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html"
]
date = "2016-03-25T11:21:33Z"
draft = false
publishdate = "2016-03-26"
slug = "wercker-s3-workflow-hugo-deploy"
title = "A continuous deployment workflow for Hugo with Wercker and Amazon AWS S3"

+++

After some trial and error finding the right deployment for my site I thought I'd share a few of the intricacies and issues I had deploying my static Hugo site to an S3 bucket with Wercker. The basics are fairly simple and [explained well in the Hugo Docs][link-hugo-deployment] but there is not much documentation out there for the little touches like handling cache control and minifying your HTML output to please the Google Page Speed gods.

[link-hugo-deployment]: https://gohugo.io/tutorials/automated-deployments/

<!--more-->

## RTFM!!!

First thing's first, [read this tutorial][link-hugo-deployment]. It will take you through the process of setting up a git repo for your site, creating an account with Wercker and setting up a build step for your site. You can skip the 'Adding a GitHub Pages step' section because we will be hosting on an S3 bucket instead of GitHub Pages. But carry on with the final steps of setting up a deploy target.

## S3 bucket configuration

After signing up for Amazon S3 [here][link-s3] you will need to create a S3 bucket with the name of your domain. I followed [Amazon's tutorial][link-amazon-tutorial] for setting up buckets with a cusom domain name and found it really helpful. To test that everything was working fine I uploaded a test index.html and 404.html to my S3 bucket to double check that I was seeing the right documents on page load.

[link-s3]: https://aws.amazon.com/s3
[link-amazon-tutorial]: https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html

Once you have your S3 buckets forwarding to your domain name you can go back to your Wercker console.

## Generate your AWS security keys

To allow Wercker to deploy to an S3 bucket you must provide a set of access keys. You can generate a new set in the [Security credentials section of the AWS][link-aws-security]. Just press `Create New Access Key` under the Access Keys section. When you receive your new keys, make sure you save them somewhere safe because Amazon won't let you see the Secret key every again.

[link-aws-security]: https://console.aws.amazon.com/iam/home#security_credential

## Wercker environment variables

To allow Wercker to deploy to an S3 bucket you must provide it with your AWS credentials at the deploy step which include the URL of your S3 bucket and both public and secret keys. Now obviously you don't want to publish these details to your public git repo so you need to create some Wercker environment variables.

Go to your new application in the Wercker console, click the top right setting button and then select 'Environment variables' in the sidebar. Then create three protected varibles, one for your AWS key, another for the secret and a final one for the URL of your S3 bucket.

I initially thought this should be the long URL that S3 provided when you first setup the bucket... something like `danbahrami.io.s3-website-eu-west-1.amazonaws.com` and I banged my head against the wall because it just wouldn't work. Turns out what Wercker needs is a URL in this format `s3://{{ bucket name }}` so for my site the URL is `s3://danbahrami.io`.

Once your environment variables are stored you can setup your Wercker deploy step

## werkcer.yml

My `wercker.yml` file looks like this...

```
box: node

build:
  steps:
    - npm-install
    - hgen/gulp
    - arjen/hugo-build:
        version: "0.14"
    - samueldebruyn/minify:
        css: false
        js: false

deploy:
  steps:
    - s3sync:
        key_id: $KEY
        key_secret: $SECRET
        bucket_url: $URL
        source_dir: public/
        opts: --add-header=Cache-Control:max-age=604800
```

I'll break this down...

### Node box

Because I am using Gulp to build my sass and cache-bust my assets I need Wercker to run NodeJS for me. Fortunately Wercker provides a box with node installed so I have set `box: node` at the top to specify that. Again this took some searching around to find when I realised my builds were failing and the Wercker docs are lacking here.

### Build step

The next step is the build step. Here's what my build step does in order...

- `npm-install`: obviously... installs npm
-  `hgen/gulp`: This just runs my gulpfile as I would do locally
-  `arjen/hugo-build`: This step does my Hugo site compile
-  `samueldebruyn/minify`: This step minifies all my HTML... because Google says so!

### Deploy step

The `s3sync` step is what deploys to your S3 bucket. in the options underneath I am providing pointers to my three environment variables `KEY`, `SECRET` and `URL`, specifying that the `public/` directory of the compiled output is what needs to be deployed and also telling S3 to add a week of browser caching to all assets...

Browser caching is good for page speed but it has the massive benefit of saving you money on your S3 bill... each asset on each page load served from the cache is one less GET request to pay for.


## Git push

And that's it, all you need to do know is push to master. If you want, have the Wercker console open on your application and you can watch the progress bars fly and the satisfying little green tick appear as the build and deploys run successfully.... good work. #webmaster

