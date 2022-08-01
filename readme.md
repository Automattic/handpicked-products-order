## Handpicked Products Sorting Order

This extension was born from a Proof-of-Concept (PoC) for adding sorting to the existing handpicked products block. The extension allows you to use _extremely basic_ drag and drop ordering for products in your Handpicked Products Blocks. You can also specify your order via the Code Editor view of Gutenberg if you prefer.

### Background

**Important:** This is **NOT** a feature plugin that will eventually be moved into the core of WooCommerce Blocks. The current development direction of WooCommerce Blocks will make this extension obsolete in the future. This PoC is being released to allow a mechanism for those who currently desire this functionality on their sites to do so.

I started work on this PoC to fill a project requirement which was ultimately not needed. As such I'm open-sourcing this in its final development state, it's functional, but not as polished / user-experience friendly as you may expect. Use this extension at your own discretion.

### Usage

- Ensure WooCommerce Blocks is installed and activated.
- Download and install this repo into your WordPress plugins folder, active this plugin.
- Add the `Handpicked Products` block to your page, and insert some items.
- When in the product view, click the `Enable Sorting` button in your toolbar.
- You can now drag and drop the product order, the dropped product will always be placed in front of the product you drop it on (PoC remember!)
- Click the `Save Changes` (checkmark) button in the block toolbar.
- The products in this block will now persist in your chosen order.

### I don't like it / turn this off!

No problem, just deactivate this plugin, your Handpicked Products blocks will revert to their standard ordering behaviour.

### Using this in the code editor view of Gutenberg

Easy, paste the following into the code editor view:

```
<!-- wp:woocommerce/handpicked-products {"orderby":"post__in","products":[188,203,191]} /-->
```

Now edit the product IDs inside the square brackets as needed. Remember, add a comma after every item, leave the last item without a comma. If you run into issues, compare your code to what's above.

### Contributing / Issues

Please feel free to submit issues / contributions on the understanding that your issues may never be resolved and your contributions may never be merged. Remember, this was a PoC, if something doesn't seem correct, chances are I already know, this should not be considered a finished or polished product.

---

Tom.
