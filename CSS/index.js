window.onscroll = function() {
    var target = document.getElementById("bigtitle");

    var height = window.innerHeight;
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if(scrollTop > 70)
        scrollTop = 70;
    scrollTop = -scrollTop;
    target.style.transform = "translate3d(0px, " + scrollTop.toString() + "px, 0px)";
};