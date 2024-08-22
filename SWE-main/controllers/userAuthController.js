// controllers/homeController.js
exports.renderHomePage = (req, res) => {
    res.render('home', { title: 'Home Page' });
};
