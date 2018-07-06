document.addEventListener("DOMContentLoaded", function () {
    let width = 400;
    let height = 400;
    let tau = Math.PI * 2;

    let draw = SVG("drawing").size(width, height).viewbox(0, 0, width, height);

    drawArc(200, 200, tau * 0.5, tau, 150, false);
    drawArc(200, 200, tau * 0.5, tau, 120, true);
    //drawArc(200, 200, tau * 0.53, tau * .2, 120, true);

    let icon = draw.rect(50, 50);
    icon.center(width / 2, 200);

    function drawArc(x, y, startAngle, endAngle, radius, inside) {

        let group = draw.group();
        group.center(x, y);
        group.fill('#fff');

        let startPoint = polarToCartesian(startAngle, radius);
        let endPoint = polarToCartesian(endAngle, radius);

        let arc = new SVG.PathArray([
            ['M', startPoint[0], startPoint[1]],
            getArc(endPoint, radius)
        ]);

        let path = group.path(arc);
        let len = path.length();

        if(inside) {
            let count = 7;
            let segment = len / count;

            for(var i = 0; i <= count; i++) {
                let point = path.pointAt(segment * i);
                let rect = group.rect(24, 24)
                rect.fill('#333')
                rect.center(point.x, point.y)
            }
        }
        else {
            let count =  7;
            let segment = len / count;

            for(var i = 0; i <= count; i++) {
                let point = path.pointAt(segment * i);
                let rect = group.rect(24, 24)
                rect.fill('#333')
                rect.center(point.x, point.y)
            }
        }




        path.stroke({
            color: 'red',
            width: 2
        });
    }

    function polarToCartesian(angle, radius) {
        return [
            radius * Math.cos(angle),
            radius * Math.sin(angle)
        ]
    }

    function getArc(end, radius) {


        return [
            'A',
            radius,
            radius,
            0,
            1,
            1,
            end[0],
            end[1]
        ]
    }

});
