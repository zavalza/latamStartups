Template.myBlogIndexTemplate.rendered = function()
{

	jQuery.getScript("https://static.medium.com/embed.js")
	.done(function() {
		/* yay, all good, do something */
	})
	.fail(function() {
		/* boo, fall back to something else */
	}
	);
}