# Your studio website

A five-page site to show prospective clients: who you are, what you've built,
how you work, what it costs, and how to reach you.

**To look at it:** double-click **`Preview site.cmd`**. It opens
<http://localhost:8770/> and keeps a small web server running in a black window.
Close that window when you're done.

---

## The pages

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Headline, who-we-are blurb, how we build, featured project, the three steps, stats |
| Work | `work.html` | The Auntie M's build in full — every page, screenshotted |
| About | `about.html` | Longer intro, **your video**, the three of you, the AI question answered, FAQ |
| Pricing | `pricing.html` | Two packages, a comparison chart, the monthly edit option, money FAQ |
| Contact | `contact.html` | Your details and a message form |
| Getting your site | `handover.html` | The GitHub handover steps, written for the client |

`handover.html` sits in the top menu as **Handover**, between Pricing and
Contact. A client can find it themselves after the call, and you can also send
the direct link (`yoursite.com/handover.html`). It's in the footer too.

Prospects who haven't bought anything will see it as well, which is no bad
thing — a menu item showing exactly how the site ends up in their name backs up
the "you own it outright" promise made everywhere else.

Each subject now lives in exactly one place. Money is only on Pricing, the
three-step process is only on Home, and the AI explanation is only on About.
If you add something, try to keep it that way — the earlier version repeated
"you don't pay until you've seen it" a dozen times and it started to sound
like a sales pitch rather than a promise.

There's also `404.html`, which shows if someone hits a bad link.

---

## Your prices

`pricing.html` shows two packages:

| Package | Price | What it is |
| --- | --- | --- |
| The One-Pager | **$150** | Everything on a single page |
| The Full Site | **$300** | Up to 10 pages — the one most people take |

Plus an optional monthly arrangement: **$0/month** if the site is left as built,
**$10/month** if they want to send you changes whenever they like.

**One thing left open.** The $0 column now says *"Ask us and we'll price up the
one-off"*, so the two options differ properly: pay per change, or pay $10 a
month and changes are included. You haven't set a one-off rate — decide roughly
what you'd charge for a small change before a client asks, so you're not
working it out on the phone.

**Important framing on that $10.** The site is never hosted or held by you —
it lives on the client's own GitHub account from the day of handover. The
monthly fee buys them the convenience of you doing the typing, via editor
access they grant and can revoke. The pricing page states this outright in a
green box, and the handover page repeats it. Don't let that wording drift back
towards "we look after it" or "we keep it online" — it changes what you'd be
selling, and it's the sort of thing that sounds like a lock-in.

If you change a price, change it in **two places**: the cards near the top of
the page, and the comparison chart below them. There's a comment in the file
marking the spot.

The turnaround times in the chart (1–2 wks / 2–4 wks) are still orange
placeholders — we had nothing to base them on. Put in whatever you can actually
deliver.

The Full Site is double the One-Pager, which makes it a real choice rather than
an obvious one — someone who genuinely only needs one page can take it without
feeling short-changed, and everyone else can see why $300 is worth it.

---

## Before you show this to anyone — 5 things to fill in

Everything that still needs your input is marked in the page with an
**orange dashed box**, so you can spot it at a glance in the browser.

### 1. The studio name

Right now it says **Northwind Studio** everywhere. That's a placeholder.

Right-click **`rename.ps1`** → *Run with PowerShell*, type your real name, and
it updates all five pages plus the little logo square and the browser-tab icon.

### 2. The three of you — `about.html`

Find the "Three of us. One kitchen table." section. There are three cards:
your dad (Owner), then the two of you. Replace:

- `Your dad's name`, `Your name` and `Your sister's name`
- The three `Two or three sentences about…` blocks
- The roles (`Owner`, `Design & build`, `Words & client care`) if those
  aren't right

The `D`, `1` and `2` in the coloured circles are meant to be each person's
initial — change those too.

### 3. Your contact details — `contact.html`

Four rows near the top: email, phone, town, hours. Each one needs the visible
text changed **and** the link behind it:

```
<a class="contact-row" href="mailto:your@email.com">   <- change this
  <span class="v"><span class="ph">your@email.com</span></span>   <- and this
```

Once you've put the real value in, delete `class="ph"` so it stops looking like
a placeholder. Same email also appears in:

- the form: `data-mailto-form="your@email.com"`
- the footer of every page

### 4. Your intro video — `about.html`

Record ~30 seconds of the two of you saying your names and what you do. Save it
as:

```
assets/video/intro.mp4
```

That's it — the placeholder card detects the file and swaps itself out for a
real video player. You'll need to create the `assets/video` folder first.

A still image at `assets/img/video-poster.jpg` will show before it plays. That's
optional but makes it look better.

**Filming tips:** landscape (phone sideways), somewhere quiet, good light on
your faces. Under a minute. It doesn't need to be slick — it needs to look like
two real people, which is the whole selling point.

---

### 5. Two small gaps in the FAQs

- `about.html` — *"How long does a build take?"* needs your usual turnaround
- `pricing.html` — *"Can I pay in instalments?"* needs your answer

---

## The handover page

`handover.html` walks a client through taking ownership. Your side of it:

1. They email you their GitHub username.
2. In the repo: **Settings → General → Danger Zone → Transfer ownership**.
   Enter their username and confirm.
3. They get an email from GitHub and accept it. GitHub expires that invitation
   after about a day — if it lapses, just start the transfer again.
4. After the transfer, the site's default GitHub Pages address changes to use
   *their* username, so check Pages is still switched on and re-apply the custom
   domain. The page tells them this bit is yours to do, so don't skip it.

A couple of things the page promises on your behalf — make sure you're happy
with them:

- **You'll never ask for their password.** Worth honouring absolutely; it's the
  line that makes you look trustworthy rather than technical.
- **If they don't want a GitHub account, you'll host it elsewhere.** Netlify or
  Cloudflare Pages both work the same way.
- **You'll walk them through it on the phone if they're stuck.**

---

## How the site talks about AI

You asked for the site to say AI helps you build, without suggesting it does the
work. That's handled in three places:

- **Home** — a "Serious tools. Human judgment." section with the five build
  stages laid out. Stage 03 (Code) is marked as the assisted one; the other four
  are plainly yours.
- **About** — a full section, *"Yes, we use AI. Here's exactly how."* It splits
  the work into two columns: what the tooling speeds up, and what the two of you
  do yourselves. The second list is deliberately longer.
- **About FAQ** — two questions: *"Do you use AI to build these?"* and
  *"Does that mean it's a template?"*

**Something important that came with this change.** The site previously said
"hand-coded", "written by hand" and "every line of code is ours" in about a
dozen places. Those directly contradict an AI mention, and a sharp client would
have spotted it. All of them are now "custom-built", "built from scratch" or
"real code, written for your business" — accurate either way, and still a strong
claim against a template or page-builder site.

If you edit copy later, keep that in mind: **"custom" and "from scratch" are safe;
"by hand" and "every line typed by us" are not.**

---

## About the Auntie M's case study

The `work.html` page uses **real screenshots** of the site you built — pulled
straight from the browser, not mockups.

The copy on that page says plainly that Auntie M's didn't hire you: you built it
first and then took it to them. That's deliberate. It's honest, it explains why
you have one project rather than fifty, and it's the same offer you're making to
whoever is reading — so it does more selling than a fake testimonial would.

**One thing to be aware of:** the address bar in the screenshots reads
`auntiemsdeerwood.com`, which is the domain the build was set up for. If that
site isn't actually live at that address, a sharp client might check. Either get
it live, or say up front that it's a build you're showing rather than a live
site.

There are no invented testimonials, client logos, or made-up statistics anywhere
on this site. The numbers on the home page (2 people, 0 templates, 0 paid up
front, 100% yours) are all things you can defend in a conversation.

---

## Putting it online

It's plain HTML, CSS, images and one small JavaScript file — no build step, no
database, no monthly platform. Any of these will host it free or nearly free:

- **Netlify** or **Cloudflare Pages** — drag the whole folder onto their
  dashboard and it's live in about a minute
- **GitHub Pages** — free, needs a GitHub account
- Ordinary web hosting — upload the folder by FTP

You'll want a domain name (~$12/year) to look legitimate. Buy it somewhere like
Namecheap or Cloudflare, then point it at whichever host you picked.

### If you want the form to email you directly

Right now the contact form opens the visitor's own email app with the message
pre-filled. That works everywhere and costs nothing, but some people don't have
an email app set up.

To have it send straight from the page, sign up at [Formspree](https://formspree.io)
(free tier is fine), then in `contact.html` change:

```html
<form class="form-grid" data-mailto-form="your@email.com" novalidate>
```

to:

```html
<form class="form-grid" action="https://formspree.io/f/YOURCODE" method="POST">
```

and delete the `data-form-note` paragraph at the bottom of the form.

---

## How it's built

```
index.html, work.html, about.html, contact.html, 404.html
assets/
  css/style.css     all styling, one file, commented by section
  js/main.js        scroll animations, mobile menu, counters, video swap
  fonts/            Fraunces + Karla, self-hosted (no Google Fonts call)
  img/work/         the Auntie M's screenshots
tools/serve.ps1     the little preview server
Preview site.cmd    double-click this to view the site
rename.ps1          swaps the placeholder studio name
```

Notes for future you:

- **Colours and spacing** live at the top of `style.css` under `:root`. Change
  `--amber` and the whole site's accent colour follows.
- **Animations** are opt-in per element via `data-reveal`. Add
  `data-reveal="left"`, `"right"`, `"zoom"` or `"fade"` to any element and it
  animates in on scroll. A `data-stagger="90"` on the parent makes children
  come in one after another.
- Anyone who has "reduce motion" turned on in their operating system gets the
  site with all the animation switched off. That's intentional.
- The fonts are the same two used on the Auntie M's site (Fraunces and Karla),
  loaded from this folder rather than from Google — so nothing is sent to a
  third party and the pages don't flash unstyled text.
