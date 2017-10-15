+++

title = "How we made our product more personalized with CSS Variables and React"
Description = "In this post, I’ll describe how and why we used CSS Variables (Custom Properties) in combination with React to re-style our web app on the fly!"
Author = "Dan Bahrami"
draft = false
date = "2017-10-15T12:33:24+01:00"
publishdate = "2017-10-15"
slug = "css-variables-custom-properties-react"
resources = [
    "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables",
    "https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care"
]

+++

I have seen some buzz around [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) lately and recently had the opportunity to use them as part of the front-end team at [Geckoboard](https://www.geckoboard.com/). They solved a very specific problem for us while being easy to use, fast, and maintainable. In this post, I’ll describe how and why we used CSS Variables in combination with React to re-style our web app on the fly!

<!--more-->

*Disclaimer: This post was originally [a Medium post](https://medium.com/geckoboard-under-the-hood/how-we-made-our-product-more-personalized-with-css-variables-and-react-b29298fde608) for [Geckoboard: under the hood](https://medium.com/geckoboard-under-the-hood/)*

## The problem

At [Geckoboard](https://medium.com/u/bfb03fc87209), we build live dashboards to display key metrics on TV screens. Being able to add your own personality to a dashboard is important to a lot of our customers, so a few months ago ourdesign team previewed a feature they were calling “Customization”.

The idea was simple: a form where you tweak your dashboard with new background colors, widget colors, font-sizes etc. and we would display a live preview of what your dashboard will look like.

![The design prototype for Customization with live preview](https://cdn-images-1.medium.com/max/1600/1*dTladcIJvtmb7apgLJ4mWQ.gif)
<span class="caption">The design prototype for Customization with live preview</span>

As soon as the engineering team saw the “live preview” aspect, we knew we had a hurdle to jump. Our site is a [React](https://facebook.github.io/react/) application and handling UI updates is easy, however all our styles are written in SASS, so changing the dashboard theme in such a reactive way would be a problem.

At this point we supported two themes: dark and light. Since the default theme was dark, we would override our main CSS by loading a `light.css` stylesheet whenever a user chose the light theme for their dashboard.

But now our design team wanted to support millions of possible themes and they needed to be applied without a page reload, in a performant way… we had to rethink what a “theme” was.

## These were our assumptions

1.  Our web-app would contain a single set of styles that could support any possible theme.
2.  A theme has a standard format and can be entirely defined in JSON. (this is how it will be stored in our database)
3.  The applied theme can be changed client-side (easily), and when it is, our view layer re-renders automatically to fully represent the change.
4.  The applied theme should be a top-down global concern, and not require opt-in from individual view components.
5.  There will always be a default theme which the applied theme may partially or fully override.

Here is an example of what a theme might look like in the new world…

{{<highlight css>}}
{
  'theme-primary-color': '#8DC63F',
  'widget-color': '#333333',
  'dashboard-footer-text-color': '#FFFFFF',
  // etc.
}
{{</highlight>}}

## Sounds like a job for “CSS in JS”!

Absolutely! This was a tempting option, combining inline styles with React would tick most of the boxes. Our styles would be flexible enough to support any theme, a JSON theme would be easy to parse and automatic re-renders would be handled by React.

On a fresh codebase, we definitely could have taken this route. However, at the time of writing, we have 29,951 lines of SASS in 566 files. Moving to inline styles would be one heck of change to make!

A few of us in the front-end team had done some reading around a new spec for native CSS Variables. It seemed interesting so we decided to build a proof of concept.

*Note: There are some great frameworks around that handle styles in React. If this is an option for you then check out [Radium](https://github.com/FormidableLabs/radium), [Styled Components](https://styled-components.com/) ,and [Styled JSX](https://www.npmjs.com/package/styled-jsx).*

## What are CSS Variables?

CSS Variables (Or [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) as they are officially known) are a new feature of CSS that allow you to define placeholder values for CSS properties. The syntax of a variable name is a string starting with two dashes (e.g.`--theme-primary-color`), variables are then referenced using a new CSS function `var()`. Here’s what using a CSS Variable looks like…

{{<highlight css>}}
/* Define a variable at the top level of the cascade */
:root {
  --theme-primary-color: blue;
}

/* You can use this variable throughout your styles */
.header {
  background: var(--theme-primary-color);
}
{{</highlight>}}

Now the background colour of my `.header` component will be whatever value I assign to the variable `--theme-primary-color`, in this case, ‘blue’. If at any time the variable updates, the browser repaints automatically and the updated style is applied.

In the above example the variable is assigned on the document’s [root selector](https://www.w3schools.com/cssref/sel_root.asp). Because this is the top level element, the value ‘blue’ will essentially be globally assigned to `--theme-primary-color` but variables can be redefined and also follow the cascade.

{{<highlight css>}}
:root {
  --theme-primary-color: blue;
}

.header {
  background: var(--theme-primary-color);
}

.sidebar {
  --theme-primary-color: red;
}

.sidebar .widget {
  background: var(--theme-primary-color);
}
{{</highlight>}}

In this example the `--theme-primary-color` variable is reassigned inside `.sidebar` so that when it gets used by `.widget` inside `.sidebar` it has the value ‘red’. The effect of this is that our header will have a blue background and our sidebar widgets will have a red background.

In addition, if a variable is referenced but is never defined, or if the browser you’re using doesn’t support CSS Variables, then it gets ignored completely. So we can add a fallback for these cases quite easily…

{{<highlight css>}}
.header {
  background: blue; /* Fallback */
  background: var(--theme-primary-color);
}
{{</highlight>}}

## Adding CSS Variables to our SASS

This was a relatively easy move. In total there were 63 properties in our SASS that needed to change depending on the theme. To avoid having to manually add fallbacks in all these cases, we created a SASS mixin.

{{<highlight css>}}
@mixin variable($property, $variable, $fallback) {
  #{$property}: $fallback;
  #{$property}: var($variable);
}
{{</highlight>}}

Then in our SASS we added the variables...

{{<highlight css>}}
/* what was... */
.dashboard {
  background: blue;
}

/* becomes... */
.dashboard {
  @include variable(background, --theme-primary-color, blue);
}

/* Which compiles to... */
.dashboard {
  background: blue;
  background: var(--theme-primary-color);
}
{{</highlight>}}

At this point we had a product that looked exactly the same, because our CSS was always falling back to the default values we set, but we were ready to start applying CSS Variables!

## Using CSS Variables with React

As I’ve mentioned, our UI is built in React, so we wanted a way to apply the theme with React. Considering our themes will be available as JavaScript objects, it is a perfect candidate to handle our 3rd assumption:

* The applied theme can be changed client-side (easily), and when it is, our view layer re-renders automatically to fully represent the change.

If we had a component that took the theme as a prop and applied it as CSS Variables then React could take care of re-renders for us when the theme changed.

## How to apply CSS Variables in JavaScript

So far I’ve talked about defining variables in CSS, but variables can also be defined with inline styles, either directly in HTML…


or by using the [JavaScript setProperty api](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty)…

{{<highlight js>}}
element.style.setProperty('--theme-primary-color', 'blue');
{{</highlight>}}

We built a React component around the latter. It takes an object that maps variable names to values (that just so happened to be what a “theme” looks like) and applies them as style properties on the document’s root element. Here is a simplified version of that component…

{{<highlight js>}}
class CSSVariableApplicator extends Component {
  componentDidMount() {  
    this.updateCSSVariables(this.props.variables);
  }

  componentDidUpdate(prevProps) {
    if (this.props.variables !== prevProps.variables) {     
      this.updateCSSVariables(this.props.variables);
    }
  }

  updateCSSVariables(variables) {   
    forEach(variables, (value, prop) => {
      document.documentElement.style.setProperty(prop, value));
    });
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
{{</highlight>}}

As an implementation detail, we store our theme and handle updates with Redux, but here’s an example use without Redux…

{{<highlight js>}}
class App extends Component {
  constructor(props) {
    super(props);

    const theme = {
      '--theme-primary-color': '#8DC63F',
      '--widget-color': '#333333',
      '--dashboard-footer-text-color': '#FFFFFF',
    };

    this.state = { theme: theme };
  }

  render() {
    return (
      <div>
        <CSSVariableApplicator variables={this.state.theme} />
        {* the rest of the app *}
      </div>
    );
  }
}
{{</highlight>}}

Guess what - it worked like a charm! I was shocked how easy it was to apply themes like this. When the theme is modified in state our component immediately applies the CSS Variables globally and the page is re-rendered with the new theme. That was a good feeling.

![The working live-preview feature!](https://cdn-images-1.medium.com/max/1600/1*e-3LOeDUbwR9rr4h7wyLrw.gif)
<span class="caption">The working live-preview feature!</span>

In this GIF there is a single, static CSS file, no styles are set inline and none of our React components (except the theme applicator) need to worry about the theme.

Even though our styles are still in CSS, we now have the full power of JavaScript to calculate theme values. In the screenshot above, you may notice that the widget background color is automatically selected based on the background color; this is not using transparency, we are calculating an appropriate color choice based on the background color.

![](https://cdn-images-1.medium.com/max/1600/1*qwBxCQh8X52tgzc6QRlbUw@2x.png)

## The cons

Of course, we can’t talk about new features of the CSS spec without browser support rearing its ugly head. Unfortunately, at the time of writing, there is no IE support at all for CSS Custom Properties.

![Browser support chart for CSS Custom Properties](https://cdn-images-1.medium.com/max/2000/1*RSxwhWR_vHOXdqH81VnzyQ.png)
<span class="caption">Browser support for CSS Custom Properties</span>

Another downside is that our JavaScript and CSS are tied slightly more together now because they both need to be aware of what CSS variables we use. This is certainly a trade-off but it’s one we were willing to make.

## You should publish that React component to NPM!

I already have! It’s called [react-custom-properties](https://www.npmjs.com/package/react-custom-properties) and it is slightly more powerful than the example above. It can apply CSS Variables globally or to a specific part of your UI, it can also be nested so you can go crazy with CSS Variables!
