module.exports = {
  index : function (req, res) {
    res.render("index", {title : "Express"});
  },
  thrower : function (req, res) {
    throw new Error("Imagine I'm deeper in the code");
  }
};
