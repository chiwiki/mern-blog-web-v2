const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const crypto = require("crypto");
const slugify = require("slugify");
var that = (module.exports = {
  createBlogValidation: (authorId, blogInfo) => {
    return new Promise((resolve, reject) => {
      let { title, des, banner, tags, content, draft, id } = blogInfo;

      if (!title.length) {
        reject("You might provide title to publish ");
      }
      if (!draft) {
        if (!des.length || des.length > 200) {
          reject("You must provide blog description under 200 characters");
        }
        if (!banner.length) {
          reject("You must prodive banner");
        }
        if (!content.blocks.length) {
          reject("There must be some blog content to publish");
        }
        if (!tags.length || tags.length > 10) {
          reject(
            "You must provide tag or number of tags have to be less than 10"
          );
        }

        tags = tags.map((tag) => tag.toLowerCase());
      }

      let blog_id =
        id || slugify(title) + crypto.randomBytes(10).toString("hex");

      console.log(blog_id);
      // res.json({ title: "nice" });
      if (id) {
        Blog.findOneAndUpdate(
          { blog_id },
          { title, des, banner, content, tags, draft: draft ? draft : false }
        )
          .then(() => {
            resolve({ id: blog_id });
          })
          .catch((err) => {
            reject(err.message);
          });
      } else {
        let blog = new Blog({
          title,
          banner,
          des,
          content,
          tags,
          author: authorId,
          blog_id,
          draft: Boolean(draft),
        });

        blog
          .save()
          .then((blog) => {
            let incrementVal = draft ? 0 : 1;

            User.findOneAndUpdate(
              { _id: authorId },
              {
                $inc: { "account_info.total_posts": incrementVal },
                $push: { blogs: blog._id },
              }
            )
              .then((user) => {
                resolve({ id: blog.blog_id });
              })
              .catch((err) => {
                reject("Failed to update total posts number ");
              });
          })
          .catch((err) => {
            reject(err.message);
          });
      }
    });
  },
});
