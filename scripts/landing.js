var points = document.getElementsByClassName('point');

var animatePoints = function(points){
    var revealPoint = function(points) {
        for(var point in points){
            points[point].style.opactiy = 1;
            points[point].style.transform = "scale(1) translateY(0)";
            points[point].style.msTransform = "scale(1) translateY(0)";
            points[point].style.WebkitTransform = "scale(1) translateY(0)";
    }
    
    revealPoint(points);
    };
};