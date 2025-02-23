# Homeboard: eInk display

@meta publishDate 2025-02-23
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

What's better than one display? Two displays, of course.

When I see a picture in my Homeboard, I often remember when and where I took it (photos are, after all, a form of exomemory), but not always. In [wwwslide](https://github.com/nicolasbrailo/wwwslide), my home slideshow service, I workaround this with a QR code: a small QR code is displayed in a corner of the image, and I can scan it to read the metadata of the picture being displayed. This is a good solution, but I'm not entirely happy with it.

Today, I added an [eInk display]( https://github.com/nicolasbrailo/libeink) to my Homeboard project. I can show picture metadata (and maybe even a QR code!) without taking up valuable picture real-estate. I chose an eInk display because they are easy to source and work with, relatively cheap, and require very little power (Homeboard is powered by PoE). Some day, I'm hoping to use it as an extra low-power mechanism to show actual homeboard info (a clock? weather? price of memecoins? The options are endless!)

I couldn't get all of the manufacturer's examples to work (especially the partial refresh), but it works well enough to display a thing rendered with [Cairo](https://www.cairographics.org/). The original manufacturer's examples had a custom rendering library which was quite unnecessary; my version of lib-eInk gets rid of all the custom rendering code, and uses [Cairo](https://www.cairographics.org/) to create graphics. Here's [an example](https://github.com/nicolasbrailo/libeink/blob/main/main.c):

```
struct EInkDisplay* display = eink_init();
cairo_t *cr = eink_get_cairo(display);

// Get display's surface
cairo_surface_t *surface = cairo_get_target(cr);
const size_t width = cairo_image_surface_get_width(surface);
const size_t height = cairo_image_surface_get_height(surface);

// Configure "pen"
cairo_set_source_rgba(cr, 0, 0, 0, 1);
cairo_select_font_face(cr, "Sans", CAIRO_FONT_SLANT_NORMAL, CAIRO_FONT_WEIGHT_BOLD);
cairo_set_font_size(cr, 20);

// Calculate text position
cairo_text_extents_t extents;
cairo_text_extents(cr, "Hola mundo", &extents);
double x = (width - extents.width) / 2 - extents.x_bearing;
double y = (height - extents.height) / 2 - extents.y_bearing;

// Draw
cairo_move_to(cr, x, y);
cairo_show_text(cr, text);

eink_render(display);
eink_delete(display);
```

[Github repo here]( https://github.com/nicolasbrailo/libeink).

---

Sidenote: my multiline code rendering seems to be eating pointers for breakfast, so `struct S*` may be rendered as `struct S`. I should fix this.

